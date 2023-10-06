require('dotenv').config()

const fs = require("fs");
const httpServer = require("https").createServer({
  key: fs.readFileSync(process.env.PATH_TO_SSL_PRIVATE_KEY),
  cert: fs.readFileSync(process.env.PATH_TO_SSL_CERTIFICATE)
});
const options = { /* ... */ };
const io = require("socket.io")(httpServer, options);

io.on("connection", socket => {
    console.log(`${socket.id} has connected`)
    socket.on('join-game', message => {
        console.log(`message from client is ${message}`)
    })
    socket.on('disconnect', socket => {
        console.log(`${socket._id} has disconnected`)
    })
})

httpServer.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
});