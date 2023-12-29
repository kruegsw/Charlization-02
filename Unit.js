class Unit {
    constructor({player, coordinates, unitType}) {
        this.player = player
        this.color = this.player.color
        this.coordinates = coordinates
        this.selectable = true
        this.unitType = unitType
        this.cost = 10
        this.attack = 1
        this.defense = 1
        this.health = 1
        this.firepower = 1
        this.move = 1
        this.orders = {}
        this.obsolete = ''
        this.prerequisite = ''
        this.setBasicAttributesBasedOnUnitType(unitType)
        this.setAbilitiesBasedOnUnitType()
    }

    setBasicAttributesBasedOnUnitType(unitType) {
        this.cost = Unit.UNIT_TYPES[unitType].cost
        this.attack = Unit.UNIT_TYPES[unitType].attack
        this.defense = Unit.UNIT_TYPES[unitType].defense
        this.health = Unit.UNIT_TYPES[unitType].health
        this.firepower = Unit.UNIT_TYPES[unitType].firepower
        this.move = Unit.UNIT_TYPES[unitType].move
        this.obsolete = Unit.UNIT_TYPES[unitType].obsolete
        this.prerequisite = Unit.UNIT_TYPES[unitType].prerequisite
    }
    
    setAbilitiesBasedOnUnitType() {
        switch(this.unitType) {
            case 'settler':
                this.orders = {
                    'KeyB': 'buildNewCity',
                    'KeyTBD1': 'increaseCityPopulation', // only up to 8
                    'KeyR': 'buildRoad',
                    'KeyI': 'buildIrrigation',
                    'KeyTBD2': 'cleanUpPollution'
                }
                break
            case 'warrior':
                this.orders = {
                }
                break
            default:
                return
        }
    }

    static UNIT_TYPES = {
        'aegisCruiser': {
            name: "AEGIS Cruiser",
            cost: 100,
            attack: 8,
            defense: 8,
            health: 3,
            firepower: 2,
            move: 5,
            obsolete: '',
            prerequisite: 'rocketry'
        },
        'alpineTroops': {
            name: "Alpine Troops",
            cost: 50,
            attack: 5,
            defense: 5,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: '',
            prerequisite: 'explosives'
        },
        'archers': {
            name: "Archers",
            cost: 30,
            attack: 3,
            defense: 2,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'gunpowder',
            prerequisite: 'warriorCode'
        },
        'armor': {
            name: "Armor",
            cost: 80,
            attack: 10,
            defense: 5,
            health: 3,
            firepower: 1,
            move: 3,
            obsolete: '',
            prerequisite: 'mobileWarfare'
        },
        'artillery': {
            name: "Artillery",
            cost: 50,
            attack: 10,
            defense: 1,
            health: 2,
            firepower: 2,
            move: 1,
            obsolete: 'robotics',
            prerequisite: 'machineTools'
        },
        'battleship': {
            name: "Battleship",
            cost: 160,
            attack: 12,
            defense: 12,
            health: 4,
            firepower: 2,
            move: 4,
            obsolete: '',
            prerequisite: 'automobile',
        },
        'bomber': {
            name: "Bomber",
            cost: 120,
            attack: 12,
            defense: 1,
            health: 2,
            firepower: 2,
            move: 8,
            obsolete: 'stealth',
            prerequisite: 'advancedFlight'
        },
        'cannon': {
            name: "Canon",
            cost: 40,
            attack: 8,
            defense: 1,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: 'machineTools',
            prerequisite: 'metallurgy'
        },
        'caravan': {
            name: "Caravan",
            cost: 50,
            attack: 0,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'theCorporation',
            prerequisite: 'trade'
        },
        'caravel': {
            name: "Caravel",
            cost: 40,
            attack: 2,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'magnetism',
            prerequisite: 'navigation'
        },
        'carrier': {
            name: "Carrier",
            cost: 160,
            attack: 1,
            defense: 9,
            health: 4,
            firepower: 2,
            move: 5,
            obsolete: '',
            prerequisite: 'advancedFlight'
        },
        'catapult': {
            name: "Catapult",
            cost: 40,
            attack: 6,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'metallurgy',
            prerequisite: 'mathematics'
        },
        'cavalry': {
            name: "Cavalry",
            cost: 60,
            attack: 8,
            defense: 3,
            health: 2,
            firepower: 1,
            move: 2,
            obsolete: 'mobileWarfare',
            prerequisite: 'leadership'
        },
        'chariots': {
            name: "Chariots",
            cost: 30,
            attack: 3,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'polytheism',
            prerequisite: 'theWheel'
        },
        'cruiseMissile': {
            name: "Cruise Msl.",
            cost: 60,
            attack: 18,
            defense: 0,
            health: 1,
            firepower: 3,
            move: 12,
            obsolete: '',
            prerequisite: 'rocketry'
        },
        'cruiser': {
            name: "Cruiser",
            cost: 80,
            attack: 6,
            defense: 6,
            health: 3,
            firepower: 2,
            move: 5,
            obsolete: 'rocketry',
            prerequisite: 'steel'
        },
        'crusader': {
            name: "Crusader",
            cost: 40,
            attack: 5,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'leadership',
            prerequisite: 'monotheism'
        },
        'destroyer': {
            name: "Destroyer",
            cost: 60,
            attack: 4,
            defense: 4,
            health: 3,
            firepower: 1,
            move: 6,
            obsolete: '',
            prerequisite: 'electricity'
        },
        'diplomat': {
            name: "Diplomat",
            cost: 30,
            attack: 0,
            defense: 0,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'espionage',
            prerequisite: 'writing'
        },
        'dragoons': {
            name: "Dragoons",
            cost: 50,
            attack: 5,
            defense: 2,
            health: 2,
            firepower: 1,
            move: 2,
            obsolete: 'tactics',
            prerequisite: 'leadership'
        },
        'elephant': {
            name: "Elephant",
            cost: 40,
            attack: 4,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'monotheism',
            prerequisite: 'polytheism'
        },
        'engineers': {
            name: "Engineers",
            cost: 40,
            attack: 0,
            defense: 2,
            health: 2,
            firepower: 1,
            move: 2,
            obsolete: '',
            prerequisite: 'explosives'
        },
        'explorer': {
            name: "Explorer",
            cost: 30,
            attack: 0,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'guerrillaWarfare',
            prerequisite: 'searfaring'
        },
        'fanatics': {
            name: "Fanatics",
            cost: 20,
            attack: 4,
            defense: 4,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: '',
            prerequisite: 'fundamentalism'
        },
        'fighter': {
            name: "Fighter",
            cost: 60,
            attack: 4,
            defense: 3,
            health: 2,
            firepower: 2,
            move: 10,
            obsolete: 'stealth',
            prerequisite: 'flight'
        },
        'freight': {
            name: "Freight",
            cost: 50,
            attack: 0,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: '',
            prerequisite: 'theCorporation'
        },
        'frigate': {
            name: "Frigate",
            cost: 50,
            attack: 4,
            defense: 2,
            health: 2,
            firepower: 1,
            move: 4,
            obsolete: 'electricity',
            prerequisite: 'magnetism'
        },
        'galleon': {
            name: "Galleon",
            cost: 40,
            attack: 0,
            defense: 2,
            health: 2,
            firepower: 1,
            move: 4,
            obsolete: 'industrialization',
            prerequisite: 'magnetism'
        },
        'helicopter': {
            name: "Helicopter",
            cost: 100,
            attack: 10,
            defense: 3,
            health: 2,
            firepower: 2,
            move: 6,
            obsolete: '',
            prerequisite: 'combinedArms'
        },
        'horsemen': {
            name: "Horsemen",
            cost: 20,
            attack: 2,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'chivalry',
            prerequisite: 'horsebackRiding'
        },
        'howitzer': {
            name: "Howitzer",
            cost: 70,
            attack: 12,
            defense: 2,
            health: 3,
            firepower: 2,
            move: 2,
            obsolete: '',
            prerequisite: 'robotics'
        },
        'ironclad': {
            name: "Ironclad",
            cost: 60,
            attack: 4,
            defense: 4,
            health: 3,
            firepower: 1,
            move: 4,
            obsolete: 'electricity',
            prerequisite: 'steamEngine'
        },
        'knights': {
            name: "Knights",
            cost: 40,
            attack: 4,
            defense: 2,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'leadership',
            prerequisite: 'chivalry'
        },
        'legion': {
            name: "Legion",
            cost: 40,
            attack: 4,
            defense: 2,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'gunpowder',
            prerequisite: 'ironWorking'
        },
        'marines': {
            name: "Marines",
            cost: 60,
            attack: 8,
            defense: 5,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: '',
            prerequisite: 'amphibiousWarfare'
        },
        'mechanizedInfantry': {
            name: "Mech. Inf.",
            cost: 50,
            attack: 6,
            defense: 6,
            health: 3,
            firepower: 1,
            move: 3,
            obsolete: '',
            prerequisite: 'laborUnion'
        },
        'musketeers': {
            name: "Musketeers",
            cost: 30,
            attack: 3,
            defense: 3,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: 'conscription',
            prerequisite: 'gunpowder'
        },
        'nuclearMissile': {
            name: "Nuclear Msl.",
            cost: 160,
            attack: 99,
            defense: 0,
            health: 1,
            firepower: 1,
            move: 16,
            obsolete: '',
            prerequisite: 'rocketry'
        },
        'paratroopers': {
            name: "Paratroopers",
            cost: 60,
            attack: 6,
            defense: 4,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: '',
            prerequisite: 'combinedArms'
        },
        'partisans': {
            name: "Partisans",
            cost: 50,
            attack: 4,
            defense: 4,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: '',
            prerequisite: 'guerillaWarfare'
        },
        'phalanx': {
            name: "Phalanx",
            cost: 20,
            attack: 1,
            defense: 2,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'feudalism',
            prerequisite: 'bronzeWorking'
        },
        'pikemen': {
            name: "Pikemen",
            cost: 20,
            attack: 1,
            defense: 2,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'gunpowder',
            prerequisite: 'feudalism'
        },
        'riflemen': {
            name: "Riflemen",
            cost: 40,
            attack: 5,
            defense: 4,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: '',
            prerequisite: 'conscription'
        },
        'settler': {
            name: "Settler",
            cost: 40,
            attack: 0,
            defense: 1,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: 'explosives',
            prerequisite: '',
            orders: {
                'KeyB': 'buildNewCity',
                'KeyTBD1': 'increaseCityPopulation', // only up to 8
                'KeyR': 'buildRoad',
                'KeyI': 'buildIrrigation',
                'KeyTBD2': 'cleanUpPollution'
            },
            ordersList: ["Build New City", "Build Road", "Build Irrigation", "Change (terrain) to _____", "Clean Up Pollution"]
        },
        'spy': {
            name: "Spy",
            cost: 30,
            attack: 0,
            defense: 0,
            health: 1,
            firepower: 1,
            move: 3,
            obsolete: '',
            prerequisite: 'espionage'
        },
        'stealthBomber': {
            name: "Stlth. Bmbr",
            cost: 160,
            attack: 14,
            defense: 5,
            health: 2,
            firepower: 2,
            move: 12,
            obsolete: '',
            prerequisite: 'stealth'
        },
        'stealthFighter': {
            name: "Stlth. Ftr.",
            cost: 80,
            attack: 8,
            defense: 4,
            health: 2,
            firepower: 2,
            move: 14,
            obsolete: '',
            prerequisite: 'stealth'
        },
        'submarine': {
            name: "Submarine",
            cost: 60,
            attack: 10,
            defense: 2,
            health: 3,
            firepower: 2,
            move: 3,
            obsolete: '',
            prerequisite: 'combustion'
        },
        'transport': {
            name: "Transport",
            cost: 50,
            attack: 0,
            defense: 3,
            health: 3,
            firepower: 1,
            move: 5,
            obsolete: '',
            prerequisite: 'industrialization'
        },
        'trireme': {
            name: "Trireme",
            cost: 40,
            attack: 1,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 3,
            obsolete: 'navigation',
            prerequisite: 'mapMaking'
        },
        'warrior': {
            name: "Warrior",
            cost: 10,
            attack: 1,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'feudalism',
            prerequisite: ''
        },
    }
}

module.exports = Unit