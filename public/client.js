let clientGame = ""
let canvas = ""
let localPlayer = ""
const mouse = { x: undefined, y: undefined }

//SOCKET_IO_URL = "https://charlization.com:4000" || "https://localhost:4000"

//const socket = io("https://localhost:4000",
const socket = io("https://charlization.com:4000",
    {
        transports: ['websocket', 'polling'],
        //extraHeaders: {
        //    username: "sdub",
        //    color: "red"
        //}
    }
);

socket.on("connect", () => {
    console.log(`You are socket.id ${socket.id}`)
})

socket.on('update-players', serverPlayers => clientGame.players = serverPlayers)

//socket.on('player-left-game', socketID => canvas.removePlayerFromBoard({username: socketID, board: clientGame.board}))

socket.on('update-gameState', serverBoard => clientGame.board = serverBoard)

socket.on('update-game', serverGame => {
    clientGame.board = serverGame.board
    clientGame.players = serverGame.players
})

socket.on('init-client-game', serverGame => {
    //clientGame = new Game({players: serverGame.players, board: serverGame.board})
    clientGame = serverGame
    canvas = new Canvas({canvasID: "canvas1", board: clientGame.board})
    localPlayer = serverGame.players[socket.id]

    function animate() {
        window.requestAnimationFrame(() => {
            canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height) // clear canvas
            canvas.renderMap({board: clientGame.board, username: localPlayer.username}) // redraw canvas
            if (canvas.selectedUnit) { canvas.animateBlinkSelectedUnit() }
            window.requestAnimationFrame(() => {animate()})
        })
    }
    animate()

    /*
    setInterval(() => {
        canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height) // clear canvas
        canvas.renderMap(clientGame.board) // redraw canvas
        if (canvas.selectedUnit) { canvas.animateBlinkSelectedUnit() }
    }, 15)
    */

})

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

socket.on("message-from-server-to-client", message => console.log(message))

socket.on("disconnect", () => { console.log(`Client ${socket.id} disconnected from WebSocket`) })

//const localPlayer = new Player({username: "sdub", color: `hsl(${Math.random()*360}, 100%, 50%)` /* hue, saturation, lightness */})
/*
const clientGame = new Game({
    players: { [socket.id]: localPlayer },
    board: new Board({x: 10, y: 10})
})
clientGame.setPlayersInitialLocations(localPlayer)
*/

function registerEventListener() {

    document.addEventListener("keydown", (e) => {
        console.log(e)
        socket.emit('message-from-client-to-server', message = e.key)
        if (!e.repeat) {
            if (canvas.selectedUnit) {
                e.preventDefault() // prevent screen scrolling when moving selected unit
                let command = keydownCommand(e.key)
                if (command.type === "move") {
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

    window.addEventListener("click", (event) => {
        console.log(clientGame)
        const rect = canvas.canvas.getBoundingClientRect()
        mouse.x = Math.floor((event.x - rect.left) / canvas.tileSize)
        mouse.y = Math.floor((event.y - rect.top) / canvas.tileSize)

        if (canvas.selectedUnit) {
            let targetTile = clientGame.board.tiles[mouse.x][mouse.y]
            socket.emit('moveUnitToTile', {unit: canvas.selectedUnit, tile: targetTile})
            //clientGame.moveUnitToTile({unit: canvas.selectedUnit, tile: targetTile})
            canvas.selectTile(targetTile)
            canvas.deselectUnit()
        } else {
            const rect = canvas.canvas.getBoundingClientRect()
            let targetTile = clientGame.board.tiles[mouse.x][mouse.y]
            canvas.selectTile(targetTile)
            canvas.selectUnit({tile: targetTile, username: socket.id})
        }
        //console.log(game.localPlayer.selectedTile)
        //console.log(game.localPlayer.selectedUnit)
    })

        /*
    document.addEventListener("beforeinput", (e) => {
    console.log(`Key "${e.data}" about to be input [event: beforeinput]`);
    });

    document.addEventListener("input", (e) => {
    console.log(`Key "${e.data}" input [event: input]`);
    });

    document.addEventListener("keyup", (e) => {
    console.log(`Key "${e.key}" released [event: keyup]`);
    });

    */

    function keydownCommand(key) {
        //console.log(key)
        if (key === "ArrowUp") { return { type: "move", direction: { x: 0, y: -1 } } }
        if (key === "ArrowDown") { return { type: "move", direction: { x: 0, y: 1 } } }
        if (key === "ArrowLeft") { return { type: "move", direction: { x: -1, y: 0 } } }
        if (key === "ArrowRight") { return { type: "move", direction: { x: 1, y: 0 } } }
        if (key === "Escape") { return { type: "escape" } }
    }

    //this.canvas.canvas.addEventListener('mousemove', () => {
    //	mouse.x = event.x
    //	mouse.y = event.y
    //})

    window.addEventListener("resize", () => canvas.adjustCanvasSizeWhenBrowserResizing(clientGame.board) )
}
registerEventListener()


console.log(clientGame)
console.log(`after definition`)
