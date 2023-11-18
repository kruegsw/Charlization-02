class CityCanvas {
    constructor() {
        this.sounds = {}
        this.sprites = {}
        this.initializeSprites()
    }

    renderCity(cityCanvas, cityCtx, cityObject) {
        cityCtx.drawImage(
            this.sprites.city,
            0, 0, 640, 480,
            0, 0, cityCanvas.width, cityCanvas.height
        )
        let citizen = 'ancient-happy-man'
        cityCtx.drawImage(
            this.sprites.people,
            this.sprites.people[citizen].x, this.sprites.people[citizen].y, this.sprites.people[citizen].w, this.sprites.people[citizen].h,
            cityCanvas.width*(6)/640, cityCanvas.height*(2+8)/421, cityCanvas.width*(this.sprites.people[citizen].w)/640, cityCanvas.width*(this.sprites.people[citizen].h)/640
        )
        console.log(cityObject)
    }



    //  ████   █████   █████    ███   █████   █████    ████         █     ████    ███    █   █   ██    █   ████     ████
    // █       █   █   █    █    █      █     █       █            █     █       █   █   █   █   █ █   █   █   █   █
    //  ███    █████   ██████    █      █     █████    ███        █       ███    █   █   █   █   █  █  █   █   █    ███
    //     █   █       █   █     █      █     █           █      █           █   █   █   █   █   █   █ █   █   █       █
    // ████    █       █    █   ███     █     █████   ████      █        ████     ███     ███    █    ██   ████    ████


    initializeSprites() {
        this.initializeCitySprites()
        this.initializeIconSprites()
        this.initializePeopleSprites()
    }

    initializeCitySprites() {
        this.sprites.city = new Image()
        this.sprites.city.src = "/assets/images/city.png"
    }

    initializeIconSprites() {
        this.sprites.icons = new Image()
        this.sprites.icons.src = "/assets/images/icons.png"
    }

    initializePeopleSprites() {
        this.sprites.people = new Image()
        this.sprites.people.src = "/assets/images/people.png"
        let citizenSprites = [
            ['ancient-happy-man', 'ancient-happy-woman', 'ancient-content-man', 'ancient-content-woman', 'ancient-unhappy-man', 'ancient-unhappy-woman', 'ancient-pirate-man', 'ancient-pirate-woman', 'ancient-entertainer', 'ancient-taxcollector', 'ancient-scientist'],
            ['ren-happy-man', 'ren-happy-woman', 'ren-content-man', 'ren-content-woman', 'ren-unhappy-man', 'ren-unhappy-woman', 'ren-pirate-man', 'ren-pirate-woman', 'ren-entertainer', 'ren-taxcollector', 'ren-scientist'],
            ['ind-happy-man', 'ind-happy-woman', 'ind-content-man', 'ind-content-woman', 'ind-unhappy-man', 'ind-unhappy-woman', 'ind-pirate-man', 'ind-pirate-woman', 'ind-entertainer', 'ind-taxcollector', 'ind-scientist'],
            ['modern-happy-man', 'modern-happy-woman', 'modern-content-man', 'modern-content-woman', 'modern-unhappy-man', 'modern-unhappy-woman', 'modern-pirate-man', 'modern-pirate-woman', 'modern-entertainer', 'modern-taxcollector', 'modern-scientist'],
        ]
        citizenSprites.forEach( (row, j) => {
            row.forEach( (citizen, i) => {
                this.sprites.people[citizen] = {x: 3+i*28, y: 7+j*31, w: 27, h: 30}
            })
        })
        console.log(this.sprites)
    }

}