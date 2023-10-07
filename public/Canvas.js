class Canvas {
    #ctx
    constructor(canvasID, board) {
        this.canvas = document.getElementById(canvasID)
        this.#ctx = this.canvas.getContext("2d")
        this.#adjustCanvasSizeToMatchBrowser()
        this.#adjustCanvasSizeWhenBrowserResizing()
        this.board = board
        this.#determineTileSize()
    }

    animate() {
        this.#ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // clear canvas
        this.#renderMap() // redraw canvas
        if (game.localPlayer.selectedUnit) { this.#animateBlinkSelectedUnit() } 
        window.requestAnimationFrame(() => {this.animate()})
    }

    #animateBlinkSelectedUnit() {
        let selectedTile = game.localPlayer.selectedTile
        if ( (Math.floor(Date.now() / 500)) % 3 === 0 ) { this.#renderUnit(selectedTile) } else { this.#renderTerrain(selectedTile) }
    }

    #adjustCanvasSizeToMatchBrowser() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    #adjustCanvasSizeWhenBrowserResizing() {
        window.addEventListener("resize", () => {
            this.#determineTileSize()
            this.#adjustCanvasSizeToMatchBrowser()
    })}

    #determineTileSize() {
        this.tileSize = Math.min( Math.floor(this.canvas.offsetWidth / board.size.x), Math.floor(this.canvas.offsetHeight / board.size.y) )
    }

    #renderTerrain(tile) {
        let x = tile.coordinates.x
        let y = tile.coordinates.y
        this.#ctx.fillStyle = Tile.TERRAIN_TYPES[tile.terrain].color
        let width = this.tileSize
        let height = this.tileSize
        this.#ctx.fillRect(x*this.tileSize, y*this.tileSize, width, height)
    }

    #renderUnit(tile) {
        if (tile.unit) {
            let x = tile.coordinates.x
            let y = tile.coordinates.y
            this.#ctx.fillStyle = tile.unit.color
            this.#ctx.strokeStyle = "red"
            this.#ctx.lineWidth = 0
            this.#ctx.beginPath();
            this.#ctx.arc(x*this.tileSize+this.tileSize/2, y*this.tileSize+this.tileSize/2, this.tileSize*0.4, 0, Math.PI * 2)
            this.#ctx.stroke()
            this.#ctx.fill()
        }
    }

    #renderTile(tile) {
        this.#renderTerrain(tile)
        this.#renderUnit(tile)
    }

    #renderMap() {
        this.board.tiles.forEach( (columnOfTiles, i) => {
            columnOfTiles.forEach( (tile, j) => {
              this.#renderTile(tile)
            })
        })
    }
}