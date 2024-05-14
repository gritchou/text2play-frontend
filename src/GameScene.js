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
	}

	create() {
		const { width, height } = this.scale;
		this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

		this.potions = this.physics.add.group({
			key: 'potion',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		});

		this.potions.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});

		this.player = this.physics.add.sprite(100, 450, 'mage');
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(this.player, this.potions, this.collectPotion, null, this);
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

	collectPotion(player, potion) {
		potion.disableBody(true, true);
	}
}
