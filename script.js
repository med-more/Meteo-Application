let cityInput = document.getElementById('city-input'),
searchBtn = document.getElementById('searchBtn'),
api_key = 'd38860a0b65e51579e110ea108ab41c4',
currentWeatherCard = document.querySelector('.weather-left .card');
fiveDaysForecastCard = document.querySelector('.day-forecast');
aqiCard = document.querySelectorAll('.highlights .card')[0],
sunriseCard = document.querySelectorAll('.highlights .card')[1],
aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
        AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data =>{
        let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
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
    }).catch(() =>{
        alert("field to fetch air quality");
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
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-light fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                    <p><i class="fa-light fa-location-dot"></i>${name}, ${country}</p>
                </div>
            `;
            let {sunrise, sunset} = data.sys,
            {timezone} = data,
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
        })
        .catch(() => {
            alert('Failed to fetch the current weather');
        });

        fetch(FORECAST_API_URL).then(res => res.json()).then(data =>{
            let uniqueForecastDays = [];
            let fiveDaysForecast = data.list.filter(forecast =>{
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if(!uniqueForecastDays.includes(forecastDate)){
                    return uniqueForecastDays.push(forecastDate);
                }
            });
            fiveDaysForecastCard.innerHTML = '';
            for(i = 1; i<fiveDaysForecast.length; i++){
                let date = new Date(fiveDaysForecast[i].dt_txt);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                            <div class="icon-wrapper">
                                <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                                <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                            </div>
                            <p>${date.getDate()} ${months[date.getMonth()]}</p>
                            <p>${days[date.getDay()]}</p>
                        </div>
                `;
            }
        }).catch(() => {
            alert('Failed to fetch  weather Forecast');
        });
}

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

searchBtn.addEventListener('click', getCityCoordinates);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getCityCoordinates();
    }
});