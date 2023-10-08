class Canvas {
    #ctx
    constructor(canvasID, board) {
        this.canvas = document.getElementById(canvasID)
        this.#ctx = this.canvas.getContext("2d")
        this.#adjustCanvasSizeToMatchBrowser()
        this.#adjustCanvasSizeWhenBrowserResizing()
        this.#determineTileSize(board)
    }

    animate(board, localPlayer) {
        this.#ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // clear canvas
        this.#renderMap(board) // redraw canvas
        if (localPlayer.selectedUnit) { this.#animateBlinkSelectedUnit(localPlayer) } 
        window.requestAnimationFrame(() => {this.animate(board, localPlayer)})
    }

    #animateBlinkSelectedUnit(localPlayer) {
        let selectedTile = localPlayer.selectedTile
        if ( (Math.floor(Date.now() / 400)) % 3 === 0 ) { this.#renderTerrain(selectedTile) } else { this.#renderUnit(selectedTile) }
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

    #determineTileSize(board) {
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

    #renderMap(board) {
        board.tiles.forEach( (columnOfTiles, i) => {
            columnOfTiles.forEach( (tile, j) => {
              this.#renderTile(tile)
            })
        })
    }
}