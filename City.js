const Unit = require('./Unit')

class City {
    constructor({player, coordinates}) {
        this.uuid = crypto.randomUUID()
        this.name = "Washington"
        this.player = player
        this.color = this.player.color
        this.coordinates = coordinates
        this.citizens = {
            happy: 1,
            content: 1,
            unhappy: 0,
            pirate: 0,
            entertainer: 0,
            taxcollector: 0,
            scientist: 0,
        }
        this.population = this.citizenCount()*(10000+5000*(this.citizenCount()-1))
        this.unitsSupported = []
        this.unitsPresent = []
        this.cityImprovements = []
        this.resources = {
            food: 0,
            hunger: 0,
            surplus: 0,
            trade: 0,
            corruption: 0,
            tax: 0,
            luxury: 0,
            science: 0,
            production: 4,
            support: 0,
            waste: 0
        }
        this.foodStorage = 0
        this.inProduction = {
            inProduction: "",
            cost: 10,
            progress: 0
        }
        this.getInitialProduction()
    }

    citizenCount() {
        return Object.values(this.citizens).reduce( (sum, countOfCitizenType) => sum + countOfCitizenType)
    }

    getInitialProduction() {
        this.inProduction.inProduction = "warrior"
        this.inProduction.cost = Unit.UNIT_TYPES[this.inProduction.inProduction].cost
        // this.inProduction.progress unchanged
    }

    buyProduction() {
        this.inProduction.progress = this.inProduction.cost
    }

    changeProduction(orderDetails) {
        this.inProduction.inProduction = orderDetails
        console.log(this)
    }
}

module.exports = City