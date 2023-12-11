const Tile = require('./Tile')

class Board {
    constructor({x, y, orientation}) {
        this.size = {x: x, y: y}
        this.orientation = orientation
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

    isValidLocationOnMap({x, y}) {
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
            x < this.size.x &&
            y >= 0 &&
            y < this.size.y
        )
    }

    #isValidLocationOnDiamondMap({x, y}) {
        //console.log(0, this.boardSize.x - 1, y - this.boardSize.x - 1, y + this.boardSize.x - 1)
        return (
            x >= 0 &&  // left edge
            x <= (this.size.x - 1) &&  // right edge
            x >= (this.size.x - y - 1) &&  // top edge
            x <= (this.size.y - y - 1)  // bottom edge
        )
    }
}

module.exports = Board