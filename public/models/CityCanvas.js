class CityCanvas {
    constructor(canvas) {
        this.cityObject
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")
        this.sounds = {}
        this.sprites = {}
        this.initializeSounds()
        this.initializeSprites()
        this.unscaledPixelWidth
        this.unscaledPixelHeight
        this.adjustCanvasSizeToBrowser()
        this.inProductionChangeMenu = {
            IsOpen: false,
            scrollPosition: 0
        }
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

        const citySpriteXYWH = this.sprites.city.background
        const cityCanvasXYWH = citySpriteXYWH

        const borderThicknessLRTB = this.getCityBorderThicknessLeftRightTopBottom()

        this.unscaledPixelWidth = cityCanvasXYWH.w + borderThicknessLRTB.left + borderThicknessLRTB.right
        this.unscaledPixelHeight = cityCanvasXYWH.h + borderThicknessLRTB.top + borderThicknessLRTB.bottom
        
        if (window.innerWidth / window.innerHeight > this.unscaledPixelWidth/this.unscaledPixelHeight ) {
            this.canvas.height = window.innerHeight
            this.canvas.width = this.canvas.height*this.unscaledPixelWidth/this.unscaledPixelHeight
        } else {
            this.canvas.width = window.innerWidth
            this.canvas.height = this.canvas.width*this.unscaledPixelHeight/this.unscaledPixelWidth
        }

        //this.canvas.width = window.innerWidth // * devicePixelRatio
        //this.canvas.height = window.innerHeight // * devicePixelRatio

        const devicePixelRatio = window.devicePixelRatio
        if (devicePixelRatio > 1) {

            if (window.innerWidth / window.innerHeight > this.unscaledPixelWidth/this.unscaledPixelHeight ) {
                this.canvas.height = window.innerHeight
                this.canvas.width = this.canvas.height*this.unscaledPixelWidth/this.unscaledPixelHeight
            } else {
                this.canvas.width = window.innerWidth
                this.canvas.height = this.canvas.width*this.unscaledPixelHeight/this.unscaledPixelWidth
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

    renderCity() {
        this.drawCityBorder()
        this.drawCityBackground()
        this.drawCitizens()
        this.drawInProduction()
        this.drawBottomRightButtons()
        this.drawResources()
        if (this.inProductionChangeMenu.IsOpen) { this.drawInProductionChangeMenu() }
        this.#fixPixelBlur()
    }

    drawSpriteScaledToCanvas(spriteSheet, spriteSheetXYWH, canvasXYWH) {
        //console.log(spriteSheet, spriteSheetXYWH, canvasXY)
        const scaledCanvasXYWH = this.getScaledCanvasXYWH(canvasXYWH)
        scaledCanvasXYWH.w = this.canvas.width*(spriteSheetXYWH.w/this.unscaledPixelWidth) // w
        scaledCanvasXYWH.h = this.canvas.height*(spriteSheetXYWH.h/this.unscaledPixelHeight) // h
        this.ctx.drawImage(
            spriteSheet,
            ...Object.values(spriteSheetXYWH), // x, y, w, h,
            ...Object.values(scaledCanvasXYWH), // x, y, w, h
        )
    }

    drawSpriteScaledToCanvasAndAvailableWidth(spriteSheet, spriteSheetXYWH, canvasXYWH) {
        const scaledCanvasXYWH = this.getScaledCanvasXYWH(canvasXYWH)
        scaledCanvasXYWH.h = this.canvas.height*(canvasXYWH.w*(spriteSheetXYWH.h/spriteSheetXYWH.w))/this.unscaledPixelHeight
        this.ctx.drawImage(
            spriteSheet,
            ...Object.values(spriteSheetXYWH), // x, y, w, h
            ...Object.values(scaledCanvasXYWH), // x, y, w, h
        )
        /*
        this.ctx.drawImage(
            spriteSheet,
            ...Object.values(spriteSheetXYWH), // x, y, w, h,
            this.canvas.width*(canvasXYWH.x/citySpriteXYWH.w), // x
            this.canvas.height*(canvasXYWH.y/citySpriteXYWH.h), // y
            this.canvas.width*(canvasXYWH.w/citySpriteXYWH.w), //w
            this.canvas.height*(canvasXYWH.w*(spriteSheetXYWH.h/spriteSheetXYWH.w)/citySpriteXYWH.h) // h
        )
        */
    }

    /*
    drawUnitSpriteScaledToCanvasForInProduction(spriteSheet, spriteSheetXYWH, canvasXYWH) {
        //console.log(spriteSheet, spriteSheetXYWH, canvasXY)
        const citySpriteXYWH = this.sprites.city.background
        this.ctx.drawImage(
            spriteSheet,
            ...Object.values(spriteSheetXYWH), // x, y, w, h,
            this.canvas.width*(canvasXYWH.x/citySpriteXYWH.w), this.canvas.height*(canvasXYWH.y/citySpriteXYWH.h), this.canvas.width*(spriteSheetXYWH.w/citySpriteXYWH.w), this.canvas.height*(spriteSheetXYWH.h/citySpriteXYWH.h)
        )
    }

    drawSpriteScaledToCanvasAndCenteredWithinXYWH(spriteSheet, spriteSheetXYWH, canvasXYWH) {
        //console.log(spriteSheet, spriteSheetXYWH, canvasXY)
        const citySpriteXYWH = this.sprites.city.background
        this.ctx.drawImage(
            spriteSheet,
            ...Object.values(spriteSheetXYWH), // x, y, w, h,
            this.canvas.width*((canvasXYWH.x-spriteSheetXYWH.w/2)/citySpriteXYWH.w), this.canvas.height*((canvasXYWH.y-spriteSheetXYWH.h/2)/citySpriteXYWH.h), this.canvas.width*(spriteSheetXYWH.w/citySpriteXYWH.w), this.canvas.height*(spriteSheetXYWH.h/citySpriteXYWH.h)
        )
    }
    */

    drawShadowBorder(leftAndTopColor, rightAndBottomColor, spriteXYWH, lineWidth) {
        const boxXYWH = this.getScaledCanvasXYWH(spriteXYWH)
        this.ctx.beginPath()
        this.ctx.moveTo(boxXYWH.x, boxXYWH.y + boxXYWH.h)
        this.ctx.lineTo(boxXYWH.x, boxXYWH.y)
        this.ctx.lineTo(boxXYWH.x + boxXYWH.w, boxXYWH.y)
        this.ctx.lineWidth = lineWidth
        this.ctx.strokeStyle = leftAndTopColor
        this.ctx.stroke()
        this.ctx.beginPath()
        this.ctx.moveTo(boxXYWH.x + boxXYWH.w, boxXYWH.y)
        this.ctx.lineTo(boxXYWH.x + boxXYWH.w, boxXYWH.y + boxXYWH.h)
        this.ctx.lineTo(boxXYWH.x, boxXYWH.y + boxXYWH.h)
        this.ctx.lineWidth = lineWidth
        this.ctx.strokeStyle = rightAndBottomColor
        this.ctx.stroke()
    }

    drawGrayButtonWithCenteredBlackText(spriteXYWH, text, textColor, textHeight) {
        let canvasXYWH = this.getScaledCanvasXYWH(spriteXYWH)
        this.ctx.beginPath();
        this.ctx.rect(canvasXYWH.x, canvasXYWH.y, canvasXYWH.w, canvasXYWH.h);
        this.ctx.fillStyle = 'rgba(180,180,180,1)';  // color of stone
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
        canvasXYWH = {...spriteXYWH}
        this.drawTextScaledToCanvas(text, canvasXYWH, textColor, textHeight)
        this.drawShadowBorder('lightgray', 'gray', spriteXYWH, 4)
    }

    drawTextScaledToCanvas(text, canvasXYWH, textColor, textHeight, font = "Times New Roman") {
        const borderThicknessLRTB = this.getCityBorderThicknessLeftRightTopBottom()
        const citySpriteXYWH = this.sprites.city.background
        //this.ctx.font = "48px serif";
        //this.ctx.strokeText(text, this.canvas.width*(canvasXYWH.x/citySpriteXYWH.w), this.canvas.height*((canvasXYWH.y+canvasXYWH.h)/citySpriteXYWH.h));

        //ctx.lineWidth = 4;
        //ctx.strokeStyle = "#000000";
        this.ctx.fillStyle = textColor;
        //this.ctx.rect(canvasXYWH.x, canvasXYWH.y, canvasXYWH.w, canvasXYWH.h)
        this.ctx.font=`${this.canvas.height*(textHeight/this.unscaledPixelHeight)}px ${font}`;
        this.ctx.textAlign = "center"; 
        this.ctx.textBaseline = "middle";
        //this.ctx.fillStyle = "#000000";
        //this.ctx.fillText("Attack!",rectX+(rectWidth/2),rectY+(rectHeight/2));
        //this.ctx.font = '20pt Times New Roman';
        //this.ctx.fillStyle = '#000000';
        this.ctx.fillText(
            text, // text
            this.canvas.width*((borderThicknessLRTB.left+canvasXYWH.x+canvasXYWH.w/2)/this.unscaledPixelWidth), // x
            this.canvas.height*((borderThicknessLRTB.top+canvasXYWH.y+canvasXYWH.h/2)/this.unscaledPixelHeight)) // y
        //this.ctx.fillText(text, x + w / 4, y + 64);
    }

    getScaledCanvasXYWH(cityXYWH) {
        const borderThicknessLRTB = this.getCityBorderThicknessLeftRightTopBottom()
        return {
            x: this.canvas.width*(borderThicknessLRTB.left+cityXYWH.x)/this.unscaledPixelWidth,
            y: this.canvas.height*(borderThicknessLRTB.top+cityXYWH.y)/this.unscaledPixelHeight,
            w: this.canvas.width*(cityXYWH.w)/this.unscaledPixelWidth,
            h: this.canvas.height*(cityXYWH.h)/this.unscaledPixelHeight
        }
    }

    drawWhiteOuterBorder(boxXYWH) {
        const thickness = 2
        const outerBorderXYWH = { // relative to top left corner of cityBackground
            x: boxXYWH.x,
            y: boxXYWH.y,
            w: boxXYWH.w,
            h: boxXYWH.h
        }
        this.drawShadowBorder('snow', 'whitesmoke', outerBorderXYWH, thickness)
    }

    drawGrayOuterBorder(boxXYWH) {
        const thickness = 2
        const outerBorderXYWH = { // relative to top left corner of cityBackground
            x: boxXYWH.x+thickness,
            y: boxXYWH.y+thickness,
            w: boxXYWH.w-2*thickness,
            h: boxXYWH.h-2*thickness
        }
        this.drawShadowBorder('silver', 'gray', outerBorderXYWH, thickness)
    }

    drawWhiteAndGrayOuterBorder(boxXYWH) {
        this.drawWhiteOuterBorder(boxXYWH)
        this.drawGrayOuterBorder(boxXYWH)
    }

    drawGrayInnerBorder(boxXYWH) {
        const thickness = 2
        const outerXYWH = { // relative to top left corner of cityBackground
            x: boxXYWH.x-thickness/2,
            y: boxXYWH.y-thickness/2,
            w: boxXYWH.w+thickness,
            h: boxXYWH.h+thickness
        }
        this.drawShadowBorder('darkgray', 'lightgray', outerXYWH, thickness)
    }

    // ███ █ ███ █ █   ██  ███ ██  ██  ███ ██ 
    // █   █  █  █ █   ███ █ █ █ █ █ █ ██  █ █
    // █   █  █   █    ███ █ █ ██  █ █ █   ██
    // ███ █  █   █    ██  ███ █ █ ██  ███ █ █

    drawCityBorder() {
        this.drawCityBorderPattern()
        //this.drawWhiteOuterBorder()
        //this.drawGrayOuterBorder()
        this.drawCityWhiteAndGrayOuterBorder()
        this.drawCityGrayInnerBorder()
        this.drawTopLeftIcons()
        this.drawTopBorderText()
    }

    drawCityBorderPattern() {
        const pattern = this.ctx.createPattern(this.sprites.border, "repeat");
        this.ctx.fillStyle = pattern;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCityWhiteAndGrayOuterBorder() {
        const borderThicknessLRTB = this.getCityBorderThicknessLeftRightTopBottom()
        const boxXYWH = { // relative to top left corner of cityBackground
            x: -borderThicknessLRTB.left,
            y: -borderThicknessLRTB.top,
            w: this.unscaledPixelWidth,
            h: this.unscaledPixelHeight
        }
        this.drawWhiteAndGrayOuterBorder(boxXYWH)
    }

    drawCityGrayInnerBorder() {
        const borderThicknessLRTB = this.getCityBorderThicknessLeftRightTopBottom()
        const boxXYWH = { // relative to top left corner of cityBackground
            x: 0,
            y: 0,
            w: this.unscaledPixelWidth-borderThicknessLRTB.left-borderThicknessLRTB.right,
            h: this.unscaledPixelHeight-borderThicknessLRTB.top-borderThicknessLRTB.bottom
        }
        this.drawGrayInnerBorder(boxXYWH)
    }

    getCityBorderThicknessLeftRightTopBottom() {
        const arrowIcon = 16 // using arrow icon as reference to estimate border pixel thickness
        return {left: (arrowIcon/2), right: (arrowIcon/2), top: (arrowIcon+4+4), bottom: (arrowIcon/2)}
    }

    drawTopLeftIcons() {
        const spriteSheet = this.sprites.icons
        const iconSpritesForBorderTopLeft = [ 'closeWindow', 'upArrow', 'downArrow' ]
        const canvasXYWH = {...this.sprites.border.topLeftButtons}
        iconSpritesForBorderTopLeft.forEach( (icon, i) => {
            const spriteXYWH = spriteSheet[icon]
            this.drawSpriteScaledToCanvas(spriteSheet, spriteXYWH, canvasXYWH)
            canvasXYWH.x += 16 + 2
        } )
    }

    drawTopBorderText() {
        const text = `City of ${this.cityObject.name}, 123 B.C., Population ${this.cityObject.population.toLocaleString("en-US")} (Treasury: 123 Gold)`
        const canvasXYWH = {...this.sprites.border.topBorderText}
        const textColor = "dimgray"
        const textHeight = canvasXYWH.h
        const font = "Times New Roman"
        this.drawTextScaledToCanvas(text, canvasXYWH, textColor, textHeight, font)
    }

    // ███ █ ███ █ █   ██  ███ ███ █ █ ███ ██  ███ █ █ █  █ ██ 
    // █   █  █  █ █   ███ █ █ █   ██  █   █ █ █ █ █ █ ██ █ █ █
    // █   █  █   █    ███ ███ █   ██  █ █ ██  █ █ █ █ █ ██ █ █
    // ███ █  █   █    ██  █ █ ███ █ █ ███ █ █ ███ ███ █  █ ██

    drawCityBackground() {
        const borderThicknessLRTB = this.getCityBorderThicknessLeftRightTopBottom()
        const spriteXYWH = {...this.sprites.city.background}
        this.ctx.drawImage(
            this.sprites.city,
            ...Object.values(this.sprites.city.background), // x, y, w, h,
            this.canvas.width*(borderThicknessLRTB.left/this.unscaledPixelWidth), // x
            this.canvas.height*(borderThicknessLRTB.top/this.unscaledPixelHeight), // y
            this.canvas.width*(spriteXYWH.w/this.unscaledPixelWidth), // w
            this.canvas.height*(spriteXYWH.h/this.unscaledPixelHeight) // h
        )
    }
    

    // ███ █ ███ █ ███ ███ █  █ ███
    // █   █  █  █   █ ██  ██ █ █
    // █   █  █  █  █  █   █ ██   █
    // ███ █  █  █ ███ ███ █  █ ███

    drawCitizens() {
        // for now, assume 16 available spaces 25 px wide (dimension of citizen sprite)
        // if count of citizen is > 16, then citizens will need to overlap, increment = 400 px / citizens
        let era = "ancient" // notice era hard coded to ancient for now
        const canvasXYWH = {...this.sprites.city.citizens} // create clone to avoid mutatation
        const xIncrement = Math.min(25, 375 / this.#citizenCount() )
        let gapUsed = 0
        let genderCounter = 0
        for (let citizenType in this.cityObject.citizens) {
            if (citizenType === "entertainer" || citizenType === "taxcollector" || citizenType === "scientist") {
                if (!gapUsed) {gapUsed = 1; canvasXYWH.x += xIncrement} // make a space between normal citizens and specialists
                for (let i = 0; i < this.cityObject.citizens[citizenType]; i++) {    
                    //console.log(citizenType)
                    let citizenSprite = this.sprites.people[era]["specialist"][citizenType] //[citizenType][gender] // notice era hard coded to ancient for now
                    this.#drawCitizen(citizenSprite, canvasXYWH)
                    canvasXYWH.x += xIncrement // adjust x position to right for next citizen
                }
            } else {
                for (let i = 0; i < this.cityObject.citizens[citizenType]; i++) {
                    let gender = this.#getCitizenGender(genderCounter)
                    genderCounter++
                    let citizenSprite = this.sprites.people[era][citizenType][gender] //[citizenType][gender]
                    this.#drawCitizen(citizenSprite, canvasXYWH)
                    canvasXYWH.x += xIncrement // adjust x position to right for next citizen
                }
            }
          }
    }

    #citizenCount() { // this function exists in City class definition as instance method but could not be called here so I copied it here
        return Object.values(this.cityObject.citizens).reduce( (sum, countOfCitizenType) => sum + countOfCitizenType)
    }

    #getCitizenGender(n) {
        const genders = ["man", "woman"]
        return genders[n % 2]
    }

    #drawCitizen(citizenSprite, canvasXYWH) {
        let spriteSheet = this.sprites.people
        this.drawSpriteScaledToCanvas(spriteSheet, citizenSprite, canvasXYWH)
    }

    // ██  ███ ███ ███ █ █ ██  ███ ███   █   █ ███ ███
    // █ █ ██  █   █ █ █ █ █ █ █   ██    ██ ██ █ █ █ █
    // ██  █     █ █ █ █ █ ██  █   █     █ █ █ ███ ███
    // █ █ ███ ███ ███ ███ █ █ ███ ███   █   █ █ █ █

    // ██  ███ ███ ███ █ █ ██  ███ ███ ███
    // █ █ ██  █   █ █ █ █ █ █ █   ██  █  
    // ██  █     █ █ █ █ █ ██  █   █     █
    // █ █ ███ ███ ███ ███ █ █ ███ ███ ███

    drawResources() {
        this.drawResourcesProduction()
    }

    drawResourcesProduction() {
        const production = this.cityObject.resources.production
        const canvasXYWH = {...this.sprites.city.resources.wasteSupportProduction}
        const spriteSheet = this.sprites.icons
        const iconSprite = this.sprites.icons.production
        this.drawSpriteScaledToCanvas(spriteSheet, iconSprite, canvasXYWH)
    }

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
        this.drawInProductionShadowBorder()
        this.drawBuyBox()
        this.drawChangeBox()
        this.drawInProductionProgress()
        this.drawInProductionImage()
    }

    //drawInProductionText() {
    //    this.drawSpriteScaledToCanvas(this.sprites.city, this.sprites.people.ancient.content.woman, this.sprites.city.inProduction.text)
    //    //this.drawGrayButton(ctx, inProductionText.x, inProductionText.y, inProductionText.w, inProductionText.h, 'testText')
    //}

    drawInProductionShadowBorder() {
        const cost = this.cityObject.inProduction.cost
        const rowsOfShields = Math.min(cost / 10, 10)
        const iconSpriteHeight = 14
        const margin = 2
        const inProductionProgressWithAdjustedHeight = {...this.sprites.city.inProduction.progress}
        inProductionProgressWithAdjustedHeight.h = rowsOfShields * (iconSpriteHeight + margin) + margin
        this.drawShadowBorder('lightblue', 'darkblue', inProductionProgressWithAdjustedHeight, 1)
    }

    drawBuyBox() {
        this.drawGrayButtonWithCenteredBlackText(this.sprites.city.inProduction.buyButton, "Buy", 'black', this.sprites.city.inProduction.buyButton.h/2)
    }
    
    drawChangeBox() {
        this.drawGrayButtonWithCenteredBlackText(this.sprites.city.inProduction.changeButton, "Change", 'black', this.sprites.city.inProduction.changeButton.h/2)
    }

    drawInProductionText() {
        const inProductionText = this.cityObject.inProduction.inProduction
        const canvasXYWH = {...this.sprites.city.inProduction.text}
        const textHeight = canvasXYWH.h
        this.drawTextScaledToCanvas(inProductionText, canvasXYWH, 'SteelBlue', textHeight)
    }

    drawInProductionImage() {
        const inProductionText = this.cityObject.inProduction.inProduction
        if (this.sprites.icons[inProductionText]) { // if the inProduction is a wonder or improvement
            const spriteSheet = this.sprites.icons
            const spriteSheetXYWH = {... this.sprites.icons[inProductionText]}
            const canvasXYWH = {...this.sprites.city.inProduction.inProductionImage}
            this.drawInProductionText()
            this.drawSpriteScaledToCanvas(spriteSheet, spriteSheetXYWH, canvasXYWH) // manually scale unit to fix the available area
        } else {
            const spriteSheet = this.sprites.units
            const spriteSheetXYWH = {... this.sprites.units[inProductionText]}
            const canvasXYWH = {...this.sprites.city.inProduction.inProductionImageForUnits}
            this.drawSpriteScaledToCanvasAndAvailableWidth(spriteSheet, spriteSheetXYWH, canvasXYWH)
        }
    }

    drawInProductionProgress() {
        const cost = this.cityObject.inProduction.cost
        const progress = this.cityObject.inProduction.progress
        const canvasXYWH = {...this.sprites.city.inProduction.progress}
        const spriteSheet = this.sprites.icons
        const iconSprite = this.sprites.icons.production
        const rowsOfShields = Math.min(cost / 10, 10)
        const shieldsPerRow = cost / rowsOfShields
        const sideMargin = iconSprite.w / 2
        const overhangWithoutAdjustment = sideMargin * 2 * ( (shieldsPerRow * (1/10)) - 1 ) * (10 / shieldsPerRow)
        const rowStartingX = canvasXYWH.x + sideMargin
        const xIncrement = (canvasXYWH.w - (sideMargin * 2) - overhangWithoutAdjustment) / shieldsPerRow//, (canvasXYWH.w - iconSprite.w) / (10 / (cost / 100)) )
        const yIncrement = Math.min((canvasXYWH.h - 2 - 2) / rowsOfShields, iconSprite.h + 2)
        canvasXYWH.x = canvasXYWH.x + sideMargin // left margin will be one half of a shield width
        canvasXYWH.y = canvasXYWH.y + 2
        let shieldsPainted = 0
        for (let i = 0; i < rowsOfShields; i++) {
            for (let j = 0; j < shieldsPerRow; j++) {
                if (shieldsPainted >= progress) {return}
                this.drawSpriteScaledToCanvas(spriteSheet, iconSprite, canvasXYWH)
                shieldsPainted++
                canvasXYWH.x += xIncrement // adjust x position to right for next citizen
            }
            canvasXYWH.x = rowStartingX
            canvasXYWH.y = canvasXYWH.y + yIncrement
        }
    }

    // █ █  █   ███ ██  ███ ██  █ █ ███ ███ █ ███ █  █   ███ █ █ ███ █  █ ███ ███   █   █ ███ █  █ █ █
    // █ ██ █   █ █ █ █ █ █ █ █ █ █ █    █  █ █ █ ██ █   █   █ █ █ █ ██ █ █   █     ██ ██ █   ██ █ █ █
    // █ █ ██   ███ ██  █ █ █ █ █ █ █    █  █ █ █ █ ██   █   ███ ███ █ ██ █ █ ██    █ █ █ ██  █ ██ █ █
    // █ █  █   █   █ █ ███ ██  ███ ███  █  █ ███ █  █   ███ █ █ █ █ █  █ ███ ███   █   █ ███ █  █ ███

    drawInProductionChangeMenu() {
        this.drawInProductionChangeMenuPattern()
        this.drawInProgressChangeMenuWhiteAndGrayOuterBorder()
        this.drawInProductionScrollableSelectionAreaBackground()
        this.drawInProgressChangeMenuGrayInnerBorder()
        this.drawInProgressChangeMenuBorderText()
    }

    drawInProductionChangeMenuPattern() {
        const borderThicknessLRTB = this.getCityBorderThicknessLeftRightTopBottom()
        const backgroundXYWH = {...this.sprites.city.inProduction.changeMenu}
        const pattern = this.ctx.createPattern(this.sprites.border, "repeat");
        this.ctx.fillStyle = pattern;
        this.ctx.fillRect(
            this.canvas.width*((borderThicknessLRTB.left+backgroundXYWH.x)/this.unscaledPixelWidth), // x
            this.canvas.height*((borderThicknessLRTB.top+backgroundXYWH.y)/this.unscaledPixelHeight), // y
            this.canvas.width*(backgroundXYWH.w/this.unscaledPixelWidth), // w
            this.canvas.height*(backgroundXYWH.h/this.unscaledPixelHeight) // h
        )
    }

    drawInProgressChangeMenuWhiteAndGrayOuterBorder() {
        const backgroundXYWH = {...this.sprites.city.inProduction.changeMenu}
        this.drawWhiteAndGrayOuterBorder(backgroundXYWH)
    }

    drawInProductionScrollableSelectionAreaBackground() {
        const borderThicknessLRTB = this.getInProgressChangeMenuBorderThicknessLeftRightTopBottom()
        const backgroundXYWH = {...this.sprites.city.inProduction.changeMenu}
        this.ctx.fillStyle = "lightgray";
        this.ctx.fillRect(
            this.canvas.width*((borderThicknessLRTB.left*2+backgroundXYWH.x)/this.unscaledPixelWidth), // x relative to top left of city canvas including border
            this.canvas.height*((borderThicknessLRTB.top*2+backgroundXYWH.y)/this.unscaledPixelHeight), // y relative to top left of city canvas including border
            this.canvas.width*((backgroundXYWH.w-borderThicknessLRTB.left-borderThicknessLRTB.right)/this.unscaledPixelWidth), // w
            this.canvas.height*((backgroundXYWH.h-borderThicknessLRTB.top-borderThicknessLRTB.bottom)/this.unscaledPixelHeight) // h
        )
    }

    drawInProgressChangeMenuGrayInnerBorder() {
        const borderThicknessLRTB = this.getInProgressChangeMenuBorderThicknessLeftRightTopBottom()
        const backgroundXYWH = {...this.sprites.city.inProduction.changeMenu}
        const boxXYWH = { // relative to top left corner of cityBackground
            x: borderThicknessLRTB.left+backgroundXYWH.x,
            y: borderThicknessLRTB.top+backgroundXYWH.y,
            w: backgroundXYWH.w-borderThicknessLRTB.left-borderThicknessLRTB.right,
            h: backgroundXYWH.h-borderThicknessLRTB.top-borderThicknessLRTB.bottom
        }
        this.drawGrayInnerBorder(boxXYWH)
    }
    
    getInProgressChangeMenuBorderThicknessLeftRightTopBottom() {
        const border = this.getCityBorderThicknessLeftRightTopBottom()
        border.bottom = border.top
        return border
    }

    drawInProgressChangeMenuBorderText() {
        const borderXYWH = this.getInProgressChangeMenuBorderThicknessLeftRightTopBottom()
        const text = `What shall we build in ${this.cityObject.name}?`
        const canvasXYWH = {
            x: this.sprites.city.inProduction.changeMenu.x,
            y: this.sprites.city.inProduction.changeMenu.y+4,
            w: this.sprites.city.inProduction.changeMenu.w,
            h: borderXYWH.top-4-4
        }
        const textColor = "dimgray"
        const textHeight = canvasXYWH.h
        const font = "Times New Roman"
        this.drawTextScaledToCanvas(text, canvasXYWH, textColor, textHeight, font)
    }

    /*
    drawInProductionChangeMenuBackground() {
        const borderThicknessLRTB = this.getCityBorderThicknessLeftRightTopBottom()
        const spriteXYWH = {...this.sprites.city.inProduction.changeMenu}
        this.ctx.drawImage(
            this.sprites.city,
            ...Object.values(this.sprites.city.background), // x, y, w, h,
            this.canvas.width*((borderThicknessLRTB.left+spriteXYWH.x)/this.unscaledPixelWidth), // x
            this.canvas.height*((borderThicknessLRTB.top+spriteXYWH.y)/this.unscaledPixelHeight), // y
            this.canvas.width*(spriteXYWH.w/this.unscaledPixelWidth), // w
            this.canvas.height*(spriteXYWH.h/this.unscaledPixelHeight) // h
        )
    }
    */

    // ██  █ █ ███ ███ █ █ █  █ ███
    // ███ █ █  █   █  █ █ ██ █ █
    // █ █ █ █  █   █  █ █ █ ██   █
    // ██  ███  █   █  ███ █  █ ███

    drawBottomRightButtons() {
        //this.drawGrayButton(100, 100, 200, 200, 'testText')
    }

    // production area is 438, 166 to 632, 356  ...  632 - 438 = 194 pixels wide, 365 - 166 = 190 high
    // width ... 4 voids at 4 px each... 178 left ... assume inProduction takes 



    // █    █    ████   █████   █████       ███   ██    █   █████   █████   █████    █████    ███     ███    █████
    // █    █   █       █       █    █       █    █ █   █     █     █       █    █   █       █   █   █   █   █
    // █    █    ███    █████   ██████       █    █  █  █     █     █████   ██████   █████   █████   █       █████
    // █    █       █   █       █   █        █    █   █ █     █     █       █   █    █       █   █   █   █   █
    //  ████    ████    █████   █    █      ███   █    ██     █     █████   █    █   █       █   █    ███    █████


    handleClick(canvasMouseClick) {
        const buyButtonXYWH = this.getScaledCanvasXYWH(this.sprites.city.inProduction.buyButton)
        const changeButtonXYWH = this.getScaledCanvasXYWH(this.sprites.city.inProduction.changeButton)
        const closeWindowButtonXYWH = this.getScaledCanvasXYWH(this.sprites.border.closeWindowButton)
        const upArrowButton = this.getScaledCanvasXYWH(this.sprites.border.upArrowButton)
        const downArrowButton = this.getScaledCanvasXYWH(this.sprites.border.downArrowButton)

        // Top Left Close Button Clicked
        if ( this.clickIsWithinXYWH(canvasMouseClick, closeWindowButtonXYWH ) ) {
            this.closeCityWindowAndBringBoardCanvasToFront()
            return
        }

        // Top Left upArrow (next city) Button Clicked
        if ( this.clickIsWithinXYWH(canvasMouseClick, upArrowButton ) ) {
            boardCanvasController.selectNextCity({board: clientGame.board, username: socket.id})
            this.cityObject = boardCanvasController.selectedCity
            this.renderCity()
            return
        }

        // Top Left downArrow (previous city) Button Clicked
        if ( this.clickIsWithinXYWH(canvasMouseClick, downArrowButton ) ) {
            boardCanvasController.selectPreviousCity({board: clientGame.board, username: socket.id})
            this.cityObject = boardCanvasController.selectedCity
            this.renderCity()
            return
        }

        // Buy Button Clicked
        if ( this.clickIsWithinXYWH(canvasMouseClick, buyButtonXYWH) ) {
            // if not enough gold, window showing user they don't have required amount of gold
            // if enough gold, window prompting user if they want to finish production for 'x' gold
            this.sounds.buyInProduction.play()
            // add later:  reduce player gold to pay
            this.cityObject.inProduction.progress = this.cityObject.inProduction.cost
            this.renderCity()
            socket.emit('cityOrders', {city: this.cityObject, orders: "buyProduction"})
            //socket.emit to update gold balance (or combine this into a single socket.emit in future)
            return
        }

        // Change Button Clicked
        if ( this.clickIsWithinXYWH(canvasMouseClick, changeButtonXYWH) ) {
            this.inProductionChangeMenu.IsOpen = true
            console.log('change button clicked')
            // pop-up window which is populated with available units / improvements for player and city location
            // listeners on window which detected selected unit
            return
        }
    }

    clickIsWithinXYWH(canvasMouseClick, canvasXYWH) {
        return(
            canvasMouseClick.x >= canvasXYWH.x &&
            canvasMouseClick.x <= (canvasXYWH.x + canvasXYWH.w) &&
            canvasMouseClick.y >= canvasXYWH.y &&
            canvasMouseClick.y <= (canvasXYWH.y + canvasXYWH.h)
        )
    }

    closeCityWindowAndBringBoardCanvasToFront() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight) // clear city canvas (akin to close city window)
        bringToFront(boardCanvas) // !!! this is a function defined in listeners.js !!!
    }

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


    initializeSounds() {
        this.sounds.buyInProduction = new Audio('/assets/sounds/POS1.WAV')
    }

    initializeSprites() {
        this.initializePatternSprites()
        this.initializeCitySprites()
        this.initializeIconSprites()
        this.initializePeopleSprites()
        this.initializeUnitSprites()  // redundant with boardCanvas
        console.log(this.sprites)
    }

    initializePatternSprites() {
        this.sprites.border = new Image();
        this.sprites.border.src = "/assets/images/patternStone1.png"
        this.sprites.border.topLeftButtons = {x: 0, y: -2-16, w: 16, h: 16 } // relative to top left corner of cityBackground
        this.sprites.border.closeWindowButton = {x: 0, y: -2-16, w: 16, h: 16 }
        this.sprites.border.downArrowButton = {x: 0+(16+2), y: -2-16, w: 16, h: 16 }
        this.sprites.border.upArrowButton = {x: 0+2*(16+2), y: -2-16, w: 16, h: 16 }
        this.sprites.border.topBorderText = {x: 0+2*(16+2)+8, y: -2-16, w: 640-( 2*(16+2)+8 ), h: 16 }
    }

    initializeCitySprites() {
        this.sprites.city = new Image()
        this.sprites.city.src = "/assets/images/city.png"
        this.sprites.city.background = {x: 0, y: 0, w: 640, h: 420}
        this.sprites.city.citizens = {x: 6, y: 10, w: 424, h: 26}
        this.sprites.city.resourceMap = {x: 3, y: 61, w: 196, h: 245}
        this.sprites.city.resources = {x: 199, y: 46, w: 238, h: 166,  // 437 212
            wasteSupportProduction: {x: 199, y: 181, w: 238, h: 16},  // 437 197
        }
        this.sprites.city.foodStorage = {x: 1, y: 1, w: 1, h: 1}
        this.sprites.city.unitsSupported = {x: 1, y: 1, w: 1, h: 1}
        this.sprites.city.cityImprovements = {x: 1, y: 1, w: 1, h: 1}
        this.sprites.city.unitsPresent = {x: 1, y: 1, w: 1, h: 1}
        this.sprites.city.inProduction = {
            x: 437, y: 165, w: 194, h: 190,  // 631, 355
            text: {x: 441, y: 169, w: 186, h: 10},
            buyButton: {x: 446, y: 181, w: 64, h: 23},
            inProductionImage: {x: 516, y: 182, w: 40, h: 23},
            inProductionImageForUnits: {x: 513, y: 170, w: 48, h: 23},
            changeButton: {x: 558, y: 181, w: 64, h: 23},  // 182 /26 = 7   42 for dragon  70 for button
            progress: {x: 445, y: 208, w: 178, h: 145},
            changeMenu: {x: 3+196/2, y: 46+3, w: (437+194/2)-(3+196/2), h: (165+190-2)-(46+3)} // width middle resourceMap to middle inProduction, height just below top of resource to just above bottom buttons
        }
        this.sprites.city.buttons = {x: 1, y: 1, w: 1, h: 1}
    }

    initializeIconSprites() {
        this.sprites.icons = new Image()
        this.sprites.icons.src = "/assets/images/icons.png"
        let iconSpritesLargeResourceBoxes = [
            ['hunger', 'waste', 'corruption'],
            ['food', 'production', 'trade'],
            ['luxury', 'tax', 'science'],
            ['bigUnhappyFace', 'notSure']
        ]
        iconSpritesLargeResourceBoxes.forEach( (row, i) => {
            row.forEach( (icon, j) => {
                this.sprites.icons[icon] = {x: 1+j*(14+1), y: 290+i*(14+1), w: 14, h: 14}
            })
        } )
        let iconSpritesForBorder = [ 'closeWindow', 'upArrow', 'downArrow', 'borderIconNotSure' ]
        iconSpritesForBorder.forEach( (icon, i) => {
            this.sprites.icons[icon] = {x: 1+i*(16+1), y: 389, w: 16, h: 16}
        } )
        let iconSpritesImprovementsBoxes = [
            ['palace', 'barracks', 'granary', 'temple', 'marketplace', 'library', 'courthouse', 'cityWalls'],
            ['aqueduct', 'bank', 'cathedral', 'university', 'massTransit', 'colloseum', 'factory', 'manufacturingPlant'],
            ['SDIdefence', 'recyclingCenter', 'powerPlant', 'hydroPlant', 'nuclearPlant', 'stockExchange', 'sewerSystem', 'supermarket'],
            ['superhighways', 'reasearchLab', 'SAMmissileBattery', 'coastalFortress', 'solarPlant', 'harbor', 'offshorePlatform', 'airport'],
            ['policeStation', 'SSstructural', 'SScomponent', 'SSmodule', '(Capitalization)'],
            ['pyramids', 'hangingGardens', 'collosus', 'lighthouse', 'greatLibrary', 'oracle', 'greatWall'],
            ['sunTzusWarAcademy', 'kingRichardsCrusade', 'marcoPolosEmbassy', 'michelangelosChapel', 'copernicussObservatory', 'magellansExpedition', 'shakespearesTheatre'],
            ['leonardosWorkshop', 'JSBachsCathedral', 'isaacNewtonsCollege', 'adamSmithsTradingCo', 'darwinsVoyage', 'statueOfLiberty', 'eiffelTower'],
            ['womensSuffrage', 'hooverDam', 'manhattanProject', 'unitedNations', 'apolloProgram', 'SETIprogram', 'cureForCancer']
        ]
        iconSpritesImprovementsBoxes.forEach( (row, i) => {
            row.forEach( (icon, j) => {
                this.sprites.icons[icon] = {x: 343+j*((379-343)+1), y: 1+i*((21-1)+1), w: (379-343), h: (21-1)}  //  42  36     23   20
            })
        } )
        let stoneBackgroundBoxes = [
            ['stone1', {x: 199, y: 322, w: (263-199), h: (354-322)}],
            ['stone2', {x: 298, y: 190, w: (330-298), h: (222-190)}],
            ['stone3', {x: 265, y: 223, w: (297-265), h: (255-223)}],
            ['stone4', {x: 298, y: 223, w: 32, h: 32}]
        ]
        stoneBackgroundBoxes.forEach( (pattern, i) => {
            this.sprites.icons[pattern[0]] = [pattern[1]]
        })
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
            row.forEach( (_citizen, i) => {
                let citizenType = columnCitizenType[i]
                if (!this.sprites.people[era][citizenType]) { this.sprites.people[era][citizenType] = {} }
                let citizenGender = columnCitizenGenderOrSpecialistType[i]
                this.sprites.people[era][citizenType][citizenGender] = {x: 3+i*28, y: 7+j*31, w: 25, h: 28}
            })
        })
    }

    initializeUnitSprites() { // this is redundant with boardCanvas
        this.sprites.units = new Image()
        this.sprites.units.src = "/assets/images/units.png"
        let unitSprites = [
            ['settler', 'engineer', 'warrior', 'phalanx', 'archer', 'legion', 'pikeman', 'musketeer', 'fanatic'],
            ['partisan', 'alpine', 'rifleman', 'marine', 'parachuter', 'humvee', 'horseman', 'chariot', 'elephant'],
            ['crusader', 'knight', 'not sure cavalry', 'cavalary', 'armor', 'catapult', 'cannon', 'artillery', 'howitzer'],
            ['plane', 'bomber', 'helicopter', 'fighter', 'stealth', 'trireme', 'caravel', 'galley', 'frigate'],
            ['ironclad', 'destroyer', 'cruser', 'not sure ship', 'battleship', 'submarine', 'carrier', 'transport', 'missile'],
            ['nuclear', 'diplomat', 'spy', 'caravan', 'freight', 'explorer', 'not sure barbarian', 'not sure boat', 'not sure ballon'],
            ['barb1', 'barb2', 'barb3', 'barb4', 'barb5', 'barb6', 'barb7', 'barb8', 'barb9', 'barb10']
        ]
        unitSprites.forEach( (row, j) => {
            row.forEach( (unit, i) => {
                this.sprites.units[unit] = {x: 2+i*65, y: 2+j*49, w: 62, h: 46}
            })
        })
        this.sprites.units['shield'] = {x: 597, y: 30, w: 12, h: 20}
    }

}