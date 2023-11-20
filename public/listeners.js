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
                        canvas.targetCoordinatesIfMovingUpOnLeftEdge({x, y}) : canvas.targetCoordinatesIfMovingUp({x, y})
                    moveUnitToTile({unit: unit, x: targetX, y: targetY}) // check if valid move, emit move to server, update canvas
                    break
                case "ArrowDown":
                    if (canvas.onBottomEdgeOfDiamondMap({x, y})) {return}
                    [targetX, targetY] = canvas.onRightEdge({x, y}) ?
                        canvas.targetCoordinatesIfMovingDownOnRightEdge({x, y}) : canvas.targetCoordinatesIfMovingDown({x, y})
                    moveUnitToTile({unit: unit, x: targetX, y: targetY}) // check if valid move, emit move to server, update canvas
                    break
                case "KeyB":
                    socket.emit('unitOrders', {unit: canvas.selectedUnit, orders: canvas.selectedUnit.orders[event.code]})
                    canvas.deselectUnit()
                    canvas.sounds.buildCity.play()
                    return
                case "Tab":
                    event.preventDefault()
                    return
                case "Escape":
                    canvas.deselectTile()
                    canvas.deselectUnit()
                    cityCanvasController.canvas.clearRect(0, 0, window.innerWidth, window.innerHeight)
                    return
                default:
                    return
            }
        } else {
            if (event.code === "ArrowUp") { canvas.scrollUp(); return }
            if (event.code === "ArrowDown") { canvas.scrollDown(); return }
            if (event.code === "ArrowLeft") { canvas.scrollLeft(); return }
            if (event.code === "ArrowRight") { canvas.scrollRight(); return }
            if (event.code === "Escape") {
                cityCanvasController.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight) // clear city canvas (akin to close city window)
                //bringToFront(canvas1)
            }
        }
        if (event.code === "Tab") {
            event.preventDefault() // prevent screen scrolling when moving selected unit, and tabbing
            canvas.selectNextUnit({board: clientGame.board, username: socket.id})
            if ( !(canvas.tileIsVisibleOnScreen(canvas.selectedTile)) ) { canvas.centerScreenOnTile(canvas.selectedTile) }
            console.log(canvas.selectedUnit)
            return
        }
    })

    window.addEventListener("pointermove", (event) => {

        const rect = canvas.canvas.getBoundingClientRect()
        mouse.x = Math.floor((event.x - rect.left) / canvas.tileSize.x)
        mouse.y = Math.floor((event.y - rect.top) / canvas.tileSize.y)

        const hoveredTileXY = canvas.determineTileFromPixelCoordinates(event.offsetX, event.offsetY)
        let hoveredTile = clientGame.board.tiles[hoveredTileXY.x][hoveredTileXY.y]
        //console.log(hoveredTile)

        if (hoveredTile.unit) {
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
 
    window.addEventListener("pointerdown", (event) => {
        event.preventDefault()
        console.log('listener added')
        pointerDown = true;
        pointerDownPixelLocation.x = event.x;
        pointerDownPixelLocation.y = event.y;
        //transformedPointerDownPixelLocation = canvas.getTransformedPoint(pointerDownPixelLocation.x, pointerDownPixelLocation.y)

        // WILL BE USED LATER ON FOR CITY VIEW //
        if ( isAtFront(cityCanvas) ) {
            console.log("clicking on city window")
            return
        }
        ////////////////////////////////////////
        
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
            let targetTile = clientGame.board.tiles[clickedTile.x][clickedTile.y]
            if (targetTile.city) {
                cityCanvasController.renderCity(targetTile.city)
                //bringToFront(cityCanvas)
                return
            }
            canvas.selectTile(targetTile)
            canvas.selectUnit({tile: targetTile, username: socket.id})
        }
        console.log("down:" + event.x + " " + event.y);
    }, { passive: false }) // prevents scrollbar https://stackoverflow.com/questions/20026502/prevent-mouse-wheel-scrolling-but-not-scrollbar-event-javascript


    window.addEventListener("pointerup", (event) => {
        pointerDown = false;
        first_pass_pan = true;
        //console.log("mouse up");
    })

    const old_event = {x: 0, y: 0}
    let first_pass_pan = true;
    window.addEventListener("pointermove", (event) => {
        //pointerDownPixelLocation
        event.preventDefault()
        console.log(event)

        if (pointerDown) {
            canvas.panMouse(pointerDownPixelLocation, event.movementX, event.movementY)
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
        console.log("move event:" + event.x + " " + event.y);
        console.log("move old event:" + event.x + " " + event.y);
        
        ////////////////////////////////////////////////////////////////////////
        
    }, { passive: false }) // prevents scrollbar https://stackoverflow.com/questions/20026502/prevent-mouse-wheel-scrolling-but-not-scrollbar-event-javascript


    window.addEventListener("resize", () => {
        canvas.adjustCanvasSizeToBrowser(clientGame.board)
        cityCanvasController.adjustCanvasSizeToBrowser()
    } )
    window.addEventListener("wheel", (event) => {
        event.preventDefault() 
        canvas.scrollZoom(event)
    }, { passive: false }) // prevents scrollbar https://stackoverflow.com/questions/20026502/prevent-mouse-wheel-scrolling-but-not-scrollbar-event-javascript

}

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

function bringToFront(element) {
    element.style.zIndex = "0";
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
                canvas.scrollRight()
            } else {
                /* left swipe */
                canvas.scrollLeft()
            }                       
        } else {
            if ( yDiff > 0 ) {
                /* down swipe */ 
                canvas.scrollDown()
            } else { 
                /* up swipe */
                canvas.scrollUp()
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