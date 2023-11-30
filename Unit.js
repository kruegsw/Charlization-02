class Unit {
    constructor({player, coordinates, unitType}) {
        this.player = player
        this.color = this.player.color
        this.coordinates = coordinates
        this.selectable = true
        this.unitType = unitType
        this.cost = 10
        this.attack = 1
        this.defence = 1
        this.health = 1
        this.firepower = 1
        this.move = 1
        this.orders = {

        }
        this.obsolete = ''
        this.technology = ''
        this.modifyAttributesBasedOnUnitType()
}

modifyAttributesBasedOnUnitType() {
    switch(this.unitType) {
        case 'settler':
            this.cost = 40
            this.attack = 0
            this.defence = 1
            this.health = 2
            this.firepower = 1
            this.move = 1
            this.orders = {
                'KeyB': 'buildNewCity',
                'KeyTBD1': 'increaseCityPopulation', // only up to 8
                'KeyR': 'buildRoad',
                'KeyI': 'buildIrrigation',
                'KeyTBD2': 'cleanUpPollution'
            }
            this.obsolete = 'explosives'
            this.technology = ''
            break
        case 'warrior':
            this.cost = 10
            this.attack = 1
            this.defence = 1
            this.health = 1
            this.firepower = 1
            this.move = 1
            this.orders = {
            }
            this.obsolete = 'feudalism'
            this.technology = ''
            break
        default:
            return
    }
}

static UNIT_TYPES = {
    'alpine': "",
    'archer': "",
    'armor': "",
    'artillery': "",
    'not sure ship': "",
    'battleship': "",
    'bomber': "",
    'not sure cavalry': "",
    'cannon': "",
    'caravan': "",
    'caravel': "",
    'carrier': "",
    'catapult': "",
    'cavalary': "",
    'chariot': "",
    'crusader': "",
    'cruser': "",
    'destroyer': "",
    'diplomat': "",
    'elephant': "",
    'engineer': "",
    'explorer': "",
    'fanatic': "",
    'fighter': "",
    'freight': "",
    'frigate': "",
    'galley': "",
    'helicopter': "",
    'horseman': "",
    'howitzer': "",
    'humvee': "",
    'ironclad': "",
    'knight': "",
    'partisan': "",
    'plane': "",
    'legion': "",
    'marine': "",
    'missile': "",
    'musketeer': "",
    'nuclear': "",
    'parachuter': "",
    'phalanx': "",
    'pikeman': "",
    'rifleman': "",
    'settler': {
        cost: 40,
        attack: 0,
        defence: 1,
        health: 2,
        firepower: 1,
        move: 1,
        orders: {
            'KeyB': 'buildNewCity',
            'KeyTBD1': 'increaseCityPopulation', // only up to 8
            'KeyR': 'buildRoad',
            'KeyI': 'buildIrrigation',
            'KeyTBD2': 'cleanUpPollution'
        },
        obsolete: 'explosives',
        technology: '',
        ordersList: ["Build New City", "Build Road", "Build Irrigation", "Change (terrain) to _____", "Clean Up Pollution"]
    },
    
    'spy': "",
    'stealth': "",
    'submarine': "",
    'transport': "",
    'trireme': "",
    'warrior': {
        cost: 10,
        attack: 1,
        defence: 1,
        health: 1,
        firepower: 1,
        move: 1,
        orders: {
        },
        obsolete: 'feudalism',
        technology: ''
    },
}
}

module.exports = Unit