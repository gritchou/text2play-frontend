import React, { useState } from 'react';
import HomePage from './HomePage';
import GamePage from './GamePage';
import './App.css';

const App = () => {
	const [description, setDescription] = useState('');
	const [showGame, setShowGame] = useState(false);

	const handlePlay = (inputValue) => {
		console.log('Transitioning to GamePage with description:', inputValue); // Add this log
		setDescription(inputValue);
		setShowGame(true);
	};

	return (
		<div className="App">
			{showGame ? <GamePage description={description} /> : <HomePage onPlay={handlePlay} />}
		</div>
	);
};

export default App;
