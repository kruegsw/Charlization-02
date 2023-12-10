class Unit {
    constructor({player, coordinates, unitType}) {
        this.player = player
        this.color = this.player.color
        this.coordinates = coordinates
        this.selectable = true
        this.unitType = unitType
        cost: 10
        attack: 1
        this.defence = 1
        health: 1
        firepower: 1
        move: 1
        this.orders = {

        }
        obsolete: ''
        technology: ''
        this.setBasicAttributesBasedOnUnitType()
        this.setAbilitiesBasedOnUnitType()
    }

    setBasicAttributesBasedOnUnitType() {
        switch(this.unitType) {
            default:
                return
        }
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
            cost: 100,
            attack: 8,
            defense: 8,
            health: 3,
            firepower: 2,
            move: 5,
            obsolete: '',
            technology: 'rocketry'
        },
        'alpine': {
            cost: 50,
            attack: 5,
            defense: 5,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: '',
            technology: 'explosives'
        },
        'archers': {
            cost: 30,
            attack: 3,
            defense: 2,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'gunpowder',
            technology: 'warriorCode'
        },
        'armor': {
            cost: 80,
            attack: 10,
            defense: 5,
            health: 3,
            firepower: 1,
            move: 3,
            obsolete: '',
            technology: 'mobileWarfare'
        },
        'artillery': {
            cost: 50,
            attack: 10,
            defense: 1,
            health: 2,
            firepower: 2,
            move: 1,
            obsolete: 'robotics',
            technology: 'machineTools'
        },
        'battleship': {
            cost: 160,
            attack: 12,
            defense: 12,
            health: 4,
            firepower: 2,
            move: 4,
            obsolete: '',
            technology: 'automobile',
        },
        'bomber': {
            cost: 120,
            attack: 12,
            defense: 1,
            health: 2,
            firepower: 2,
            move: 8,
            obsolete: 'stealth',
            technology: 'advancedFlight'
        },
        'cannot': {
            cost: 40,
            attack: 8,
            defense: 1,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: 'machineTools',
            technology: 'metallurgy'
        },
        'caravan': {
            cost: 50,
            attack: 0,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'theCorporation',
            technology: 'trade'
        },
        'caravel': {
            cost: 40,
            attack: 2,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'magnetism',
            technology: 'navigation'
        },
        'carrier': {
            cost: 160,
            attack: 1,
            defense: 9,
            health: 4,
            firepower: 2,
            move: 5,
            obsolete: '',
            technology: 'advancedFlight'
        },
        'catapult': {
            cost: 40,
            attack: 6,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'metallurgy',
            technology: 'mathematics'
        },
        'cavalry': {
            cost: 60,
            attack: 8,
            defense: 3,
            health: 2,
            firepower: 1,
            move: 2,
            obsolete: 'mobileWarfare',
            technology: 'leadership'
        },
        'chariot': {
            cost: 30,
            attack: 30,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'polytheism',
            technology: 'theWheel'
        },
        'cruiseMissile': {
            cost: 60,
            attack: 18,
            defense: 0,
            health: 1,
            firepower: 3,
            move: 12,
            obsolete: '',
            technology: 'rocketry'
        },
        'cruiser': {
            cost: 80,
            attack: 6,
            defense: 6,
            health: 3,
            firepower: 2,
            move: 5,
            obsolete: 'rocketry',
            technology: 'steel'
        },
        'crusader': {
            cost: 40,
            attack: 5,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'leadership',
            technology: 'monotheism'
        },
        'destroyer': {
            cost: 60,
            attack: 4,
            defense: 4,
            health: 3,
            firepower: 1,
            move: 6,
            obsolete: '',
            technology: 'electricity'
        },
        'diplomat': {
            cost: 30,
            attack: 0,
            defense: 0,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'espionage',
            technology: 'writing'
        },
        'dragoons': {
            cost: 50,
            attack: 5,
            defense: 2,
            health: 2,
            firepower: 1,
            move: 2,
            obsolete: 'tactics',
            technology: 'leadership'
        },
        'elephant': {
            cost: 40,
            attack: 4,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'monotheism',
            technology: 'polytheism'
        },
        'engineers': {
            cost: 40,
            attack: 0,
            defense: 2,
            health: 2,
            firepower: 1,
            move: 2,
            obsolete: '',
            technology: 'explosives'
        },
        'explorer': {
            cost: 30,
            attack: 0,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'guerrillaWarfare',
            technology: 'searfaring'
        },
        'fanatics': {
            cost: 20,
            attack: 4,
            defense: 4,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: '',
            technology: 'fundamentalism'
        },
        'fighter': {
            cost: 60,
            attack: 4,
            defense: 3,
            health: 2,
            firepower: 2,
            move: 10,
            obsolete: 'stealth',
            technology: 'flight'
        },
        'freight': {
            cost: 50,
            attack: 0,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: '',
            technology: 'theCorporation'
        },
        'frigate': {
            cost: 50,
            attack: 4,
            defense: 2,
            health: 2,
            firepower: 1,
            move: 4,
            obsolete: 'electricity',
            technology: 'magnetism'
        },
        'galleon': {
            cost: 40,
            attack: 0,
            defense: 2,
            health: 2,
            firepower: 1,
            move: 4,
            obsolete: 'industrialization',
            technology: 'magnetism'
        },
        'helicopter': {
            cost: 100,
            attack: 10,
            defense: 3,
            health: 2,
            firepower: 2,
            move: 6,
            obsolete: '',
            technology: 'combinedArms'
        },
        'horsemen': {
            cost: 20,
            attack: 2,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'chivalry',
            technology: 'horsebackRiding'
        },
        'howitzer': {
            cost: 70,
            attack: 12,
            defense: 2,
            health: 3,
            firepower: 2,
            move: 2,
            obsolete: '',
            technology: 'robotics'
        },
        'ironclad': {
            cost: 60,
            attack: 4,
            defense: 4,
            health: 3,
            firepower: 1,
            move: 4,
            obsolete: 'electricity',
            technology: 'steamEngine'
        },
        'knights': {
            cost: 40,
            attack: 4,
            defense: 2,
            health: 1,
            firepower: 1,
            move: 2,
            obsolete: 'leadership',
            technology: 'chivalry'
        },
        'legion': {
            cost: 40,
            attack: 4,
            defense: 2,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'gunpowder',
            technology: 'ironWorking'
        },
        'marines': {
            cost: 60,
            attack: 8,
            defense: 5,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: '',
            technology: 'amphibiousWarfare'
        },
        'mechanizedInfantry': {
            cost: 50,
            attack: 6,
            defense: 6,
            health: 3,
            firepower: 1,
            move: 3,
            obsolete: '',
            technology: 'laborUnion'
        },
        'musketeers': {
            cost: 30,
            attack: 3,
            defense: 3,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: 'conscription',
            technology: 'gunpowder'
        },
        'nuclearMissile': {
            cost: 160,
            attack: 99,
            defense: 0,
            health: 1,
            firepower: 1,
            move: 16,
            obsolete: '',
            technology: 'rocketry'
        },
        'paratroopers': {
            cost: 60,
            attack: 6,
            defense: 4,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: '',
            technology: 'combinedArms'
        },
        'partisan': {
            cost: 50,
            attack: 4,
            defense: 4,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: '',
            technology: 'guerillaWarfare'
        },
        'phalanx': {
            cost: 20,
            attack: 1,
            defense: 2,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'feudalism',
            technology: 'bronzeWorking'
        },
        'pikemen': {
            cost: 20,
            attack: 1,
            defense: 2,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'gunpowder',
            technology: 'feudalism'
        },
        'riflemen': {
            cost: 40,
            attack: 5,
            defense: 4,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: '',
            technology: 'conscription'
        },
        'settler': {
            cost: 40,
            attack: 0,
            defense: 1,
            health: 2,
            firepower: 1,
            move: 1,
            obsolete: 'explosives',
            technology: '',
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
            cost: 30,
            attack: 0,
            defense: 0,
            health: 1,
            firepower: 1,
            move: 3,
            obsolete: '',
            technology: 'espionage'
        },
        'stealthBomber': {
            cost: 160,
            attack: 14,
            defense: 5,
            health: 2,
            firepower: 2,
            move: 12,
            obsolete: '',
            technology: 'stealth'
        },
        'stealthFighter': {
            cost: 80,
            attack: 8,
            defense: 4,
            health: 2,
            firepower: 2,
            move: 14,
            obsolete: '',
            technology: 'stealth'
        },
        'submarine': {
            cost: 60,
            attack: 10,
            defense: 2,
            health: 3,
            firepower: 2,
            move: 3,
            obsolete: '',
            technology: 'combustion'
        },
        'transport': {
            cost: 50,
            attack: 0,
            defense: 3,
            health: 3,
            firepower: 1,
            move: 5,
            obsolete: '',
            technology: 'industrialization'
        },
        'trireme': {
            cost: 40,
            attack: 1,
            defense: 1,
            health: 1,
            firepower: 1,
            move: 3,
            obsolete: 'navigation',
            technology: 'mapMaking'
        },
        'warrior': {
            cost: 10,
            attack: 1,
            defence: 1,
            health: 1,
            firepower: 1,
            move: 1,
            obsolete: 'feudalism',
            technology: ''
        },
    }
}

module.exports = Unit