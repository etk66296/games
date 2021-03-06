class TouchButton extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, frame, ctrlSwitch, justDown, allowJam, buttonScale = 1.0) {
		super(scene, x, y, 'controlButtonsAtlas', frame)
		scene.add.existing(this)
		this.ctrlSwitch = ctrlSwitch
		this.nonePressedFrame = frame
		this.buttonScale = buttonScale
		this.downTime = 0
		this.allowedDownTime = 200
		this.allowJam = allowJam
		this.updateCounter
		this.justDown = justDown
		this.justDownCounter = 0
	}
	setup() {
		this.setName(this.nonePressedFrame)
		this.setInteractive()
		this.setDepth(102)
		this.setScrollFactor(0,0)
		this.setScale(this.buttonScale)
		this.on('pointerdown', () => {
			this.ctrlSwitch.isDown = true
			this.downTime = 0
			this.setFrame(this.nonePressedFrame + 'Pressed')
		})
		this.on('pointerup', () => {
			this.ctrlSwitch.isDown = false
			this.setFrame(this.nonePressedFrame)
		})
	}
	preUpdate (time, delta) {
		if (!this.allowJam) {
			if(this.ctrlSwitch) {
				this.downTime += delta
				if (this.downTime >= this.allowedDownTime) {
					this.ctrlSwitch.isDown = false
					this.setFrame(this.nonePressedFrame)
				}
			}
		}

		// some touch buttons have to trigger just one time after they are down
		if (this.justDown && this.ctrlSwitch.isDown) {
			this.justDownCounter += 1 
			if (this.justDownCounter >= 2) {
				this.justDownCounter = 0
				this.ctrlSwitch.isDown = false
			}
		}
	}
}
class Controls extends Phaser.GameObjects.Group {
  constructor (scene) {
		super(scene.physics.world, scene)
		this.key_RIGHT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, false, false)
		this.key_LEFT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, false, false)
		this.key_JUMP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT, false, false)
		this.key_FIRE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y, false, false)
		this.key_USE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, true, false)

		this.touch_USE = { isDown: false }
		this.touch_RIGHT = { isDown: false }
		this.touch_LEFT = { isDown: false }
		this.touch_JUMP = { isDown: false }
		this.touch_FIRE = { isDown: false }
	
		scene.input.addPointer(5)
		this.add(new TouchButton(scene, 418, 145, 'UseButton', this.touch_USE, false, true, 0.6))
		this.add(new TouchButton(scene, 70, 240, 'RArrowButton', this.touch_RIGHT, false, true))
		this.add(new TouchButton(scene, 35, 180, 'LArrowButton', this.touch_LEFT, false, true))
		this.add(new TouchButton(scene, 430, 240, 'AButton', this.touch_JUMP, true, false))
		this.add(new TouchButton(scene, 465, 180, 'BButton', this.touch_FIRE, true, false))

		this.gunPowerAmount = 1
		this.gunPowerTxtObj = scene.add.text(
			480,
			95,
			String(this.gunPowerAmount),
			{
				fontFamily: 'Arial',
				fontSize: 16, color: '#FFFFFF'
			}
		)
		this.gunPowerTxtObj.setScrollFactor(0, 0)
		this.gunPowerTxtObj.setDepth(102)

		this.collectedPointsTxtObj = scene.add.text(
			405,
			54,
			String(0),
			{
				fontFamily: 'Arial',
				fontSize: 16, color: '#FFFFFF'
			}
		)
		this.collectedPointsTxtObj.setScrollFactor(0, 0)
		this.collectedPointsTxtObj.setDepth(102)

		return this
	}
	setup() {
		this.setName('ControlsGroup')
		this.children.iterate( button => {
			button.setup()
		})
	}
	release() {
		this.touch_USE.isDown = false
		this.touch_RIGHT.isDown = false
		this.touch_LEFT.isDown = false
		this.touch_JUMP.isDown = false
		this.touch_FIRE.isDown = false
		this.key_RIGHT.isDown = false
		this.key_LEFT.isDown = false
		this.key_JUMP.isDown = false
		this.key_FIRE.isDown = false
		this.key_USE.isDown = false
	}
	upgradeGunPower() {
		this.gunPowerAmount += 1
		this.gunPowerTxtObj.setText(String(this.gunPowerAmount))
	}
	updatePointDsp(amount) {
		this.collectedPointsTxtObj.setText(String(amount))
	}
}