class Game {
    constructor(canvasID, localPlayer, board ) {
        this.localPlayer = localPlayer
        this.canvas = new Canvas(canvasID, board)
        this.setPlayersInitialLocations()

        window.requestAnimationFrame(() => {this.canvas.animate()})
        console.log(this.canvas)
    }

    moveUnitInDirection(direction) {
        let currentTile = this.localPlayer.selectedTile
        let x = currentTile.coordinates.x
        let y = currentTile.coordinates.y
        let dx = direction.x
        let dy = direction.y
        let destinationTile = this.canvas.board.tiles[x+dx][y+dy]
        
        currentTile.removeUnit(this.localPlayer.selectedUnit)
        destinationTile.addUnit(this.localPlayer.selectedUnit)

        this.localPlayer.selectedUnit.coordinates = destinationTile.coordinates
        this.localPlayer.selectTile(destinationTile)
    }

    moveUnitToTile(tile) {
        let currentTile = this.localPlayer.selectedTile
        let x = currentTile.coordinates.x
        let y = currentTile.coordinates.y
        let destinationTile = tile
        
        currentTile.removeUnit(this.localPlayer.selectedUnit)
        destinationTile.addUnit(this.localPlayer.selectedUnit)

        this.localPlayer.selectedUnit.coordinates = destinationTile.coordinates
        this.localPlayer.selectTile(destinationTile)
    }

    setPlayersInitialLocations() {
        let x = Math.floor(Math.random() * this.canvas.board.size.x)
        let y = Math.floor(Math.random() * this.canvas.board.size.y)
        let tile = this.canvas.board.tiles[x][y]
        tile.unit = new Unit(this.localPlayer, {x, y})
    }

    deselectUnit() {
        this.localPlayer.selectedUnit = null
    }

    deselectTile() {
        this.localPlayer.selectedTile = null
    }
}