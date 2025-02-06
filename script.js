let cityInput = document.getElementById('city-input'),
    searchBtn = document.getElementById('searchBtn'),
    locationBtn = document.getElementById('locationBtn'),
    favoriteBtn = document.getElementById('favoriteBtn'),
    favoritesContainer = document.querySelector('.favorites'),
    api_key = 'd38860a0b65e51579e110ea108ab41c4',
    currentWeatherCard = document.querySelector('.weather-left .card'),
    fiveDaysForecastCard = document.querySelector('.day-forecast'),
    aqiCard = document.querySelectorAll('.highlights .card')[0],
    sunriseCard = document.querySelectorAll('.highlights .card')[1],
    humidityVal = document.getElementById('humidityVal'),
    pressureVal = document.getElementById('pressureVal'),
    visibilityVal = document.getElementById('visibilityVal'),
    windspeedVal = document.getElementById('windspeedVal'),
    feelsVal = document.getElementById('feelsVal'),
    hourlyForecastCard = document.querySelector('.hourly-forecast'),
    aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to save favorites to localStorage
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to add a city to favorites
function addFavorite(city) {
    if (!favorites.includes(city)) {
        favorites.push(city);
        saveFavorites();
        displayFavorites();
    }
}

// Function to remove a city from favorites
function removeFavorite(city) {
    favorites = favorites.filter(fav => fav !== city);
    saveFavorites();
    displayFavorites();
}

// Function to display favorites
function displayFavorites() {
    favoritesContainer.innerHTML = '';
    favorites.forEach((city, index) => {
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`)
            .then(res => res.json())
            .then(data => {
                let { lat, lon } = data[0];
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
                    .then(res => res.json())
                    .then(weatherData => {
                        let favoriteItem = document.createElement('div');
                        favoriteItem.classList.add('card');
                        favoriteItem.innerHTML = `
                            <p>${city}</p>
                            <img src="${getAmChartsIconPath(weatherData.weather[0].icon)}" alt="${weatherData.weather[0].description}">
                            <p>${(weatherData.main.temp - 273.15).toFixed(2)}°C</p>
                            <button class="remove-btn" onclick="removeFavorite('${city}')">X</button>
                        `;
                        favoritesContainer.appendChild(favoriteItem);
                    });
            });
    });
}
// Function to update the star icon based on whether the city is favorited
function updateStarIcon(city) {
    let favoriteStar = document.querySelector('.favorite-star');
    if (favorites.includes(city)) {
        favoriteStar.classList.add('favorited');
    } else {
        favoriteStar.classList.remove('favorited');
    }
}

// Function to map OpenWeatherMap icons to amCharts SVG icons
function getAmChartsIconPath(iconCode) {
    const iconMap = {
        '01d': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/day.svg',       // Clear sky (day)
        '01n': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/night.svg',    // Clear sky (night)
        '02d': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy-day-1.svg', // Few clouds (day)
        '02n': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy-night-1.svg', // Few clouds (night)
        '03d': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy.svg',   // Scattered clouds
        '03n': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy.svg',
        '04d': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy.svg',   // Broken clouds
        '04n': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy.svg',
        '09d': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-6.svg',  // Shower rain
        '09n': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-6.svg',
        '10d': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-4.svg',  // Rain (day)
        '10n': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-4.svg',  // Rain (night)
        '11d': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/thunder.svg',  // Thunderstorm
        '11n': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/thunder.svg',
        '13d': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/snowy-6.svg',  // Snow
        '13n': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/snowy-6.svg',
        '50d': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy.svg',   // Fog
        '50n': 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy.svg'
    };
    return iconMap[iconCode] || 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/cloudy.svg'; // Default to cloudy icon
}

// Function to fetch and display weather details
function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
        AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
        let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
        aqiCard.innerHTML = `
            <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class="fa-regular fa-wind fa-3x"></i>
                <div class="item">
                    <p>PM2.5</p>
                    <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                    <p>PM10</p>
                    <h2>${pm10}</h2>
                </div>
                <div class="item">
                    <p>SO2</p>
                    <h2>${so2}</h2>
                </div>
                <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                </div>
                <div class="item">
                    <p>NO</p>
                    <h2>${no}</h2>
                </div>
                <div class="item">
                    <p>NO2</p>
                    <h2>${no2}</h2>
                </div>
                <div class="item">
                    <p>NH3</p>
                    <h2>${nh3}</h2>
                </div>
                <div class="item">
                    <p>O3</p>
                    <h2>${o3}</h2>
                </div>
            </div>
        `;
    }).catch(() => {
        alert("Failed to fetch air quality");
    });

    fetch(WEATHER_API_URL)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch weather data');
            return res.json();
        })
        .then(data => {
            let date = new Date();
            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="${getAmChartsIconPath(data.weather[0].icon)}" alt="${data.weather[0].description}" style="width: 100px; height: 100px;">
                    </div>
                    <i class="fa-regular fa-star favorite-star"></i>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-light fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                    <p><i class="fa-light fa-location-dot"></i>${name}, ${country}</p>
                </div>
            `;
            updateStarIcon(name);

            let favoriteStar = document.querySelector('.favorite-star');
            favoriteStar.addEventListener('click', () => {
                let city = document.querySelector('.card-footer p:nth-child(2)').textContent.split(',')[0].trim();
                if (!favorites.includes(city)) {
                    addFavorite(city);
                    updateStarIcon(city);
                } else {
                    removeFavorite(city);
                    updateStarIcon(city);
                }
            });

            let { sunrise, sunset } = data.sys,
                { timezone, visibility } = data,
                { humidity, pressure, feels_like } = data.main,
                { speed } = data.wind,
                sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
                sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');
            sunriseCard.innerHTML = `
                <div class="card-head">
                    <p>Sunrise & Sunset</p>
                </div>
                <div class="sunrise-sunset">
                    <div class="item">
                        <div class="icon">
                            <i class="fa-light fa-sunrise fa-4x"></i>
                        </div>
                        <div>
                            <p>Sunrise</p>
                            <h2>${sRiseTime}</h2>
                        </div>
                    </div>
                    <div class="item">
                        <div class="icon">
                            <i class="fa-light fa-sunset fa-4x"></i>
                        </div>
                        <div>
                            <p>Sunset</p>
                            <h2>${sSetTime}</h2>
                        </div>
                    </div>
                </div>
            `;
            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure}hPa`;
            visibilityVal.innerHTML = `${visibility / 1000}km`;
            windspeedVal.innerHTML = `${speed}m/s`;
            feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
        }).catch(() => {
            alert('Failed to fetch the current weather');
        });

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        let hourlyForecast = data.list;
        hourlyForecastCard.innerHTML = '';
        for (let i = 0; i <= 7; i++) {
            let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
            let hr = hrForecastDate.getHours();
            let a = 'PM';
            if (hr < 12) a = 'AM';
            if (hr == 0) hr = 12;
            if (hr > 12) hr = hr - 12;
            hourlyForecastCard.innerHTML += `
                <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="${getAmChartsIconPath(hourlyForecast[i].weather[0].icon)}" alt="${hourlyForecast[i].weather[0].description}" style="width: 50px; height: 50px;">
                    <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
            `;
        }
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });
        fiveDaysForecastCard.innerHTML = '';
        for (let i = 1; i < fiveDaysForecast.length; i++) {
            let date = new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="${getAmChartsIconPath(fiveDaysForecast[i].weather[0].icon)}" alt="${fiveDaysForecast[i].weather[0].description}" style="width: 50px; height: 50px;">
                        <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
            `;
        }
    }).catch(() => {
        alert('Failed to fetch weather Forecast');
    });
}

// Function to get city coordinates
function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;

    let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

    fetch(GEOCODING_API_URL)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch city coordinates');
            return res.json();
        })
        .then(data => {
            if (data.length === 0) throw new Error('City not found');
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(() => {
            alert(`Failed to fetch coordinates of ${cityName}`);
        });
}

// Function to get user coordinates
function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let { latitude, longitude } = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            let { name, country, state } = data[0];
            getWeatherDetails(name, latitude, longitude, country, state);
        }).catch(() => {
            alert("Failed to fetch user coordinates");
        });
    }, error => {
        if (error.code === error.PERMISSION_DENIED) {
            alert('Geolocation permission denied. Please reset location permission to grant access again');
        }
    });
}

// Event listeners
searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinates);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getCityCoordinates();
        displayFavorites();
    }
});

// Initial display of favorites
displayFavorites();