class Player {
    #username
    constructor(username, color) {
        this.#username = username
        this.color = color
        this.selectedUnit = ""
        this.selectedTile = ""
    }

    selectUnit(tile) {
        this.selectedUnit = tile.unit
    }

    selectTile(tile) {
        this.selectedTile = tile
    }

    deselectUnit() {
        this.selectedUnit = null
    }

    deselectTile() {
        this.selectedTile = null
    }

}