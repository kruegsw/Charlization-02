class CityCanvas {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")
        this.sounds = {}
        this.sprites = {}
        this.initializeSprites()
        this.adjustCanvasSizeToBrowser()
    }


    // █████    █████   █   █   ███   ███    █████        █    ████    ████    ███    █   █    ████   █████   ████
    // █    █   █       █   █    █   █   █   █           █     █   █   █   █  █   █   █   █   █       █       █   █
    // █    █   █████    █ █     █   █       █████      █      ████    █████  █   █   █ █ █    ███    █████   █████
    // █    █   █        █ █     █   █   █   █         █       █   █   █  █   █   █   █ █ █       █   █       █  █
    // █████    █████     █     ███   ███    █████    █        ████    █   █   ███     ███    ████    █████   █   █

    #fixPixelBlur() {
        // https://stackoverflow.com/questions/31910043/html5-canvas-drawimage-draws-image-blurry
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
    }


    #adjustCanvasSizeToMatchBrowser() {  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
        
        if (window.innerWidth / window.innerHeight > 640/480 ) {
            this.canvas.height = window.innerHeight
            this.canvas.width = this.canvas.height*640/480
        } else {
            this.canvas.width = window.innerWidth
            this.canvas.height = this.canvas.width*480/640
        }

        //this.canvas.width = window.innerWidth // * devicePixelRatio
        //this.canvas.height = window.innerHeight // * devicePixelRatio

        const devicePixelRatio = window.devicePixelRatio
        if (devicePixelRatio > 1) {

            if (window.innerWidth / window.innerHeight > 640/480 ) {
                this.canvas.height = window.innerHeight
                this.canvas.width = this.canvas.height*640/480
            } else {
                this.canvas.width = window.innerWidth
                this.canvas.height = this.canvas.width*480/640
            }

            // 2. Force it to display at the original (logical) size with CSS or style attributes
            //this.canvas.style.width = window.innerWidth + 'px'
            //this.canvas.style.height = window.innerHeight + 'px'

            /*
            // 3. Scale the context so you can draw on it without considering the ratio.
            this.ctx.scale(devicePixelRatio, devicePixelRatio)

            // update scale parameter for
            this.view.scale = Math.pow(this.view.scale, devicePixelRatio)
            */
        }
    }

    adjustCanvasSizeToBrowser() {
        this.#adjustCanvasSizeToMatchBrowser() // scrollZoom does not work unless canvas height and width are set to the window innerHeight & innerWeidth
        this.#fixPixelBlur()
    }


    // █████    █████   ██    █   ████    █████   █████    ███   ██    █    █████
    // █    █   █       █ █   █   █   █   █       █    █    █    █ █   █   █    
    // ██████   █████   █  █  █   █   █   █████   ██████    █    █  █  █   █   ███ 
    // █   █    █       █   █ █   █   █   █       █   █     █    █   █ █   █    █
    // █    █   █████   █    ██   ████    █████   █    █   ███   █    ██    ████

    renderCity(cityObject) {
        this.drawCityBackground()
        this.drawCitizens(cityObject)
        this.drawInProduction()
        this.drawBottomRightButtons()
        this.#fixPixelBlur()
        console.log(cityObject)
    }

    drawGrayButton(ctx, x, y, w, h, text) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fillStyle = 'rgba(215,222,217,1)';  // color of stone
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.closePath();
        ctx.font = '20pt Times New Roman';
        ctx.fillStyle = '#000000';
        ctx.fillText(text, x + w / 4, y + 64);
    }

    drawSpriteScaledToCanvas(spriteSheet, spriteSheetXYWH, canvasXY) {
        console.log(spriteSheet, spriteSheetXYWH, canvasXY)
        this.ctx.drawImage(
            spriteSheet,
            ...Object.values(spriteSheetXYWH), // x, y, w, h,
            this.canvas.width*canvasXY.x/640, this.canvas.height*canvasXY.y/480, this.canvas.width*(spriteSheetXYWH.w)/640, this.canvas.height*(spriteSheetXYWH.h)/480
        )
    }

    // ███ █ ███ █ █   ██  ███ ███ █ █ ███ ██  ███ █ █ █  █ ██ 
    // █   █  █  █ █   ███ █ █ █   ██  █   █ █ █ █ █ █ ██ █ █ █
    // █   █  █   █    ███ ███ █   ██  █ █ ██  █ █ █ █ █ ██ █ █
    // ███ █  █   █    ██  █ █ ███ █ █ ███ █ █ ███ ███ █  █ ██

    drawCityBackground() {
        this.ctx.drawImage(
            this.sprites.city,
            ...Object.values(this.sprites.city.background), // x, y, w, h,
            0, 0, this.canvas.width, this.canvas.height
        )
    }
    

    // ███ █ ███ █ ███ ███ █  █ ███
    // █   █  █  █   █ ██  ██ █ █
    // █   █  █  █  █  █   █ ██   █
    // ███ █  █  █ ███ ███ █  █ ███

    drawCitizens(cityObject) {
        // for now, assume 16 available spaces 25 px wide (dimension of citizen sprite)
        // if count of citizen is > 16, then citizens will need to overlap, increment = 400 px / citizens
        let era = "ancient" // notice era hard coded to ancient for now
        const canvasXYWH = this.sprites.city.citizens
        let canvasXY = {x: canvasXYWH.x, y: canvasXYWH.y}
        const xIncrement = Math.min(25, 375 / this.#citizenCount(cityObject) )
        let gapUsed = 0
        for (let citizenType in cityObject.citizens) {
            let genderCounter = 0
            if (citizenType === "entertainer" || citizenType === "taxcollector" || citizenType === "scientist") {
                if (!gapUsed) {gapUsed = 1; canvasXY.x += xIncrement} // make a space between normal citizens and specialists
                for (let i = 0; i < cityObject.citizens[citizenType]; i++) {    
                    console.log(citizenType)
                    let citizenSprite = this.sprites.people[era]["specialist"][citizenType] //[citizenType][gender] // notice era hard coded to ancient for now
                    this.#drawCitizen(citizenSprite, canvasXY)
                    canvasXY.x += xIncrement // adjust x position to right for next citizen
                }
            } else {
                for (let i = 0; i < cityObject.citizens[citizenType]; i++) {
                    let gender = this.#getCitizenGender(genderCounter)
                    genderCounter++
                    let citizenSprite = this.sprites.people[era][citizenType][gender] //[citizenType][gender]
                    this.#drawCitizen(citizenSprite, canvasXY)
                    canvasXY.x += xIncrement // adjust x position to right for next citizen
                }
            }
          }
    }

    #citizenCount(cityObject) { // this function exists in City class definition as instance method but could not be called here so I copied it here
        return Object.values(cityObject.citizens).reduce( (sum, countOfCitizenType) => sum + countOfCitizenType)
    }

    #getCitizenGender(n) {
        const genders = ["man", "woman"]
        return genders[n % 2]
    }

    #drawCitizen(citizenSprite, canvasXY) {
        let spriteSheet = this.sprites.people
        this.drawSpriteScaledToCanvas(spriteSheet, citizenSprite, canvasXY)
    }

    // ██  ███ ███ ███ █ █ ██  ███ ███   █████ ███ ███
    // █ █ ██  █   █ █ █ █ █ █ █   ██    █ █ █ █ █ █ █
    // ██  █     █ █ █ █ █ ██  █   █     █ █ █ ███ ███
    // █ █ ███ ███ ███ ███ █ █ ███ ███   █ █ █ █ █ █

    // ██  ███ ███ ███ █ █ ██  ███ ███ ███
    // █ █ ██  █   █ █ █ █ █ █ █   ██  █  
    // ██  █     █ █ █ █ █ ██  █   █     █
    // █ █ ███ ███ ███ ███ █ █ ███ ███ ███

    // ███ ███ ███ ██    ███ ███ ███ ██  ███ ███ ███
    // █   █ █ █ █ █ █   █    █  █ █ █ █ █ █ █   ██
    // ███ █ █ █ █ █ █     █  █  █ █ ██  ███ █ █ █
    // █   ███ ███ ██    ███  █  ███ █ █ █ █ ███ ███

    // █ █ █  █ █ ███ ███   ███ █ █ ███ ███ ███ ██  ███ ███ ██
    // █ █ ██ █ █  █  █     █   █ █ █ █ █ █ █ █ █ █  █  ██  █ █
    // █ █ █ ██ █  █    █     █ █ █ ███ ███ █ █ ██   █  █   █ █
    // ███ █  █ █  █  ███   ███ ███ █   █   ███ █ █  █  ███ ██

    // ███ █ ███ █ █   █ █████ ███ ██  ███ █ █ ███ █████ ███ █  █ ███ ███
    // █   █  █  █ █   █ █ █ █ █ █ █ █ █ █ █ █ ██  █ █ █ ██  ██ █  █  █
    // █   █  █   █    █ █ █ █ ███ ██  █ █ █ █ █   █ █ █ █   █ ██  █    █
    // ███ █  █   █    █ █ █ █ █   █ █ ███  █  ███ █ █ █ ███ █  █  █  ███

    // █ █ █  █ █ ███ ███   ███ ██  ███ ███ ███ █  █ ███
    // █ █ ██ █ █  █  █     █ █ █ █ ██  █   ██  ██ █  █
    // █ █ █ ██ █  █    █   ███ ██  █     █ █   █ ██  █
    // ███ █  █ █  █  ███   █   █ █ ███ ███ ███ █  █  █

    // █ █  █   ███ ██  ███ ██  █ █ ███ ███ █ ███ █  █
    // █ ██ █   █ █ █ █ █ █ █ █ █ █ █    █  █ █ █ ██ █
    // █ █ ██   ███ ██  █ █ █ █ █ █ █    █  █ █ █ █ ██
    // █ █  █   █   █ █ ███ ██  ███ ███  █  █ ███ █  █

    drawInProduction() {
        this.drawInProductionText()
    }

    drawInProductionText() {
        let inProductionText = this.sprites.city.inProduction.text
        this.drawSpriteScaledToCanvas(this.sprites.city, this.sprites.people.ancient.content.woman, this.sprites.city.inProduction.text)
        //this.drawGrayButton(ctx, inProductionText.x, inProductionText.y, inProductionText.w, inProductionText.h, 'testText')
    }

    // ██  █ █ ███ ███ █ █ █  █ ███
    // ███ █ █  █   █  █ █ ██ █ █
    // █ █ █ █  █   █  █ █ █ ██   █
    // ██  ███  █   █  ███ █  █ ███

    drawBottomRightButtons() {
        this.drawGrayButton(this.ctx, 100, 100, 200, 200, 'testText')
    }

    // production area is 438, 166 to 632, 356  ...  632 - 438 = 194 pixels wide, 365 - 166 = 190 high
    // width ... 4 voids at 4 px each... 178 left ... assume inProduction takes 



    // █    █    ████   █████   █████       ███   ██    █   █████   █████   █████    █████    ███     ███    █████
    // █    █   █       █       █    █       █    █ █   █     █     █       █    █   █       █   █   █   █   █
    // █    █    ███    █████   ██████       █    █  █  █     █     █████   ██████   █████   █████   █       █████
    // █    █       █   █       █   █        █    █   █ █     █     █       █   █    █       █   █   █   █   █
    //  ████    ████    █████   █    █      ███   █    ██     █     █████   █    █   █       █   █    ███    █████



    // ████    █   █   █       █████    ████        █    ██ ██    ███    █   █   █████   ██ ██   █████   ██    █   █████
    // █   █   █   █   █       █       █           █     █ █ █   █   █   █   █   █       █ █ █   █       █ █   █     █
    // █████   █   █   █       █████    ███       █      █ █ █   █   █    █ █    ████    █ █ █   █████   █  █  █     █
    // █  █    █   █   █       █           █     █       █   █   █   █    █ █    █       █   █   █       █   █ █     █
    // █   █    ███    █████   █████   ████     █        █   █    ███      █     █████   █   █   █████   █    ██     █


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
        this.sprites.city.background = {x: 0, y: 0, w: 640, h: 480}
        this.sprites.city.citizens = {x: 6, y: 10, w: 424, h: 26}
        this.sprites.city.resourceMap = {x: 1, y: 1, w: 1, h: 1}
        this.sprites.city.resources = {x: 1, y: 1, w: 1, h: 1}
        this.sprites.city.foodStorage = {x: 1, y: 1, w: 1, h: 1}
        this.sprites.city.unitsSupported = {x: 1, y: 1, w: 1, h: 1}
        this.sprites.city.cityImprovements = {x: 1, y: 1, w: 1, h: 1}
        this.sprites.city.unitsPresent = {x: 1, y: 1, w: 1, h: 1}
        this.sprites.city.inProduction = {
            x: 437, y: 165, w: 194, h: 190,
            text: {x: 441, y: 169, w: 186, h: 10},
            buyButton: {x: 441, y: 181, w: 70, h: 25},
            inProductionIcon: {x: 513, y: 182, w: 42, h: 23},
            changeButton: {x: 557, y: 181, w: 70, h: 25},  // 182 /26 = 7   42 for dragon  70 for button
            progress: {x: 441, y: 208, w: 186, h: 152}
        }
        this.sprites.city.buttons = {x: 1, y: 1, w: 1, h: 1}
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
        const citizenRow = ["ancient", "renaissance", "industrial", "modern"]
        const columnCitizenType = ["happy", "happy", "content", "content", "unhappy", "unhappy", "pirate", "pirate", "specialist", "specialist", "specialist"]
        const columnCitizenGenderOrSpecialistType = ["man", "woman", "man", "woman", "man", "woman", "man", "woman", "entertainer", "taxcollector", "scientist"]
        citizenSprites.forEach( (row, j) => {
            let era = citizenRow[j]
            if (!this.sprites.people[era]) { this.sprites.people[era] = {} }
            console.log(era)
            row.forEach( (_citizen, i) => {
                let citizenType = columnCitizenType[i]
                console.log(citizenType)
                if (!this.sprites.people[era][citizenType]) { this.sprites.people[era][citizenType] = {} }
                let citizenGender = columnCitizenGenderOrSpecialistType[i]
                console.log(citizenGender)
                this.sprites.people[era][citizenType][citizenGender] = {x: 3+i*28, y: 7+j*31, w: 25, h: 28}
            })
        })
        console.log(this.sprites)
    }

}