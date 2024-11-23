const API_KEY = "7ded80d91f2b280ec979100cc8bbba94";
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

const addressInput = document.getElementById("address");
const getWeatherButton = document.getElementById("getWeather");
const currentWeatherData = document.getElementById("currentWeatherData");
const forecastWeatherData = document.getElementById("forecastWeatherData");

getWeatherButton.addEventListener("click", () => {
    const location = addressInput.value.trim();
    if (location) {
        fetchCurrentWeather(location);
        fetchWeatherForecast(location);
    } else {
        alert("Please enter a valid city name or address!");
    }
});

function fetchCurrentWeather(location) {
    const url = `${CURRENT_WEATHER_URL}?q=${location}&appid=${API_KEY}&units=metric`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log("Current Weather Response:", data);
            displayCurrentWeather(data);
        } else {
            currentWeatherData.textContent = "Error fetching current weather.";
        }
    };
    xhr.send();
}

function displayCurrentWeather(data) {
    const { name, main, weather } = data;
    currentWeatherData.innerHTML = `
        <p><strong>Location:</strong> ${name}</p>
        <p><strong>Temperature:</strong> ${main.temp}°C</p>
        <p><strong>Weather:</strong> ${weather[0].description}</p>
    `;
}

function fetchWeatherForecast(location) {
    const url = `${FORECAST_URL}?q=${location}&appid=${API_KEY}&units=metric`;
    fetch(url)
        .then(response => {
            console.log("Forecast Response (raw):", response);
            if (!response.ok) throw new Error("Error fetching forecast.");
            return response.json();
        })
        .then(data => {
            console.log("Forecast Response (parsed):", data);
            displayWeatherForecast(data);
        })
        .catch(error => {
            forecastWeatherData.textContent = "Error fetching weather forecast.";
            console.error(error);
        });
}

function displayWeatherForecast(data) {
    const { list } = data;

    const forecastHTML = list.map(item => {
        const date = new Date(item.dt * 1000);
        const formattedDate = date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
        });
        const formattedTime = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        });
        const icon = item.weather[0].icon; // Ikona z API
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`; // Budowanie URL ikony

        return `
            <div class="forecast-item">
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${formattedTime}</p>
                <img src="${iconUrl}" alt="${item.weather[0].description}" title="${item.weather[0].description}">
                <p><strong>Temp:</strong> ${item.main.temp}°C</p>
                <p><strong>Humidity:</strong> ${item.main.humidity}%</p>
            </div>
        `;
    }).join("");

    forecastWeatherData.innerHTML = forecastHTML;
}

