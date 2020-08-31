function Level1Scene() {
	Phaser.Scene.call(this, 'Level1Scene')
	this.controls = null
	this.hero = null
	this.cursors = null
	this.lastDir = 'right'
	this.heroHealthGroup = null
	this.healthBlocks = { current: 10, max: 10 }
	this.heroScale = 1.0
	this.pointCounterDsp = { scoreText: null, amount: 0}
	this.gunMulti = { gunMultiText: null, amount: 1 }

	// the string is used to check if the ogvw character gifts are collected in the correct order
	this.collectedGiftsChar = ''

	//map and layer data
	this.map = null
	this.solidLayer = null
	this.decorationLayer = null
	this.guardsObjLayerData = null
	this.giftObjLayerData = null
	this.camsObjLayerData = null
	this.minirobotsObjLayerData = null
	this.crocosObjLayerData = null
	this.wheelcanonObjLayerData = null
	this.giftsObjLayerData = null
	this.minesObjLayerData = null
	this.elevatorsObjLayerData = null
	this.glowthrowersObjLayerData = null
	this.trapsObjLayerData = null
	this.keysAndGatesObjLayerData = null
	this.animatedDecoObjLayerData = null
	this.levelGateObjLayerData = null
	this.washerBossObjLayerData = null
	this.shootableBricksObjLayerData = null

	// parameters
	this.jumpSpeed = 85
	//game objects
	this.bullets = null
	this.gunCoolsDown = 0
	this.mines = null
	this.heroPainState = false
	this.heroPainTime = 750
	this.heroPainStopWatch = 0
	this.gameCamsGroup = null
	this.minirobotsGroup = null
	this.giantRobots = null
	this.pointFlyersGroup = null
	this.crocosGroup = null
	this.wheelcanonsGroup = null
	this.enemyBullets = null
	this.giftsGroup = null
	this.mapDynamite = null
	this.dynamiteGroup = null
	this.elevators = []
	this.glowThrowers = []
	this.traps = []
	this.trapGuards = {}
	this.keysNGatesGroup = null
	this.animtedDecoGroup = null
	this.levelGateGroup = null
	this.finalBossGroup = null
	this.headUpDsp = null
	this.shootableBricksGroup = null

	// controls
	this.key_RIGHT = null
	this.key_LEFT = null
	this.key_JUMP = null
	this.key_FIRE = null
	this.key_USE = null
	this.touch_RIGHT = {isDown: false}
	this.touch_LEFT = {isDown: false}
	this.touch_JUMP = {isDown: false}
	this.touch_FIRE = {isDown: false}
	this.touch_USE = {isDown: false}
	this.aButton = null
	this.aButtonPressed = null
	this.bButton = null
	this.bButtonPressed = null
	this.leftButton = null
	this.leftButtonPressed = null
	this.rightButton = null
	this.rightButtonPressed = null
	this.upButton = null
	this.upButtonPressed = null

	// sound opjects
	this.heroStepSound = null
	this.heroJumpSound = null
	this.heroFiresSound = null
	this.explosionSound = null
	this.pickupGiftSound = null
	this.floorfireSound = null
	this.painSound = null
	this.openGateSound = null
	this.whaserBossNoise = null
}

Level1Scene.prototype = Object.create(Phaser.Scene.prototype)
Level1Scene.prototype.constructor = Level1Scene

Level1Scene.prototype.preload = function () {
	// all preloads are done in the intro scene
}

Level1Scene.prototype.create = function() {
	// background
	this.add.sprite(-100, 0, 'skyline1').setOrigin(0).setScrollFactor(0.2).setDepth(-1)
	this.add.sprite(-100, 0, 'skyline2').setOrigin(0).setScrollFactor(0.1).setDepth(-2)
	this.add.sprite(-10, -50, 'bgSunrise').setOrigin(0).setScrollFactor(0).setDepth(-3)

	// create the sound effect objects
	this.heroStepSound = this.sound.add('dukeStep')
	this.heroStepSound.rate = 2.0
	this.heroStepSound.volume = 0.5
	this.heroJumpSound = this.sound.add('dukeJump')
	this.heroFiresSound = this.sound.add('dukeFire')
	this.heroFiresSound.volume = 0.75
	this.explosionSound = this.sound.add('explosion')
	this.pickupGiftSound = this.sound.add('pickupGift')
	this.floorfireSound = this.sound.add('floorFire')
	this.painSound = this.sound.add('pain')
	this.openGateSound = this.sound.add('openGate')
	this.whaserBossNoise = this.sound.add('washerNoise')

	
	this.healthBlocks = { current: 10, max: 10 }

	// init all game stuff
	this.initMapData()
	this.initControls()

	// especially the game sprite objects
	this.initAnimatedDeco()
	this.initHeroBullets()
	this.initEnemyBullets()
	this.initHero()
	this.initLevelGate()
	this.initMines()
	this.initGifts()
	this.initObserverCameras()
	this.initMiniRobots()
	this.initGiantRobots()
	this.initCrocos()
	this.initWheelCanons()
	this.initBouncerGuards()
	this.initElevators()
	this.initGlowThrower()
	this.initTraps()
	this.initWasherBoss()
	this.initKeysAndGates()
	this.initShootableBricks()

	this.initHealthBar()
	
	
	// upon creating all game object instances let's add the collison polling
	this.initCollision()

	
	// define head up display
	this.headUpDsp = this.add.sprite(-10, -10, 'headUpDsp')
	
	this.headUpDsp.setOrigin(0)
	this.headUpDsp.setDepth(100)
	this.headUpDsp.setScrollFactor(0,0)
	
	// setup a hero following phaser cam
	this.cameras.main.startFollow(this.hero)

	// constrols
	this.input.addPointer(5)
	this.aButton = this.add.sprite(this.scale.canvas.width - 65, this.scale.canvas.height - 150, 'aButton')
	this.aButton.setOrigin(0)
	this.aButton.setInteractive()
	this.aButton.setDepth(102)
	this.aButton.setScrollFactor(0,0)
	this.aButtonPressed = this.add.sprite(this.scale.canvas.width - 70, this.scale.canvas.height - 155, 'buttonPressed')
	this.aButtonPressed.setOrigin(0)
	this.aButtonPressed.setInteractive()
	this.aButtonPressed.setDepth(101)
	this.aButtonPressed.setScrollFactor(0,0)
	this.aButtonPressed.setVisible(false)
	this.aButton.on('pointerdown', (pointer) => {
		this.touch_FIRE.isDown = true
		this.aButtonPressed.setVisible(true)
	})
	this.aButton.on('pointerup', (pointer) => {
		this.touch_FIRE.isDown = false
		this.aButtonPressed.setVisible(false)
	})
	
	this.bButton = this.add.sprite(this.scale.canvas.width - 100, this.scale.canvas.height - 80, 'bButton').setOrigin(0)
	this.bButton.setOrigin(0)
	this.bButton.setInteractive()
	this.bButton.setDepth(102)
	this.bButton.setScrollFactor(0,0)
	this.bButtonPressed = this.add.sprite(this.scale.canvas.width - 105, this.scale.canvas.height - 85, 'buttonPressed')
	this.bButtonPressed.setOrigin(0)
	this.bButtonPressed.setInteractive()
	this.bButtonPressed.setDepth(101)
	this.bButtonPressed.setScrollFactor(0,0)
	this.bButtonPressed.setVisible(false)
	this.bButton.on('pointerdown', (pointer) => {
		this.touch_JUMP.isDown = true
		this.bButtonPressed.setVisible(true)
		
	})
	this.bButton.on('pointerup', (pointer) => {
		this.touch_JUMP.isDown = false
		this.bButtonPressed.setVisible(false)
	})
	this.leftButton = this.add.sprite(5, this.scale.canvas.height - 150, 'leftButton').setOrigin(0)
	this.leftButton.setOrigin(0)
	this.leftButton.setInteractive()
	this.leftButton.setDepth(102)
	this.leftButton.setScrollFactor(0,0)
	this.leftButtonPressed = this.add.sprite(0, this.scale.canvas.height - 155, 'buttonPressed')
	this.leftButtonPressed.setOrigin(0)
	this.leftButtonPressed.setInteractive()
	this.leftButtonPressed.setDepth(101)
	this.leftButtonPressed.setScrollFactor(0,0)
	this.leftButtonPressed.setVisible(false)
	this.leftButton.on('pointerdown', (pointer) => {
		this.touch_LEFT.isDown = true
		this.leftButtonPressed.setVisible(true)
	})
	this.leftButton.on('pointerup', (pointer) => {
		this.touch_LEFT.isDown = false
		this.leftButtonPressed.setVisible(false)
	})
	this.rightButton = this.add.sprite(40, this.scale.canvas.height - 80, 'rightButton').setOrigin(0)
	this.rightButton.setOrigin(0)
	this.rightButton.setInteractive()
	this.rightButton.setDepth(102)
	this.rightButton.setScrollFactor(0,0)
	this.rightButtonPressed = this.add.sprite(35, this.scale.canvas.height - 85, 'buttonPressed')
	this.rightButtonPressed.setOrigin(0)
	this.rightButtonPressed.setInteractive()
	this.rightButtonPressed.setDepth(101)
	this.rightButtonPressed.setScrollFactor(0,0)
	this.rightButtonPressed.setVisible(false)
	this.rightButton.on('pointerdown', (pointer) => {
		this.touch_RIGHT.isDown = true
		this.rightButtonPressed.setVisible(true)
	})
	this.rightButton.on('pointerup', (pointer) => {
		this.touch_RIGHT.isDown = false
		this.rightButtonPressed.setVisible(false)
	})
	this.upButton = this.add.sprite(this.scale.canvas.width - 104, this.scale.canvas.height - 121, 'upButton').setOrigin(0)
	this.upButton.setScale(0.6)
	this.upButton.setOrigin(0)
	this.upButton.setInteractive()
	this.upButton.setDepth(102)
	this.upButton.setScrollFactor(0,0)
	this.upButtonPressed = this.add.sprite(this.scale.canvas.width - 107, this.scale.canvas.height - 124, 'buttonPressed')
	this.upButtonPressed.setScale(0.6)
	this.upButtonPressed.setOrigin(0)
	this.upButtonPressed.setInteractive()
	this.upButtonPressed.setDepth(101)
	this.upButtonPressed.setScrollFactor(0,0)
	this.upButtonPressed.setVisible(false)
	this.upButton.on('pointerdown', (pointer) => {
		this.touch_USE.isDown = true
		this.upButtonPressed.setVisible(true)
	})
	this.upButton.on('pointerup', (pointer) => {
		this.touch_USE.isDown = false
		this.upButtonPressed.setVisible(false)
	})
	// score text -->
	this.pointCounterDsp.amount = 0
	// this.scoreText = this.add.text(this.scale.canvas.width - 95, 50, String(this.mainPoints), { fontSize: 28, color: '#123456' })
	this.pointCounterDsp.scoreText = this.add.text(this.scale.canvas.width - 95, 50, String(this.pointCounterDsp.amount))
	this.pointCounterDsp.scoreText.setStyle({
    fontSize: '20px',
    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
    color: '#ff8a0a',
		// align: 'right',
    // backgroundColor: '#ff00ff'
	})
	this.pointCounterDsp.scoreText.setDepth(102)
	this.pointCounterDsp.scoreText.setScrollFactor(0)
	// <-- score text
	// gun multiplicator -->
	this.gunMulti.gunMultiText = this.add.text(this.scale.canvas.width - 22, 88, String(this.gunMulti.amount))
	this.gunMulti.gunMultiText.setStyle({
    fontSize: '24px',
    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
    color: '#dddddd',
		// align: 'right',
    // backgroundColor: '#ff00ff'
	})
	this.gunMulti.gunMultiText.setDepth(102)
	this.gunMulti.gunMultiText.setScrollFactor(0)
	// <-- gun multiplicator
}

Level1Scene.prototype.update = function (time, delta) {
	// hero movement -->
	if (this.key_LEFT.isDown || this.touch_LEFT.isDown) {
		if(this.hero.body.onFloor()) {
			if (!this.heroStepSound.isPlaying) {
				this.heroStepSound.play()
			}
			this.hero.setVelocityX(-140)
			if (this.heroPainState) {
				this.hero.anims.play('heroPainLeft', true)
			} else {
				this.hero.anims.play('heroWalkLeft', true)
			}
		} else {
			this.hero.setVelocityX(-this.jumpSpeed)
			if (this.heroPainState) {
				this.hero.anims.play('heroPainLeft', true)
			} else {
				this.hero.anims.play('heroJumpLeft', true)
			}
		}
		this.lastDir = 'left'
  } else if (this.key_RIGHT.isDown || this.touch_RIGHT.isDown) {
		if(this.hero.body.onFloor()) {
			if (!this.heroStepSound.isPlaying) {
				this.heroStepSound.play()
			}
			this.hero.setVelocityX(140)
			if (this.heroPainState) {
				this.hero.anims.play('heroPainRight', true)
			} else {
				this.hero.anims.play('heroWalkRight', true)
			}
		} else {
			this.hero.setVelocityX(this.jumpSpeed)
			if (this.heroPainState) {
				this.hero.anims.play('heroPainRight', true)
			} else {
				this.hero.anims.play('heroJumpRight', true)
			}
		}
		this.lastDir = 'right'
  } else {
		this.hero.setVelocityX(0)
		if(this.lastDir === 'left') {
			if (this.heroPainState) {
				this.hero.anims.play('heroPainLeft', true)
			} else {
				this.hero.anims.play('heroIdleLeft')
			}
		} else {
			if (this.heroPainState) {
				this.hero.anims.play('heroPainRight', true)
			} else {
				this.hero.anims.play('heroIdleRight')
			}
		}
	}
	// if ((this.touch_JUMP.isDown || this.key_JUMP.isDown) && (this.hero.body.onFloor() || this.hero.body.touching.down)) {
	if ((this.touch_JUMP.isDown || this.key_JUMP.isDown) && this.hero.body.onFloor()) {
		this.hero.setVelocityY(-185)
		if (!this.heroJumpSound.isPlaying) {
			this.heroJumpSound.play()
		}
	}
	// <-- hero movement
	// fire -->
	if ((this.touch_FIRE.isDown || this.key_FIRE.isDown) && this.gunCoolsDown <= 0) {
		if (!this.heroFiresSound.isPlaying) {
			this.heroFiresSound.play()
		}
		this.gunCoolsDown = 1000 // if the gun was fired it must cool down before the next shoot
		if(this.lastDir === 'left') {
			this.bullets.fireBullet(this.hero.x, this.hero.y, -1)
		} else {
			this.bullets.fireBullet(this.hero.x, this.hero.y, 1)
		}
	} else {
		this.gunCoolsDown -= delta
	}
	// <-- fire
	// use -->
	if (this.key_USE.isDown || this.touch_USE.isDown) {
		this.elevators.forEach((elevator) => {
			elevator.enable()
		})
	}
	// <-- use
	// pain time -->
	if (this.heroPainState) {
		this.heroPainStopWatch += delta
	}
	if(this.heroPainStopWatch > this.heroPainTime) {
		if (!this.painSound.isPlaying) {
			this.painSound.play()
		}
		this.heroPainState = false
		this.heroPainStopWatch = 0
		this.healthBlocks.current -= 1
	}
	this.updateHealthBlock()
	if (this.healthBlocks.current <= 0) {
		this.healthBlocks.current = 0
		this.heroScale -= 0.01
		this.hero.setScale(this.heroScale)
		if(this.heroScale <= 0) {
			// change to game over scene
			// this.scene.stop('Level1Scene')
			this.scene.start('LogoScene', { doRestart: true });
		}
	}
	// <-- pain time
	// points -->
	this.pointCounterDsp.scoreText.setText(String(this.pointCounterDsp.amount))
	// <-- points
}

Level1Scene.prototype.initControls = function() {	
	// constrols
	this.key_RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
	this.key_LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
	this.key_JUMP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
	this.key_FIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y)
	this.key_USE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
}

Level1Scene.prototype.initMapData = function() {	
	// map
	this.add.sprite(-1, -1, 'level1Background').setOrigin(0)
	this.map = this.make.tilemap({ key: "level1map" })
	const tileset = this.map.addTilesetImage("TilesNoTileBleeding", "TilesNoTileBleeding")
	this.solidLayer = this.map.createStaticLayer("Solid", tileset) //, 0, 0)
	this.solidLayer.setCollisionBetween(0, 11519)
	this.decorationLayer = this.map.createStaticLayer("Decoration", tileset)
	this.guardsObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "Guards")].objects
	this.giftObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "Gifts")].objects
	this.camsObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "Cameras")].objects
	this.minirobotsObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "Minirobots")].objects
	this.giantrobotsObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "Giantrobots")].objects
	this.crocosObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "Crocos")].objects
	this.wheelcanonObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "Wheelcanon")].objects
	this.giftsObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "Gifts")].objects
	this.minesObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "Mines")].objects
	this.elevatorsObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "Elevators")].objects
	this.glowthrowersObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "GlowThrowers")].objects
	this.trapsObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "Traps")].objects
	this.keysAndGatesObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "KeysAndGates")].objects
	this.animatedDecoObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "AnimatedDecoration")].objects
	this.levelGateObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "LevelGate")].objects
	this.washerBossObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "WasherBoss")].objects
	this.shootableBricksObjLayerData = this.map.objects[this.map.objects.findIndex(x => x.name === "ShootableBricks")].objects
}

Level1Scene.prototype.initAnimatedDeco = function() {	
	this.animtedDecoGroup = new AnimatedDeco(this, this.animatedDecoObjLayerData)
	this.animtedDecoGroup.children.iterate((decoSegment) => {
		decoSegment.setup()
	})
}

Level1Scene.prototype.initHeroBullets = function() {	
	this.bullets = new Bullets(this, this.solidLayer)
	this.bullets.children.iterate((bullet) => {
		bullet.setup()
	})
}

Level1Scene.prototype.initCrocos = function() {
	this.crocosGroup = new Crocos(this, this.crocosObjLayerData, this.solidLayer, this.bullets, this.explosionSound, this.pointCounterDsp)
	this.crocosGroup.children.iterate(function (croco) {
		croco.setup()
	})
}

Level1Scene.prototype.initLevelGate = function() {	
	this.levelGateGroup = new LevelGate(this, this.levelGateObjLayerData, this.hero, this.key_USE, this.touch_USE)
	this.levelGateGroup.children.iterate((levelGateSegment) => {
		levelGateSegment.setup()
	})
	this.levelGateGroup.setup()
}

Level1Scene.prototype.initEnemyBullets = function() {
	this.enemyBullets = new EnemyBullets(this, this.solidLayer)
	this.enemyBullets.children.iterate((bullet) => {
		bullet.setup()
	})
}

Level1Scene.prototype.initMines = function() {
	this.mines = new Mines(this, this.minesObjLayerData, this.solidLayer, this.bullets)
	this.mines.children.iterate(function(mine) {
		mine.setup()
	})
}

Level1Scene.prototype.initObserverCameras = function() {
	this.gameCamsGroup = new GameCams(this, this.camsObjLayerData, this.bullets, this.pointFlyersGroup, this.explosionSound, this.pointCounterDsp)
	this.gameCamsGroup.children.iterate((cam) => {
		cam.setup()
	})
}

Level1Scene.prototype.initGiantRobots = function() {
	this.giantRobots = new Giantrobots(this, this.giantrobotsObjLayerData, this.solidLayer, this.enemyBullets, this.hero, this.bullets, this.pointCounterDsp)
	this.giantRobots.children.iterate(function (giantrobo) {
		giantrobo.setup()
	})
}

Level1Scene.prototype.initMiniRobots = function() {
	this.minirobotsGroup = new Minirobots(this, this.minirobotsObjLayerData, this.solidLayer, this.bullets, this.explosionSound, this.pointCounterDsp)
	this.minirobotsGroup.children.iterate(function (minirobo) {
		minirobo.setup()
	})
}

Level1Scene.prototype.initWheelCanons = function() {
	this.wheelcanonsGroup = new Wheelcanons(this, this.wheelcanonObjLayerData, this.solidLayer, this.enemyBullets, this.bullets, this.pointCounterDsp)
	this.wheelcanonsGroup.children.iterate(function (wheelcanon) {
		wheelcanon.setup()
	})
}

Level1Scene.prototype.initBouncerGuards = function() {
	this.guardsObjLayerData.forEach((guard) => {
		var r1 = this.add.rectangle(guard.x + 8, guard.y + 8, guard.width, guard.height)
		this.physics.add.existing(r1)
		r1.body.immovable = true
		this.physics.add.collider(r1, this.minirobotsGroup)
		this.physics.add.collider(r1, this.crocosGroup )
		this.physics.add.collider(r1, this.wheelcanonsGroup )
		if (guard.type === "Trapguard") {
			if (this.trapGuards[guard.properties.id] === undefined) {
				this.trapGuards[guard.properties.id] = []
			}
			this.trapGuards[guard.properties.id].push(r1)
		}
	})
}

Level1Scene.prototype.initHero = function() {
	this.hero = this.physics.add.sprite(900, 100, 'heroSpriteAtlas').play('heroJumpRight')
	this.hero.body.setSize(10, 32, true)
	this.hero.body.setOffset(11, 0)
	this.hero.setGravityY(300)
	this.hero.setBounce(0.0)
	this.hero.useElevator = false
	this.physics.add.collider(this.hero, this.solidLayer)
	this.hero.isUsingElevator = false
	this.hero.inventory = []
	this.hero.equipmentDsp = { nextPosIndex: 0, positions: [
		{ x: 16, y: 16 },
		{ x: 16 + 18, y: 16 },
		{ x: 16 + 18 * 2, y: 16 },
		{ x: 16 + 18 * 3, y: 16 },
		{ x: 16 + 18 * 4, y: 16 },
		{ x: 16, y: 16 + 18 },
		{ x: 16 + 18, y: 16 + 18 },
		{ x: 16 + 18 * 2, y: 16 + 18 },
		{ x: 16 + 18 * 3, y: 16 + 18 },
		{ x: 16 + 18 * 4, y: 16 + 18 },
		{ x: 16, y: 16 + 18 * 2 },
		{ x: 16 + 18, y: 16 + 18 * 2 },
		{ x: 16 + 18 * 2, y: 16 + 18 * 2 },
		{ x: 16 + 18 * 3, y: 16 + 18 * 2 },
		{ x: 16 + 18 * 4, y: 16 + 18 * 2 },
		{ x: 16, y: 16 + 18 * 3 },
		{ x: 16 + 18, y: 16 + 18 * 3 },
		{ x: 16 + 18 * 2, y: 16 + 18 * 3 },
		{ x: 16 + 18 * 3, y: 16 + 18 * 3 },
		{ x: 16 + 18 * 4, y: 16 + 18 * 3 },
		{ x: 16, y: 16 + 18 * 4 },
		{ x: 16 + 18, y: 16 + 18 * 4 },
		{ x: 16 + 18 * 2, y: 16 + 18 * 4 },
		{ x: 16 + 18 * 3, y: 16 + 18 * 4 },
		{ x: 16 + 18 * 4, y: 16 + 18 * 4 },
		{ x: 16, y: 16 + 18 * 5 },
		{ x: 16 + 18, y: 16 + 18 * 5 },
		{ x: 16 + 18 * 2, y: 16 + 18 * 5 },
		{ x: 16 + 18 * 3, y: 16 + 18 * 5 },
		{ x: 16 + 18 * 4, y: 16 + 18 * 5 }
	]}
}

Level1Scene.prototype.initGifts = function() {
	// depends on the hero bullets instance
	this.pointFlyersGroup = new PointsFlyers(this)
	this.dynamiteGroup = new Dynamite(this, this.floorfireSound)
	this.dynamiteGroup.children.iterate((floorfire) => {
		floorfire.setup()
	})
	this.giftsGroup = new Gifts(this, this.giftsObjLayerData,
		this.solidLayer,
		this.pointFlyersGroup,
		this.bullets,
		this.dynamiteGroup,
		this.pickupGiftSound,
		this.explosionSound,
		this.healthBlocks,
		this.pointCounterDsp
	)
	this.giftsGroup.children.iterate(gift => {
		gift.setup()
	})
}

Level1Scene.prototype.initElevators = function() {
	this.elevators = []
	this.elevatorsObjLayerData.forEach((elevatorData) => {
		this.elevators.push(new Elevator(this, elevatorData, this.hero, this.key_USE, this.touch_USE))
	})
	// all elevator groups in one level are in an array
	this.elevators.forEach(elevator => {
		elevator.setup()
		elevator.children.iterate(segment => {
			segment.setup()
		})
	})
}

Level1Scene.prototype.initGlowThrower = function() {
	this.glowThrowers = []
	// glow thrower groups are organized in an array
	this.glowthrowersObjLayerData.forEach((glowThrowerData) => {
		this.glowThrowers.push(new GlowThrower(this, glowThrowerData))
	})
	this.glowThrowers.forEach((glowThrower) => {
		glowThrower.children.iterate((glowSegment) => {
			glowSegment.setup()
		})
	})
}


Level1Scene.prototype.initTraps = function() {
	this.traps = []
	// check how many traps are in the level
	// each trapsegment of the same trap has the same id
	let trapsData = {}
	this.trapsObjLayerData.forEach(trapSegment => {
		if (trapsData[trapSegment.properties.id] === undefined) {
			trapsData[trapSegment.properties.id] = []
		}
		trapsData[trapSegment.properties.id].push(trapSegment)
	})
	Object.keys(trapsData).forEach((key) => {
		// the guards corresponding to the traps must have the same id attribute as the traps itself
		this.traps.push(new Trap(this, trapsData[key], this.hero, this.trapGuards[key]))
	})
	this.traps.forEach(trap => {
		trap.children.iterate(trapSegment => {
			trapSegment.setup()
		})
	})
}

Level1Scene.prototype.initWasherBoss = function() {
	this.finalBossGroup = new WasherBoss(this, this.washerBossObjLayerData, this.hero, this.bullets, this.pointCounterDsp, this.whaserBossNoise)
	this.finalBossGroup.children.iterate(bossSegment => {
		bossSegment.setup()
	})
}

Level1Scene.prototype.initShootableBricks = function() {
	this.shootableBricksGroup = new ShootableBrick(this, this.shootableBricksObjLayerData, this.hero, this.bullets, this.pointCounterDsp)
	this.shootableBricksGroup.children.iterate(brick => {
		brick.setup()
	})
}


Level1Scene.prototype.initKeysAndGates = function() {
	this.keysNGatesGroup = new KeysNGates(this, this.keysAndGatesObjLayerData, this.hero, this.pointFlyersGroup, this.key_USE,this.touch_USE, this.openGateSound, this.pointCounterDsp)
	this.keysNGatesGroup.children.iterate(keyItem => {
		keyItem.setup()
	})
}

Level1Scene.prototype.initHealthBar = function() {
	this.heroHealthGroup = this.add.group()
	for (let i = 0; i < this.healthBlocks.max; i++) {
		let rect = this.add.rectangle(this.scale.canvas.width - 95 +  i * 9, 14, 7, 22, 0x00ff00)
		rect.setOrigin(0, 0)
		rect.setDepth(102)
		rect.setScrollFactor(0)
		this.heroHealthGroup.add(rect)
		// let rect = this.heroHealthGroup.add(new Phaser.GameObjects.Rectangle(200, 200, 148, 148, 0x6666ff))
		// rect.setOrigin(0, 0)
		// rect.setDepth(102)
		// this.add.circle(400, 200, 80, 0x9966ff);
	}
}

Level1Scene.prototype.initCollision = function() {
	// this function depends on all init functions
	// mini robots -->
	this.physics.add.overlap(this.hero, this.minirobotsGroup,  () => {
		this.heroPainState = true
	})
	// <-- mini robots
	// giant robots -->
	this.physics.add.overlap(this.hero, this.giantRobots,  () => {
		this.heroPainState = true
	})
	// <-- giant robots
	// crocos -->
	this.physics.add.overlap(this.hero, this.crocosGroup,  () => {
		this.heroPainState = true
	})
	// <-- crocos
	// enemy bullets -->
	this.physics.add.overlap(this.hero, this.enemyBullets, () => {
		this.heroPainState = true
	})
	// <-- enemy bullets
	// wheel canon -->
	this.physics.add.overlap(this.hero, this.wheelcanonsGroup, () => {
		this.heroPainState = true
	})
	// <-- wheel canon
	// mines -->
	this.physics.add.overlap(this.mines, this.hero, () => {
		this.heroPainState = true
	})
	// <-- mines
	// spikes -->
	this.physics.add.overlap(this.hero, this.decorationLayer,  (hero, deco) => {
		if (deco.properties.spike) {
			this.heroPainState = true
		}
	})
	// <-- spikes
	// glow thrower -->
	this.glowThrowers.forEach(glowThrower => {
		this.physics.add.overlap(this.hero, glowThrower,  (hero, deco) => {
			this.heroPainState = true
		})
	})
	// <-- glowthrower
	// gifts -->
	this.physics.add.overlap(this.hero, this.giftsGroup,  (hero, gift) => {
		gift.collected()
	})
	this.physics.add.overlap(this.hero, this.dynamiteGroup,  () => {
		this.heroPainState = true
	})
	// <-- gifts
}

Level1Scene.prototype.updateHealthBlock = function() {
	this.heroHealthGroup.children.iterate((healthBlock, index) => {
		if (index >= this.healthBlocks.current) {
			healthBlock.setVisible(false)
		} else {
			healthBlock.setVisible(true)
		}
	})
}