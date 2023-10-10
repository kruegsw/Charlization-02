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
        
        currentTile.removeUnit()
        destinationTile.addUnit(unit)
    }

    moveUnitToTile({unit, tile}) {
        let x = unit.coordinates.x
        let y = unit.coordinates.y
        let currentTile = this.board.tiles[x][y]
        let destinationTile = tile
        
        currentTile.removeUnit()
        destinationTile.addUnit(unit)
    }

    setPlayersInitialLocations(player) {
        let x = Math.floor(Math.random() * this.board.size.x)
        let y = Math.floor(Math.random() * this.board.size.y)
        let tile = this.board.tiles[x][y]
        tile.unit = new Unit({player: player, coordinates: {x, y}})
    }
}