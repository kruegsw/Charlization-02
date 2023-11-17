class CityCanvas {
    constructor() {

    }

    static renderCity(cityCtx, citySprite) {
        //let cityImage = new Image()
        //cityImage.src = "/assets/images/city.png"
        cityCtx.drawImage(
            citySprite,
            0, 0, 640, 480,
            0, 0, window.innerWidth, window.innerHeight
        )
    }



    //  ████   █████   █████    ███   █████   █████    ████         █     ████    ███    █   █   ██    █   ████     ████
    // █       █   █   █    █    █      █     █       █            █     █       █   █   █   █   █ █   █   █   █   █
    //  ███    █████   ██████    █      █     █████    ███        █       ███    █   █   █   █   █  █  █   █   █    ███
    //     █   █       █   █     █      █     █           █      █           █   █   █   █   █   █   █ █   █   █       █
    // ████    █       █    █   ███     █     █████   ████      █        ████     ███     ███    █    ██   ████    ████




}