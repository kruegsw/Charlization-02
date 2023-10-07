class Player {
    #username
    constructor(username, color) {
        this.#username = username
        this.color = color
        this.selectedUnit = ""
        this.selectedTile = ""
    }

    selectUnit(tile) {
        if (tile.unit.selectable) {
            this.selectedUnit = tile.unit
        }	else {
            this.selectedUnit = undefined
        }
    }

    selectTile(tile) {
        this.selectedTile = tile
    }

}