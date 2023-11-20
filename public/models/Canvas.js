class Canvas {
    constructor({canvas, board}) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")//, { alpha: false }) // turning off transprency of canvas and makes background black
        this.boardSize = {x: board.size.x, y: board.size.y}
        this.tileSize = {}
        this.orientation = "short diamond"  // short diamond, diamond, or [nothing = standard]
        this.selectedUnit = ""
        this.selectedTile = ""
        this.sounds = {}
        this.sprites = {}
        this.view = {
            //origin: {x: 0, y: 0},  // referenced in client.js but x and y are not changed right now
            scale: 0.5 // update in scroolZoom
        }
        this.adjustCanvasSizeToBrowser(board)
        this.initializeSounds()
        this.initializeUnitSprites()
        this.initializeTerrainSprites()
        this.initializeCitiesSprites()
        //this.#setOffScreenCanvas()
        //canvas.renderMapOffScreenCanvas({board: clientGame.board, username: localPlayer.username})
    }



    // █████    █████   █   █   ███   ███    █████        █    ████    ████    ███    █   █    ████   █████   ████
    // █    █   █       █   █    █   █   █   █           █     █   █   █   █  █   █   █   █   █       █       █   █
    // █    █   █████    █ █     █   █       █████      █      ████    █████  █   █   █ █ █    ███    █████   █████
    // █    █   █        █ █     █   █   █   █         █       █   █   █  █   █   █   █ █ █       █   █       █  █
    // █████    █████     █     ███   ███    █████    █        ████    █   █   ███     ███    ████    █████   █   █

    #fixPixelBlur() {
        // https://stackoverflow.com/questions/31910043/html5-canvas-drawimage-draws-image-blurry
        //doesn't work
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
    }

    #adjustCanvasSizeToMatchBrowserOld() {
        const devicePixelRatio = window.devicePixelRatio || 1 // adjust resolution (e.g. macbook pro retina display has 2x resolution) test this later
        this.canvas.width = window.innerWidth //* devicePixelRatio
        this.canvas.height = window.innerHeight //* devicePixelRatio
    }


    #adjustCanvasSizeToMatchBrowser() {  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
        
        this.canvas.width = window.innerWidth // * devicePixelRatio
        this.canvas.height = window.innerHeight // * devicePixelRatio

        const devicePixelRatio = window.devicePixelRatio
        if (devicePixelRatio > 1) {

            this.canvas.width = window.innerWidth // * devicePixelRatio
            this.canvas.height = window.innerHeight // * devicePixelRatio

            // 2. Force it to display at the original (logical) size with CSS or style attributes
            this.canvas.style.width = window.innerWidth + 'px'
            this.canvas.style.height = window.innerHeight + 'px'

            // 3. Scale the context so you can draw on it without considering the ratio.
            this.ctx.scale(devicePixelRatio, devicePixelRatio)

            // update scale parameter for
            this.view.scale = Math.pow(this.view.scale, devicePixelRatio)
        }

        //this.ctx.scale(devicePixelRatio, devicePixelRatio)

        // Get the DPR and size of the canvas
        //const dpr = window.devicePixelRatio;
        //const rect = this.canvas.getBoundingClientRect();

        // Set the "actual" size of the canvas
        //this.canvas.width = rect.width * dpr;
        //this.canvas.height = rect.height * dpr;

        // Scale the context to ensure correct drawing operations
        //this.ctx.scale(dpr, dpr);


        // 2. Force it to display at the original (logical) size with CSS or style attributes
        //this.canvas.style.width = window.innerWidth + 'px'
        //this.canvas.style.height = window.innerHeight + 'px'

        // 3. Scale the context so you can draw on it without considering the ratio.
        //this.ctx.scale(devicePixelRatio, devicePixelRatio)
        //this.view.scale = Math.pow(this.view.scale, devicePixelRatio)
    }

    adjustCanvasSizeToBrowser(board) {
        this.#adjustCanvasSizeToMatchBrowser() // scrollZoom does not work unless canvas height and width are set to the window innerHeight & innerWeidth
        this.#setTileSize(board)
        this.#setCanvasOrientation()
        this.#fixPixelBlur()
    }

    #setTileSize(board) {
        this.#setTileSizeToMatchBrowserViewport(board)
        this.tileSize = { x: 62, y: 62 }
    }

    #setTileSizeToMatchBrowserViewport(board) {
        const minXorYDimension = Math.min(
            Math.floor(this.canvas.offsetWidth / board.size.x),
            Math.floor(this.canvas.offsetHeight / board.size.y)
            //Math.floor(this.canvas.width / board.size.x),
            //Math.floor(this.canvas.height / board.size.y)
        )
        this.tileSize = {x: minXorYDimension, y: minXorYDimension}
    }

    #setCanvasOrientation() {
        if (this.orientation === "diamond" ) { this.ctx.rotate(Math.PI*45/180) }
        if (this.orientation === "short diamond") { this.ctx.transform(1, 0.5, -1, 0.5, 0, 0) }
    }


    // █████    █████   ██    █   ████    █████   █████    ███   ██    █    █████
    // █    █   █       █ █   █   █   █   █       █    █    █    █ █   █   █    
    // ██████   █████   █  █  █   █   █   █████   ██████    █    █  █  █   █   ███ 
    // █   █    █       █   █ █   █   █   █       █   █     █    █   █ █   █    █
    // █    █   █████   █    ██   ████    █████   █    █   ███   █    ██    ████
    //
    // The standard map and diamond map are rendered differently.  [NOTE THAT NOT ALL FEATURES LISTED BELOW ARE IMPLEMENTED YET]
    //
    // Standard maps are flat and 2D, like a checkers board.
    //
    //     __________________                                    ______________________________________
    //    |                  |                                  |         `  X               ` X       |
    //    |                  |                                  |         `                  `         |
    //    |                  |                                  |         `                  `         |
    //    |                  |                                  |         `                  `         |
    //    |                  |                                  |         `                  `         |
    //    |                  |                                  |         `                  `         |
    //    |__________________|                                  |_________`__________________`_________|
    //
    //
    // The diamond pattern is created by rotating the square board by 45 degrees in clocwise direction
    // then creating a parallelogram by hiding the top and bottom triangles from view.
    //
    //
    //             ___                                                               `
    //            /   ___                                                           `   `
    //           /       ___                                                       `       `
    //          /           ___                                                   `           `
    //         / _ _ _ _ _ _ _ ___        __________________      _______________`_______________`_
    //        /                  /      /                  /      \             `                  `\
    //       /                  /      /                  /       /            `                  ` /
    //      /                  /      /                  /        \           `                  `  \
    //     /                  /      /                  /         /         X`                 X`   /
    //    /___ _ _ _ _ _ _ _ /      /__________________/          \_________`__________________`____\
    //        ___           /                                                 `               `
    //           ___       /                                                     `           `
    //              ___   /                                                         `       `
    //                 __/                                                             `   `
    //                                                                                    `
    // 
    // The board tile images are copied to the left and right to create the illusion of a world map when scrolling.
    // Each tile appears twice, on the board itself and the copied image.
    // the "camera" can scroll in one direction then jump to the other side upon hitting the edge.
    //
    // When moving the piece "off the board" (e.g. left from the left edge of the board),
    // the unit will both appear on the right edge of the board, and continue left to the copied image of the right edge tile.
    // For this reason, the scale of the canvas should be adjusted and constrained so the "camera" cannot see the same tile twice.

    // render each tile one at a time, starting with left column from top to bottom, through last column at right
    renderMap({board, username}) {
        board.tiles.forEach( (columnOfTiles, i) => {
            columnOfTiles.forEach( (tile, j) => {
              this.#renderTile({tile: tile, username: username})
            })
        })
    }

    // each tile will render the state of tile and determine by the game board
    #renderTile({tile, username}) {
        this.#renderTerrain(tile)
        this.#renderUnit(tile, username)
        this.#renderCity(tile, username)
        this.#renderTileOutline(tile)
    }

    animateBlinkSelectedUnit() {
        if ( (Math.floor(Date.now() / 400)) % 3 === 0 ) { this.#renderTerrain(this.selectedTile) } else { this.#renderUnit(this.selectedTile) }
    }

    // the outline is primarily used to show the original board locations for troubleshooting purposes right now (but will have other purposes later)
    #renderTileOutline(tile) {
        let x = tile.coordinates.x
        let y = tile.coordinates.y
        this.ctx.strokeStyle="black"
        this.ctx.strokeRect(x*this.tileSize.x,y*this.tileSize.y,this.tileSize.x,this.tileSize.y)
    }

    // copy image from source file then paste so it is centered (and rotated if diamond pattern) on board tile
    #renderTerrain(tile) {

        // skip tiles which are cropped out of the diamond view
        if (
            ( this.orientation === "diamond" || this.orientation === "short diamond" ) &&
            this.#isCroppedTileforDiamondView({x: tile.coordinates.x, y: tile.coordinates.y})
        ) { return } 

        // render tiles on the board
        const terrainSpritesSheet = this.sprites.terrain1
        const terrain = tile.terrain
        this.ctx.save() // remember canvas location and orientation
        this.#prepareCanvasToRenderImage(tile)  // find pixel at top left of tile before painting image
        this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: terrainSpritesSheet, sprite: terrain})  // paint image from source file
        this.ctx.restore() // restore canvas so its ready to render next tile in same manner

        // render the copied images of the tiles on either side of the board
        if (( this.orientation === "diamond" || this.orientation === "short diamond" )) {
            if (this.#toBeCopiedForRightSideOfDiamondMap(tile)) {
                this.ctx.save()
                this.#prepareCanvasToRenderImageForRightReflection(tile)
                this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: terrainSpritesSheet, sprite: terrain})
                this.ctx.restore()
            }
            if (this.#toBeCopiedForLeftSideOfDiamondMap(tile)) {
                this.ctx.save()
                this.#prepareCanvasToRenderImageForLeftReflection(tile)
                this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: terrainSpritesSheet, sprite: terrain})
                this.ctx.restore()
            }
        } else { // render image at left of board for standard
            if (this.#toBeCopiedForLeftSideOfStandardMap(tile)) {
                this.ctx.save()
                this.#prepareCanvasToRenderImageForLeftReflection(tile)
                this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: terrainSpritesSheet, sprite: terrain})
                this.ctx.restore()
            }
        }
    }

    // similar comments to #renderTerrain
    #renderUnit(tile, username) {
        
        if (tile.unit) { // unit exists on tile

            // render tiles on the board
            const unit = tile.unit.unitType
            const unitSpritesSheet = this.sprites.units
            this.ctx.save()
            this.#prepareCanvasToRenderImage(tile)
            this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: unitSpritesSheet, sprite: unit})
            this.ctx.restore()

            // render the copied images of the tiles on either side of the board for diamond pattern
            if (( this.orientation === "diamond" || this.orientation === "short diamond" )) {
                if (this.#toBeCopiedForRightSideOfDiamondMap(tile)) {
                    this.ctx.save()
                    this.#prepareCanvasToRenderImageForRightReflection(tile)
                    this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: unitSpritesSheet, sprite: unit})
                    this.ctx.restore()
                }
                if (this.#toBeCopiedForLeftSideOfDiamondMap(tile)) {
                    this.ctx.save()
                    this.#prepareCanvasToRenderImageForLeftReflection(tile)
                    this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: unitSpritesSheet, sprite: unit})
                    this.ctx.restore()
                }
            } else { // render image at left of board for standard
                if (this.#toBeCopiedForLeftSideOfStandardMap(tile)) {
                    this.ctx.save()
                    this.#prepareCanvasToRenderImageForLeftReflection(tile)
                    this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: unitSpritesSheet, sprite: unit})
                    this.ctx.restore()
                }
            }
            
           /*
            this.ctx.save()
            this.#positionCanvasToTileReflectionPixelAndRotateForImage(tile)
            this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: unitSpritesSheet, sprite: unit})
            this.ctx.restore()
            */
        }
    }

    #renderCity(tile, username) {
        
        if (tile.city) { // unit exists on tile

            // render tiles on the board
            const city = "stone-bronze-1-open"
            const citySpritesSheet = this.sprites.cities
            this.ctx.save()
            this.#prepareCanvasToRenderImage(tile)
            this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: citySpritesSheet, sprite: city})
            this.ctx.restore()

            // render the copied images of the tiles on either side of the board for diamond pattern
            if (( this.orientation === "diamond" || this.orientation === "short diamond" )) {
                if (this.#toBeCopiedForRightSideOfDiamondMap(tile)) {
                    this.ctx.save()
                    this.#prepareCanvasToRenderImageForRightReflection(tile)
                    this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: citySpritesSheet, sprite: city})
                    this.ctx.restore()
                }
                if (this.#toBeCopiedForLeftSideOfDiamondMap(tile)) {
                    this.ctx.save()
                    this.#prepareCanvasToRenderImageForLeftReflection(tile)
                    this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: citySpritesSheet, sprite: city})
                    this.ctx.restore()
                }
            } else { // render image at left of board for standard
                if (this.#toBeCopiedForLeftSideOfStandardMap(tile)) {
                    this.ctx.save()
                    this.#prepareCanvasToRenderImageForLeftReflection(tile)
                    this.#drawSpriteCenteredOnCanvasOrigin({spriteSheet: citySpritesSheet, sprite: city})
                    this.ctx.restore()
                }
            }
        }
    }

    // true if board tile is cropped
    #isCroppedTileforDiamondView({x, y}) {
        let isCroppedTileFromTopOfDiamondView = y < ( this.boardSize.x - x - 1 )
        let isCroppedTileFromBottomOfDiamondView = y > ( this.boardSize.y - x - 1 )
        return isCroppedTileFromTopOfDiamondView || isCroppedTileFromBottomOfDiamondView
    }

    /*
    isCopiedTile(tile) {
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            return this.#toBeCopiedForRightSideOfDiamondMap(tile) || this.#toBeCopiedForLeftSideOfDiamondMap(tile)
        } else {
            return this.#isCopiedTileForStandardMap(tile)
        }
    }   
    */

    // true if this tile should be copied to the right of the board
    #toBeCopiedForRightSideOfDiamondMap(tile) {
        const x = tile.coordinates.x
        const y = tile.coordinates.y
        return ( x < y - this.boardSize.x )   //x < this.boardSize.x + y  //  Math.floor(this.boardSize.x / 2) + 1
    }

    // true if this tile should be copied to the left of the board
    #toBeCopiedForLeftSideOfDiamondMap(tile) {
        const x = tile.coordinates.x
        const y = tile.coordinates.y
        return ( x > y - this.boardSize.x - 1)   //x < this.boardSize.x + y  //  Math.floor(this.boardSize.x / 2) + 1
    }

    #toBeCopiedForLeftSideOfStandardMap(tile) {
        return true // all tiles copied to left side
    }

    /*
    #isCopiedTileForRightSideOfDiamondMap(tile) {
        const x = tile.coordinates.x
        const y = tile.coordinates.y
        return (
            x > y - this.boardSize.x - 1 - this.tileSize &&
            x < this.boardSize.x
        )
    }

    #isCopiedTileForStandardMap(tile) {
        const x = tile.coordinates.x
        const y = tile.coordinates.y
        return (
            x < 0 &&
            x >= -this.boardSize.x &&  // copied cells are in same layout as board just copied to left side of y axis
            y < this.boardSize.y &&
            y >= 0
        )
    }
    */

    // translate canvas (and rotated if diamond pattern) so image will be centered on board tile
    #prepareCanvasToRenderImage(tile) {
        const tileCenterPixel = this.#findTileCenterPixel(tile)
        this.ctx.translate(tileCenterPixel.x, tileCenterPixel.y) // move canvas top left corner to center of tile
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            this.ctx.rotate(-this.#radiansForImageAngleAdjustment())  // rotate canvas 45 degrees to match orientation of diamond tiles
        }
    }

    #prepareCanvasToRenderImageForRightReflection(tile) {
        const tileCenterPixel = this.#findTileCenterPixel(tile)
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            this.ctx.translate(tileCenterPixel.x+this.tileSize.x*(this.boardSize.x), tileCenterPixel.y-this.tileSize.x*(this.boardSize.x))
            this.ctx.rotate(-this.#radiansForImageAngleAdjustment())  // rotate canvas 45 degrees to match orientation of diamond tiles
        } else {
            this.ctx.translate(tileCenterPixel.x+this.tileSize.x*(this.boardSize.x), tileCenterPixel.y)
        }
    }

    #prepareCanvasToRenderImageForLeftReflection(tile) {
        const tileCenterPixel = this.#findTileCenterPixel(tile)
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            this.ctx.translate(tileCenterPixel.x-this.tileSize.x*(this.boardSize.x), tileCenterPixel.y+this.tileSize.x*(this.boardSize.x))
            this.ctx.rotate(-this.#radiansForImageAngleAdjustment())  // rotate canvas 45 degrees to match orientation of diamond tiles
        } else {
            this.ctx.translate(tileCenterPixel.x-this.tileSize.x*(this.boardSize.x), tileCenterPixel.y)
        }
    }

    #drawSpriteCenteredOnCanvasOrigin({spriteSheet, sprite}) {
        this.ctx.drawImage(
            spriteSheet,
            ...this.#imageLocationAndDimensionsOnSpriteSheet(spriteSheet, sprite), // source (sprite sheet) image x, y, w, h
            ...this.#imagePositionRelativeToCenterOfTileAndDimensions(), // destination (board) x, y, w, h
        )
    }

    drawCityCanvasOrigin({spriteSheet}) {
        this.ctx.drawImage(
            spriteSheet, 0, 0,
            //...this.#imageLocationAndDimensionsOnSpriteSheet(spriteSheet, sprite), // source (sprite sheet) image x, y, w, h
            //0, 0, window.size.x, window.size.y, // destination (board) x, y, w, h
        )
    }

    /////////////////////
    #tileMovementFromBoardToRightCopy({x, y}) {
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            return {x: this.boardSize.x, y: -this.boardSize.x}
        } else {
            return {x: this.boardSize.x, y: 0}
        }
    }

    #tileMovementFromBoardToLeftCopy({x, y}) {
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            return {x: -this.boardSize.x, y: +this.boardSize.x}
        } else {
            return {x: this.boardSize.x, y: 0}
        }
    }
    //////////////////

    #findTileCenterPixel(tile) {
        //this.ctx.fillRect(0, 0, 5, 5) // draw dot at center of tile for troubleshooting
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            const radians = this.#radiansForImageAngleAdjustment()
            return {
                x: 0 + (tile.coordinates.x+0.5)*this.tileSize.x,
                y: 0 + (tile.coordinates.y+0.5)*this.tileSize.y
                //y: 0 + (tile.coordinates.y+0.5-tile.coordinates.x)*this.tileSize.y // align cells into latitudes
            }
        }
        return {
            x: 0 + (tile.coordinates.x+0.5)*this.tileSize.x,
            y: 0 + (tile.coordinates.y+0.5)*this.tileSize.y
        }
    }

    #imagePositionRelativeToCenterOfTileAndDimensions() {  // 
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            const radians = this.#radiansForImageAngleAdjustment()
            return [
                -this.tileSize.x * Math.cos(radians), // x
                -this.tileSize.y * Math.sin(radians), // y
                this.tileSize.x / Math.cos(radians), // w
                this.tileSize.y / Math.sin(radians) // h
            ]
        }
        return [
            0.5 * -this.tileSize.x, // x
            0.5 * -this.tileSize.y, // y
            this.tileSize.x, // w
            this.tileSize.y // h
        ]

        /*
        return [
            x*this.tileSize.x,
            y*this.tileSize.y + (this.tileSize.y-unitSpritesSheet[unit].h)/4,
            this.tileSize.x,
            this.tileSize.y*this.sprites.units[unit].h/this.sprites.units[unit].w
        ]
        */
            
    }

    #radiansForImageAngleAdjustment() {
        let angle = 0
        switch (this.orientation) {
            case "diamond":
                angle = 45
                break
            case "short diamond":
                angle = 45
                break
        }
        return Math.PI*angle/180
    }

    // █    █    ████   █████   █████       ███   ██    █   █████   █████   █████    █████    ███     ███    █████
    // █    █   █       █       █    █       █    █ █   █     █     █       █    █   █       █   █   █   █   █
    // █    █    ███    █████   ██████       █    █  █  █     █     █████   ██████   █████   █████   █       █████
    // █    █       █   █       █   █        █    █   █ █     █     █       █   █    █       █   █   █   █   █
    //  ████    ████    █████   █    █      ███   █    ██     █     █████   █    █   █       █   █    ███    █████



    // pair the screen pixel to the location on the board, used whenever user clicks on screen
    getTransformedPoint(x, y) { // https://roblouie.com/article/617/transforming-mouse-coordinates-to-canvas-coordinates/
        const originalPoint = new DOMPoint(x, y);
        return this.ctx.getTransform().invertSelf().transformPoint(originalPoint);
    }

    determineTileFromPixelCoordinates(x, y) {
        const currentTransformedCursor = this.getTransformedPoint(x, y)
        //console.log(currentTransformedCursor)
        let tileX = Math.floor(currentTransformedCursor.x / this.tileSize.x)
        let tileY = Math.floor(currentTransformedCursor.y / this.tileSize.y)
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            if (tileX >= this.boardSize.x) { // check if location corresponds to a copied tile to right of board
                const checkIfCopiedX = tileX - this.boardSize.x
                const checkIfCopiedY = tileY + this.boardSize.x
                //console.log([checkIfCopiedX, checkIfCopiedY])
                if (this.#isValidLocationOnMap({x: checkIfCopiedX, y: checkIfCopiedY})) {
                    tileX = checkIfCopiedX
                    tileY = checkIfCopiedY
                }
            }
            if (tileX < 0) { // check if location corresponds to a copied tile to left of board
                const checkIfCopiedX = tileX + this.boardSize.x
                const checkIfCopiedY = tileY - this.boardSize.x
                if (this.#isValidLocationOnMap({x: checkIfCopiedX, y: checkIfCopiedY})) {
                    [tileX, tileY] = [checkIfCopiedX, checkIfCopiedY]
                }
            }
        } else {
            if (tileX >= this.boardSize.x) {return} // standard map has copied cells on left only
            if (tileX < 0) {
                const checkIfCopiedX = tileX + this.boardSize.x
                const checkIfCopiedY = tileY
                if (this.#isValidLocationOnMap({x: checkIfCopiedX, y: checkIfCopiedY})) {
                    [tileX, tileY] = [checkIfCopiedX, checkIfCopiedY]
                }
            }
        }
        return {x: tileX, y: tileY}
    }

    clientOwnsUnit({unit, username}) { return unit.player.username === username }

    selectNextUnit({board, username}) {
        board.tiles.forEach( (column) => {
            column.forEach( (tile) => {
                if (tile.unit && tile.unit.player.username === username) {
                    this.selectUnit({tile: tile, username: username})
                    this.selectTile(tile)
                }
            })
        })
    }

    selectUnit({tile, username}) {
        if (tile.unit && this.clientOwnsUnit({unit: tile.unit, username: username})) { this.selectedUnit = tile.unit }
        console.log(this.selectedUnit)
    }

    selectTile(tile) { this.selectedTile = tile }

    // clearly this needs to be renamed or changed to be for cities only
    lookInsideCity(tile) {
        if (tile.city && this.clientOwnsUnit({unit: tile.city, username: username})) { this.selectedUnit = tile.unit }
    }

    deselectUnit() { this.selectedUnit = "" }

    deselectTile() { this.selectedTile = "" }

    scrollZoom(event) {  // https://roblouie.com/article/617/transforming-mouse-coordinates-to-canvas-coordinates/

        //console.log(event)

        const currentTransformedCursor = this.getTransformedPoint(event.x, event.y);
        
        const zoom = event.deltaY < 0 ? 1.1 : 0.9;
        
        this.ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y);
        this.ctx.scale(zoom, zoom);
        this.ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y);
        //console.log(currentTransformedCursor)

        this.view.scale = Math.pow(this.view.scale, zoom)
        
        // Redraws the image after the scaling    
        //drawImageToCanvas();
        
        // Stops the whole page from scrolling
        //event.preventDefault();
    }

    scrollUp() {
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            //const currentTransformedTileSize = this.getTransformedPoint(this.tileSize.x*this.view.scale, this.tileSize.y*this.view.scale)
            //const currentTransformedTileSizeY = this.getTransformedPoint(0, this.tileSize.y*this.view.scale)
            //this.ctx.translate(currentTransformedTileSize.x, currentTransformedTileSize.y)
            this.ctx.translate(this.tileSize.x*this.view.scale, this.tileSize.y*this.view.scale)
            //console.log(this.view.scale)
        } else {
            this.ctx.translate(0, this.tileSize.y*this.view.scale)
        }
    }

    panMouse(pointerDownPixelLocation, dx, dy) {
        if (true) {
            const pointerDownPixelLocationTransformedCursor = this.getTransformedPoint(pointerDownPixelLocation.x, pointerDownPixelLocation.y)
            //const currentTransformedTopLeftScreenPixel = this.getTransformedPoint(0, 0)
            const pointerCurrentPixelLocationTransformedCursor = this.getTransformedPoint(dx, dy)
            //console.log(transformedPointerDownPixelLocation)
            //this.ctx.translate(
            //    dx*this.view.scale,dy*this.view.scale 
            //)
            //this.ctx.translate(
            //    pointerDownPixelLocationTransformedCursor.x,
            //    pointerDownPixelLocationTransformedCursor.y
            //)
            /*
            this.ctx.translate(
                pointerCurrentPixelLocationTransformedCursor.x,
                pointerCurrentPixelLocationTransformedCursor.y
            )
            */
            const radians = this.#radiansForImageAngleAdjustment()  // I know why this doesn't work now ..
            //-this.tileSize.x * Math.cos(radians) // x
            //-this.tileSize.y * Math.sin(radians) // y
            //this.tileSize.x / Math.cos(radians), // w
            //this.tileSize.y / Math.sin(radians) // h
            /*
            this.ctx.translate(
                (dx *  Math.cos(radians) + dy *  Math.sin(radians) ),
                (dx * -Math.cos(radians) + dy * -Math.sin(radians) )
            )
            a, b, c, d, e, f
            this.ctx.transform(1, 0.5, -1, 0.5, 0, 0)
            */
            let a = -1 // 1 original transform
            let b = 2 // 0.5 original transform
            let c = 1 // -1 original transform 
            let d = 2 // 0.5 original transform
            let e = 0
            let f = 0
            let newDX = a*dx + c*dy + e
            let newDY = b*dx + d*dy + f
            this.ctx.translate(
                newDX,
                newDY
            )
            console.log(dx, dy)
            console.log(newDX, newDY)
            console.log(pointerCurrentPixelLocationTransformedCursor)  // I know why this doesn't work now ..
            //console.log("dx,dy = " + dx + " " + dy)
            //console.log("move dx=" + dx + " and dy=" & dy)
        } else {
            //.ctx.translate(0, this.tileSize.y*this.view.scale)
        }
    }

        //const currentTransformedOrigin = this.getTransformedPoint(0, 0)
        //const currentTransformedTileSizeY = this.getTransformedPoint(0, this.tileSize.y)
        //const currentTransformedTileSizeY = this.getTransformedPoint(0, this.tileSize.y*this.view.scale)
        //this.ctx.translate(currentTransformedOrigin.x, currentTransformedOrigin.y + currentTransformedTileSizeY.y)
        //this.ctx.translate(currentTransformedTileSizeY.x, currentTransformedTileSizeY.y)
        //this.ctx.translate(currentTransformedOrigin.x, currentTransformedOrigin.y)

    scrollDown() {
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            this.ctx.translate(-this.tileSize.x*this.view.scale, -this.tileSize.y*this.view.scale)
        } else {
            this.ctx.translate(0,-this.tileSize.y*this.view.scale)
        }
    }
        //const currentTransformedOrigin = this.getTransformedPoint(0, 0)
        //const currentTransformedTileSizeY = this.getTransformedPoint(0, this.tileSize.y*this.view.scale)
        //this.ctx.translate(currentTransformedOrigin.x, currentTransformedOrigin.y)// - currentTransformedTileSizeY.y)
        //this.ctx.translate(-this.tileSize.x*this.view.scale, -this.tileSize.y*this.view.scale)
    scrollLeft() {
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            this.ctx.translate(this.tileSize.x*this.view.scale, -this.tileSize.y*this.view.scale)
        } else {
            this.ctx.translate(+this.tileSize.x*this.view.scale, 0)
        }
    }
    scrollRight() {
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            this.ctx.translate(-this.tileSize.x*this.view.scale, this.tileSize.y*this.view.scale)
        } else {
            this.ctx.translate(-this.tileSize.x*this.view.scale, 0)
        }
    }

    // currently used to find selected unit on the map when the 'tab' key is pressed (see client.js event listeners)
    centerScreenOnTile(tile) {
        const currentTransformedCenterScreenPixel = this.getTransformedPoint(window.innerWidth/2, window.innerHeight/2);
        this.ctx.translate(
            currentTransformedCenterScreenPixel.x - tile.coordinates.x * this.tileSize.x,
            currentTransformedCenterScreenPixel.y - tile.coordinates.y * this.tileSize.y
        )
    }

    // currently used to determine if selected tile is visible, or if it is necessary to centerScreenOnTile
    tileIsVisibleOnScreen(tile) {
        const currentTransformedTopLeft = this.getTransformedPoint(0, 0)
        const currentTransformedTopRight = this.getTransformedPoint(window.innerWidth, 0)
        const currentTransformedBottomLeft = this.getTransformedPoint(0, window.innerHeight)
        return (
            tile.coordinates.x > this.boardSize.y - currentTransformedTopLeft.y &&
            tile.coordinates.y < this.boardSize.y - currentTransformedTopLeft.x &&
            tile.coordinates.x < this.boardSize.y - currentTransformedTopRight.y &&
            tile.coordinates.y > this.boardSize.y - currentTransformedBottomLeft.x
        )
    }


    // ████    █   █   █       █████    ████        █    ██ ██    ███    █   █   █████   ██ ██   █████   ██    █   █████
    // █   █   █   █   █       █       █           █     █ █ █   █   █   █   █   █       █ █ █   █       █ █   █     █
    // █████   █   █   █       █████    ███       █      █ █ █   █   █    █ █    ████    █ █ █   █████   █  █  █     █
    // █  █    █   █   █       █           █     █       █   █   █   █    █ █    █       █   █   █       █   █ █     █
    // █   █    ███    █████   █████   ████     █        █   █    ███      █     █████   █   █   █████   █    ██     █


    // most of these are just being started and probably will be re-factored

    onLeftEdge({x, y}) { // same for diamond, but smaller when cropped
        return x === 0
    }

    onRightEdge({x, y}) { // same for diamond, but smaller when cropped
        return x === this.boardSize.x - 1
    }

    onTopEdgeOfDiamondMap({x, y}) {
        return ( (x === this.boardSize.x - y - 1) && (this.orientation === "diamond" || this.orientation === "short diamond") )
    }

    onBottomEdgeOfDiamondMap({x, y}) {
        return ( (x === this.boardSize.y - y - 1) && (this.orientation === "diamond" || this.orientation === "short diamond") )
    }

    targetCoordinatesIfMovingLeftEdgeToRightEdge({x, y}) {
        let targetX
        let targetY
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            targetX = x+(clientGame.board.size.x-1)
            targetY = y-(clientGame.board.size.x-1)
        } else {
            targetX = x+(clientGame.board.size.x-1)
            targetY = y
        }
        return [targetX, targetY]
    }

    targetCoordinatesIfMovingLeft({x, y}) {
        let targetX
        let targetY
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            targetX = x-1
            targetY = y+1
        } else {
            targetX = x-1
            targetY = y
        }
        return [targetX, targetY]
    }

    targetCoordinatesIfMovingRightEdgeToLeftEdge({x, y}) {
        let targetX
        let targetY
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            targetX = x-(clientGame.board.size.x-1)
            targetY = y+(clientGame.board.size.x-1)
        } else {
            targetX = x-(clientGame.board.size.x-1)
            targetY = y
        }
        return [targetX, targetY]
    }

    targetCoordinatesIfMovingRight({x, y}) {
        let targetX
        let targetY
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            targetX = x+1
            targetY = y-1
        } else {
            targetX = x+1
            targetY = y
        }
        return [targetX, targetY]
    }

    targetCoordinatesIfMovingUp({x, y}) {
        let targetX
        let targetY
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            targetX = x-1
            targetY = y-1
        } else {
            targetX = x
            targetY = y-1
        }
        return [targetX, targetY]
    }

    targetCoordinatesIfMovingUpOnLeftEdge({x, y}) {
        let targetX
        let targetY
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            targetX = x+(clientGame.board.size.x-1)
            targetY = y-(clientGame.board.size.x+1)
        } else {
            targetX = x
            targetY = y-1
        }
        return [targetX, targetY]
    }

    targetCoordinatesIfMovingDown({x, y}) {
        let targetX
        let targetY
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            targetX = x+1
            targetY = y+1
        } else {
            targetX = x
            targetY = y+1
        }
        return [targetX, targetY]
    }

    targetCoordinatesIfMovingDownOnRightEdge({x, y}) {
        let targetX
        let targetY                        
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            targetX = x-(clientGame.board.size.x-1)
            targetY = y+(clientGame.board.size.x+1)
        } else {
            targetX = x
            targetY = y+1
        }
        return [targetX, targetY]
    }

    #isValidLocationOnMap({x, y}) {
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            //console.log(this.#isValidLocationOnDiamondMap({x, y}))
            return this.#isValidLocationOnDiamondMap({x, y})
        } else {
            return this.#isValidLocationOnStandardMap({x, y})
        }
    }
    
    #isValidLocationOnStandardMap({x, y}) {
        return (
            x >= 0 &&
            x < this.boardSize.x &&
            y >= 0 &&
            y < this.boardSize.y
        )
    }

    #isValidLocationOnDiamondMap({x, y}) {
        //console.log(0, this.boardSize.x - 1, y - this.boardSize.x - 1, y + this.boardSize.x - 1)
        return (
            x >= 0 &&  // left edge
            x <= (this.boardSize.x - 1) &&  // right edge
            x >= (this.boardSize.x - y - 1) &&  // top edge
            x <= (this.boardSize.y - y - 1)  // bottom edge
        )
    }

    // this is still used but I am going to phase this out
    isInvalidMove({x, y}) {
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            return (
                this.#isCroppedTileforDiamondView({x, y}) ||
                this.#isInTheNorthPoleOfDiamondView({x, y}) ||
                this.#isInTheSouthPoleOfDiamondView({x, y})
            )
        } else {
            return false
        }
    }

    // phasing this in
    isValidMove({unit, x, y}) {
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            return (
                //tile.coordinates &&
                !(this.#isCroppedTileforDiamondView({x, y})) &&
                !(this.#isInTheNorthPoleOfDiamondView({x, y})) &&
                !(this.#isInTheSouthPoleOfDiamondView({x, y}))
            )
        } else {
            return true
        }
    }

    #isInTheNorthPoleOfDiamondView({x, y}) {
        return y < ( this.boardSize.y - this.boardSize.x - x - 1 )
    }

    #isInTheSouthPoleOfDiamondView({x, y}) {
        return y > ( this.boardSize.y - x - 1 )
    }


    //  ████   █████   █████    ███   █████   █████    ████         █     ████    ███    █   █   ██    █   ████     ████
    // █       █   █   █    █    █      █     █       █            █     █       █   █   █   █   █ █   █   █   █   █
    //  ███    █████   ██████    █      █     █████    ███        █       ███    █   █   █   █   █  █  █   █   █    ███
    //     █   █       █   █     █      █     █           █      █           █   █   █   █   █   █   █ █   █   █       █
    // ████    █       █    █   ███     █     █████   ████      █        ████     ███     ███    █    ██   ████    ████


    initializeSounds() {
        this.sounds.movePiece = new Audio('/assets/sounds/MOVPIECE.WAV');
        this.sounds.swordFight = new Audio('/assets/sounds/SWORDFGT.WAV');
        this.sounds.buildCity = new Audio('/assets/sounds/BLDCITY.WAV');
    }

    initializeUnitSprites() {
        this.sprites.units = new Image()
        this.sprites.units.src = "/assets/images/units.png"
        let unitSprites = [
            ['settler', 'engineer', 'warrior', 'phalanx', 'archer', 'legion', 'pikeman', 'musketeer', 'fanatic'],
            ['partisan', 'alpine', 'rifleman', 'marine', 'parachuter', 'humvee', 'horseman', 'chariot', 'elephant'],
            ['crusader', 'knight', 'not sure cavalry', 'cavalary', 'armor', 'catapult', 'cannon', 'artillery', 'howitzer'],
            ['plane', 'bomber', 'helicopter', 'fighter', 'stealth', 'trireme', 'caravel', 'galley', 'frigate'],
            ['ironclad', 'destroyer', 'cruser', 'not sure ship', 'battleship', 'submarine', 'carrier', 'transport', 'missile'],
            ['nuclear', 'diplomat', 'spy', 'caravan', 'freight', 'explorer', 'not sure barbarian', 'not sure boat', 'not sure ballon'],
            ['barb1', 'barb2', 'barb3', 'barb4', 'barb5', 'barb6', 'barb7', 'barb8', 'barb9', 'barb10']
        ]
        unitSprites.forEach( (row, j) => {
            row.forEach( (unit, i) => {
                this.sprites.units[unit] = {x: 2+i*65, y: 2+j*49, w: 62, h: 46}
            })
        })
        this.sprites.units['shield'] = {x: 597, y: 30, w: 12, h: 20}
    }

    initializeTerrainSprites() {
        this.sprites.terrain2 = new Image()
        this.sprites.terrain2.src = "/assets/images/terrain2.png"
        let terrain2Sprites = [
            [],
            [],
            ['river', 'river-45', 'river-135', 'river-45-135', 'river-225', 'river-45-225', 'river-135-225', 'river-45-135-225'],
            ['river-315', 'river-45-315', 'river-135-315', 'river-45-135-315', 'river-225-315', 'river-45-225-315', 'river-135-225-315', 'river-45-135-225-315'],
            ['forest', 'forest-45', 'forest-135', 'forest-45-135', 'forest-225', 'forest-45-225', 'forest-135-225', 'forest-45-135-225'],
            ['forest-315', 'forest-45-315', 'forest-135-315', 'forest-45-135-315', 'forest-225-315', 'forest-45-225-315', 'forest-135-225-315', 'forest-45-135-225-315'],
            ['mountain', 'mountain-45', 'mountain-135', 'mountain-45-135', 'mountain-225', 'mountain-45-225', 'mountain-135-225', 'mountain-45-135-225'],
            ['mountain-315', 'mountain-45-315', 'mountain-135-315', 'mountain-45-135-315', 'mountain-225-315', 'mountain-45-225-315', 'mountain-135-225-315', 'mountain-45-135-225-315'],
            ['hill', 'hill-45', 'hill-135', 'hill-45-135', 'hill-225', 'hill-45-225', 'hill-135-225', 'hill-45-135-225'],
            ['hill-315', 'hill-45-315', 'hill-135-315', 'hill-45-135-315', 'hill-225-315', 'hill-45-225-315', 'hill-135-225-315', 'hill-45-135-225-315'],
            ['rivermouth-45', 'rivermouth-135', 'rivermouth-225', 'rivermouth-315']
        ]
        terrain2Sprites.forEach( (row, j) => {
            row.forEach( (terrain, i) => {
                this.sprites.terrain2[terrain] = {x: 2+i*65, y: 2+j*33, w: 62, h: 30}
            })
        })
        
        this.sprites.terrain1 = new Image()
        this.sprites.terrain1.src = "/assets/images/terrain1.png"
        let terrain1Sprites = [
            ['desert', 'desert-2', 'oasis', 'oil'],//-1', 'desert-2'],
            ['prairie', '', 'bison', 'wheat'],
            ['grassland', 'grassland-2', 'grassland-silk', 'grassland-silkworm'],
            ['forest-base-1', 'forest-base-2', 'pheasant', 'silk', '', '', '', 'irrigation'],
            ['hill-base-1', 'hill-base-2', 'coal', 'grapes', '', '', '', 'farmland'],
            ['mountain-base-1', 'mountain-base-2', 'gold', 'iron', '', '', '', 'mine'],
            ['tundra', 'walrus', 'walrus', 'goat', 'fur', 'iron', '', '', '', 'pollution'],
            ['arctic', 'moose', 'walrus', 'oil', 'iron', '', '', '', 'grassland-resource'],
            ['swamp', 'moose', 'peat', 'spice', '', '', '', 'village'],
            ['jungle', 'jungle-2', 'gems', 'bananas'],
            ['ocean', '', 'fish', 'whale']
        ]
        terrain1Sprites.forEach( (row, j) => {
            row.forEach( (terrain, i) => {
                this.sprites.terrain1[terrain] = {x: 2+i*65, y: 2+j*33, w: 62, h: 30}
            })
        })
    }

    initializeCitiesSprites() {
        this.sprites.cities = new Image()
        this.sprites.cities.src = "/assets/images/cities.png"
        let citiesSprites = [
            ['stone-bronze-1-open', 'stone-bronze-2-open', 'stone-bronze-3-open', 'stone-bronze-4-open', '', 'stone-bronze-1-walled', 'stone-bronze-2-walled', 'stone-bronze-3-walled', 'stone-bronze-4-walled'],
            ['ancient-classical-1-open', 'ancient-classical-2-open', 'ancient-classical-3-open', 'ancient-classical-4-open', '', 'ancient-classical-1-walled', 'ancient-classical-2-walled', 'ancient-classical-3-walled', 'ancient-classical-4-walled'],
            ['far-east-1-open', 'far-east-2-open', 'far-east-3-open', 'far-east-4-open', '', 'far-east-1-walled', 'far-east-2-walled', 'far-east-3-walled', 'far-east-4-walled'],
            ['medieval-1-open', 'medieval-2-open', 'medieval-3-open', 'medieval-4-open', '', 'medieval-1-walled', 'medieval-2-walled', 'medieval-3-walled', 'medieval-4-walled'],
            ['early-industrial-1-open', 'early-industrial-2-open', 'early-industrial-3-open', 'early-industrial-4-open', '', 'early-industrial-1-walled', 'early-industrial-2-walled', 'early-industrial-3-walled', 'early-industrial-4-walled'],
            ['modern-1-open', 'modern-2-open', 'modern-3-open', 'modern-4-open', '', 'modern-1-walled', 'modern-2-walled', 'modern-3-walled', 'modern-4-walled']
        ]
        citiesSprites.forEach( (row, j) => {
            row.forEach( (city, i) => {
                this.sprites.cities[city] = {x: 2+i*65, y: 40+j*49, w: 62, h: 46}
            })
        })
    }

    #imageLocationAndDimensionsOnSpriteSheet(terrainSpritesSheet, terrain) {
        return [terrainSpritesSheet[terrain].x, terrainSpritesSheet[terrain].y, terrainSpritesSheet[terrain].w, terrainSpritesSheet[terrain].h]
    }
}