import React, { useState } from 'react';

const HomePage = ({ onPlay }) => {
	const [inputValue, setInputValue] = useState('');

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const handlePlayClick = () => {
		console.log('Play button clicked');
		console.log('Input Value:', inputValue);
		onPlay(inputValue);
	};

	return (
		<div className="home-page">
			<h1>Welcome to the Game</h1>
			<label htmlFor="description-input">Enter a description:</label>
			<input
				type="text"
				id="description-input"
				value={inputValue}
				onChange={handleInputChange}
				placeholder="Enter description here..."
			/>
			<button onClick={handlePlayClick}>Play</button>
		</div>
	);
};

export default HomePage;
