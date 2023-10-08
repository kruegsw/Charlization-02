require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/client.html')
})

const fs = require("fs");
const httpServer = require("https").createServer({
  key: fs.readFileSync(process.env.PATH_TO_SSL_PRIVATE_KEY),
  cert: fs.readFileSync(process.env.PATH_TO_SSL_CERTIFICATE)
}, app);
const options = { /* ... */ };
const io = require("socket.io")(httpServer, options);

//let gameState

io.on("connection", socket => {
    //console.log(Object.keys(io.engine.clients))

    //if (!gameState) { gameState =  }

    socket.on('message-from-client-to-server', message => {
        console.log(`message from client ${socket.id}: ${message}`)
        io.emit('message-from-server', `message from client ${socket.id}: ${message}`)
        //io.emit('gameState-from-server', gameState)
    })

    socket.on('disconnect', () => { })
})

httpServer.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
});