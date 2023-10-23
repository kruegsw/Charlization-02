class TerrainOffScreenCanvas {
    constructor(tileSize, orientation) {
        this.canvas = new OffscreenCanvas(window.innerWidth, window.innerHeight)
        this.ctx = this.offscreenCanvas.getContext('2d')
        this.tileSize = tileSize // not necessary?
        this.orientation = orientation // not necessary?
        this.sprites = {}
        this.initializeTerrain()
        this.offscreenContext.drawImage(this.canvas, 0, 0)
    }

    //potentially common method
    getTransformedPoint(x, y) { // https://roblouie.com/article/617/transforming-mouse-coordinates-to-canvas-coordinates/
        const originalPoint = new DOMPoint(x, y);
        return this.ctx.getTransform().invertSelf().transformPoint(originalPoint);
    }

    //potentially common method
    #imageLocationAndDimensionsOnSpriteSheet(terrainSpritesSheet, terrain) {
        return [terrainSpritesSheet[terrain].x, terrainSpritesSheet[terrain].y, terrainSpritesSheet[terrain].w, terrainSpritesSheet[terrain].h]
    }

    //potentially common method
    #findTileCenterPixel(tile) {
        //this.ctx.fillRect(0, 0, 5, 5) // draw dot at center of tile for troubleshooting
        return {
            x: 0 + (tile.coordinates.x+0.5)*this.tileSize.x,
            y: 0 + (tile.coordinates.y+0.5)*this.tileSize.y
        }
    }

    //potentially common method
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
    }

    //potentially common method
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

    #renderTerrainOffScreenCanvas(tile) {       
        const terrainSpritesSheet = this.sprites.terrain1
        const terrain = tile.terrain

        this.offscreenContext.save()
        const tileCenterPixel = this.#findTileCenterPixel(tile)
        this.offscreenContext.translate(tileCenterPixel.x, tileCenterPixel.y) // center of tile
        this.offscreenContext.rotate(-this.#radiansForImageAngleAdjustment())
        this.offscreenContext.drawImage(
            terrainSpritesSheet,
            ...this.#imageLocationAndDimensionsOnSpriteSheet(terrainSpritesSheet, terrain), // x, y, w, h
            ...this.#imagePositionRelativeToCenterOfTileAndDimensions() // x, y, w, h
        )
        this.offscreenContext.restore()
    }

    #renderTileOffScreenCanvas({tile, username}) {
        this.#renderTerrainOffScreenCanvas(tile)
    }

    renderMapOffScreenCanvas({board, username}) {
        console.log(this.offscreenCanvas)
        console.log(this.canvas)
        board.tiles.forEach( (columnOfTiles, i) => {
            columnOfTiles.forEach( (tile, j) => {
            this.#renderTileOffScreenCanvas({tile: tile, username: username})
            })
        })
    }

    renderMapFromOffscreenCanvas() {  // this must be done from basic canvas
        const currentTransformedOrigin = this.getTransformedPoint(0, 0)
        const currentTransformedBottomRight = this.getTransformedPoint(this.canvas.width, this.canvas.width)
        this.ctx.drawImage(
            this.offscreenCanvas,
            0, 0, this.canvas.width, this.canvas.width,
            0, 0, this.canvas.width, this.canvas.width
        );
    }
}
