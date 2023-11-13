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
                'KeyB': 'buildNewCity'
            }
        case 'warrior':
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
        orders: ["Build New City", "Build Road", "Build Irrigation", "Change (terrain) to _____", "Clean Up Pollution"]
    },
    'spy': "",
    'stealth': "",
    'submarine': "",
    'transport': "",
    'trireme': "",
    'warrior': "",
}
}

module.exports = Unit