class Unit {
    constructor({player, coordinates}) {
        this.player = player
        this.color = this.player.color
        this.coordinates = coordinates
        this.selectable = true
        //this.selected = false
    }
}

module.exports = Unit