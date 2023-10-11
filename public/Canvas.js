class Canvas {
    constructor({canvasID, board}) {
        this.canvas = document.getElementById(canvasID)
        this.ctx = this.canvas.getContext("2d")
        this.#adjustCanvasSizeToMatchBrowser()
        this.#determineTileSize(board)
        this.selectedUnit = ""
        this.selectedTile = ""
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
        this.canvas.width = window.innerWidth * devicePixelRatio
        this.canvas.height = window.innerHeight * devicePixelRatio
    }

    adjustCanvasSizeWhenBrowserResizing(board) {
        this.#determineTileSize(board)
        this.#adjustCanvasSizeToMatchBrowser()
    }

    #determineTileSize(board) {
        this.tileSize = Math.min( Math.floor(this.canvas.offsetWidth / board.size.x), Math.floor(this.canvas.offsetHeight / board.size.y) )
    }

    #renderTerrain(tile) {
        let x = tile.coordinates.x
        let y = tile.coordinates.y
        this.ctx.fillStyle = tile.terrain.color
        let width = this.tileSize
        let height = this.tileSize
        this.ctx.fillRect(x*this.tileSize, y*this.tileSize, width, height)
    }

    #renderUnit(tile) {
        if (tile.unit) {
            let x = tile.coordinates.x
            let y = tile.coordinates.y
            this.ctx.fillStyle = tile.unit.color
            this.ctx.strokeStyle = "black"
            this.ctx.lineWidth = 0
            this.ctx.beginPath();
            this.ctx.arc(x*this.tileSize+this.tileSize/2, y*this.tileSize+this.tileSize/2, this.tileSize*0.4, 0, Math.PI * 2)
            this.ctx.stroke()
            this.ctx.fill()
        }
    }

    #renderTile(tile) {
        this.#renderTerrain(tile)
        this.#renderUnit(tile)
    }

    renderMap(board) {
        board.tiles.forEach( (columnOfTiles, i) => {
            columnOfTiles.forEach( (tile, j) => {
              this.#renderTile(tile)
            })
        })
    }
}