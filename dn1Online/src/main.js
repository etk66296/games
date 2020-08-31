function MemoryGame() {
	var config = {
			type: Phaser.AUTO,
			// type: Phaser.CANVAS,
	    parent: 'phaser3Canvas',
	    width: 500, // the odd values avoid bleeding on the render borders
	    height: 280,
			backgroundColor: '#111111',
			physics: {
				default: "arcade",
				arcade: {
					// gravity: { y: 300 }, // Top down game, so no gravity
					debug: true
				}
    	},
			// scene: [IntroScene, MenuScene],
			scene: [IntroScene, Level0Scene, LogoScene, Level1Scene],
			audio: {
        disableWebAudio: true
    	}
	}
	var game = new Phaser.Game(config)
}
