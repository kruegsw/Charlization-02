class City {
    constructor({player, coordinates}) {
        this.player = player
        this.color = this.player.color
        this.coordinates = coordinates
        this.citizens = {
            happy: 10,
            content: 4,
            unhappy: 4,
            pirate: 6,
            entertainer: 2,
            taxcollector: 2,
            scientist: 2,
        }
        this.population = this.citizenCount()*(10000+5000*(this.citizenCount()-1))
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
            inProduction: "warrior",
            cost: 10,
            progress: 0
        }
    }

    citizenCount() {
        return Object.values(this.citizens).reduce( (sum, countOfCitizenType) => sum + countOfCitizenType)
    }
}

module.exports = City