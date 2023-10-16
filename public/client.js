let clientGame = ""
let canvas = ""
let localPlayer = ""
const mouse = { x: undefined, y: undefined }

//const socket = io("https://localhost:4000", {transports: ['websocket', 'polling']} )
const socket = io("https://charlization.com:4000", {transports: ['websocket', 'polling']} )
socket.on("connect", () => { console.log(`You are socket.id ${socket.id}`) })
socket.on('init-client-game', serverGame => {
    clientGame = serverGame
    canvas = new Canvas({canvasID: "canvas1", board: clientGame.board})
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
        socket.emit('message-from-client-to-server', message = e.key)
        if (!e.repeat) {
            if (canvas.selectedUnit) {
                e.preventDefault() // prevent screen scrolling when moving selected unit
                let command = keydownCommand(e.key)
                if (command.type === "move") {
                    if (clientGame.board.tiles[canvas.selectedUnit.coordinates.x+command.direction.x][canvas.selectedUnit.coordinates.y+command.direction.y].unit) {canvas.sounds.swordFight.play()} else {canvas.sounds.movePiece.play()}
                    socket.emit('moveUnitInDirection', {unit: canvas.selectedUnit, direction: command.direction})
                    //clientGame.moveUnitInDirection({unit: canvas.selectedUnit, direction: command.direction})
                    canvas.deselectTile()
                    canvas.deselectUnit()
                }
                if (command.type === "escape") {
                    canvas.deselectTile()
                    canvas.deselectUnit()
                }
            }
        } else {
            //console.log(`Key "${e.key}" repeating [event: keydown]`);
        }
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
        console.log(clientGame)
        const rect = canvas.canvas.getBoundingClientRect()
        mouse.x = Math.floor((event.x - rect.left) / canvas.tileSize.x)
        mouse.y = Math.floor((event.y - rect.top) / canvas.tileSize.y)
        console.log(mouse)

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

    function keydownCommand(key) {
        if (key === "ArrowUp") { return { type: "move", direction: { x: 0, y: -1 } } }
        if (key === "ArrowDown") { return { type: "move", direction: { x: 0, y: 1 } } }
        if (key === "ArrowLeft") { return { type: "move", direction: { x: -1, y: 0 } } }
        if (key === "ArrowRight") { return { type: "move", direction: { x: 1, y: 0 } } }
        if (key === "Escape") { return { type: "escape" } }
    }

    window.addEventListener("resize", () => canvas.adjustCanvasSizeToBrowser(clientGame.board) )
}

function animate() {
    window.requestAnimationFrame(() => {
        canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height) // clear canvas
        canvas.renderMap({board: clientGame.board, username: localPlayer.username}) // redraw canvas

        if (canvas.selectedUnit) { canvas.animateBlinkSelectedUnit() }
        window.requestAnimationFrame(() => {animate()})
    })
}