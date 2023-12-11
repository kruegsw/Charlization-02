let clientGame = ""
const boardCanvas = document.getElementById("boardCanvas")
const boardCanvasController = new BoardCanvas({canvas: boardCanvas, /*board: clientGame.board}*/})
const popup = document.getElementById('popup');
const cityCanvas = document.getElementById("cityCanvas")
const cityCanvasController = new CityCanvas(cityCanvas)

let canvasOrder = [boardCanvas, cityCanvas] // keep track of which html element is in front
setZindex() // first element in canvasOrder will be in front, last element will be in the back

let localPlayer = ""
const mouse = { x: undefined, y: undefined }

//const socket = io("https://192.168.1.69:4000", {transports: ['websocket', 'polling']} )  // this is for testing in local area network
//const socket = io("https://0.0.0.0:4000", {transports: ['websocket', 'polling']} )  // this is for testing in local area network
//const socket = io("https://localhost:4000", {transports: ['websocket', 'polling']} )  // this is for testing on local machine only
const socket = io("https://charlization.com:4000", {transports: ['websocket', 'polling']} )  // this is for server
socket.on("connect", () => { console.log(`You are socket.id ${socket.id}`) })
socket.on('init-client-game', serverGame => {
    clientGame = serverGame
    boardCanvasController.setBoard(clientGame.board)
    localPlayer = serverGame.players[socket.id]
    animate()
})
socket.on("connect_error", err => console.log(`connect_error due to ${err.message}`) )
socket.on('update-players', serverPlayers => clientGame.players = serverPlayers)
//socket.on('update-gameState', serverBoard => clientGame.board = serverBoard)
socket.on('update-game', serverGame => Object.assign(clientGame, serverGame) )
//socket.on("message-from-server-to-client", message => console.log(message))
socket.on("disconnect", () => { console.log(`Client ${socket.id} disconnected from WebSocket`) })

function animate() {
    window.requestAnimationFrame(() => {
        boardCanvasController.ctx.clearRect(0 -50000, 0 -50000, boardCanvasController.canvas.width +100000, boardCanvasController.canvas.height +100000) // clear canvas
        boardCanvasController.renderMap({board: clientGame.board, username: localPlayer.username}) // redraw canvas
        if ( isAtFront(cityCanvas) ) { // if city window is open then update city canvas
            let cityXY = cityCanvasController.cityObject.coordinates
            cityCanvasController.cityObject = clientGame.board.tiles[cityXY.x][cityXY.y].city
            cityCanvasController.renderCity()
            //cityCanvasController.renderCity(clientGame.board.tiles[selectedCity.coordinates.x][selectedCity.coordinates.y])
        }
        //canvas.renderMapFromOffscreenCanvas()

        if (boardCanvasController.selectedUnit) { boardCanvasController.animateBlinkSelectedUnit() }
        window.requestAnimationFrame(() => {animate()})
    })
}

function setZindex() {  
    canvasOrder.forEach( (element, i) => {
        element.style.zIndex = -i
    })
    console.log(canvasOrder)
}


setInterval(() => {
    // need to emit client sides ticks to avoid overloading the server
    //io.emit('update-game', game)
    //io.emit('message-from-server-to-client', "tick")
}, 250)


