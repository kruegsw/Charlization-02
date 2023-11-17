require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.static('public'))
app.get('/', (req, res) => {res.sendFile(__dirname + '/public/client.html')})

const fs = require("fs");
const httpServer = require("https").createServer({
  key: fs.readFileSync(process.env.PATH_TO_SSL_PRIVATE_KEY),
  cert: fs.readFileSync(process.env.PATH_TO_SSL_CERTIFICATE)
}, app);
const options = { /*pingInterval: 2000, pingTimeout: 5000*/ };
const io = require("socket.io")(httpServer, options);

const Board = require('./Board')
const Player = require('./Player')
const Game = require('./Game')
const game = new Game({players: {}, board: new Board({x: 21, y: 41})})
console.log(game.players)

io.on("connection", socket => {
    if (!game.players[socket.id]) {
        game.players[socket.id] = new Player({username: socket.id, color: `hsl(${Math.random()*360}, 100%, 50%)` /* hue, saturation, lightness */})
        game.setPlayersInitialLocations(game.players[socket.id])
    }
    io.emit('update-players', game.players)
    io.emit('init-client-game', game )

    socket.on('message-from-client-to-server', message => {
        console.log(`message from client ${socket.id}: ${message}`)
        io.emit('message-from-server', `message from client ${socket.id}: ${message}`)
        io.emit('update-game', game)
    })

    socket.on('moveUnitInDirection', ({unit, direction}) => {
        game.moveUnitInDirection({unit, direction})
        io.emit('update-game', game)
    })
    socket.on('moveUnitToTile', ({unit, tile}) => {
        game.moveUnitToTile({unit: unit, tile: tile})
        io.emit('update-game', game)
    })
    socket.on('unitOrders', ({unit, orders}) => {
        game.unitOrders({unit, orders})
        io.emit('update-game', game)
    })

    socket.on('disconnect', (reason) => {
        console.log(`reason for ${socket.id} disconnect: ${reason}`)
        //io.emit('player-left-game', socket.id)
        game.removePlayerFromBoard({username: socket.id})
        delete game.players[socket.id]
        io.emit('update-game', game)
        console.log(game.players)
    })
})

setInterval(() => {
    io.emit('update-game', game)
    //io.emit('message-from-server-to-client', "tick")
    //yo dis tbuz first file update
}, 60000)

httpServer.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
});