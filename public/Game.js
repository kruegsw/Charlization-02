class Game {
    constructor(players, board ) {
        this.players = players
        this.board = board
    }

    moveUnitInDirection(player, direction) {
        let currentTile = player.selectedTile
        let x = currentTile.coordinates.x
        let y = currentTile.coordinates.y
        let dx = direction.x
        let dy = direction.y
        let destinationTile = this.board.tiles[x+dx][y+dy]
        
        currentTile.removeUnit(player.selectedUnit)
        destinationTile.addUnit(player.selectedUnit)

        player.selectedUnit.coordinates = destinationTile.coordinates
        player.selectTile(destinationTile)
    }

    moveUnitToTile(player, tile) {
        let currentTile = player.selectedTile
        let x = currentTile.coordinates.x
        let y = currentTile.coordinates.y
        let destinationTile = tile
        
        currentTile.removeUnit(player.selectedUnit)
        destinationTile.addUnit(player.selectedUnit)

        player.selectedUnit.coordinates = destinationTile.coordinates
        player.selectTile(destinationTile)
    }

    setPlayersInitialLocations(player) {
        let x = Math.floor(Math.random() * this.board.size.x)
        let y = Math.floor(Math.random() * this.board.size.y)
        let tile = this.board.tiles[x][y]
        tile.unit = new Unit(player, {x, y})
    }
}