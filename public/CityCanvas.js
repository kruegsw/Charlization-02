class CityCanvas {
    constructor() {
        this.sounds = {}
        this.sprites = {}
        this.initializeSprites()
    }


    // █████    █████   ██    █   ████    █████   █████    ███   ██    █    █████
    // █    █   █       █ █   █   █   █   █       █    █    █    █ █   █   █    
    // ██████   █████   █  █  █   █   █   █████   ██████    █    █  █  █   █   ███ 
    // █   █    █       █   █ █   █   █   █       █   █     █    █   █ █   █    █
    // █    █   █████   █    ██   ████    █████   █    █   ███   █    ██    ████

    renderCity(cityCanvas, cityCtx, cityObject) {
        this.drawCityBackground(cityCanvas, cityCtx)
        this.drawCitizen(cityCanvas, cityCtx)
        this.drawBottomRightBottoms(cityCanvas, cityCtx)
        console.log(cityObject)
    }

    // ███ █ ███ █ █   ██  ███ ███ █ █ ███ ██  ███ █ █ █  █ ██ 
    // █   █  █  █ █   ███ █ █ █   ██  █   █ █ █ █ █ █ ██ █ █ █
    // █   █  █   █    ███ ███ █   ██  █ █ ██  █ █ █ █ █ ██ █ █
    // ███ █  █   █    ██  █ █ ███ █ █ ███ █ █ ███ ███ █  █ ██

    drawCityBackground(canvas, ctx) {
        ctx.drawImage(
            this.sprites.city,
            0, 0, 640, 480,
            0, 0, canvas.width, canvas.height
        )
    }
    

    // ███ █ ███ █ ███ ███ █  █ ███
    // █   █  █  █   █ ██  ██ █ █
    // █   █  █  █  █  █   █ ██   █
    // ███ █  █  █ ███ ███ █  █ ███

    drawCitizen(canvas, ctx, citizen = 'ancient-content-man') {
        ctx.drawImage(
            this.sprites.people,
            this.sprites.people[citizen].x, this.sprites.people[citizen].y, this.sprites.people[citizen].w, this.sprites.people[citizen].h,
            canvas.width*(6)/640, canvas.height*(2+8)/421, canvas.width*(this.sprites.people[citizen].w)/640, canvas.width*(this.sprites.people[citizen].h)/640
        )
    }

    // ██  ███ ███ ███ █ █ ██  ███ ███   █████ ███ ███
    // █ █ ██  █   █ █ █ █ █ █ █   ██    █ █ █ █ █ █ █
    // ██  █     █ █ █ █ █ ██  █   █     █ █ █ ███ ███
    // █ █ ███ ███ ███ ███ █ █ ███ ███   █ █ █ █ █ █

    // ██  ███ ███ ███ █ █ ██  ███ ███ ███ ███ ███
    // █ █ ██  █   █ █ █ █ █ █ █   ██  █   ██  █
    // ██  █     █ █ █ █ █ ██  █   █     █ █     █
    // █ █ ███ ███ ███ ███ █ █ ███ ███ ███ ███ ███

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

    // ██  █ █ ███ ███ █ █ █  █ ███
    // ███ █ █  █   █  █ █ ██ █ █
    // █ █ █ █  █   █  █ █ █ ██   █
    // ██  ███  █   █  ███ █  █ ███

    drawBottomRightBottoms(canvas, ctx) {
        this.drawGrayButton(ctx, 100, 100, 200, 200, 'testText')
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

    // production area is 438, 166 to 632, 356  ...  632 - 438 = 194 pixels wide, 365 - 166 = 190 high
    // width ... 4 voids at 4 px each... 178 left ... assume inProduction takes 



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
                this.sprites.people[citizen] = {x: 3+i*28, y: 7+j*31, w: 25, h: 28}
            })
        })
        console.log(this.sprites)
    }

}