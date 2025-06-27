const baseUrl = "https://api.weatherapi.com/v1";
const apiKey = "eae56411965046928cc212140252506";

const inputField = document.querySelector("#query");

inputField.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    // console.log(inputField.value);
    let data = fetchWeatherData(inputField.value);
  }
});

function fetchWeather() {
  fetchWeatherData(inputField.value);
}

async function fetchWeatherData(q) {
  try {
    let queryUrl = `${baseUrl}/current.json?q=${q}&key=${apiKey}`;
    let response = await fetch(queryUrl);

    if (!response.ok) {
      throw new Error("Unable to retrieve the data for: " + q);
    }

    let data = await response.json();
    cardWeather = new WeatherCardGenerator(data);
    cardWeather.generateCard();
  } catch (err) {
    console.log(err);
  }
}

class WeatherCardGenerator {
  constructor(weatherData) {
    this.name = weatherData.location.name;
    this.temp = weatherData.current.temp_c;
    this.image = weatherData.current.condition.icon;
    this.country = weatherData.location.country;
    this.condition = weatherData.current.condition.text;
    this.wind = weatherData.current.wind_kph;
    this.wind_dir = weatherData.current.wind_dir;
    this.uv = weatherData.current.uv;
    this.pressure = weatherData.current.pressure_mb;
    this.precip = weatherData.current.precip_mm;
  }

  generateCard() {
    const element = document.querySelector(".weather-info");
    element.innerHTML = "";

    const newDiv = document.createElement("div");
    newDiv.innerHTML = this.generateCardTemplate();
    element.appendChild(newDiv);
  }

  generateCardTemplate() {
    return `<div class="weather-card roboto-font justify-left">
            <h2>${this.name}</h2>
            <div class="justify-temp-icon">
                <h1>${this.temp}°C</h1>
                <img src="https:${this.image.replace(
                  "64x64",
                  "128x128"
                )}" />
            </div>
            <h3>${this.country}</h3>
            <h4 class="cs">${this.condition}</h4>
            <div class="grid-info"> 
                <div class="item-info">
                    <span><i class="fa-solid fa-wind"></i></span>
                    <span>${this.wind} Km/H</span>
                    <span><i class="fa-solid fa-location-arrow"></i> ${
                      this.wind_dir
                    }</span>
                </div>
                <div class="item-info">
                    <span><i class="fa-solid fa-sun"></i></span>
                    <span>${this.uv}</span>
                    <span>UV Index</span>
                </div>
                <div class="item-info">
                    <span><i class="fas fa-thermometer-half"></i></span>
                    <span>${this.pressure} kPa</span>
                </div>
                <div class="item-info">
                    <span><i class="fa-solid fa-cloud-showers-heavy"></i></span>
                    <span>${this.precip} mm</span>
                </div>
            </div>
        </div>
        `;
  }
}
