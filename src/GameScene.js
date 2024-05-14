import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: 'GameScene' });
	}

	init(data) {
		this.assets = data.assets;
	}

	preload() {
		this.load.image('background', this.assets.background_url);
		this.load.image('mage', this.assets.mage_url);
		this.load.image('potion', this.assets.potion_url);
	}

	create() {
		this.add.image(960, 540, 'background');

		const potions = this.physics.add.group({
			key: 'potion',
			repeat: 5,
			setXY: { x: 12, y: 0, stepX: 70 },
		});

		potions.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});

		this.player = this.physics.add.sprite(100, 450, 'mage');
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update() {
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-160);
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(160);
		} else {
			this.player.setVelocityX(0);
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-330);
		}
	}
}
