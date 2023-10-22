class Canvas {
    constructor({canvasID, board}) {
        this.canvas = document.getElementById(canvasID)
        this.ctx = this.canvas.getContext("2d")
        this.tileSize = {}
        this.orientation = "short diamond"
        this.selectedUnit = ""
        this.selectedTile = ""
        this.sounds = {}
        this.sprites = {}
        this.adjustCanvasSizeToBrowser(board)
        this.initializeSounds()
        this.initializeSprites()
        this.initializeTerrain()
        this.view = {
            //origin: {x: 0, y: 0},  // referenced in client.js but x and y are not changed right now
            scale: 1 // update in scroolZoom
        }
        //this.#setOffScreenCanvasForTerrain()
    }

    #setOffScreenCanvasForTerrain() {
        this.offScreenCanvas = document.getElementById("offScreenCanvas")
        //this.offscreenCanvas = document.createElement("canvas");
        this.offScreenCanvas.width = this.canvas.width;
        this.offScreenCanvas.height = this.canvas.height;
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
        this.offScreenContext = this.offScreenCanvas.getContext("2d")

        const terrainSpritesSheet = this.sprites.terrain1

    }

    #adjustCanvasSizeToMatchBrowser() {
        const devicePixelRatio = window.devicePixelRatio || 1 // adjust resolution (e.g. macbook pro retina display has 2x resolution), test this later
        this.canvas.width = window.innerWidth //* devicePixelRatio
        this.canvas.height = window.innerHeight //* devicePixelRatio
    }

    adjustCanvasSizeToBrowser(board) {
        this.#adjustCanvasSizeToMatchBrowser() // scrollZoom does not work unless canvas height and width are set to the window innerHeight & innerWeidth
        this.#setTileSize(board)
        this.#setCanvasOrientation()
    }

    #setTileSize(board) {
        this.#setTileSizeToMatchBrowserViewport(board)
        //this.tileSize = { x: 62, y: 62 }
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

    scrollZoom(event) {  // https://roblouie.com/article/617/transforming-mouse-coordinates-to-canvas-coordinates/

        console.log(event)

        const currentTransformedCursor = this.getTransformedPoint(event.x, event.y);
        
        const zoom = event.deltaY < 0 ? 1.1 : 0.9;
        
        this.ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y);
        this.ctx.scale(zoom, zoom);
        this.ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y);
        console.log(currentTransformedCursor)

        this.view.scale *= zoom
        
        // Redraws the image after the scaling    
        //drawImageToCanvas();
        
        // Stops the whole page from scrolling
        //event.preventDefault();
    }

    scrollUp() {
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            this.ctx.translate(this.tileSize.x*this.view.scale, this.tileSize.y*this.view.scale)
        } else {
            this.ctx.translate(0, this.tileSize.y*this.view.scale)
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
            this.ctx.translate(0, -this.tileSize.y*this.view.scale)
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
            this.ctx.translate(-this.tileSize.x*this.view.scale, 0)
        }
    }
    scrollRight() {
        if (this.orientation === "diamond" || this.orientation === "short diamond") {
            this.ctx.translate(-this.tileSize.x*this.view.scale, this.tileSize.y*this.view.scale)
        } else {
            this.ctx.translate(this.tileSize.x*this.view.scale, 0)
        }
    }

    getTransformedPoint(x, y) { // https://roblouie.com/article/617/transforming-mouse-coordinates-to-canvas-coordinates/
        const originalPoint = new DOMPoint(x, y);
        return this.ctx.getTransform().invertSelf().transformPoint(originalPoint);
    }

    initializeSounds() {
        this.sounds.movePiece = new Audio('MOVPIECE.WAV');
        this.sounds.swordFight = new Audio('SWORDFGT.WAV');
    }

    initializeSprites() {
        this.sprites.units = new Image()
        this.sprites.units.src = "units.png"
        let unitSprites = [
            ['settler', 'engineer', 'warrior', 'phalanx', 'archer', 'legion', 'pikeman', 'musketeer', 'fanatic'],
            ['partisan', 'alpine', 'rifleman', 'marine', 'parachuter', 'humvee', 'horseman', 'chariot', 'elephant'],
            ['crusader', 'knight', 'not sure cavalry', 'cavalary', 'armor', 'catapult', 'cannon', 'not sure cannon', 'howitzer'],
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
    }

    initializeTerrain() {
        this.sprites.terrain2 = new Image()
        this.sprites.terrain2.src = "terrain2.png"
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
        this.sprites.terrain1.src = "terrain1.png"
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

    #imageLocationAndDimensionsOnSpriteSheet(terrainSpritesSheet, terrain) {
        return [terrainSpritesSheet[terrain].x, terrainSpritesSheet[terrain].y, terrainSpritesSheet[terrain].w, terrainSpritesSheet[terrain].h]
    }

    determineTileFromPixelCoordinates(x, y) {
        const currentTransformedCursor = this.getTransformedPoint(x, y)
        console.log(currentTransformedCursor)
        const tileX = Math.floor(currentTransformedCursor.x / this.tileSize.x)
        const tileY = Math.floor(currentTransformedCursor.y / this.tileSize.y)
        return {x: tileX, y: tileY}
    }

    selectUnit({tile, username}) {
        if (tile.unit && this.clientOwnsUnit({unit: tile.unit, username: username})) { this.selectedUnit = tile.unit }
        console.log(this.selectedUnit)
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

    selectTile(tile) { this.selectedTile = tile }

    deselectUnit() { this.selectedUnit = "" }

    deselectTile() { this.selectedTile = "" }

    animateBlinkSelectedUnit() {
        if ( (Math.floor(Date.now() / 400)) % 3 === 0 ) { this.#renderTerrain(this.selectedTile) } else { this.#renderUnit(this.selectedTile) }
    }

    #renderTerrain(tile) {       
        const terrainSpritesSheet = this.sprites.terrain1
        const terrain = tile.terrain

        this.ctx.save()
        const tileCenterPixel = this.#findTileCenterPixel(tile)
        this.ctx.translate(tileCenterPixel.x, tileCenterPixel.y) // center of tile
        this.ctx.rotate(-this.#radiansForImageAngleAdjustment())
        this.ctx.drawImage(
            terrainSpritesSheet,
            ...this.#imageLocationAndDimensionsOnSpriteSheet(terrainSpritesSheet, terrain), // x, y, w, h
            ...this.#imagePositionRelativeToCenterOfTileAndDimensions() // x, y, w, h
        )
        this.ctx.restore()
    }

    #renderFlateTerrain(tile) {

    }

    #renderUnit(tile, username) {
        if (tile.unit) {
            const unit = "legion"
            const unitSpritesSheet = this.sprites.units
            this.ctx.save()
            const tileCenterPixel = this.#findTileCenterPixel(tile)
            this.ctx.translate(tileCenterPixel.x, tileCenterPixel.y) // center of tile
            this.ctx.rotate(-this.#radiansForImageAngleAdjustment())
            this.ctx.drawImage(
                unitSpritesSheet,
                ...this.#imageLocationAndDimensionsOnSpriteSheet(unitSpritesSheet, unit), // x, y, w, h
                ...this.#imagePositionRelativeToCenterOfTileAndDimensions(), // x, y, w, h
            )
            this.ctx.restore()
        }
    }

    #renderTile({tile, username}) {
        this.#renderTerrain(tile)
        this.#renderUnit(tile, username)
        this.#renderTileOutline(tile)
    }

    #renderTileOutline(tile) {
        let x = tile.coordinates.x
        let y = tile.coordinates.y
        this.ctx.strokeStyle="black"
        this.ctx.strokeRect(x*this.tileSize.x,y*this.tileSize.y,this.tileSize.x,this.tileSize.y)
    }

    renderMap({board, username}) {
        board.tiles.forEach( (columnOfTiles, i) => {
            columnOfTiles.forEach( (tile, j) => {
              this.#renderTile({tile: tile, username: username})
            })
        })
    }

    #findTileCenterPixel(tile) {
        //this.ctx.fillRect(0, 0, 5, 5) // draw dot at center of tile for troubleshooting
        return {
            x: 0 + (tile.coordinates.x+0.5)*this.tileSize.x,
            y: 0 + (tile.coordinates.y+0.5)*this.tileSize.y
        }
    }

    #imagePositionRelativeToCenterOfTileAndDimensions() {
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

    setFocusOnTile() {
        this.selectedTile
    }

    centerScreenOnTileCoordinates({x, y}) { // does not work
        //const centerOfScreenTransformedCursor = this.getTransformedPoint(this.canvas.offsetLeft, this.canvas.offsetTop)
        const currentTransformedTileCoordinates = this.getTransformedPoint(x*this.tileSize.x, y*this.tileSize.y)
        const currentTransformedOrigin = this.getTransformedPoint(0, 0)
        const currentTransformedCanvasBottomRightLeft = this.getTransformedPoint(this.canvas.width, this.canvas.height)
        console.log(Math.floor(currentTransformedTileCoordinates.x / this.tileSize.x), Math.floor(currentTransformedTileCoordinates.y / this.tileSize.y))
        console.log(currentTransformedOrigin)
        console.log({x, y})
        console.log(currentTransformedCanvasBottomRightLeft)
        //this.ctx.translate(currentTransformedTileCoordinates.x, currentTransformedTileCoordinates.y);
        //if (this.canvas.width/2-x*this.tileSize.x > )
        //this.ctx.translate(this.canvas.width/2-x*this.tileSize.x, this.canvas.height/2-y*this.tileSize.y);
        //this.ctx.translate(+ window.innerWidth/2, + window.innerHeight/2) 
        //this.ctx.translate(-x*this.tileSize.x+this.canvas.width/2, -y*this.tileSize.y+this.canvas.height/2)
    }

}