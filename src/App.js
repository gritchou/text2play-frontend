import React, { useState } from 'react';
import HomePage from './HomePage';
import GamePage from './GamePage';
import './App.css';

const App = () => {
	const [assets, setAssets] = useState(null);
	const [showGame, setShowGame] = useState(false);

	const handlePlay = (apiResponse) => {
		console.log('Transitioning to GamePage with assets:', apiResponse);
		setAssets(apiResponse);
		setShowGame(true);
	};

	return (
		<div className="App">
			{showGame ? <GamePage assets={assets} /> : <HomePage onPlay={handlePlay} />}
		</div>
	);
};

export default App;
