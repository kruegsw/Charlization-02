class Board {
    constructor(x, y) {
        this.size = {x: x, y: y}
        this.tiles = []
        this.buildMap()
    }

    buildMap() {
        for (let i = 0; i < this.size.x; i++) {
            let column = []
            for (let j = 0; j < this.size.y; j++) {
                column.push(new Tile(i, j) )
            }
            this.tiles.push(column)
        }
    }
}