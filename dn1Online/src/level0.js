function Level0Scene() {
	Phaser.Scene.call(this, 'Level0Scene')
	this.worldMap = null
	this.tileset = null

	// controls
	this.gameControls = null
	
	// world layers
	this.solidLayer = null
	this.decorationLayer = null
	this.giftsObjLayerData = null
	this.elevatorsObjLayerData = null
	this.bouncerGuardsObjLayerData = null
	this.crocosObjLayerData = null
	this.miniRobotsObjLayerData = null
	this.shootableBricksObjLayerData = null
	this.spikesObjLayerData = null
	this.dangleTilesLayerData = null
	this.multiHandLayerData = null
	this.giantRobosLayerData = null
	this.keysAndGatesObjLayerData = null
	this.placeTranslatorObjLayerData = null
	this.observerCamsObjLayerData = null
	this.fireWheelRobotsObjLayerData = null
	this.flyRobotsObjLayerData = null
	this.deuteriumSphereObjLayerData = null

	// scene objects
	this.heroGun = null
	this.hero = null
	this.crocosGroup = null
	this.elevators = null
	this.shootableBricksGroup = null
	this.mutliHandAcess = null
	this.enemyBullets = null
	this.giantRobots = null
	this.keysNGatesGroup = null
	this.placeTranslator = []
	this.fireWheelRobots = null
	this.flyRobots = null
	this.deuteriumSpheres = null
}

Level0Scene.prototype = Object.create(Phaser.Scene.prototype)
Level0Scene.prototype.constructor = Level0Scene

Level0Scene.prototype.preload = function () {
	// all preloads are done in the intro scene
}

Level0Scene.prototype.init = function () {
	this.initWorld()
}

Level0Scene.prototype.create = function() {
	// background
	this.stuttgart = this.add.sprite(-50, 0, 'stuttgart')
	this.stuttgart.setOrigin(0)
	this.stuttgart.setDepth(-100)
	this.stuttgart.setScrollFactor(0.15, 0.1)
	// hud
	this.headUpDsp = this.add.sprite(-10, -10, 'headUpDsp')
	this.headUpDsp.setOrigin(0)
	this.headUpDsp.setDepth(100)
	this.headUpDsp.setScrollFactor(0,0)

	// controls
	this.gameControls = new Controls(this)
	this.gameControls.setup()

	// create the hero and gun instances
	this.heroGun = new HeroGun(this, this.solidLayer)
	this.hero = new Hero(this, 890, 160, this.solidLayer, this.gameControls, this.heroGun)
	
	// place translator machine
	this.placeTranslatorObjLayerData.forEach(pTData => {
		this.placeTranslator.push(new PlaceTranslatorMachine(this, this.hero, pTData))
	})

	// dangle tiles
	this.dangleTiles = new DangleTiles(this, this.hero, this.dangleTilesLayerData)
	// dangle tiles
	this.mutliHandAcess = new MultiHandPlateAndTiles(this, this.hero, this.multiHandLayerData)
	// key and gates
	this.keysNGatesGroup = new KeysNGates(this, this.hero, this.keysAndGatesObjLayerData)

	// enemy bullets
	this.enemyBullets = new EnemyBullets(this, this.hero, this.solidLayer)

	// gifts
	this.giftsGroup = new Gifts(this, this.hero, this.giftsObjLayerData, this.solidLayer)

	// spikes
	this.spikesGroup = new Spikes(this, this.hero, this.spikesObjLayerData)

	// shootable bricks
	this.shootableBricksGroup = new ShootableBricks(this, this.hero, this.shootableBricksObjLayerData)

	// observer cams
	this.observerCamsGroup = new ObserverCams(this, this.hero, this.observerCamsObjLayerData)
	this.observerCamsGroup.children.iterate(cam => {
		cam.registerAsShootable()
	})
	
	// deuterium spheres
	this.deuteriumSpheres = new DeuteriumSperes(this, this.hero, this.deuteriumSphereObjLayerData)
	this.deuteriumSpheres.children.iterate((dts) => {
		dts.registerAsPainful()
		dts.registerAsShootable()
	})
	// crocos
	this.crocosGroup = new Crocos(this, this.hero, this.crocosObjLayerData, this.solidLayer)
	this.crocosGroup.children.iterate((croco) => {
		croco.registerAsPainful()
		croco.registerAsShootable()
	})
	// mini robots
	this.miniRobotsGroup = new Minirobots(this, this.hero, this.miniRobotsObjLayerData, this.solidLayer)
	this.miniRobotsGroup.children.iterate((miniRobo) => {
		miniRobo.registerAsPainful()
		miniRobo.registerAsShootable()
	})
	// giant roboty
	this.giantRobots = new Giantrobots(this, this.hero, this.giantRobosLayerData, this.solidLayer, this.enemyBullets)
	this.giantRobots.children.iterate(giantRobo => {
		giantRobo.registerAsPainful()
		giantRobo.registerAsShootable()
	})
	// fire wheel robots
	this.fireWheelRobots = new FireWheelRobots(this, this.hero, this.fireWheelRobotsObjLayerData, this.solidLayer)
	this.fireWheelRobots.children.iterate(fireWheelRobo => {
		fireWheelRobo.registerAsPainful()
		fireWheelRobo.registerAsShootable()
	})
	// fly robots
	this.flyRobots = new FlyRobots(this, this.hero, this.flyRobotsObjLayerData, this.solidLayer, this.enemyBullets)
	this.flyRobots.children.iterate(flyRobot=> {
		flyRobot.registerAsPainful()
		flyRobot.registerAsShootable()
	})
	// bouncer
	this.bouncerGuards = new BouncerGuards(this, this.bouncerGuardsObjLayerData, [
		this.crocosGroup,
		this.miniRobotsGroup,
		this.fireWheelRobots,
		this.flyRobots
	]/*collider groups(mini robots, crocos, ...)*/)

	// elevators
	this.elevators = []
	this.elevatorsObjLayerData.forEach((elevatorData) => {
		this.elevators.push(new Elevator(this, elevatorData, this.hero))
	})

	// camera
	this.cameras.main.startFollow(this.hero)
}

Level0Scene.prototype.update = function (time, delta) {
}

Level0Scene.prototype.initWorld = function() {	
	// map
	this.worldMap = this.make.tilemap({ key: "level0map" })
	this.tileset = this.worldMap.addTilesetImage("TilesNoTileBleeding", "TilesNoTileBleeding")
	this.decorationLayer = this.worldMap.createStaticLayer("Decoration", this.tileset)
	this.solidLayer = this.worldMap.createStaticLayer("Solid", this.tileset) //, 0, 0)
	this.solidLayer.setCollisionBetween(0, 11519)

	// place translator machine
	this.placeTranslatorObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "PlaceTranslatorMachines")].objects

	// dangle tiles
	this.dangleTilesLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "DangleTiles")].objects
	// multi hand
	this.multiHandLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "MultiHandAccess")].objects

	// spikes
	this.spikesObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "Spikes")].objects

	// observer cams
	this.observerCamsObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "ObserverCams")].objects

	// keys and gates
	this.keysAndGatesObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "KeysAndGates")].objects

	// shootable bricks layer
	this.shootableBricksObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "ShootableBricks")].objects

	// gifts
	this.giftsObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "Gifts")].objects
	
	// elevators
	this.elevatorsObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "Elevators")].objects

	// bouncer guards
	this.bouncerGuardsObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "Guards")].objects
	// crocos
	this.crocosObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "Crocos")].objects
	// mini robots
	this.miniRobotsObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "Minirobots")].objects
	// giant robos
	this.giantRobosLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "Giantrobots")].objects
	// fire wheel robots
	this.fireWheelRobotsObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "FireWheelRobots")].objects
	// fly robots
	this.flyRobotsObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "FlyRobots")].objects
	// deuterium spheres
	this.deuteriumSphereObjLayerData = this.worldMap.objects[this.worldMap.objects.findIndex(x => x.name === "DeuteriumSpheres")].objects
}

Level0Scene.prototype.initControls = function() {	
	// constrols
	this.heroControls.key_RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
	this.heroControls.key_LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
	this.heroControls.key_JUMP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
	this.heroControls.key_FIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y)
	this.heroControls.key_USE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
}