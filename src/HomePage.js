import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './HomePage.css'; // Add CSS file for retro styling

const HomePage = ({ onPlay }) => {
	const [inputValue, setInputValue] = useState('');
	const [resolution, setResolution] = useState('SD');
	const [loading, setLoading] = useState(false);
	const [gameReady, setGameReady] = useState(false);
	const [assets, setAssets] = useState(null); // New state to hold the assets

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const handleResolutionChange = (e) => {
		setResolution(e.target.value);
	};

	const handlePlayClick = async () => {
		console.log('Play button clicked');
		console.log('Input Value:', inputValue);

		setLoading(true);

		// Map resolution names to API values
		const resolutionMap = {
			'SD': 'small',
			'HD': 'medium',
			'Full HD': 'large',
		};

		try {
			if (inputValue.trim() === '') {
				// Local background image scenario
				setLoading(false);
				setAssets({ localBackground: true }); // Store assets locally
				setGameReady(true);
			} else {
				// Fetch background from the internet
				const response = await axios.post(
					`${process.env.REACT_APP_API_ENDPOINT}/getImage/`,
					{
						prompt: inputValue,
						resolution: resolutionMap[resolution],
						content_weight: null,
						style_weight: null,
						num_steps: null
					},
					{
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					}
				);
				console.log('API response:', response.data);
				setLoading(false);
				setAssets(response.data); // Store fetched assets
				setGameReady(true);
			}
		} catch (error) {
			console.error('Error fetching assets:', error);
			setLoading(false);
			alert('Error preparing assets. Please try again.');
		}
	};

	const handleKeyPress = useCallback((event) => {
		if (gameReady) {
			setGameReady(false);
			window.removeEventListener('keydown', handleKeyPress);
			onPlay(assets); // Pass the stored assets to onPlay
		}
	}, [gameReady, onPlay, assets]);

	useEffect(() => {
		if (gameReady) {
			window.addEventListener('keydown', handleKeyPress);
		}
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [gameReady, handleKeyPress]);

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
					<div className="resolution-buttons">
						<label>
							<input
								type="radio"
								value="SD"
								checked={resolution === 'SD'}
								onChange={handleResolutionChange}
							/>
							<span className="retro-button">SD</span>
						</label>
						<label>
							<input
								type="radio"
								value="HD"
								checked={resolution === 'HD'}
								onChange={handleResolutionChange}
							/>
							<span className="retro-button">HD</span>
						</label>
						<label>
							<input
								type="radio"
								value="Full HD"
								checked={resolution === 'Full HD'}
								onChange={handleResolutionChange}
							/>
							<span className="retro-button">Full HD</span>
						</label>
					</div>
					<button className="play-button" onClick={handlePlayClick}>Play</button>
				</>
			)}
		</div>
	);
};

export default HomePage;
