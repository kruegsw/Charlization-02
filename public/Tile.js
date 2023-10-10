class Tile {
    constructor({x, y}) {
        this.terrain = this.generateRandomTerrain()
        this.unit = ""
        this.coordinates = {x: x, y: y}
    }

    undiscoveredTerrain() { return TERRAIN_TYPES.undiscovered }

    generateRandomTerrain() {
        let terrainTypeKeysArray = Object.keys(Tile.TERRAIN_TYPES)
        return Tile.TERRAIN_TYPES[terrainTypeKeysArray[Math.floor(Math.random() * terrainTypeKeysArray.length)]]
    }

    static TERRAIN_TYPES = {
        "grassland": {type: "grassland", color: "lightgreen" },
        "plains": {type: "plains", color: "orange" },
        "forest": {type: "forest", color: "darkgreen" },
        "desert": {type: "desert", color: "beige" },
        "hill": {type: "hill", color: "lightgrey" },
        "mountain": {type: "mountain", color: "grey" },
        "ocean": {type: "ocean", color: "blue" },
        "undiscovered": {type: "undiscovered", color: "black" }
    }
}