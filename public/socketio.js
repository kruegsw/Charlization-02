
const socket = io(`https://localhost:4000`, { transports: ['websocket', 'polling'] } );

socket.on("connect", () => { console.log(`You are socket.id ${socket.id}`) })

socket.on("message-from-server", message => console.log(message))

socket.on("disconnect", () => { console.log(`Client ${socket.id} disconnected from WebSocket`) })