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
            scrollPosition: 0,
            availableForProduction: [
                'settler', 'warrior', 'phalanx', 'archers', 'horsemen', 'chariots', 'elephant', 'nuclearMissile',
                'palace', 'barracks', 'granary', 'temple', 'cityWalls',
                'colossus', 'greatLibrary', 'apolloProgram'
            ],
            selectedIndexForProduction: 0
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

    drawBorder(leftAndTopColor, rightAndBottomColor, spriteXYWH, lineWidth) {
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

    drawGrayButtonWithCenteredBlackText(unscaledCanvasXYWH, text, textColor, textHeight) {
        this.drawBox({unscaledCanvasXYWH})
        this.drawCenteredBlackText(unscaledCanvasXYWH, text, textColor, textHeight)
    }

    drawCustomColorButtonWithCenteredBlackText(unscaledCanvasXYWH, boxColor, text, textColor, textHeight) {
        this.drawBox({unscaledCanvasXYWH, boxColor})
        this.drawCenteredBlackText(unscaledCanvasXYWH, text, textColor, textHeight)
    }

    drawBox({unscaledCanvasXYWH, boxColor = 'rgba(180,180,180,1)', outlineColor = "", lineWidth = 1}) { // color of stone
        let canvasXYWH = this.getScaledCanvasXYWH(unscaledCanvasXYWH)
        this.ctx.lineWidth = lineWidth
        this.ctx.strokeStyle = outlineColor // no color
        this.ctx.beginPath();
        this.ctx.rect(canvasXYWH.x, canvasXYWH.y, canvasXYWH.w, canvasXYWH.h);
        this.ctx.fillStyle = boxColor;
        this.ctx.fill();
        if (lineWidth > 0) {this.ctx.stroke()};
        this.ctx.closePath();
    }

    drawCenteredBlackText(unscaledCanvasXYWH, text, textColor, textHeight) {
        const canvasXYWH = {...unscaledCanvasXYWH}
        this.drawTextScaledToCanvasAndCenteredOnProvidedXYWH({text, canvasXYWH, textColor, textHeight, font: "Times New Roman"})
        this.drawBorder('lightgray', 'gray', unscaledCanvasXYWH, 4)
    }

    drawTextScaledToCanvasAndCenteredOnProvidedXYWH({text, canvasXYWH, textColor, textHeight, font}) {
        const borderThicknessLRTB = this.getCityBorderThicknessLeftRightTopBottom()
        const citySpriteXYWH = this.sprites.city.background
        this.ctx.fillStyle = textColor;
        this.ctx.font=`${this.canvas.height*(textHeight/this.unscaledPixelHeight)}px ${font}`;
        this.ctx.textAlign = "center"; 
        this.ctx.textBaseline = "middle"
        this.ctx.fillText(
            text,
            this.canvas.width*((borderThicknessLRTB.left+canvasXYWH.x+canvasXYWH.w/2)/this.unscaledPixelWidth), // x
            this.canvas.height*((borderThicknessLRTB.top+canvasXYWH.y+canvasXYWH.h/2)/this.unscaledPixelHeight)) // y
    }

    drawTextScaledToCanvasAndLeftAlignedOnProvidedXYWH({text, canvasXYWH, textColor, textHeight, font}) {
        const borderThicknessLRTB = this.getCityBorderThicknessLeftRightTopBottom()
        const citySpriteXYWH = this.sprites.city.background
        this.ctx.fillStyle = textColor;
        this.ctx.font=`${this.canvas.height*(textHeight/this.unscaledPixelHeight)}px ${font}`;
        this.ctx.textAlign = "left"; 
        this.ctx.textBaseline = "middle"
        this.ctx.fillText(
            text,
            this.canvas.width*((borderThicknessLRTB.left+canvasXYWH.x)/this.unscaledPixelWidth), // x
            this.canvas.height*((borderThicknessLRTB.top+canvasXYWH.y+canvasXYWH.h/2)/this.unscaledPixelHeight)) // y
    }

    drawTextScaledToCanvasAndRightAlignedOnProvidedXYWH({text, canvasXYWH, textColor, textHeight, font}) {
        const borderThicknessLRTB = this.getCityBorderThicknessLeftRightTopBottom()
        const citySpriteXYWH = this.sprites.city.background
        this.ctx.fillStyle = textColor;
        this.ctx.font=`${this.canvas.height*(textHeight/this.unscaledPixelHeight)}px ${font}`;
        this.ctx.textAlign = "right"; 
        this.ctx.textBaseline = "middle"
        this.ctx.fillText(
            text,
            this.canvas.width*((borderThicknessLRTB.left+canvasXYWH.x+canvasXYWH.w)/this.unscaledPixelWidth), // x
            this.canvas.height*((borderThicknessLRTB.top+canvasXYWH.y+canvasXYWH.h/2)/this.unscaledPixelHeight)) // y
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
        this.drawBorder('snow', 'whitesmoke', outerBorderXYWH, thickness)
    }

    drawGrayOuterBorder(boxXYWH) {
        const thickness = 2
        const outerBorderXYWH = { // relative to top left corner of cityBackground
            x: boxXYWH.x+thickness,
            y: boxXYWH.y+thickness,
            w: boxXYWH.w-2*thickness,
            h: boxXYWH.h-2*thickness
        }
        this.drawBorder('silver', 'gray', outerBorderXYWH, thickness)
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
        this.drawBorder('darkgray', 'lightgray', outerXYWH, thickness)
    }

    drawTrianglePointingUp(scaledAndCenterTriangleXYWH, unscaledwidth, unscaledHeight) {
        const centerXY = {
            x: scaledAndCenterTriangleXYWH.x+scaledAndCenterTriangleXYWH.w/2,
            y: scaledAndCenterTriangleXYWH.y+scaledAndCenterTriangleXYWH.h/2
        }
        const canvasXYWH = this.getScaledCanvasXYWH({
            x: centerXY.x,
            y: centerXY.y,
            w: unscaledwidth,
            h: unscaledHeight
        })
        this.ctx.beginPath();
        this.ctx.moveTo(canvasXYWH.x, canvasXYWH.y-canvasXYWH.h/2);
        this.ctx.lineTo(canvasXYWH.x+canvasXYWH.w/2, canvasXYWH.y+canvasXYWH.h/2);
        this.ctx.lineTo(canvasXYWH.x-canvasXYWH.w/2, canvasXYWH.y+canvasXYWH.h/2);
        this.ctx.lineTo(canvasXYWH.x, canvasXYWH.y-canvasXYWH.h/2);
        this.ctx.fillStyle = "black"
        this.ctx.fill();
    }

    drawTrianglePointingDown(scaledAndCenterTriangleXYWH, unscaledwidth, unscaledHeight) {
        const centerXY = {
            x: scaledAndCenterTriangleXYWH.x+scaledAndCenterTriangleXYWH.w/2,
            y: scaledAndCenterTriangleXYWH.y+scaledAndCenterTriangleXYWH.h/2
        }
        const canvasXYWH = this.getScaledCanvasXYWH({
            x: centerXY.x,
            y: centerXY.y,
            w: unscaledwidth,
            h: unscaledHeight
        })
        this.ctx.beginPath();
        this.ctx.moveTo(canvasXYWH.x, canvasXYWH.y+canvasXYWH.h/2);
        this.ctx.lineTo(canvasXYWH.x+canvasXYWH.w/2, canvasXYWH.y-canvasXYWH.h/2);
        this.ctx.lineTo(canvasXYWH.x-canvasXYWH.w/2, canvasXYWH.y-canvasXYWH.h/2);
        this.ctx.lineTo(canvasXYWH.x, canvasXYWH.y+canvasXYWH.h/2);
        this.ctx.fillStyle = "black"
        this.ctx.fill();
    }

    getUnitOrImprovementName(option) {
        if ( Unit.UNIT_TYPES[option] ) {
            return Unit.UNIT_TYPES[option].name
        } else if ( CityImprovement.CITY_IMPROVEMENT_TYPES[option] ) {
            return CityImprovement.CITY_IMPROVEMENT_TYPES[option].name
        } else {
            // wonders included in 'cityImprovements' right now
        }
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
        this.drawTextScaledToCanvasAndCenteredOnProvidedXYWH({text, canvasXYWH, textColor, textHeight, font: "Times New Roman"})
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

        const sideMargin = iconSprite.w / 2
        const xIncrement = (canvasXYWH.w - (sideMargin * 2)) / production

        for (let i = 0; i < production; i++) {
            this.drawSpriteScaledToCanvas(spriteSheet, iconSprite, canvasXYWH)
            canvasXYWH.x += xIncrement
        }
    }

    //drawInProductionProgress() {
    //    const cost = this.cityObject.inProduction.cost
    //    const progress = this.cityObject.inProduction.progress
    //    const canvasXYWH = {...this.sprites.city.inProduction.progress}
    //    const spriteSheet = this.sprites.icons
    //    const iconSprite = this.sprites.icons.production
    //    const rowsOfShields = Math.min(cost / 10, 10)
    //    const shieldsPerRow = cost / rowsOfShields
    //    const sideMargin = iconSprite.w / 2
    //    const overhangWithoutAdjustment = sideMargin * 2 * ( (shieldsPerRow * (1/10)) - 1 ) * (10 / shieldsPerRow)
    //    const rowStartingX = canvasXYWH.x + sideMargin
    //    const xIncrement = (canvasXYWH.w - (sideMargin * 2) - overhangWithoutAdjustment) / shieldsPerRow//, (canvasXYWH.w - iconSprite.w) / (10 / (cost / 100)) )
    //    const yIncrement = Math.min((canvasXYWH.h - 2 - 2) / rowsOfShields, iconSprite.h + 2)
    //    canvasXYWH.x = canvasXYWH.x + sideMargin // left margin will be one half of a shield width
    //    canvasXYWH.y = canvasXYWH.y + 2
    //    let shieldsPainted = 0
    //    for (let i = 0; i < rowsOfShields; i++) {
    //        for (let j = 0; j < shieldsPerRow; j++) {
    //            if (shieldsPainted >= progress) {return}
    //            this.drawSpriteScaledToCanvas(spriteSheet, iconSprite, canvasXYWH)
    //            shieldsPainted++
    //            canvasXYWH.x += xIncrement // adjust x position to right for next citizen
    //        }
    //        canvasXYWH.x = rowStartingX
    //        canvasXYWH.y = canvasXYWH.y + yIncrement
    //    }
    //}

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
        const iconSprite = this.sprites.icons.production
        const margin = 3
        const canvasXYWH = {...this.sprites.city.inProduction.progress}
        const yIncrement = Math.min((canvasXYWH.h - 2 - 2) / rowsOfShields, iconSprite.h + 2)
        const inProductionProgressWithAdjustedHeight = {...this.sprites.city.inProduction.progress}
        inProductionProgressWithAdjustedHeight.h = rowsOfShields * yIncrement + margin
        this.drawBorder('lightblue', 'darkblue', inProductionProgressWithAdjustedHeight, 1)
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
        const textName = this.getUnitOrImprovementName(inProductionText)
        this.drawTextScaledToCanvasAndCenteredOnProvidedXYWH({text: textName, canvasXYWH, textColor: "SteelBlue", textHeight, font: "Times New Roman"})
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
        this.drawInProductionChangeMenuOkBox()
        this.drawInProductionChangeMenuRowsOfSelectableOptions()
        this.drawInProductionChangeMenuScrollBar()
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
        this.drawTextScaledToCanvasAndCenteredOnProvidedXYWH({text, canvasXYWH, textColor, textHeight, font: "Times New Roman"})
    }

    drawInProductionChangeMenuOkBox() {
        const unscaledCanvasXYWH = this.getInProductionChangeMenuOkBoxXYWH()
        this.drawGrayButtonWithCenteredBlackText(unscaledCanvasXYWH, "OK", 'black', unscaledCanvasXYWH.h/1.5)
    }

    getInProductionChangeMenuOkBoxXYWH() {
        const changeMenuXYWH = this.sprites.city.inProduction.changeMenu
        const borderLRTB = this.getInProgressChangeMenuBorderThicknessLeftRightTopBottom()
        const margin = 5 // between buttons, above buttons, below buttons
        const buttonWidth = (changeMenuXYWH.w - borderLRTB.left - borderLRTB.right - margin*2) / 3
        const unscaledCanvasXYWH = {
            x: changeMenuXYWH.x + changeMenuXYWH.w - borderLRTB.right - buttonWidth,
            y: changeMenuXYWH.y + changeMenuXYWH.h - borderLRTB.bottom + margin,
            w: buttonWidth,
            h: borderLRTB.bottom - margin*2
        }
        return unscaledCanvasXYWH
    }

    drawInProductionChangeMenuScrollBar() {
        this.drawInProductionChangeMenuScrollBarBackground()
        if (this.inProductionChangeMenu.availableForProduction.length <= 16) { return } // don't draw a scroll arrows & handle if all options fit into window
        this.drawTopGrayScrollBoxWithArrow()
        this.drawBottomGrayScrollBoxWithArrow()
        this.drawGrayScrollHandle()
    }

    drawInProductionChangeMenuScrollBarBackground() {
        const unscaledCanvasXYWH = this.getInProductionChangeMenuCenterScrollBarXYWH()
        const boxColor = "#f2f2f2"
        this.drawBox({unscaledCanvasXYWH, boxColor})
    }

    /*drawTopGrayScrollBoxWithArrow() {
        const scrollBarXYWH = this.getInProductionChangeMenuCenterScrollBarXYWH()
        const unscaledCanvasXYWH = {x: scrollBarXYWH.x, y: scrollBarXYWH.y, w: scrollBarXYWH.w, h: scrollBarXYWH.w}
        let canvasXYWH = this.getScaledCanvasXYWH(unscaledCanvasXYWH)
        this.drawTrianglePointingUp(canvasXYWH)
    }*/

    
    drawTopGrayScrollBoxWithArrow() {
        const scrollBarXYWH = this.getInProductionChangeMenuCenterScrollBarXYWH()
        const unscaledCanvasXYWH = {x: scrollBarXYWH.x, y: scrollBarXYWH.y, w: scrollBarXYWH.w, h: scrollBarXYWH.w}
        const boxColor = "lightgray"
        this.drawBox({unscaledCanvasXYWH, boxColor})
        const unscaledwidth = unscaledCanvasXYWH.w/2
        const unscaledHeight = unscaledCanvasXYWH.h/3
        this.drawTrianglePointingUp(unscaledCanvasXYWH, unscaledwidth, unscaledHeight)

        
        //const spriteSheet = this.sprites.icons
        ////const canvasXYWH = this.getScaledCanvasXYWH(unscaledCanvasXYWH)
        //const spriteXYWH = spriteSheet.blackUpArrow
        //this.drawSpriteScaledToCanvasAndAvailableWidth(spriteSheet, spriteXYWH, unscaledCanvasXYWH)

        //const spriteSheet = this.sprites.icons
        //const iconSpritesForBorderTopLeft = 'blackUpArrow'
        ////const iconSpritesForBorderTopLeft = 'upArrow'
        //const canvasXYWH = {...this.sprites.border.topLeftButtons}
        //const spriteXYWH = spriteSheet[iconSpritesForBorderTopLeft]
        //this.drawSpriteScaledToCanvas(spriteSheet, spriteXYWH, canvasXYWH)
        
    }

    drawBottomGrayScrollBoxWithArrow() {
        const unscaledCanvasXYWH = this.getBottomGrayScrollBoxXYWH()
        const boxColor = "lightgray"
        this.drawBox({unscaledCanvasXYWH, boxColor})
        const unscaledwidth = unscaledCanvasXYWH.w/2
        const unscaledHeight = unscaledCanvasXYWH.h/3
        this.drawTrianglePointingDown(unscaledCanvasXYWH, unscaledwidth, unscaledHeight)
    }

    getTopGrayScrollBoxXYWH() {
        const scrollBarXYWH = this.getInProductionChangeMenuCenterScrollBarXYWH()
        return {x: scrollBarXYWH.x, y: scrollBarXYWH.y, w: scrollBarXYWH.w, h: scrollBarXYWH.w}
    }

    getBottomGrayScrollBoxXYWH() {
        const scrollBarXYWH = this.getInProductionChangeMenuCenterScrollBarXYWH()
        const scrollBoxY = scrollBarXYWH.y + scrollBarXYWH.h - scrollBarXYWH.w
        return {x: scrollBarXYWH.x, y: scrollBoxY, w: scrollBarXYWH.w, h: scrollBarXYWH.w}
    }

    drawGrayScrollHandle() {
        const unscaledCanvasXYWH = this.getScrollHandleXYWH()
        const boxColor = "lightgray"
        this.drawBox({unscaledCanvasXYWH, boxColor})
    }

    getScrollHandleXYWH() {
        const scrollBarXYWH = this.getInProductionChangeMenuCenterScrollBarXYWH()
        return {x: scrollBarXYWH.x, y: this.getScrollHandleY(), w: scrollBarXYWH.w, h: scrollBarXYWH.w}
    }

    getScrollHandleY() { // temporary set to top left of scroll bar for testing purposes
        const scrollBarXYWH = this.getInProductionChangeMenuCenterScrollBarXYWH()
        const overflow = this.inProductionChangeMenu.availableForProduction.length - 16
        const maxScrollHandleY = scrollBarXYWH.h - scrollBarXYWH.w*3
        return scrollBarXYWH.y+scrollBarXYWH.w+(maxScrollHandleY/overflow)*this.inProductionChangeMenu.scrollPosition
    }

    getInProductionChangeMenuCenterScrollBarWillBeWithinThisRangeXYWH() {
        const scrollBarXYWH = this.getInProductionChangeMenuCenterScrollBarXYWH()
        return {
            x: scrollBarXYWH.x,
            y: scrollBarXYWH.y + scrollBarXYWH.w,
            w: scrollBarXYWH.w,
            h: scrollBarXYWH.h - scrollBarXYWH.w*2
        }
    }

    drawInProductionChangeMenuRowsOfSelectableOptions() {
        const scrollBarXYWH = this.getInProductionChangeMenuCenterScrollBarXYWH()
        let unscaledChangeMenuCenterXYWH = this.getInProductionChangeMenuCenterXYWH()
        const availableForProduction = [...this.inProductionChangeMenu.availableForProduction].splice(this.inProductionChangeMenu.scrollPosition)
        const increment = unscaledChangeMenuCenterXYWH.h/17
        const textHeight = increment*4/5
        const unscaledIconW = this.getInProductionChangeMenuOkBoxXYWH().w/5  // *** this needs to be fixed
        const margin = 1
        const unscaledRowForSelectedBoxXYWH = {
            x: unscaledChangeMenuCenterXYWH.x + unscaledIconW*2 + margin, // leave space to show two columns of icons at left or text
            y: unscaledChangeMenuCenterXYWH.y + margin,
            w: unscaledChangeMenuCenterXYWH.w - unscaledIconW*2 - margin*2, // leave space to show two columns of icons at left or text
            h: increment - margin*2
        }
        const unscaledRowForTextXYWH = {
            x: unscaledChangeMenuCenterXYWH.x + unscaledIconW*2 + margin*2, // add margin between text and left side of box
            y: unscaledChangeMenuCenterXYWH.y + margin,
            w: unscaledChangeMenuCenterXYWH.w - unscaledIconW*2 - margin*3, // add margin between text and right side of box
            h: increment - margin*2
        }
        availableForProduction.forEach( (option, i) => {
            if (i > (16-1)) { return }  // show maximum 16 options
            const textName = this.getUnitOrImprovementName(option)
            const textForProperties = this.getInproductionChangeMenuRowsOfSelectedOptionsUnitPropertiesText(option)
            if (i === this.inProductionChangeMenu.selectedIndexForProduction - this.inProductionChangeMenu.scrollPosition) {
                // do this
                this.drawBox({unscaledCanvasXYWH: unscaledRowForSelectedBoxXYWH, boxColor: "darkgray"})
                this.drawBorder('silver', 'gray', unscaledRowForSelectedBoxXYWH, 1)
                this.drawTextScaledToCanvasAndLeftAlignedOnProvidedXYWH({text: textName, canvasXYWH: unscaledRowForTextXYWH, textColor: "white", textHeight, font: "Times New Roman"})
                this.drawTextScaledToCanvasAndRightAlignedOnProvidedXYWH({text: textForProperties, canvasXYWH: unscaledRowForTextXYWH, textColor: "white", textHeight, font: "Times New Roman"})
            } else {
                this.drawTextScaledToCanvasAndLeftAlignedOnProvidedXYWH({text: textName, canvasXYWH: unscaledRowForTextXYWH, textColor: "black", textHeight, font: "Times New Roman"})
                this.drawTextScaledToCanvasAndRightAlignedOnProvidedXYWH({text: textForProperties, canvasXYWH: unscaledRowForTextXYWH, textColor: "black", textHeight, font: "Times New Roman"})
            }
            unscaledRowForSelectedBoxXYWH.y += increment
            unscaledRowForTextXYWH.y += increment
        })
    }

    getInproductionChangeMenuRowsOfSelectedOptionsUnitPropertiesText(option) {
        const turns = 1
        let turnsText = "Turn"
        if (turns > 1) { turnsText = "Turns"}
        if (this.sprites.icons[option]) { // if option for production is a wonder or improvement
            return `(${turns} ${turnsText})`
        } else { // the option for production is a unit
            const attack = Unit.UNIT_TYPES[option].attack
            const defense = Unit.UNIT_TYPES[option].defense
            const move = Unit.UNIT_TYPES[option].move
            const HP1 = Unit.UNIT_TYPES[option].health
            const HP2 = Unit.UNIT_TYPES[option].firepower
            return `(${turns} ${turnsText}, ADM: ${attack}/${defense}/${move} HP: ${HP1}/${HP2})`
        }
    }

    getIndexOfInProductionChangeMenuSelectedOption(scaledCanvasSelectedPixelY) {
        const scaledInProductionChangeMenuCenterXYWH = this.getScaledCanvasXYWH(this.getInProductionChangeMenuCenterXYWH())
        const scaledIncrement = scaledInProductionChangeMenuCenterXYWH.h/17
        return Math.floor((scaledCanvasSelectedPixelY - scaledInProductionChangeMenuCenterXYWH.y) / scaledIncrement) + this.inProductionChangeMenu.scrollPosition
    }

    getInProductionChangeMenuCenterXYWH() {
        const backgroundXYWH = {...this.sprites.city.inProduction.changeMenu}
        const borderThicknessLRTB = this.getCityBorderThicknessLeftRightTopBottom()
        const scrollBarXYWH = this.getInProductionChangeMenuCenterScrollBarXYWH()
        return {
            x: backgroundXYWH.x + borderThicknessLRTB.left,
            y: backgroundXYWH.y + borderThicknessLRTB.top,
            w: (backgroundXYWH.x + backgroundXYWH.w - borderThicknessLRTB.right - scrollBarXYWH.w) - (backgroundXYWH.x + borderThicknessLRTB.left),
            h: (backgroundXYWH.y + backgroundXYWH.h - borderThicknessLRTB.bottom) - (backgroundXYWH.y + borderThicknessLRTB.top)
        }
    }

    getInProductionChangeMenuCenterScrollBarXYWH() {
        const changeMenuXYWH = this.sprites.city.inProduction.changeMenu
        const borderLRTB = this.getInProgressChangeMenuBorderThicknessLeftRightTopBottom()
        const scrollBarWidth = 10 // pixels
        const unscaledInProductionChangeMenuCenterScrollBarXYWH = {
            x: changeMenuXYWH.x + changeMenuXYWH.w - borderLRTB.right - scrollBarWidth,
            y: changeMenuXYWH.y + borderLRTB.top,
            w: scrollBarWidth,
            h: (changeMenuXYWH.y + changeMenuXYWH.h - borderLRTB.bottom) - (changeMenuXYWH.y + borderLRTB.top)
        }
        return unscaledInProductionChangeMenuCenterScrollBarXYWH
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
        this.drawBottomRightArrowButtons()
        this.drawInfoMapRenameHappyViewExitButtons()
        //this.drawGrayButton(100, 100, 200, 200, 'testText')
    }

    // production area is 438, 166 to 632, 356  ...  632 - 438 = 194 pixels wide, 365 - 166 = 190 high
    // width ... 4 voids at 4 px each... 178 left ... assume inProduction takes 

    drawBottomRightArrowButtons() {
        this.drawGrayButtonWithCenteredBlackText(this.sprites.city.buttons.upArrowButton, "up", 'black', this.sprites.city.buttons.upArrowButton.h/2)
        this.drawGrayButtonWithCenteredBlackText(this.sprites.city.buttons.downArrowButton, "down", 'black', this.sprites.city.buttons.downArrowButton.h/2)
    }

    drawInfoMapRenameHappyViewExitButtons() {
        this.drawGrayButtonWithCenteredBlackText(this.sprites.city.buttons.infoButton, "Info", 'black', this.sprites.city.buttons.infoButton.h/2)
        this.drawGrayButtonWithCenteredBlackText(this.sprites.city.buttons.mapButton, "Map", 'black', this.sprites.city.buttons.mapButton.h/2)
        this.drawGrayButtonWithCenteredBlackText(this.sprites.city.buttons.renameButton, "Rename", 'black', this.sprites.city.buttons.renameButton.h/2)
        this.drawGrayButtonWithCenteredBlackText(this.sprites.city.buttons.happyButton, "Happy", 'black', this.sprites.city.buttons.happyButton.h/2)
        this.drawGrayButtonWithCenteredBlackText(this.sprites.city.buttons.viewButton, "View", 'black', this.sprites.city.buttons.viewButton.h/2)
        this.drawGrayButtonWithCenteredBlackText(this.sprites.city.buttons.exitButton, "Exit", 'black', this.sprites.city.buttons.exitButton.h/2)
    }

    /*
    this.sprites.city.buttons = {  //  h = 62 = buttonHeight*(2+2/3)+2  ... 22
            x: 437, y: 356, w: 195, h: 62,  // 632-437=195, 418-356=62      buttonWidth*(3 + 1/3) = w[195] - spaceBetween[2]*3 ... buttonWidth = 57
            upArrowButton: {x: 437, y: 356+7, w: 19, h: 22},
            infoButton: {x: 437+19+2, y: 356+7, w: 57, h: 22},
            mapButton: {x: 437+19+2+57+2, y: 356+7, w: 57, h: 22},
            renameButton: {x: 437+19+2+57+2+57+2, y: 356+7, w: 57, h: 22},
            downArrowButton: {x: 437, y: 356+7+22+2, w: 19, h: 22},
            happyButton: {x: 437+19+2, y: 356+7+22+2, w: 57, h: 22},
            viewButton: {x: 437+19+2+57+2, y: 356+7+22+2, w: 57, h: 22},
            exitButton: {x: 437+19+2+57+2+57+2, y: 356+7+22+2, w: 57, h: 22},
        }
    */



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
        const inProductionChangeMenuCenterScrollBarWillBeWithinThisRangeXYWH = this.getScaledCanvasXYWH(this.getInProductionChangeMenuCenterScrollBarWillBeWithinThisRangeXYWH())
        const inProductionChangeMenuOkBoxXYWH = this.getScaledCanvasXYWH(this.getInProductionChangeMenuOkBoxXYWH())
        const inProductionChangeMenuTopGrayScrollBoxXYWH = this.getScaledCanvasXYWH(this.getTopGrayScrollBoxXYWH())
        const inProductionChangeMenuBottomGrayScrollBoxXYWH = this.getScaledCanvasXYWH(this.getBottomGrayScrollBoxXYWH())
        const inProductionChangeMenuScrollHandleXYWH = this.getScaledCanvasXYWH(this.getScrollHandleXYWH())
        const inProductionChangeMenuCenterXYWH = this.getScaledCanvasXYWH(this.getInProductionChangeMenuCenterXYWH())
        const bottomRightButtonsUpArrowButtonXYWH = this.getScaledCanvasXYWH(this.sprites.city.buttons.upArrowButton)
        const bottomRightButtonsInfoButtonXYWH = this.getScaledCanvasXYWH(this.sprites.city.buttons.infoButton)
        const bottomRightButtonsMapButtonXYWH = this.getScaledCanvasXYWH(this.sprites.city.buttons.mapButton)
        const bottomRightButtonsRenameButtonXYWH = this.getScaledCanvasXYWH(this.sprites.city.buttons.renameButton)
        const bottomRightButtonsDownArrowButtonXYWH = this.getScaledCanvasXYWH(this.sprites.city.buttons.downArrowButton)
        const bottomRightButtonsHappyButtonXYWH = this.getScaledCanvasXYWH(this.sprites.city.buttons.happyButton)
        const bottomRightButtonsViewButtonXYWH = this.getScaledCanvasXYWH(this.sprites.city.buttons.viewButton)
        const bottomRightButtonsExitButtonXYWH = this.getScaledCanvasXYWH(this.sprites.city.buttons.exitButton)

        if (this.inProductionChangeMenu.IsOpen) {

            // OK Button Clicked
            if ( this.clickIsWithinXYWH(canvasMouseClick, inProductionChangeMenuOkBoxXYWH ) ) {
                this.setProductionFromInProductionChangeMenu()
                this.closeCityInProductionChangeWindow()
                return
            }

            // Change Menu Scroll Bar Area Between Bottom Clicked
            if ( this.clickIsWithinXYWH(canvasMouseClick, inProductionChangeMenuBottomGrayScrollBoxXYWH ) ) {
                this.adjustInProductionChangeMenuScrollPosition("down")
                return
            }
            // Change Menu Scroll Bar Area Between Top Clicked
            if ( this.clickIsWithinXYWH(canvasMouseClick, inProductionChangeMenuTopGrayScrollBoxXYWH ) ) {
                this.adjustInProductionChangeMenuScrollPosition("up")
                return
            }
            // Change Menu Scroll Bar Area Between Top and Bottom Arrow Clicked
            if ( this.clickIsWithinXYWH(canvasMouseClick, inProductionChangeMenuCenterScrollBarWillBeWithinThisRangeXYWH ) ) {
                if (this.inProductionChangeMenu.availableForProduction.length <= 16) { return } // no overflow, no need to scroll
                if (canvasMouseClick.y < inProductionChangeMenuScrollHandleXYWH.y) { // Above Scroll Handle Clicked
                    this.adjustInProductionChangeMenuScrollPosition("up")
                }
                if (canvasMouseClick.y > (inProductionChangeMenuScrollHandleXYWH.y + inProductionChangeMenuScrollHandleXYWH.w)) {  // Below Scroll Handle Clicked
                    this.adjustInProductionChangeMenuScrollPosition("down")
                }
                return
            }
            // Change Menu Main Area Clicked
            if ( this.clickIsWithinXYWH(canvasMouseClick, inProductionChangeMenuCenterXYWH ) ) {
                const index = this.getIndexOfInProductionChangeMenuSelectedOption(canvasMouseClick.y)
                this.inProductionChangeMenu.selectedIndexForProduction = index
                this.renderCity()
                // later implement change in production if user presses "enter" or "OK"
                    //this.cityObject.inProduction.progress = this.cityObject.inProduction.cost
                    //this.renderCity()
                    //socket.emit('cityOrders', {city: this.cityObject, orders: "buyProduction"})
                return
            }
        }

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
            this.inProductionChangeMenu.selectedIndexForProduction = (this.inProductionChangeMenu.availableForProduction).indexOf(this.cityObject.inProduction.inProduction)
            // highlight unit which is selected for production scroll down only as far as needed
            console.log('change button clicked')
            // pop-up window which is populated with available units / improvements for player and city location
            // listeners on window which detected selected unit
            return
        }

        // Exit Button Clicked
        if ( this.clickIsWithinXYWH(canvasMouseClick, bottomRightButtonsExitButtonXYWH) ) {
            this.closeCityWindowAndBringBoardCanvasToFront()
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

    closeCityInProductionChangeWindow() {
        this.inProductionChangeMenu.IsOpen = false // close change window
        this.renderCity()
    }

    getCityInProductionSelectedOptionFromIndex(index) {
        return this.inProductionChangeMenu.availableForProduction[this.inProductionChangeMenu.scrollPosition+index]
    }

    adjustInProductionChangeMenuScrollPosition(upOrDownOrIndex) {
        if (upOrDownOrIndex === "down") {
            if (this.inProductionChangeMenu.scrollPosition >= ((this.inProductionChangeMenu.availableForProduction).length)-16) { return }
            this.inProductionChangeMenu.scrollPosition += 1
            console.log(this.inProductionChangeMenu.scrollPosition)
        } else if (upOrDownOrIndex === "up") {
            if (this.inProductionChangeMenu.scrollPosition <= 0) { return }
            this.inProductionChangeMenu.scrollPosition -= 1
            console.log(this.inProductionChangeMenu.scrollPosition)
        } else {
            this.inProductionChangeMenu.scrollPosition = upOrDownOrIndex
            console.log(this.inProductionChangeMenu.scrollPosition)
        }
    }

    adjustInProductionChangeMenuSelectedIndexForProduction(upOrDown) {
        if (upOrDown === "down") {
            if (this.inProductionChangeMenu.selectedIndexForProduction >= (this.inProductionChangeMenu.availableForProduction).length -1 ) { return }
            this.inProductionChangeMenu.selectedIndexForProduction += 1
            if (this.inProductionChangeMenu.selectedIndexForProduction > (this.inProductionChangeMenu.scrollPosition+(16-1))) { this.adjustInProductionChangeMenuScrollPosition("down") }
        } else if (upOrDown === "up") {
            if (this.inProductionChangeMenu.selectedIndexForProduction <= 0) { return }
            this.inProductionChangeMenu.selectedIndexForProduction -= 1
            if (this.inProductionChangeMenu.selectedIndexForProduction < this.inProductionChangeMenu.scrollPosition) { this.adjustInProductionChangeMenuScrollPosition("up") }
        } else {
            return
        }
    }

    setProductionFromInProductionChangeMenu() {
        const selectedForProduction = this.inProductionChangeMenu.availableForProduction[this.inProductionChangeMenu.selectedIndexForProduction]
        if (!selectedForProduction) { return }
        socket.emit('cityOrders', {city: this.cityObject, orders: "changeProduction", orderDetails: selectedForProduction})
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
            changeMenu: {
                x: 3+196/2, y: 46+3, w: (437+194/2)-(3+196/2), h: (165+190-2)-(46+3), // width middle resourceMap to middle inProduction, height just below top of resource to just above bottom buttons
            }
        }
        this.sprites.city.buttons = {  //  h = 62 = buttonHeight*(2+2/3)+2  ... 22
            x: 437, y: 356, w: 195, h: 62,  // 632-437=195, 418-356=62      buttonWidth*(3 + 1/3) = w[195] - spaceBetween[2]*3 ... buttonWidth = 57
            upArrowButton: {x: 438, y: 356+7, w: 18, h: 22},
            infoButton: {x: 438+18+4, y: 356+7, w: 54, h: 22},
            mapButton: {x: 438+18+4+54+4, y: 356+7, w: 54, h: 22},
            renameButton: {x: 438+18+4+54+4+54+4, y: 356+7, w: 54, h: 22},
            downArrowButton: {x: 438, y: 356+7+22+4, w: 18, h: 22},
            happyButton: {x: 438+18+4, y: 356+7+22+4, w: 54, h: 22},
            viewButton: {x: 438+18+4+54+4, y: 356+7+22+4, w: 54, h: 22},
            exitButton: {x: 438+18+4+54+4+54+4, y: 356+7+22+4, w: 54, h: 22},
        }
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
        let iconSpritesForBorder = [ 'closeWindow', 'upArrow', 'downArrow', 'borderIconNotSure', 'graySquare' ]
        iconSpritesForBorder.forEach( (icon, i) => {
            this.sprites.icons[icon] = {x: 1+i*(16+1), y: 389, w: 16, h: 16}
        } )
        let iconSpritesImprovementsBoxes = [
            ['palace', 'barracks', 'granary', 'temple', 'marketplace', 'library', 'courthouse', 'cityWalls'],
            ['aqueduct', 'bank', 'cathedral', 'university', 'massTransit', 'colloseum', 'factory', 'manufacturingPlant'],
            ['SDIdefence', 'recyclingCenter', 'powerPlant', 'hydroPlant', 'nuclearPlant', 'stockExchange', 'sewerSystem', 'supermarket'],
            ['superhighways', 'reasearchLab', 'SAMmissileBattery', 'coastalFortress', 'solarPlant', 'harbor', 'offshorePlatform', 'airport'],
            ['policeStation', 'SSstructural', 'SScomponent', 'SSmodule', '(Capitalization)'],
            ['pyramids', 'hangingGardens', 'colossus', 'lighthouse', 'greatLibrary', 'oracle', 'greatWall'],
            ['sunTzusWarAcademy', 'kingRichardsCrusade', 'marcoPolosEmbassy', 'michelangelosChapel', 'copernicussObservatory', 'magellansExpedition', 'shakespearesTheatre'],
            ['leonardosWorkshop', 'jsBachsCathedral', 'isaacNewtonsCollege', 'adamSmithsTradingCo', 'darwinsVoyage', 'statueOfLiberty', 'eiffelTower'],
            ['womensSuffrage', 'hooverDam', 'manhattanProject', 'unitedNations', 'apolloProgram', 'setiProgram', 'cureForCancer']
        ]
        iconSpritesImprovementsBoxes.forEach( (row, i) => {
            row.forEach( (icon, j) => {
                this.sprites.icons[icon] = {x: 343+j*((379-343)+1), y: 1+i*((21-1)+1), w: (379-343), h: (21-1)}  //  42  36     23   20
            })
        } )
        let adhocIcons = [
            ['stone1',          {x: 199, y: 322, w: (263-199), h: (354-322)}    ],
            ['stone2',          {x: 298, y: 190, w: (330-298), h: (222-190)}    ],
            ['stone3',          {x: 265, y: 223, w: (297-265), h: (255-223)}    ],
            ['stone4',          {x: 298, y: 223, w: 32,        h: 32}           ],
            ['blackUpArrow',    {x: 228, y: 393, w: 16,        h: 16}           ],
            ['blackDownArrow',  {x: 247, y: 393, w: 16,        h: 16}           ]
        ]
        adhocIcons.forEach( (adhocIcon, i) => {
            this.sprites.icons[adhocIcon[0]] = adhocIcon[1]
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
            ['settler', 'engineers', 'warrior', 'phalanx', 'archers', 'legion', 'pikeman', 'musketeers', 'fanatics'],
            ['partisans', 'alpineTroopers', 'rifleman', 'marine', 'paratroopers', 'mechanizedInfantry', 'horsemen', 'chariots', 'elephant'],
            ['crusaders', 'knights', 'dragoons', 'cavalry', 'armor', 'catapult', 'cannon', 'artillery', 'howitzer'],
            ['fighter', 'bomber', 'helicopter', 'stealthFighter', 'stealthBomber', 'trireme', 'caravel', 'galley', 'frigate'],
            ['ironclad', 'destroyer', 'cruser', 'aegisCruiser', 'battleship', 'submarine', 'carrier', 'transport', 'missile'],
            ['nuclearMissile', 'diplomat', 'spy', 'caravan', 'freight', 'explorer', 'not sure barbarian', 'not sure boat', 'not sure ballon'],
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