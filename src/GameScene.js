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
		this.load.image('ground', 'assets/ground.png'); // Load the ground image
		this.load.image('platform', 'assets/platform.png'); // Load the platform image
	}

	create() {
		const { width, height } = this.scale;

		// Add background
		this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

		// Add ground
		const ground = this.physics.add.staticGroup();
		ground.create(width / 2, height - 32, 'ground').setDisplaySize(width, 64).refreshBody(); // Adjust the ground display size as needed

		// Add floating platforms with custom collision areas
		const platform1 = this.add.image(200, 600, 'platform'); // Lower this platform
		const platform2 = this.add.image(600, 400, 'platform'); // Lower this platform
		const platform3 = this.add.image(1000, 500, 'platform'); // Keep this platform the same

		// Enable physics on platforms and set custom collision areas
		this.physics.add.existing(platform1, true);
		this.physics.add.existing(platform2, true);
		this.physics.add.existing(platform3, true);

		// Set custom collision sizes (e.g., smaller than the image dimensions)
		platform1.body.setSize(250, 20).setOffset(0, 140);
		platform2.body.setSize(250, 20).setOffset(0, 140);
		platform3.body.setSize(250, 20).setOffset(0, 140);

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
		this.physics.add.collider(this.player, [platform1, platform2, platform3]);
		this.physics.add.collider(this.potions, ground);
		this.physics.add.collider(this.potions, [platform1, platform2, platform3]);
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
