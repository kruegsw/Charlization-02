let clientGame = ""
const canvas1 = document.getElementById("canvas1")
const popup = document.getElementById('popup');
let cityCanvas = document.getElementById("cityCanvas")
let cityCtx = cityCanvas.getContext("2d")
cityCanvas.width = window.innerWidth //* devicePixelRatio
cityCanvas.height = window.innerHeight //* devicePixelRatio
//let canvasOrder = [canvas1, cityCanvas]
let localPlayer = ""
const mouse = { x: undefined, y: undefined }



console.log(canvas1)
canvas1.addEventListener("pointerdown", (event) => {
    console.log('listener added')

    if ( isAtFront(cityCanvas) ) {
        console.log("clicking on city window")
        return
    }

    const rect = canvas1.getBoundingClientRect()
    mouse.x = Math.floor((event.x - rect.left) / canvas.tileSize.x)
    mouse.y = Math.floor((event.y - rect.top) / canvas.tileSize.y)

    const clickedTile = canvas.determineTileFromPixelCoordinates(event.offsetX, event.offsetY)
    console.log(clickedTile)

    if (canvas.selectedUnit) {
        let targetTile = clientGame.board.tiles[clickedTile.x][clickedTile.y]
        if (clientGame.board.tiles[clickedTile.x][clickedTile.y].unit) {canvas.sounds.swordFight.play()} else {canvas.sounds.movePiece.play()}
        if (canvas.isInvalidMove(clickedTile)) { return }
        socket.emit('moveUnitToTile', {unit: canvas.selectedUnit, tile: targetTile})
        canvas.selectTile(targetTile)
        canvas.deselectUnit()
    } else {
        let targetTile = clientGame.board.tiles[clickedTile.x][clickedTile.y]
        if (targetTile.city) {
            // render tiles on the board
            const cityImage = canvas.sprites.city
            cityCtx.drawImage(
                cityImage,
                0, 0, 640, 480,
                0, 0, window.innerWidth, window.innerHeight
            )
            //bringToFront(cityCanvas)
            return
        }
        canvas.selectTile(targetTile)
        canvas.selectUnit({tile: targetTile, username: socket.id})
    }
    
})

//const socket = io("https://192.168.1.69:4000", {transports: ['websocket', 'polling']} )  // this is for testing in local area network
const socket = io("https://localhost:4000", {transports: ['websocket', 'polling']} )  // this is for testing on local machine only
//const socket = io("https://charlization.com:4000", {transports: ['websocket', 'polling']} )  // this is for server
// socket = io("https://localhost:4000", {transports: ['websocket', 'polling']} )  // this is for testing on local machine only
const socket = io("https://charlization.com:4000", {transports: ['websocket', 'polling']} )  // this is for server
socket.on("connect", () => { console.log(`You are socket.id ${socket.id}`) })
socket.on('init-client-game', serverGame => {
    clientGame = serverGame
    canvas = new Canvas({canvas: canvas1, board: clientGame.board})
    localPlayer = serverGame.players[socket.id]
    animate()
})
socket.on("connect_error", err => console.log(`connect_error due to ${err.message}`) )
socket.on('update-players', serverPlayers => clientGame.players = serverPlayers)
socket.on('update-gameState', serverBoard => clientGame.board = serverBoard)
socket.on('update-game', serverGame => clientGame = serverGame )
socket.on("message-from-server-to-client", message => console.log(message))
socket.on("disconnect", () => { console.log(`Client ${socket.id} disconnected from WebSocket`) })

function animate() {
    window.requestAnimationFrame(() => {
        canvas.ctx.clearRect(0 -50000, 0 -50000, canvas.canvas.width +100000, canvas.canvas.height +100000) // clear canvas
        canvas.renderMap({board: clientGame.board, username: localPlayer.username}) // redraw canvas
        //canvas.renderMapFromOffscreenCanvas()

        if (canvas.selectedUnit) { canvas.animateBlinkSelectedUnit() }
        window.requestAnimationFrame(() => {animate()})
    })
}

setInterval(() => {
    // need to emit client sides ticks to avoid overloading the server
    //io.emit('update-game', game)
    //io.emit('message-from-server-to-client', "tick")
}, 250)