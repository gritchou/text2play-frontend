import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import axios from 'axios';

const GamePage = ({ description }) => {
	const [loading, setLoading] = useState(true);
	const [assets, setAssets] = useState(null);

	useEffect(() => {
		console.log('API endpoint:', process.env.REACT_APP_API_ENDPOINT);

		const fetchAssets = async () => {
			console.log('Calling API with description:', description);
			try {
				const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/getImage/`, { prompt: description });
				console.log('API response:', response.data);
				setAssets(response.data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching assets:', error);
				setLoading(false);
			}
		};

		fetchAssets();
	}, [description]);

	useEffect(() => {
		if (!loading && assets) {
			console.log('Loading game with assets:', assets);

			const config = {
				type: Phaser.AUTO,
				width: 800,
				height: 600,
				physics: {
					default: 'arcade',
					arcade: {
						gravity: { y: 300 },
						debug: false,
					},
				},
				scene: {
					preload: preload,
					create: create,
					update: update,
				},
			};

			const game = new Phaser.Game(config);

			function preload() {
				const stylizedImageDataUrl = `data:image/jpeg;base64,${assets.stylized_image}`;
				console.log('Loading stylized image:', stylizedImageDataUrl);

				this.load.image('stylizedImage', stylizedImageDataUrl);
				this.load.image('coin', 'path/to/your/coin/image.png');
				this.load.spritesheet('mario', 'path/to/your/mario/spritesheet.png', {
					frameWidth: 32,
					frameHeight: 48,
				});
			}

			function create() {
				this.add.image(400, 300, 'stylizedImage');

				const coins = this.physics.add.group({
					key: 'coin',
					repeat: 11,
					setXY: { x: 12, y: 0, stepX: 70 },
				});

				coins.children.iterate(function (child) {
					child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
				});

				this.player = this.physics.add.sprite(100, 450, 'mario');
				this.player.setBounce(0.2);
				this.player.setCollideWorldBounds(true);

				this.anims.create({
					key: 'left',
					frames: this.anims.generateFrameNumbers('mario', { start: 0, end: 3 }),
					frameRate: 10,
					repeat: -1,
				});

				this.anims.create({
					key: 'turn',
					frames: [{ key: 'mario', frame: 4 }],
					frameRate: 20,
				});

				this.anims.create({
					key: 'right',
					frames: this.anims.generateFrameNumbers('mario', { start: 5, end: 8 }),
					frameRate: 10,
					repeat: -1,
				});

				this.cursors = this.input.keyboard.createCursorKeys();

				this.physics.add.collider(this.player, coins, collectCoin, null, this);
			}

			function update() {
				if (this.cursors.left.isDown) {
					this.player.setVelocityX(-160);
					this.player.anims.play('left', true);
				} else if (this.cursors.right.isDown) {
					this.player.setVelocityX(160);
					this.player.anims.play('right', true);
				} else {
					this.player.setVelocityX(0);
					this.player.anims.play('turn');
				}

				if (this.cursors.up.isDown && this.player.body.touching.down) {
					this.player.setVelocityY(-330);
				}
			}

			function collectCoin(player, coin) {
				coin.disableBody(true, true);
			}
		}
	}, [loading, assets]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return <div id="game-container" />;
};

export default GamePage;
