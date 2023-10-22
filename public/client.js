let clientGame = ""
let canvas = document.getElementById("canvas1")
let localPlayer = ""
const mouse = { x: undefined, y: undefined }

//const socket = io("https://localhost:4000", {transports: ['websocket', 'polling']} )
const socket = io("https://charlization.com:4000", {transports: ['websocket', 'polling']} )
socket.on("connect", () => { console.log(`You are socket.id ${socket.id}`) })
socket.on('init-client-game', serverGame => {
    clientGame = serverGame
    canvas = new Canvas({canvasID: "canvas1", board: clientGame.board})
    //canvas.initializeCanvasEventListeners()
    localPlayer = serverGame.players[socket.id]
    animate()
})
socket.on("connect_error", err => console.log(`connect_error due to ${err.message}`) )
socket.on('update-players', serverPlayers => clientGame.players = serverPlayers)
socket.on('update-gameState', serverBoard => clientGame.board = serverBoard)
socket.on('update-game', serverGame => clientGame = serverGame )
socket.on("message-from-server-to-client", message => console.log(message))
socket.on("disconnect", () => { console.log(`Client ${socket.id} disconnected from WebSocket`) })

registerEventListener()

function registerEventListener() {

    document.addEventListener("keydown", (e) => {
        console.log(e)
        //socket.emit('message-from-client-to-server', message = e.key)
        if (canvas.selectedUnit) {
            let command = keydownCommand(e.key)
            if (command.type === "move") {
                //e.preventDefault() // prevent screen scrolling when moving selected unit, and tabbing
                if (clientGame.board.tiles[canvas.selectedUnit.coordinates.x+command.direction.x][canvas.selectedUnit.coordinates.y+command.direction.y].unit) {canvas.sounds.swordFight.play()} else {canvas.sounds.movePiece.play()}
                socket.emit('moveUnitInDirection', {unit: canvas.selectedUnit, direction: command.direction})
                //clientGame.moveUnitInDirection({unit: canvas.selectedUnit, direction: command.direction})
                canvas.deselectTile()
                canvas.deselectUnit()
                return
            }
            if (command.type === "escape") {
                canvas.deselectTile()
                canvas.deselectUnit()
                return
            }
            if (e.key === "Tab") { return }
        }
        if (e.key === "Tab") {
            e.preventDefault() // prevent screen scrolling when moving selected unit, and tabbing
            canvas.selectNextUnit({board: clientGame.board, username: socket.id})
            canvas.centerScreenOnTileCoordinates(canvas.selectedUnit.coordinates)
            console.log(canvas.selectedUnit)
            return
        }
        if (e.key === "ArrowUp") { canvas.scrollUp(); return }
        if (e.key === "ArrowDown") { canvas.scrollDown(); return }
        if (e.key === "ArrowLeft") { canvas.scrollLeft(); return }
        if (e.key === "ArrowRight") { canvas.scrollRight(); return }
        if (e.key === "Escape") { return }
    });

    /*  "click" and "pointerdown" are both valid for computer browser, but only "pointerdown" is valid for mobile, so using only pointerdown for now
    window.addEventListener("click", (event) => {
        console.log(clientGame)
        const rect = canvas.canvas.getBoundingClientRect()
        mouse.x = Math.floor((event.x - rect.left) / canvas.tileSize)
        mouse.y = Math.floor((event.y - rect.top) / canvas.tileSize)

        if (canvas.selectedUnit) {
            let targetTile = clientGame.board.tiles[mouse.x][mouse.y]
            if (clientGame.board.tiles[mouse.x][mouse.y].unit) {canvas.sounds.swordFight.play()} else {canvas.sounds.movePiece.play()}
            socket.emit('moveUnitToTile', {unit: canvas.selectedUnit, tile: targetTile})
            canvas.selectTile(targetTile)
            canvas.deselectUnit()
        } else {
            const rect = canvas.canvas.getBoundingClientRect()
            let targetTile = clientGame.board.tiles[mouse.x][mouse.y]
            canvas.selectTile(targetTile)
            canvas.selectUnit({tile: targetTile, username: socket.id})
        }
    })
    */

    window.addEventListener("pointerdown", (event) => {
        //console.log(clientGame)
        const rect = canvas.canvas.getBoundingClientRect()
        mouse.x = Math.floor((event.x - rect.left) / canvas.tileSize.x)
        mouse.y = Math.floor((event.y - rect.top) / canvas.tileSize.y)

        const clickedTile = canvas.determineTileFromPixelCoordinates(event.offsetX, event.offsetY)
        //console.log(clickedTile)
        //console.log(event)
        //console.log(`screenX, screenY: ${event.screenX}, ${event.screenY}`)
        //console.log(`offsetX, offsetY: ${event.offsetX}, ${event.offsetY}`)
        //console.log(`layerX, layerY: ${event.layerX}, ${event.layerY}`)
        //console.log(`clientX, clientY: ${event.clientX}, ${event.clientY}`)

        if (canvas.selectedUnit) {
            let targetTile = clientGame.board.tiles[clickedTile.x][clickedTile.y]
            if (clientGame.board.tiles[clickedTile.x][clickedTile.y].unit) {canvas.sounds.swordFight.play()} else {canvas.sounds.movePiece.play()}
            socket.emit('moveUnitToTile', {unit: canvas.selectedUnit, tile: targetTile})
            canvas.selectTile(targetTile)
            canvas.deselectUnit()
        } else {
            const rect = canvas.canvas.getBoundingClientRect()
            let targetTile = clientGame.board.tiles[clickedTile.x][clickedTile.y]
            canvas.selectTile(targetTile)
            canvas.selectUnit({tile: targetTile, username: socket.id})
        }
    })

    function keydownCommand(key) {
        if (key === "ArrowUp") { return { type: "move", direction: { x: 0, y: -1 } } }
        if (key === "ArrowDown") { return { type: "move", direction: { x: 0, y: 1 } } }
        if (key === "ArrowLeft") { return { type: "move", direction: { x: -1, y: 0 } } }
        if (key === "ArrowRight") { return { type: "move", direction: { x: 1, y: 0 } } }
        if (key === "Escape") { return { type: "escape" } }
    }

    window.addEventListener("resize", () => canvas.adjustCanvasSizeToBrowser(clientGame.board) )
    window.addEventListener("wheel", (event) => {
        event.preventDefault() 
        canvas.scrollZoom(event)
    }, { passive:false }) // prevents scrollbar https://stackoverflow.com/questions/20026502/prevent-mouse-wheel-scrolling-but-not-scrollbar-event-javascript
}

function animate() {
    window.requestAnimationFrame(() => {
        canvas.ctx.clearRect(0 -50000, 0 -50000, canvas.canvas.width +100000, canvas.canvas.height +100000) // clear canvas
        canvas.renderMap({board: clientGame.board, username: localPlayer.username}) // redraw canvas

        if (canvas.selectedUnit) { canvas.animateBlinkSelectedUnit() }
        window.requestAnimationFrame(() => {animate()})
    })
}

setInterval(() => {
    // need to emit client sides ticks to avoid overloading the server
    //io.emit('update-game', game)
    //io.emit('message-from-server-to-client', "tick")
}, 250)