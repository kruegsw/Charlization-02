class Canvas {
    constructor({canvasID, board}) {
        this.canvas = document.getElementById(canvasID)
        this.ctx = this.canvas.getContext("2d")
        this.tileSize = {}
        this.orientation = "diamond"
        this.selectedUnit = ""
        this.selectedTile = ""
        this.sounds = {}
        this.sprites = {}
        this.adjustCanvasSizeToBrowser(board)
        this.initializeSounds()
        this.initializeSprites()
        this.initializeTerrain()
    }

    #setCanvasOrientation(board) {
        if (this.orientation === "diamond") {
            let angle = 45
            let radians = Math.PI*angle/180
            this.ctx.translate(this.tileSize.x*board.size.x*Math.sin(radians), 0) // x, y
            this.ctx.rotate(radians)
        } else {
            return
        }
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
            ['desert'],//-1', 'desert-2'],
            ['prairie'],
            ['grassland'],//-1', 'grassland-2'],
            [],
            [],
            [],
            ['tundra'],
            ['arctic'],
            ['swamp'],
            ['jungle'],
            ['ocean']
        ]
        terrain1Sprites.forEach( (row, j) => {
            row.forEach( (terrain, i) => {
                this.sprites.terrain1[terrain] = {x: 2+i*65, y: 2+j*33, w: 62, h: 30}
            })
        })
        
    }

    selectUnit({tile, username}) {
        if (tile.unit && this.clientOwnsUnit({unit: tile.unit, username: username})) { this.selectedUnit = tile.unit }
        console.log(this.selectedUnit)
    }

    clientOwnsUnit({unit, username}) { return unit.player.username === username }

    selectTile(tile) {
        this.selectedTile = tile
        console.log(this.selectedTile)
    }

    deselectUnit() {
        this.selectedUnit = ""
    }

    deselectTile() {
        this.selectedTile = ""
    }

    //animate(board) {
    //    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // clear canvas
    //    this.renderMap(board) // redraw canvas
    //    if (this.selectedUnit) { this.animateBlinkSelectedUnit() } 
    //    window.requestAnimationFrame(() => {this.animate(board)})
    //}

    animateBlinkSelectedUnit() {
        if ( (Math.floor(Date.now() / 400)) % 3 === 0 ) { this.#renderTerrain(this.selectedTile) } else { this.#renderUnit(this.selectedTile) }
    }

    #adjustCanvasSizeToMatchBrowser() {
        const devicePixelRatio = window.devicePixelRatio || 1 // adjust resolution (e.g. macbook pro retina display has 2x resolution), test this later
        this.canvas.width = window.innerWidth //* devicePixelRatio
        this.canvas.height = window.innerHeight //* devicePixelRatio
    }

    adjustCanvasSizeToBrowser(board) {
        this.#adjustCanvasSizeToMatchBrowser()
        this.#determineTileSize(board)
        this.#setCanvasOrientation(board)
    }

    #determineTileSize(board) {
        const minXorYDimension = Math.min(
            Math.floor(this.canvas.offsetWidth / board.size.x),
            Math.floor(this.canvas.offsetHeight / board.size.y)
        )
        this.tileSize = {x: minXorYDimension, y: minXorYDimension}
    }

    #renderTerrain(tile) {
        let x = tile.coordinates.x
        let y = tile.coordinates.y

        /*
        this.ctx.fillStyle = tile.terrain.color
        let width = this.tileSize
        let height = this.tileSize
        */

        let terrain = tile.terrain
        
        /*
        let terrainSprites = this.sprites.terrain1
        this.ctx.drawImage(
            terrainSprites,
            terrainSprites[terrain].x, terrainSprites[terrain].y, terrainSprites[terrain].w, terrainSprites[terrain].h, // source coordinates      (x,y,w,h) 
            x*this.tileSize, y*this.tileSize + (this.tileSize-terrainSprites[terrain].h)/4, this.tileSize, this.tileSize*terrainSprites[terrain].h/terrainSprites[terrain].w, // destination coordinates (x,y,w,h) 
        )
        */

        let terrainSprites = this.sprites.terrain1
        let source = [terrainSprites[terrain].x, terrainSprites[terrain].y, terrainSprites[terrain].w, terrainSprites[terrain].h]
        let destination = [x*this.tileSize.x, y*this.tileSize.y, this.tileSize.x, this.tileSize.y] 

        if (this.orientation === "diamond") {
            let angle = 45
            let radians = Math.PI*angle/180
            this.ctx.translate((0.5+x)*this.tileSize.x, (0.5+y)*this.tileSize.y) // center of tile
            this.ctx.rotate(-radians)
            this.ctx.drawImage(
                terrainSprites,
                ...source,      // x, y, w, h
                -this.tileSize.x * Math.cos(radians), -this.tileSize.x * Math.sin(radians), this.tileSize.x / Math.cos(radians), this.tileSize.y / Math.sin(radians)
            )
            this.ctx.rotate(radians)
            this.ctx.translate(-(0.5+x)*this.tileSize.x, -(0.5+y)*this.tileSize.y) // back to original 0,0 origin
        } else {
            this.ctx.drawImage(
                terrainSprites,
                ...source,      // x, y, w, h
                ...destination, // x, y, w, h
            )
        }

        /*
        this.ctx.fillRect(x*this.tileSize, y*this.tileSize, width, height)
        */
    }

    #renderFlateTerrain(tile) {

    }

    #renderUnit(tile, username) {
        if (tile.unit) {
            let x = tile.coordinates.x
            let y = tile.coordinates.y
            let unit = "warrior"
            let unitSprites = this.sprites.units
            let source = [unitSprites[unit].x, unitSprites[unit].y, unitSprites[unit].w, unitSprites[unit].h]
            let destination = [x*this.tileSize.x, y*this.tileSize.y + (this.tileSize.y-unitSprites[unit].h)/4, this.tileSize.x, this.tileSize.y*this.sprites.units[unit].h/this.sprites.units[unit].w]
            if (this.orientation === "diamond") {
                let angle = 45
                let radians = Math.PI*angle/180
                this.ctx.translate((0.5+x)*this.tileSize.x, (0.5+y)*this.tileSize.y) // center of tile
                this.ctx.rotate(-radians)
                this.ctx.drawImage(
                    unitSprites,
                    ...source,      // x, y, w, h
                    -this.tileSize.x * Math.cos(radians), -this.tileSize.y * Math.sin(radians), this.tileSize.x / Math.cos(radians), this.tileSize.y / Math.sin(radians)
                )
                this.ctx.rotate(radians)
                this.ctx.translate(-(0.5+x)*this.tileSize.x, -(0.5+y)*this.tileSize.y) // back to original 0,0 origin
            } else {
                this.ctx.drawImage(
                    unitSprites,
                    ...source,      // x, y, w, h
                    ...destination, // x, y, w, h
                )
            }
            /*
            this.ctx.font = `${this.tileSize/4}px serif`
            this.ctx.fillStyle = "black"
            this.ctx.fillText(username, x*this.tileSize, (y+0.5)*this.tileSize, this.tileSize)  // text, x, y, maxWidth
            */
        }
    }

    #renderTile({tile, username}) {
        this.#renderTerrain(tile)
        this.#renderUnit(tile, username)
        //this.#renderTileOutline(tile)
    }

    #renderTileOutline(tile) {
        let x = tile.coordinates.x
        let y = tile.coordinates.y
        this.ctx.strokeStyle="black"
        this.ctx.strokeRect(x*this.tileSize.x,y*this.tileSize.y,this.tileSize.x,this.tileSize.y+1)
    }

    renderMap({board, username}) {
        board.tiles.forEach( (columnOfTiles, i) => {
            columnOfTiles.forEach( (tile, j) => {
              this.#renderTile({tile: tile, username: username})
            })
        })
    }
}