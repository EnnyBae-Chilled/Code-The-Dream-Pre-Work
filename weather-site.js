document.getElementById('searchBtn').addEventListener('click', getWeather);

async function getWeather() {
    const location = document.getElementById('locationInput').value;
    const error404 = document.getElementById('error404');
    const container = document.querySelector('.container'); 
    const weatherBox = document.querySelector('.weather-box'); 
    const weatherDetails = document.querySelector('.weather-details'); 
    
    if (!location) return;

    // Convert location to latitude and longitude
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`);
    const geoData = await geoResponse.json();
    if (geoData.length === 0) {
        container.style.height = '400px';
        weatherBox.classList.remove('active');
        weatherDetails.classList.remove('active');
        error404.classList.add('active');
        return;
    }


    container.style.height = '555px';
    weatherBox.classList.add('active');
    weatherDetails.classList.add('active');
    error404.classList.remove('active');


    const latitude = geoData[0].lat;
    const longitude = geoData[0].lon;

    // Fetch weather data from Open-Meteo API
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
    const weatherData = await weatherResponse.json();
    const currentWeather = weatherData.current_weather;


    const timeZoneApiKey = 'BH8NON98ZZ62';
    const timeZoneResponse = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneApiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`);
    const timeZoneData = await timeZoneResponse.json();
    const timezone = timeZoneData.zoneName;

    updateWeatherUI(currentWeather, timezone);
}

function updateWeatherUI(weather, timezone) {
    document.getElementById("temperature").innerHTML = `${weather.temperature} <span>°C</span>`;
    document.getElementById('description').textContent = weather.weathercode_description;
    document.getElementById('timezone').textContent = `Time Zone: ${timezone}`;
    document.getElementById('windSpeed').textContent = `${weather.windspeed} Km/h`;


    // Determine if it's night time
    const localTime = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
    const hours = localTime.getHours();
    const isNightTime = hours >= 20 || hours < 6;

    const weatherIcon = document.getElementById('weatherIcon');
    switch (weather.weathercode) {
        case 0: // Clear sky
            weatherIcon.src = 'C:/Users/eniol/sun.png';
            break;
        case 1, 2, 3: // Mainly clear, partly cloudly
            weatherIcon.src = 'C:/Users/eniol/sun-behind-large-cloud.png';
            break;
        case 45, 48: // Fog
            weatherIcon.src = 'C:/Users/eniol/fog.png';
            break;
        case 51, 53, 55: // Light or moderate drizzle
            weatherIcon.src = 'C:/Users/eniol/cloud-with-rain.png';
            break;
        case 61, 63, 65, 66, 67: // Rain
            weatherIcon.src = 'C:/Users/eniol/rain.webp';
            break;
        case 71, 73, 75, 77: // Snow
            weatherIcon.src = 'C:/Users/eniol/cloud-with-snow.png';
            break;
        default:
            weatherIcon.src = 'C:/Users/eniol/sun-behind-large-cloud.png';
    }

    if (weather.weathercode == 0 && isNightTime) {
        weatherIcon.src = 'C:/Users/eniol/crescent-moon.png';
    } else {
        weatherIcon.src = getWeatherIcon(weather.weathercode);
    }
}

