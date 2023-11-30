/*
window.onload = function() { // this will be run when the whole page is loaded
    registerEventListeners()
    initializeTestSwipeMotionForMobile()
    initializeTestPinchZoomForMobile()
}
*/

document.addEventListener('DOMContentLoaded', function() {
    registerEventListeners()
    initializeTestSwipeMotionForMobile()
    //initializeTestPinchZoomForMobile()
})

let pointerDown = false;
const pointerDownPixelLocation = { x: undefined, y: undefined }
let transformedPointerDownPixelLocation

function registerEventListeners() {

    document.addEventListener("keydown", (event) => {
        console.log(event)
        console.log(clientGame)
        if (boardCanvasController.selectedUnit) {
            let unit = boardCanvasController.selectedUnit
            let x = unit.coordinates.x
            let y = unit.coordinates.y
            let targetX
            let targetY
            switch (event.code) {
                case "ArrowLeft":
                    [targetX, targetY] = boardCanvasController.onLeftEdge({x, y}) ?
                    boardCanvasController.targetCoordinatesIfMovingLeftEdgeToRightEdge({x, y}) : boardCanvasController.targetCoordinatesIfMovingLeft({x, y})
                    moveUnitToTile({unit: unit, x: targetX, y: targetY}) // check if valid move, emit move to server, update canvas
                    break
                case "ArrowRight":
                    [targetX, targetY] = boardCanvasController.onRightEdge({x, y}) ?
                    boardCanvasController.targetCoordinatesIfMovingRightEdgeToLeftEdge({x, y}) : boardCanvasController.targetCoordinatesIfMovingRight({x, y})
                    moveUnitToTile({unit: unit, x: targetX, y: targetY}) // check if valid move, emit move to server, update canvas
                    break
                case "ArrowUp":
                    if (boardCanvasController.onTopEdgeOfDiamondMap({x, y})) {return}
                    [targetX, targetY] = boardCanvasController.onLeftEdge({x, y}) ?
                    boardCanvasController.targetCoordinatesIfMovingUpOnLeftEdge({x, y}) : boardCanvasController.targetCoordinatesIfMovingUp({x, y})
                    moveUnitToTile({unit: unit, x: targetX, y: targetY}) // check if valid move, emit move to server, update canvas
                    break
                case "ArrowDown":
                    if (boardCanvasController.onBottomEdgeOfDiamondMap({x, y})) {return}
                    [targetX, targetY] = boardCanvasController.onRightEdge({x, y}) ?
                    boardCanvasController.targetCoordinatesIfMovingDownOnRightEdge({x, y}) : boardCanvasController.targetCoordinatesIfMovingDown({x, y})
                    moveUnitToTile({unit: unit, x: targetX, y: targetY}) // check if valid move, emit move to server, update canvas
                    break
                case "KeyB":
                    socket.emit('unitOrders', {unit: boardCanvasController.selectedUnit, orders: boardCanvasController.selectedUnit.orders[event.code]})
                    boardCanvasController.deselectUnit()
                    boardCanvasController.sounds.buildCity.play()
                    return
                case "Tab":
                    event.preventDefault()
                    return
                case "Escape":
                    boardCanvasController.deselectTile()
                    boardCanvasController.deselectUnit()
                    cityCanvasController.canvas.clearRect(0, 0, window.innerWidth, window.innerHeight)
                    bringToFront(boardCanvas)
                    return
                default:
                    return
            }
        } else {
            if (event.code === "ArrowUp") { boardCanvasController.scrollUp(); return }
            if (event.code === "ArrowDown") { boardCanvasController.scrollDown(); return }
            if (event.code === "ArrowLeft") { boardCanvasController.scrollLeft(); return }
            if (event.code === "ArrowRight") { boardCanvasController.scrollRight(); return }
            if (event.code === "Escape") {
                cityCanvasController.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight) // clear city canvas (akin to close city window)
                bringToFront(boardCanvas)
                return
            }
        }
        if (event.code === "Tab") {
            event.preventDefault() // prevent screen scrolling when moving selected unit, and tabbing
            boardCanvasController.selectNextUnit({board: clientGame.board, username: socket.id})
            if ( !(boardCanvasController.tileIsVisibleOnScreen(boardCanvasController.selectedTile)) ) { boardCanvasController.centerScreenOnTile(boardCanvasController.selectedTile) }
            console.log(boardCanvasController.selectedUnit)
            return
        }
    })

    boardCanvas.addEventListener("pointermove", (event) => {

        const rect = boardCanvasController.canvas.getBoundingClientRect()
        mouse.x = Math.floor((event.x - rect.left) / boardCanvasController.tileSize.x)
        mouse.y = Math.floor((event.y - rect.top) / boardCanvasController.tileSize.y)

        const hoveredTileXY = boardCanvasController.determineTileFromPixelCoordinates(event.offsetX, event.offsetY)
        let hoveredTile = clientGame.board.tiles?.[hoveredTileXY.x]?.[hoveredTileXY.y]
        //console.log(hoveredTile)

        if (hoveredTile?.unit) {
            // Set the popup content and position
            //console.log('unit')
            const objectInfo = `${hoveredTile.unit.unitType}`;
            popup.innerHTML = objectInfo;
            popup.style.left = `${event.x + 10}px`;
            popup.style.top = `${event.y + 10}px`;

            // Show the popup
            popup.style.display = 'block';
        } else {
            // Hide the popup if the mouse is not over the object
            popup.style.display = 'none';
        }
    })
 
    boardCanvas.addEventListener("pointerdown", (event) => {
        event.preventDefault()
        //console.log('listener added')
        pointerDown = true;
        pointerDownPixelLocation.x = event.x;
        pointerDownPixelLocation.y = event.y;
        //transformedPointerDownPixelLocation = canvas.getTransformedPoint(pointerDownPixelLocation.x, pointerDownPixelLocation.y)
        
        const rect = boardCanvasController.canvas.getBoundingClientRect()
        mouse.x = Math.floor((event.x - rect.left) / boardCanvasController.tileSize.x)
        mouse.y = Math.floor((event.y - rect.top) / boardCanvasController.tileSize.y)

        const clickedTile = boardCanvasController.determineTileFromPixelCoordinates(event.offsetX, event.offsetY)
        console.log(clickedTile)

        if (boardCanvasController.selectedUnit) {
            let targetTile = clientGame.board.tiles[clickedTile.x][clickedTile.y]
            if (clientGame.board.tiles[clickedTile.x][clickedTile.y].unit) {boardCanvasController.sounds.swordFight.play()} else {boardCanvasController.sounds.movePiece.play()}
            if (boardCanvasController.isInvalidMove(clickedTile)) { return }
            socket.emit('moveUnitToTile', {unit: boardCanvasController.selectedUnit, tile: targetTile})
            boardCanvasController.selectTile(targetTile)
            boardCanvasController.deselectUnit()
        } else {
            let targetTile = clientGame.board.tiles[clickedTile.x][clickedTile.y]
            if (targetTile.city) {
                selectedCity = targetTile.city
                cityCanvasController.renderCity(selectedCity)
                bringToFront(cityCanvas)
                pointerDown = false; // otherwise boardCanvas thinks the pointer is still down
                return
            }
            boardCanvasController.selectTile(targetTile)
            boardCanvasController.selectUnit({tile: targetTile, username: socket.id})
        }
        console.log("down:" + event.x + " " + event.y);
    }, { passive: false }) // prevents scrollbar https://stackoverflow.com/questions/20026502/prevent-mouse-wheel-scrolling-but-not-scrollbar-event-javascript


    boardCanvas.addEventListener("pointerup", (event) => {
        pointerDown = false;
        first_pass_pan = true;
        //console.log("mouse up");
    })

    const old_event = {x: 0, y: 0}
    let first_pass_pan = true;
    boardCanvas.addEventListener("pointermove", (event) => {
        //pointerDownPixelLocation
        event.preventDefault()
        //console.log(event)

        if (pointerDown) {
            boardCanvasController.panMouse(pointerDownPixelLocation, event.movementX, event.movementY)
        }

        // mousepan code ////////////////////////////////////////////////////
        /*
        if (pointerDown) {
            if (first_pass_pan) {
                first_pass_pan = false;
                old_event.x = canvas.getTransformedPoint(event.x,event.y).x
                old_event.y = canvas.getTransformedPoint(event.x,event.y).y
            } else {
            canvas.panMouse(
                old_event.x - canvas.getTransformedPoint(event.x,event.y).x,
                old_event.y - canvas.getTransformedPoint(event.x,event.y).y)
                //pointerDownPixelLocation.x - event.x,
                //pointerDownPixelLocation.y - event.y)
                old_event.x = canvas.getTransformedPoint(event.x,event.y).x
                old_event.y = canvas.getTransformedPoint(event.x,event.y).y
            return
            }
        } 
        */
        //console.log("move event:" + event.x + " " + event.y);
        //console.log("move old event:" + event.x + " " + event.y);
        
        ////////////////////////////////////////////////////////////////////////
        
    }, { passive: false }) // prevents scrollbar https://stackoverflow.com/questions/20026502/prevent-mouse-wheel-scrolling-but-not-scrollbar-event-javascript


    window.addEventListener("resize", () => {
        boardCanvasController.adjustCanvasSizeToBrowser(clientGame.board)
        cityCanvasController.adjustCanvasSizeToBrowser()
    } )
    boardCanvas.addEventListener("wheel", (event) => {
        event.preventDefault() 
        boardCanvasController.scrollZoom(event)
    }, { passive: false }) // prevents scrollbar https://stackoverflow.com/questions/20026502/prevent-mouse-wheel-scrolling-but-not-scrollbar-event-javascript

    cityCanvas.addEventListener("pointerdown", (event) => {
        const rect = cityCanvasController.canvas.getBoundingClientRect()
        const pixelX = event.x - rect.left
        const pixelY = event.y - rect.top
        cityCanvasController.getClickedArea(selectedCity, {pixelX, pixelY})
    })

}

function isInvalidMove(unit, direction) {
    return boardCanvasController.isInvalidMove({x: unit.coordinates.x + direction.x, y: unit.coordinates.y + direction.y})
}

function moveUnitInDirection(unit, direction) {
    socket.emit('moveUnitInDirection', {unit, direction})
    console.log(`moveUnitInDirection socket fired with unit = ${unit}, direction = ${direction}`)
    boardCanvasController.deselectTile()
    boardCanvasController.deselectUnit()
}

function moveUnitIfValidMove(unit, direction) { if (isInvalidMove(unit, direction)) {return} else { moveUnitInDirection(unit, direction) } }

function moveUnitToTile({unit, x, y}) {
    console.log(`${x}, ${y}`)
    if (boardCanvasController.isValidMove({unit, x, y})) {
        let tile = clientGame.board.tiles[x][y]
        socket.emit('moveUnitToTile', {unit, tile})
        boardCanvasController.selectTile(tile)
        boardCanvasController.deselectUnit()
    }
}

function bringToFront(element) {
    canvasOrder.unshift(element) // add element to end of array (so it will be in the front when 'setZindex' is called)
    canvasOrder = [...new Set(canvasOrder)];  // creates unique array i.e. removes extra element from array
    setZindex() // set z-index according to order of canvasOrder array
    //canvasOrder.forEach
    //for (let i = 0; i < this.canvasOrder.length; i++) {
    //    let column = []
    //    this.tiles.push(column)
    //}
}

function isAtFront(element) {
    element.style.zIndex === "0"
}

function initializeTestSwipeMotionForMobile() {  // https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android

    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;                                                        
    var yDown = null;

    function getTouches(evt) {
        evt.preventDefault()
        return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }                                                     
                                                                            
    function handleTouchStart(evt) {
        evt.preventDefault()
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                
                                                                            
    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
                                                                            
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                /* right swipe */
                boardCanvasController.scrollRight()
            } else {
                /* left swipe */
                boardCanvasController.scrollLeft()
            }                       
        } else {
            if ( yDiff > 0 ) {
                /* down swipe */ 
                boardCanvasController.scrollDown()
            } else { 
                /* up swipe */
                boardCanvasController.scrollUp()
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };

}

/*
function initializeTestPinchZoomForMobile() { // https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures
    // Global vars to cache event state
    const evCache = [];
    let prevDiff = -1;

    // Install event handlers for the pointer target
    const el = document.getElementById("target");
    el.onpointerdown = pointerdownHandler;
    el.onpointermove = pointermoveHandler;
    
    // Use same handler for pointer{up,cancel,out,leave} events since
    // the semantics for these events - in this app - are the same.
    el.onpointerup = pointerupHandler;
    el.onpointercancel = pointerupHandler;
    el.onpointerout = pointerupHandler;
    el.onpointerleave = pointerupHandler;

    function pointerdownHandler(ev) {
        // The pointerdown event signals the start of a touch interaction.
        // This event is cached to support 2-finger gestures
        evCache.push(ev);
        log("pointerDown", ev);
        socket.emit('message-from-client-to-server', 'evCache')
    }

    function pointermoveHandler(ev) {
        // This function implements a 2-pointer horizontal pinch/zoom gesture.
        //
        // If the distance between the two pointers has increased (zoom in),
        // the target element's background is changed to "pink" and if the
        // distance is decreasing (zoom out), the color is changed to "lightblue".
        //
        // This function sets the target element's border to "dashed" to visually
        // indicate the pointer's target received a move event.
        log("pointerMove", ev);
        ev.target.style.border = "dashed";
      
        // Find this event in the cache and update its record with this event
        const index = evCache.findIndex(
          (cachedEv) => cachedEv.pointerId === ev.pointerId,
        );
        evCache[index] = ev;
      
        // If two pointers are down, check for pinch gestures
        if (evCache.length === 2) {
          // Calculate the distance between the two pointers
          const curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
      
          if (prevDiff > 0) {
            if (curDiff > prevDiff) {
              // The distance between the two pointers has increased
              log("Pinch moving OUT -> Zoom in", ev);
              ev.target.style.background = "pink";
            }
            if (curDiff < prevDiff) {
              // The distance between the two pointers has decreased
              log("Pinch moving IN -> Zoom out", ev);
              ev.target.style.background = "lightblue";
            }
          }
      
          // Cache the distance for the next move event
          prevDiff = curDiff;
        }
    }

    function pointerupHandler(ev) {
        log(ev.type, ev);
        // Remove this pointer from the cache and reset the target's
        // background and border
        removeEvent(ev);
        ev.target.style.background = "white";
        ev.target.style.border = "1px solid black";
      
        // If the number of pointers down is less than two then reset diff tracker
        if (evCache.length < 2) {
          prevDiff = -1;
        }
    }

      
}
*/