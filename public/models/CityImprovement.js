class CityImprovement {
    constructor({player}) {
        //this.uuid = crypto.randomUUID()
        this.name = "Washington"
        this.player = player
        //this.color = this.player.color
        //this.coordinates = coordinates
        //this.getInitialProduction()
    }

    static CITY_IMPROVEMENT_TYPES = {
        'airport': {
            name: "Airport",
            cost: 160,
            upkeep: 3,
            prerequisite: "radio"
        },
        'aqueduct': {
            name: "Aqueduct",
            cost: 80,
            upkeep: 2,
            prerequisite: "construction"
        },
        'bank': {
            name: "Bank",
            cost: 120,
            upkeep: 3,
            prerequisite: "banking"
        },
        'barracks': {
            name: "Barracks",
            cost: 40,
            upkeep: 1,
            prerequisite: ""
        },
        'capitalization': {
            name: "Capitalization",
            cost: "100", // so the production box is drawn as big as possible
            upkeep: "",
            prerequisite: "corporation"
        },
        'cathedral': {
            name: "Cathedral",
            cost: 120,
            upkeep: 3,
            prerequisite: "monotheism"
        },
        'cityWalls': {
            name: "City Walls",
            cost: 80,
            upkeep: 0,
            prerequisite: "masonry"
        },
        'coastalFortress': {
            name: "Coastal Fortress",
            cost: 80,
            upkeep: 1,
            prerequisite: "metallurgy"
        },
        'colosseum': {
            name: "Colosseum",
            cost: 100,
            upkeep: 4,
            prerequisite: "construction"
        },
        'courthouse': {
            name: "Courthouse",
            cost: 80,
            upkeep: 1,
            prerequisite: "codeOfLaws"
        },
        'factory': {
            name: "Factory",
            cost: 200,
            upkeep: 4,
            prerequisite: "industrialization"
        },
        'granary': {
            name: "Granary",
            cost: 60,
            upkeep: 1,
            prerequisite: "pottery"
        },
        'harbor': {
            name: "Harbor",
            cost: 60,
            upkeep: 1,
            prerequisite: "seafaring"
        },
        'hydroPlant': {
            name: "Hydro Plant",
            cost: 240,
            upkeep: 4,
            prerequisite: "electronics"
        },
        'library': {
            name: "Library",
            cost: 80,
            upkeep: 1,
            prerequisite: "writing"
        },
        'manufacturingPlant': {
            name: "Manufacturing Plant",
            cost: 320,
            upkeep: 6,
            prerequisite: "robotics"
        },
        'marketplace': {
            name: "Markplace",
            cost: 80,
            upkeep: 1,
            prerequisite: "currency"
        },
        'massTransit': {
            name: "Mass Transit",
            cost: 160,
            upkeep: 4,
            prerequisite: "massProduction"
        },
        'nuclearPlant': {
            name: "Nuclear Plant",
            cost: 160,
            upkeep: 2,
            prerequisite: "nuclearPower"
        },
        'offshorePlatform': {
            name: "Offshore Platform",
            cost: 160,
            upkeep: 3,
            prerequisite: "miniaturization"
        },
        'palace': {
            name: "Palace",
            cost: 100,
            upkeep: 0,
            prerequisite: "masonry"
        },
        'policeStation': {
            name: "Police Station",
            cost: 60,
            upkeep: 2,
            prerequisite: "communism"
        },
        'portFacility': {
            name: "Port Facility",
            cost: 80,
            upkeep: 3,
            prerequisite: "amphibiousWarfare"
        },
        'powerPlant': {
            name: "Power Plant",
            cost: 160,
            upkeep: 4,
            prerequisite: "refining"
        },
        'recyclingCenter': {
            name: "Recycling Center",
            cost: 200,
            upkeep: 2,
            prerequisite: "recycling"
        },
        'researchLab': {
            name: "Research Lab",
            cost: 160,
            upkeep: 3,
            prerequisite: "computers"
        },
        'samMissileBattery': {
            name: "SAM Missile Battery",
            cost: 100,
            upkeep: 2,
            prerequisite: "rocketry"
        },
        'sdiDefense': {
            name: "SDI Defense",
            cost: 200,
            upkeep: 4,
            prerequisite: "laser"
        },
        'ssComponent': {
            name: "SS Component",
            cost: 160,
            upkeep: 0,
            prerequisite: "plastics"
        },
        'ssModule': {
            name: "SS Module",
            cost: 320,
            upkeep: 0,
            prerequisite: "superConductor"
        },
        'ssStructural': {
            name: "SS Structural",
            cost: 80,
            upkeep: 0,
            prerequisite: "spaceFlight"
        },
        'sewerSystem': {
            name: "Sewer System",
            cost: 120,
            upkeep: 2,
            prerequisite: "sanitation"
        },
        'solarPlant': {
            name: "Solar Plant",
            cost: 320,
            upkeep: 4,
            prerequisite: "environmentalism"
        },
        'stockExchange': {
            name: "Stock Exchange",
            cost: 160,
            upkeep: 4,
            prerequisite: "economics"
        },
        'superHighway': {
            name: "Super Highway",
            cost: 200,
            upkeep: 5,
            prerequisite: "automobile"
        },
        'supermarket': {
            name: "Supermarket",
            cost: 80,
            upkeep: 3,
            prerequisite: "refrigeration"
        },
        'temple': {
            name: "Temple",
            cost: 40,
            upkeep: 1,
            prerequisite: "ceremonialBurial"
        },
        'university': {
            name: "University",
            cost: 160,
            upkeep: 3,
            prerequisite: "university"
        },
        // Wonders
        'pyramids': {
            name: "Pyramids",
            cost: 200,
            era: "ancient",
            obsolete: "",
            prerequisite: "masonry"
        },
        'hangingGardens': {
            name: "Hanging Gardens",
            cost: 200,
            era: "ancient",
            obsolete: "railroad",
            prerequisite: "pottery"
        },
        'colossus': {
            name: "Colossus",
            cost: 200,
            era: "ancient",
            obsolete: "flight",
            prerequisite: "bronzeWorking"
        },
        'lighthouse': {
            name: "Lighthouse",
            cost: 200,
            era: "ancient",
            obsolete: "magnetism",
            prerequisite: "mapMaking"
        },
        'greatLibrary': {
            name: "Great Library",
            cost: 300,
            era: "ancient",
            obsolete: "electricity",
            prerequisite: "literacy"
        },
        'oracle': {
            name: "Oracle",
            cost: 300,
            era: "ancient",
            obsolete: "theology",
            prerequisite: "mysticism"
        },
        'greatWall': {
            name: "Great Wall",
            cost: 300,
            era: "ancient",
            obsolete: "metallurgy",
            prerequisite: "masonry"
        },
        'sunTzusWarAcademy': {
            name: "Sun Tzu's War Academy",
            cost: 300,
            era: "renaissance",
            obsolete: "mobileWarfare",
            prerequisite: "feudalism"
        },
        'kingRichardsCrusade': {
            name: "King Richard's Crusade",
            cost: 300,
            era: "renaissance",
            obsolete: "industrialization",
            prerequisite: "engineering"
        },
        'marcoPolosEmbassy': {
            name: "Marco Polo's Embassy",
            cost: 200,
            era: "renaissance",
            obsolete: "communism",
            prerequisite: "trade"
        },
        'michelangelosChapel': {
            name: "Michelangelo's Chapel",
            cost: 400,
            era: "renaissance",
            obsolete: "",
            prerequisite: "monotheism"
        },
        'copernicusObservatory': {
            name: "Copernicus' Observatory",
            cost: 300,
            era: "renaissance",
            obsolete: "",
            prerequisite: "astronomy"
        },
        'magellansExpedition': {
            name: "Magellan's Expedition",
            cost: 400,
            era: "renaissance",
            obsolete: "",
            prerequisite: "navigation"
        },
        'shakespearesTheatre': {
            name: "Shakespeare's Theatre",
            cost: 300,
            era: "renaissance",
            obsolete: "",
            prerequisite: "medicine"
        },
        'leonardosWorkshop': {
            name: "Leonardo's Workshop",
            cost: 400,
            era: "industrial",
            obsolete: "automobile",
            prerequisite: "invention"
        },
        'jsBachsCathedral': {
            name: "J S Bach's Cathedral",
            cost: 400,
            era: "industrial",
            obsolete: "",
            prerequisite: "theology"
        },
        'isaacNewtonsCollege': {
            name: "Isaac Newton's College",
            cost: 400,
            era: "industrial",
            obsolete: "",
            prerequisite: "theoryOfGravity"
        },
        'adamSmithsTradingCo': {
            name: "Adam Smith's Trading Co.",
            cost: 400,
            era: "industrial",
            obsolete: "",
            prerequisite: "economics"
        },
        'darwinsVoyage': {
            name: "Darwin's Voyage",
            cost: 400,
            era: "industrial",
            obsolete: "",
            prerequisite: "railroad"
        },
        'statueOfLiberty': {
            name: "Statue of Liberty",
            cost: 400,
            era: "industrial",
            obsolete: "",
            prerequisite: "democracy"
        },
        'eiffelTower': {
            name: "Eiffel Tower",
            cost: 300,
            era: "industrial",
            obsolete: "",
            prerequisite: "steamEngine"
        },
        'womensSuffrage': {
            name: "Women's Suffrage",
            cost: 600,
            era: "modern",
            obsolete: "",
            prerequisite: "industrialization"
        },
        'hooverDam': {
            name: "Hoover Dam",
            cost: 600,
            era: "modern",
            obsolete: "",
            prerequisite: "electronics"
        },
        'manhattanProject': {
            name: "Manhattan Project",
            cost: 600,
            era: "modern",
            obsolete: "",
            prerequisite: "nuclearFission"
        },
        'unitedNations': {
            name: "United Nations",
            cost: 600,
            era: "modern",
            obsolete: "",
            prerequisite: "communism"
        },
        'apolloProgram': {

            name: "Apollo Program",
            cost: 600,
            era: "modern",
            obsolete: "",
            prerequisite: "spaceFlight"
        },
        'setiProgram': {
            name: "SETI Project",
            cost: 600,
            era: "modern",
            obsolete: "",
            prerequisite: "computers"
        },
        'cureForCancer': {
            name: "Cure for Cancer",
            cost: 600,
            era: "modern",
            obsolete: "",
            prerequisite: "geneticEngineering"
        },
    }

}

module.exports = CityImprovement