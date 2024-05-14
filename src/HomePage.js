import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = ({ onPlay }) => {
	const [inputValue, setInputValue] = useState('');
	const [loading, setLoading] = useState(false);
	const [gameReady, setGameReady] = useState(false);

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const handlePlayClick = async () => {
		console.log('Play button clicked');
		console.log('Input Value:', inputValue);

		setLoading(true);

		try {
			const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/getImage/`, { prompt: inputValue });
			console.log('API response:', response.data);
			setLoading(false);
			setGameReady(true);

			// Pass the response data to the GamePage component
			onPlay(response.data);
		} catch (error) {
			console.error('Error fetching assets:', error);
			setLoading(false);
			alert('Error preparing assets. Please try again.');
		}
	};

	const handleKeyPress = () => {
		if (gameReady) {
			setGameReady(false);
			window.removeEventListener('keydown', handleKeyPress);
		}
	};

	useEffect(() => {
		if (gameReady) {
			window.addEventListener('keydown', handleKeyPress);
		} else {
			window.removeEventListener('keydown', handleKeyPress);
		}

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [gameReady]);

	return (
		<div className="home-page">
			<h1>Text2Play</h1>
			{loading ? (
				<p>Preparing assets...</p>
			) : gameReady ? (
				<p>Game is ready, press any key to play</p>
			) : (
				<>
					<input
						type="text"
						id="description-input"
						value={inputValue}
						onChange={handleInputChange}
						placeholder="Enter description here..."
					/>
					<button onClick={handlePlayClick}>Play</button>
				</>
			)}
		</div>
	);
};

export default HomePage;
