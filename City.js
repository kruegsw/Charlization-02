class City {
    constructor({player, coordinates}) {
        this.player = player
        this.color = this.player.color
        this.coordinates = coordinates
        this.selectable = true
        //this.selected = false
        this.citizens = 1
        this.population = this.citizens*(10000+5000*(this.citizens-1))
        this.unitsSupported = []
        this.unitsPresent = []
        this.cityImprovements = []
        this.resources = {
            food: 0,
            surplus: 0,
            trade: 0,
            corruption: 0,
            tax: 0,
            luxury: 0,
            science: 0,
            support: 0,
            production: 0
        }
        this.foodStorage = 0
        this.inProduction = {
            inProduction: "",
            cost: 10,
            progress: 0
        }
    }
}

module.exports = City