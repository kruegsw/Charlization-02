let clientGame = ""
//let canvas = document.getElementById("canvas1")
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


registerEventListeners2()

function registerEventListeners2() {

    document.addEventListener("keydown", (event) => {
        if (canvas.selectedUnit) {
            let unit = canvas.selectedUnit
            let x = unit.coordinates.x
            let y = unit.coordinates.y
            let targetX
            let targetY
            switch (event.code) {
                case "ArrowLeft":
                    [targetX, targetY] = canvas.onLeftEdge({x, y}) ?
                        canvas.targetCoordinatesIfMovingLeftEdgeToRightEdge({x, y}) : canvas.targetCoordinatesIfMovingLeft({x, y})
                    moveUnitToTile({unit: unit, x: targetX, y: targetY}) // check if valid move, emit move to server, update canvas
                    break
                case "ArrowRight":
                    [targetX, targetY] = canvas.onRightEdge({x, y}) ?
                        canvas.targetCoordinatesIfMovingRightEdgeToLeftEdge({x, y}) : canvas.targetCoordinatesIfMovingRight({x, y})
                    moveUnitToTile({unit: unit, x: targetX, y: targetY}) // check if valid move, emit move to server, update canvas
                    break
                case "ArrowUp":
                    if (canvas.onTopEdgeOfDiamondMap({x, y})) {return}
                    [targetX, targetY] = canvas.onLeftEdge({x, y}) ?
                        canvas.targetCoordinatesIfMovingUpThroughLeftEdge({x, y}) : canvas.targetCoordinatesIfMovingUp({x, y})
                    moveUnitToTile({unit: unit, x: targetX, y: targetY}) // check if valid move, emit move to server, update canvas
                    break
                case "ArrowDown":
                    if (canvas.onBottomEdgeOfDiamondMap({x, y})) {return}
                    [targetX, targetY] = canvas.onRightEdge({x, y}) ?
                        canvas.targetCoordinatesIfMovingDownThroughRightEdge({x, y}) : canvas.targetCoordinatesIfMovingDown({x, y})
                    moveUnitToTile({unit: unit, x: targetX, y: targetY}) // check if valid move, emit move to server, update canvas
                    break
                case "Tab":
                    event.preventDefault()
                    return
                case "Escape":
                    canvas.deselectTile()
                    canvas.deselectUnit()
                    return
                default:
                    return
            }
        } else {
            if (event.code === "ArrowUp") { canvas.scrollUp(); return }
            if (event.code === "ArrowDown") { canvas.scrollDown(); return }
            if (event.code === "ArrowLeft") { canvas.scrollLeft(); return }
            if (event.code === "ArrowRight") { canvas.scrollRight(); return }
            if (event.code === "Escape") { return }
        }
        if (event.code === "Tab") {
            event.preventDefault() // prevent screen scrolling when moving selected unit, and tabbing
            canvas.selectNextUnit({board: clientGame.board, username: socket.id})
            if ( !(canvas.tileIsVisibleOnScreen(canvas.selectedTile)) ) { canvas.centerScreenOnTile(canvas.selectedTile) }
            console.log(canvas.selectedUnit)
            return
        }
    })

    window.addEventListener("pointerdown", (event) => {
        //console.log(clientGame)
        const rect = canvas.canvas.getBoundingClientRect()
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
            const rect = canvas.canvas.getBoundingClientRect()
            let targetTile = clientGame.board.tiles[clickedTile.x][clickedTile.y]
            canvas.selectTile(targetTile)
            canvas.selectUnit({tile: targetTile, username: socket.id})
        }
        
    })

    window.addEventListener("resize", () => canvas.adjustCanvasSizeToBrowser(clientGame.board) )
    window.addEventListener("wheel", (event) => {
        event.preventDefault() 
        canvas.scrollZoom(event)
    }, { passive: false }) // prevents scrollbar https://stackoverflow.com/questions/20026502/prevent-mouse-wheel-scrolling-but-not-scrollbar-event-javascript
}
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

function isInvalidMove(unit, direction) {
    return canvas.isInvalidMove({x: unit.coordinates.x + direction.x, y: unit.coordinates.y + direction.y})
}

function moveUnitInDirection(unit, direction) {
    socket.emit('moveUnitInDirection', {unit, direction})
    console.log(`moveUnitInDirection socket fired with unit = ${unit}, direction = ${direction}`)
    canvas.deselectTile()
    canvas.deselectUnit()
}

function moveUnitIfValidMove(unit, direction) { if (isInvalidMove(unit, direction)) {return} else { moveUnitInDirection(unit, direction) } }

function moveUnitToTile({unit, x, y}) {
    console.log(`${x}, ${y}`)
    if (canvas.isValidMove({unit, x, y})) {
        let tile = clientGame.board.tiles[x][y]
        socket.emit('moveUnitToTile', {unit, tile})
        canvas.selectTile(tile)
        canvas.deselectUnit()
    }
}















/*


function registerEventListenerOld() {

    document.addEventListener("keydown", (event) => {
        console.log(event)
        //add key pad movement
        // add detect collission and appropriate sounds
        // need to fix bug when unit walks off screen
        //socket.emit('message-from-client-to-server', message = e.key)
        if (canvas.selectedUnit) {
            let direction
            let unit = canvas.selectedUnit
            if (event.code === "ArrowUp") {
                if (canvas.orientation === "diamond" || canvas.orientation === "short diamond") {
                    if (canvas.onTopEdgeOfDiamondMap({x: unit.coordinates.x, y: unit.coordinates.y})) {return}
                    if (canvas.onLeftEdgeOfSquareMap({x: unit.coordinates.x})) {
                        let targetTile = clientGame.board.tiles[unit.coordinates.x+(clientGame.board.size.x-1)][unit.coordinates.y-(clientGame.board.size.x+1)]
                        socket.emit('moveUnitToTile', {unit: unit, tile: targetTile})
                        canvas.selectTile(targetTile)
                        canvas.deselectUnit()
                        return
                    }
                    direction = {x: -1, y: -1} } else { direction = {x: 0, y: -1} }
                moveUnitIfValidMove(unit, direction)
            }
            if (event.code === "ArrowDown") {
                if (canvas.orientation === "diamond" || canvas.orientation === "short diamond") {
                    if (canvas.onBottomEdgeOfDiamondMap({x: unit.coordinates.x, y: unit.coordinates.y})) {return}
                    if (canvas.onRightEdgeOfSquareMap({x: unit.coordinates.x})) {
                        let targetTile = clientGame.board.tiles[unit.coordinates.x-(clientGame.board.size.x-1)][unit.coordinates.y+(clientGame.board.size.x+1)]
                        socket.emit('moveUnitToTile', {unit: unit, tile: targetTile})
                        canvas.selectTile(targetTile)
                        canvas.deselectUnit()
                        return
                    }
                    direction = {x: 1, y: 1} } else { direction = {x: 0, y: 1} }
                moveUnitIfValidMove(unit, direction)
            }
            if (event.code === "ArrowLeft") {
                if (canvas.onLeftEdgeOfSquareMap({x: unit.coordinates.x})) {
                    let targetTile = clientGame.board.tiles[unit.coordinates.x+(clientGame.board.size.x-1)][unit.coordinates.y-(clientGame.board.size.x-1)]
                    socket.emit('moveUnitToTile', {unit: unit, tile: targetTile})
                    canvas.selectTile(targetTile)
                    canvas.deselectUnit()
                    return
                }
                if (canvas.orientation === "diamond" || canvas.orientation === "short diamond") {
                    direction = {x: -1, y: 1} } else { direction = {x: -1, y: 0} }
                moveUnitIfValidMove(unit, direction)
            }
            if (event.code === "ArrowRight") {
                if (canvas.onRightEdgeOfSquareMap({x: unit.coordinates.x})) {
                    let targetTile = clientGame.board.tiles[unit.coordinates.x-(clientGame.board.size.x-1)][unit.coordinates.y+(clientGame.board.size.x-1)]
                    socket.emit('moveUnitToTile', {unit: unit, tile: targetTile})
                    canvas.selectTile(targetTile)
                    canvas.deselectUnit()
                    return
                }
                if (canvas.orientation === "diamond" || canvas.orientation === "short diamond") {
                    direction = {x: 1, y: -1} } else { direction = {x: 1, y: 0} }
                moveUnitIfValidMove(unit, direction)
            }

            
            //if (clientGame.board.tiles[canvas.selectedUnit.coordinates.x+command.direction.x][canvas.selectedUnit.coordinates.y+command.direction.y].unit) {
            //    canvas.sounds.swordFight.play()
            //} else {
            //    canvas.sounds.movePiece.play()
            //}
            

            if (event.code === "Escape") {
                canvas.deselectTile()
                canvas.deselectUnit()
                return
            }
            if (event.code === "Tab") {
                event.preventDefault()
                return
            }
        } else {
            if (event.code === "ArrowUp") { canvas.scrollUp(); return }
            if (event.code === "ArrowDown") { canvas.scrollDown(); return }
            if (event.code === "ArrowLeft") { canvas.scrollLeft(); return }
            if (event.code === "ArrowRight") { canvas.scrollRight(); return }
            if (event.code === "Escape") { return }
        }
        if (event.code === "Tab") {
            event.preventDefault() // prevent screen scrolling when moving selected unit, and tabbing
            canvas.selectNextUnit({board: clientGame.board, username: socket.id})
            if ( !(canvas.tileIsVisibleOnScreen(canvas.selectedTile)) ) { canvas.centerScreenOnTile(canvas.selectedTile) }
            console.log(canvas.selectedUnit)
            return
        }
    });

    //  "click" and "pointerdown" are both valid for computer browser, but only "pointerdown" is valid for mobile, so using only pointerdown for now
    //window.addEventListener("click", (event) => {
    //    console.log(clientGame)
    //    const rect = canvas.canvas.getBoundingClientRect()
    //    mouse.x = Math.floor((event.x - rect.left) / canvas.tileSize)
    //    mouse.y = Math.floor((event.y - rect.top) / canvas.tileSize)

    //    if (canvas.selectedUnit) {
    //        let targetTile = clientGame.board.tiles[mouse.x][mouse.y]
    //        if (clientGame.board.tiles[mouse.x][mouse.y].unit) {canvas.sounds.swordFight.play()} else {canvas.sounds.movePiece.play()}
    //        socket.emit('moveUnitToTile', {unit: canvas.selectedUnit, tile: targetTile})
    //        canvas.selectTile(targetTile)
    //        canvas.deselectUnit()
    //    } else {
    //        const rect = canvas.canvas.getBoundingClientRect()
    //        let targetTile = clientGame.board.tiles[mouse.x][mouse.y]
    //        canvas.selectTile(targetTile)
    //        canvas.selectUnit({tile: targetTile, username: socket.id})
    //    }
    //})
    

    window.addEventListener("pointerdown", (event) => {
        //console.log(clientGame)
        const rect = canvas.canvas.getBoundingClientRect()
        mouse.x = Math.floor((event.x - rect.left) / canvas.tileSize.x)
        mouse.y = Math.floor((event.y - rect.top) / canvas.tileSize.y)

        const clickedTile = canvas.determineTileFromPixelCoordinates(event.offsetX, event.offsetY)
        console.log(clickedTile)
        //console.log(event)
        //console.log(`screenX, screenY: ${event.screenX}, ${event.screenY}`)
        //console.log(`offsetX, offsetY: ${event.offsetX}, ${event.offsetY}`)
        //console.log(`layerX, layerY: ${event.layerX}, ${event.layerY}`)
        //console.log(`clientX, clientY: ${event.clientX}, ${event.clientY}`)

        if (canvas.selectedUnit) {
            let targetTile = clientGame.board.tiles[clickedTile.x][clickedTile.y]
            if (clientGame.board.tiles[clickedTile.x][clickedTile.y].unit) {canvas.sounds.swordFight.play()} else {canvas.sounds.movePiece.play()}
            if (canvas.isInvalidMove(clickedTile)) { return }
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

    window.addEventListener("resize", () => canvas.adjustCanvasSizeToBrowser(clientGame.board) )
    window.addEventListener("wheel", (event) => {
        event.preventDefault() 
        canvas.scrollZoom(event)
    }, { passive: false }) // prevents scrollbar https://stackoverflow.com/questions/20026502/prevent-mouse-wheel-scrolling-but-not-scrollbar-event-javascript
}

*/