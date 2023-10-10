//SOCKET_IO_URL = "https://charlization.com:4000" || "https://localhost:4000"

const socket = io("https://charlization.com:4000",
    {
        transports: ['websocket', 'polling'],
        //extraHeaders: {
        //    username: "sdub",
        //    color: "red"
        //}
    }
);

socket.on("connect", () => {console.log(`You are socket.id ${socket.id}`) })

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

socket.on("message-from-server", message => console.log(message))

socket.on('gameState-from-server', gameState => {
    /*let randomColor = Math.floor(Math.random()*16777215).toString(16);
    game = new Game(
		canvasID = "canvas1",
		localPlayer = new Player(username = socket.id, color = "red"),
        board = gameState
	)
    */

	console.log(gameState)
	console.log(`IN gameState-from-server`)
})

socket.on("disconnect", () => { console.log(`Client ${socket.id} disconnected from WebSocket`) })