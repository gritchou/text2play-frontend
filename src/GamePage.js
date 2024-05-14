import React, { useEffect } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';

const GamePage = ({ assets }) => {
	useEffect(() => {
		const config = {
			type: Phaser.AUTO,
			width: '100%',
			height: '100%',
			scale: {
				mode: Phaser.Scale.RESIZE,
				autoCenter: Phaser.Scale.CENTER_BOTH,
			},
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 300 },
					debug: false,
				},
			},
			scene: [GameScene],
			parent: 'game-container',
		};

		const game = new Phaser.Game(config);
		game.scene.start('GameScene', { assets });

		return () => {
			game.destroy(true);
		};
	}, [assets]);

	return <div id="game-container" style={{ width: '100vw', height: '100vh' }} />;
};

export default GamePage;
