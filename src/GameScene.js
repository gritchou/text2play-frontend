import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameScene' });
	}

	preload() {
		const { assets } = this.scene.settings.data;
		this.load.image('background', `data:image/jpeg;base64,${assets.stylized_image}`);
		this.load.image('mage', 'assets/mage.png');
		this.load.image('potion', 'assets/potion.png');
		this.load.image('ground', 'assets/ground.png');
		this.load.image('platform', 'assets/platform.png');
	}

	create() {
		const { width, height } = this.scale;

		// Add background
		this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

		// Add ground
		const ground = this.physics.add.staticGroup();
		ground.create(width / 2, height - 32, 'ground').setDisplaySize(width, 64).refreshBody(); // Adjust the ground display size as needed

		// Add floating platforms
		const floatingPlatforms = this.physics.add.staticGroup();
		floatingPlatforms.create(200, 400, 'platform');
		floatingPlatforms.create(600, 300, 'platform');
		floatingPlatforms.create(1000, 400, 'platform');

		// Add potions
		this.potions = this.physics.add.group({
			key: 'potion',
			repeat: 5,
			setXY: { x: 150, y: 0, stepX: 300 }
		});

		this.potions.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
			child.setCollideWorldBounds(true);
		});

		// Add player
		this.player = this.physics.add.sprite(100, height - 150, 'mage');
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		this.cursors = this.input.keyboard.createCursorKeys();
		this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		// Collisions
		this.physics.add.collider(this.player, ground);
		this.physics.add.collider(this.player, floatingPlatforms);
		this.physics.add.collider(this.potions, ground);
		this.physics.add.collider(this.potions, floatingPlatforms);
		this.physics.add.collider(this.player, this.potions, this.collectPotion, null, this);
	}

	update() {
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-240); // Increase velocity for faster movement
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(240); // Increase velocity for faster movement
		} else {
			this.player.setVelocityX(0);
		}

		if ((this.cursors.up.isDown || this.spaceBar.isDown) && this.player.body.touching.down) {
			this.player.setVelocityY(-430); // Increase jump velocity
		}
	}

	collectPotion(player, potion) {
		potion.disableBody(true, true);
	}
}
