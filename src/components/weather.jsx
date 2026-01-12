import { useEffect, useState, useMemo } from "react";

// Optimized lookup map where the weather code is the key
const weatherCodeMap = {
    0: { icon: "☀️/🌙", isDayDependent: true },
    1: { icon: "🌤️" },
    2: { icon: "⛅" },
    3: { icon: "☁️" },
    45: { icon: "🌫️" },
    48: { icon: "🌫️" },
    51: { icon: "🌦️" },
    53: { icon: "🌦️" },
    55: { icon: "🌧️" },
    61: { icon: "🌧️" },
    63: { icon: "🌧️" },
    65: { icon: "🌧️" },
    71: { icon: "🌨️" },
    73: { icon: "🌨️" },
    75: { icon: "❄️" },
    80: { icon: "🌧️" },
    81: { icon: "🌧️" },
    82: { icon: "⛈️" },
    95: { icon: "⛈️" },
    96: { icon: "⛈️" },
    99: { icon: "⛈️" },
};

const getWeatherIcon = (code, isDay) => {
    const weather = weatherCodeMap[code];
    if (!weather) return "❓";
    if (weather.isDayDependent) return isDay ? "☀️" : "🌙";
    return weather.icon;
};

export default function Weather() {
    const [weatherState, setWeatherState] = useState({
        temperature: null,
        weatherCode: null,
        isDay: true,
        error: false
    });

    useEffect(() => {
        const controller = new AbortController();

        const fetchWeather = async () => {
            try {
                const lat = "45.503193",
                    lon = "-73.569809";
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=EST&elevation=0`,
                    { signal: controller.signal }
                );
                const data = await res.json();
                setWeatherState({
                    temperature: data?.current_weather?.temperature ?? null,
                    weatherCode: data?.current_weather?.weathercode ?? null,
                    isDay: data?.current_weather?.is_day === 1,
                    error: false
                });
            } catch (error) {
                if (error.name === 'AbortError') return;
                setWeatherState({
                    temperature: null,
                    weatherCode: null,
                    isDay: true,
                    error: true
                });
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 60 * 60 * 1000);
        return () => {
            clearInterval(interval);
            controller.abort();
        };
    }, []);

    return (
        <div>
            Montréal, QC,{" "}
            {!weatherState.error && weatherState.temperature !== null
                ? `${weatherState.temperature}°C ${getWeatherIcon(weatherState.weatherCode, weatherState.isDay)}`
                : "Loading weather data..."}
        </div>
    );
}
