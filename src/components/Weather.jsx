import React, { useState, useEffect } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import rain_icon from '../assets/rain.png';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [query, setQuery] = useState('');

  const allIcons = {
    "01d": clear_icon, "01n": clear_icon,
    "02d": cloud_icon, "02n": cloud_icon,
    "03d": cloud_icon, "03n": cloud_icon,
    "04d": cloud_icon, "04n": cloud_icon,
    "09d": drizzle_icon, "09n": drizzle_icon,
    "10d": rain_icon, "10n": rain_icon,
    "11d": rain_icon, "11n": rain_icon,
    "13d": snow_icon, "13n": snow_icon,
  };

  const search = async (city) => {
    if (!city) return;
    const apiKey = import.meta.env.VITE_APP_ID;
    console.log('API key (debug):', apiKey); // cek apakah terbaca
    if (!apiKey) {
      console.error('Missing VITE_APP_ID in env (restart dev server after editing .env)');
      return;
    }

    try {
      const q = encodeURIComponent(city);
      // pastikan tidak ada newline/spasi aneh di sini
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log('OpenWeather response:', response.status, data);

      if (!response.ok) {
        // contoh: 401 invalid api key, 404 city not found
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      const icon = allIcons[data?.weather?.[0]?.icon] || clear_icon;
      setWeatherData({
        humidity: data?.main?.humidity ?? '-',
        windSpeed: data?.wind?.speed ?? '-',
        temperature: Math.round(data?.main?.temp ?? 0),
        location: data?.name ? `${data.name}${data.sys?.country ? ', ' + data.sys.country : ''}` : 'Unknown',
        icon,
      });
    } catch (err) {
      console.error('Fetch error:', err);
      setWeatherData(null);
    }
  };

  useEffect(() => {
    search('New York');
  }, []);

  return (
    <div className='weather'>
      <div className="search-bar">
        <input
          type="text"
          placeholder='Search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') search(query); }}
        />
        <img src={search_icon} alt="search" onClick={() => search(query)} style={{cursor:'pointer'}} />
      </div>

      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="weather" className='weather-icon' />
          <p className='temperature'>{weatherData.temperature}°C</p>
          <p className='location'>{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="wind" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p style={{textAlign:'center'}}>No data — try searching a city</p>
      )}
    </div>
  );
};

export default Weather;
