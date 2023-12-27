const Unit = require('./Unit')
const City = require('./City')

class Game {
    constructor({players, board}) {
        this.players = players
        this.board = board
        this.worldMap = true
    }

    moveUnitInDirection({unit, direction}) {
        console.log(unit, direction)
        let x = unit.coordinates.x
        let y = unit.coordinates.y
        let dx = direction.x
        let dy = direction.y
        console.log(dy)
        let currentTile = this.board.tiles[x][y]
        console.log(currentTile)
        let destinationTile = this.board.tiles[x+dx][y+dy]
        console.log(destinationTile)
        
        this.removeUnit({tile: currentTile})
        this.addUnit({unit: unit, tile: destinationTile})
    }

    moveUnitToTile({unit, tile}) {
        let x = unit.coordinates.x
        let y = unit.coordinates.y
        let currentTile = this.board.tiles[x][y]
        let destinationTile = this.board.tiles[tile.coordinates.x][tile.coordinates.y]
        
        this.removeUnit({tile: currentTile})
        this.addUnit({unit: unit, tile: destinationTile})
    }

    removePlayerFromBoard({username}) {
        this.board.tiles.forEach( (columnOfTiles, i) => {
            columnOfTiles.forEach( (tile, j) => {
                if (tile.unit.player && tile.unit.player.username === username) {tile.unit = ""}
                if (tile.city.player && tile.city.player.username === username) {tile.city = ""}
            })
        })
    }

    setPlayersInitialLocations(player) {
        let x = Math.floor(Math.random() * this.board.size.x)
        let y = Math.floor(Math.random() * this.board.size.y)
        if ( this.board.isValidLocationOnMap({x, y})) {
            let tile = this.board.tiles[x][y]
            let unitType = "settler"
            tile.unit = new Unit({player: player, coordinates: {x, y}, unitType})
        } else {
            this.setPlayersInitialLocations(player)
        }
    }

    addUnit({unit, tile}) {
        tile.unit = unit
        tile.unit.coordinates = tile.coordinates
    }

    addCity({player, tile}) {
        tile.city = new City({player: player, coordinates: tile.coordinates})
    }

    removeUnit({tile}) {
        tile.unit = ""
    }

    unitOrders({unit, orders}) {
        let x = unit.coordinates.x
        let y = unit.coordinates.y
        let tile = this.board.tiles[x][y]
        if (unit.unitType === "settler") {
            if (orders === "buildNewCity") {
                this.addCity({player: unit.player, tile})
                this.removeUnit({tile})
            }
        }
    }

    cityOrders({city, orders, orderDetails}) {
        let x = city.coordinates.x
        let y = city.coordinates.y
        let tile = this.board.tiles[x][y]
        if (orders === "buyProduction") {
            tile.city.buyProduction()
        }
        if (orders === "changeProduction") {
            tile.city.changeProduction(orderDetails)
        }
    }
}

module.exports = Game