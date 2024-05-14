import React, { useEffect } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';

const GamePage = ({ assets }) => {
	useEffect(() => {
		const config = {
			type: Phaser.AUTO,
			width: 1920,
			height: 1080,
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 300 },
					debug: false,
				},
			},
			scene: [GameScene],
		};

		const game = new Phaser.Game(config);
		game.scene.start('GameScene', { assets: assets });

		return () => {
			game.destroy(true);
		};
	}, [assets]);

	return <div id="game-container" />;
};

export default GamePage;
