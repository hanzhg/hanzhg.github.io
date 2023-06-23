import { useEffect, useState } from "react";

export default function Weather() {
	const [weatherTemperature, setWeatherTemperature] = useState(null);

	useEffect(() => {
		const fetchWeatherData = async () => {
			try {
				const latitude = '45.503193';
				const longitude = '-73.569809';
				const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=EST&elevation=0`;

				const response = await fetch(apiUrl);
				const data = await response.json();

				const temperature = data?.current_weather?.temperature;
				setWeatherTemperature(temperature);
			} catch (error) {
				setWeatherTemperature(false);
			}
		};

		fetchWeatherData();

		const interval = setInterval(fetchWeatherData, 60 * 60 * 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div id="text">
			{weatherTemperature ? `${weatherTemperature}°C` : 'Loading weather data...'}
		</div>
	);
}

