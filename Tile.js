class Tile {
    constructor(x, y) {
        this.terrain = this.generateTerrain()
        this.unit = ""
        this.coordinates = {x: x, y: y}
    }

    generateTerrain() {
        let terrainTypes = Object.keys(Tile.TERRAIN_TYPES)
        return terrainTypes[Math.floor(Math.random() * terrainTypes.length)]
    }

    addUnit(unit) {
        this.unit = unit
    }

    removeUnit(unit) {
        this.unit = ""
    }

    static TERRAIN_TYPES = {
        "grassland": { color: "lightgreen" },
        "plains": { color: "orange" },
        "forest": { color: "darkgreen" },
        "desert": { color: "beige" },
        "hill": { color: "lightgrey" },
        "mountain": { color: "grey" },
        "ocean": { color: "blue" }
    }
}

module.exports = Tile