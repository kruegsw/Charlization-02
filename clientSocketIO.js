
const socket = io(`https://localhost:4000`,
    {transports: ['websocket', 'polling'], // Default value: ["polling", "websocket", "webtransport"]
    //    auth: {
    //        token: "this is a token"
    //},
    //key: sslPrivateKey,
    //secure: true,
    }
);

console.log(socket)

socket.on("connect", () => {
    console.log(`Client ${socket.id} connected to the WebSocket`)
    socket.emit('join-game', "hello server")
})

socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected from WebSocket`)
})