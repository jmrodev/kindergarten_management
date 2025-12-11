import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplet, Eye, Thermometer, CloudSun, BarChart } from 'react-bootstrap-icons';

const WeatherReport = ({ latitude = -34.6037, longitude = -58.3816 }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current weather data
        const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,wind_direction_10m,weather_code&temperature_unit=celsius&windspeed_unit=kmh&timeformat=iso8601`;
        
        const currentResponse = await fetch(currentUrl);
        if (!currentResponse.ok) {
          throw new Error(`Error fetching current weather: ${currentResponse.status}`);
        }
        
        const currentData = await currentResponse.json();

        // Fetch daily forecast (next 7 days)
        const dailyUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&temperature_unit=celsius&windspeed_unit=kmh&timezone=auto&timeformat=iso8601`;
        
        const dailyResponse = await fetch(dailyUrl);
        if (!dailyResponse.ok) {
          throw new Error(`Error fetching daily forecast: ${dailyResponse.status}`);
        }
        
        const dailyData = await dailyResponse.json();


        setWeatherData({
          current: currentData.current,
          daily: dailyData.daily,
          hourly: currentData.hourly
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();

    // Refresh every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [latitude, longitude]);

  const getWeatherIcon = (weathercode, isDay = 1) => {
    // OpenMeteo weather codes
    switch (weathercode) {
      case 0: // Clear sky
        return isDay ? <Sun className="weather-icon clear-sky" /> : <Sun className="weather-icon clear-sky" />;
      case 1: // Mainly clear
      case 2: // Partly cloudy
        return <CloudSun className="weather-icon partly-cloudy" />;
      case 3: // Overcast
        return <Cloud className="weather-icon cloudy" />;
      case 45: // Fog
      case 48: // Depositing rime fog
        return <Eye className="weather-icon fog" />;
      case 51: // Light drizzle
      case 53: // Moderate drizzle
      case 55: // Dense drizzle
      case 61: // Slight rain
      case 63: // Moderate rain
      case 65: // Heavy rain
        return <CloudRain className="weather-icon rainy" />;
      case 71: // Slight snow
      case 73: // Moderate snow
      case 75: // Heavy snow
      case 77: // Snow grains
        return <CloudSnow className="weather-icon snowy" />;
      case 80: // Slight rain showers
      case 81: // Moderate rain showers
      case 82: // Violent rain showers
        return <CloudRain className="weather-icon rainy" />;
      case 85: // Slight snow showers
      case 86: // Heavy snow showers
        return <CloudSnow className="weather-icon snowy" />;
      case 95: // Thunderstorm
      case 96: // Thunderstorm with slight hail
      case 99: // Thunderstorm with heavy hail
        return <CloudRain className="weather-icon stormy" />;
      default:
        return <Cloud className="weather-icon default" />;
    }
  };

  const getWeatherBackgroundClass = (weathercode) => {
    // OpenMeteo weather codes with corresponding background classes
    switch (weathercode) {
      case 0: // Clear sky
        return 'weather-clear-sky';
      case 1: // Mainly clear
        return 'weather-partly-cloudy';
      case 2: // Partly cloudy
        return 'weather-partly-cloudy';
      case 3: // Overcast
        return 'weather-cloudy';
      case 45: // Fog
        return 'weather-fog';
      case 48: // Depositing rime fog
        return 'weather-fog';
      case 51: // Light drizzle
        return 'weather-rainy';
      case 53: // Moderate drizzle
        return 'weather-rainy';
      case 55: // Dense drizzle
        return 'weather-rainy';
      case 61: // Slight rain
        return 'weather-rainy';
      case 63: // Moderate rain
        return 'weather-rainy';
      case 65: // Heavy rain
        return 'weather-rainy';
      case 80: // Slight rain showers
        return 'weather-rainy';
      case 81: // Moderate rain showers
        return 'weather-rainy';
      case 82: // Violent rain showers
        return 'weather-rainy';
      case 71: // Slight snow
        return 'weather-snowy';
      case 73: // Moderate snow
        return 'weather-snowy';
      case 75: // Heavy snow
        return 'weather-snowy';
      case 77: // Snow grains
        return 'weather-snowy';
      case 85: // Slight snow showers
        return 'weather-snowy';
      case 86: // Heavy snow showers
        return 'weather-snowy';
      case 95: // Thunderstorm
        return 'weather-stormy';
      case 96: // Thunderstorm with slight hail
        return 'weather-stormy';
      case 99: // Thunderstorm with heavy hail
        return 'weather-stormy';
      default:
        return 'weather-default';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      weekday: 'short',
      day: 'numeric'
    });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    const index = Math.round(degrees / (360 / directions.length)) % directions.length;
    return directions[index];
  };

  if (loading) {
    return (
      <div className="weather-report-card weather-default">
        <div className="weather-header">
          <h5><CloudSun size={20} /> Clima</h5>
        </div>
        <div className="weather-loading">
          <div className="spinner" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <span>Cargando información meteorológica...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-report-card weather-default">
        <div className="weather-header">
          <h5><CloudSun size={20} /> Clima</h5>
        </div>
        <div className="weather-error alert alert-warning">
          <small>Error al cargar la información meteorológica: {error}</small>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather-report-card weather-default">
        <div className="weather-header">
          <h5><CloudSun size={20} /> Clima</h5>
        </div>
        <div className="weather-empty">
          <small>No hay datos meteorológicos disponibles</small>
        </div>
      </div>
    );
  }

  const { current, daily } = weatherData;

  // Determine background class based on current weather
  const weatherBackgroundClass = getWeatherBackgroundClass(current.weather_code);

  return (
    <div className={`weather-report-card ${weatherBackgroundClass}`}>
      <div className="weather-header">
        <h5><CloudSun size={20} /> Clima</h5>
      </div>
      
      {/* Current Weather */}
      <div className="current-weather">
        <div className="current-main">
          <div className="weather-icon-large">
            {getWeatherIcon(current.weather_code, 1)}
          </div>
          <div className="current-temp">
            <div className="temp-value">{Math.round(current.temperature_2m)}°</div>
            <div className="temp-feels-like">Sensación térmica {Math.round(current.apparent_temperature)}°</div>
          </div>
        </div>
        
        <div className="current-details">
          <div className="detail-item">
            <Thermometer size={16} className="detail-icon" />
            <div className="detail-text">
              <div>Mín: {Math.round(daily.temperature_2m_min[0])}°</div>
              <div>Max: {Math.round(daily.temperature_2m_max[0])}°</div>
            </div>
          </div>
          <div className="detail-item">
            <Droplet size={16} className="detail-icon" />
            <div className="detail-text">
              <div>Humedad: {current.relative_humidity_2m}%</div>
            </div>
          </div>
          <div className="detail-item">
            <Wind size={16} className="detail-icon" />
            <div className="detail-text">
              <div>Viento: {current.wind_speed_10m} km/h</div>
              <div>{getWindDirection(current.wind_direction_10m)}°</div>
            </div>
          </div>
          <div className="detail-item">
            <BarChart size={16} className="detail-icon" />
            <div className="detail-text">
              <div>Presión: {current.pressure_msl} hPa</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-day Forecast */}
      <div className="forecast-section">
        <h6>Pronóstico 7 días</h6>
        <div className="forecast-grid">
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <div key={dayIndex} className="forecast-day">
              <div className="forecast-date">
                {formatDate(daily.time[dayIndex])}
              </div>
              <div className="forecast-icon">
                {getWeatherIcon(daily.weather_code[dayIndex])}
              </div>
              <div className="forecast-temp">
                <span className="temp-max">{Math.round(daily.temperature_2m_max[dayIndex])}°</span>
                <span className="temp-min">{Math.round(daily.temperature_2m_min[dayIndex])}°</span>
              </div>
              <div className="forecast-rain">
                {daily.precipitation_probability_max[dayIndex]}% precip.
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="weather-footer">
        <small>Actualizado a las {new Date().toLocaleTimeString('es-AR')}</small>
      </div>
    </div>
  );
};

export default WeatherReport;