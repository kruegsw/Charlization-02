const Unit = require('./Unit')

class Game {
    constructor({players, board}) {
        this.players = players
        this.board = board
    }

    moveUnitInDirection({unit, direction}) {
        let x = unit.coordinates.x
        let y = unit.coordinates.y
        let dx = direction.x
        let dy = direction.y
        let currentTile = this.board.tiles[x][y]
        let destinationTile = this.board.tiles[x+dx][y+dy]
        
        this.removeUnit({tile: currentTile})
        this.addUnit({unit: unit, tile: destinationTile})
    }

    moveUnitToTile({unit, tile}) {
        let x = unit.coordinates.x
        let y = unit.coordinates.y
        let currentTile = this.board.tiles[x][y]
        let destinationTile = tile
        
        this.removeUnit({tile: currentTile})
        this.addUnit({unit: unit, tile: destinationTile})
    }

    setPlayersInitialLocations(player) {
        let x = Math.floor(Math.random() * this.board.size.x)
        let y = Math.floor(Math.random() * this.board.size.y)
        let tile = this.board.tiles[x][y]
        tile.unit = new Unit({player: player, coordinates: {x, y}})
    }

    addUnit({unit, tile}) {
        tile.unit = unit
        tile.unit.coordinates.x = tile.coordinates.x
        tile.unit.coordinates.y = tile.coordinates.y
    }

    removeUnit({tile}) {
        tile.unit = ""
    }
}

module.exports = Game