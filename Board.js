const Tile = require('./Tile')

class Board {
    constructor({x, y}) {
        this.size = {x: x, y: y}
        this.tiles = []
        this.randomdMap()
    }

    randomdMap() {
        for (let i = 0; i < this.size.x; i++) {
            let column = []
            for (let j = 0; j < this.size.y; j++) {
                column.push(new Tile({x: i, y: j}) )
            }
            this.tiles.push(column)
        }
    }

    importMap(board) {

    }
}

module.exports = Board