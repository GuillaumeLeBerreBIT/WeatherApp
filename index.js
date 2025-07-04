const baseUrl = "https://api.weatherapi.com/v1";
const apiKey = "eae56411965046928cc212140252506";
let queryHistory = [];

const inputField = document.querySelector("#query");

inputField.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    // console.log(inputField.value);

    const element = document.querySelector(".weather-info");
    element.innerHTML = "";

    fetchWeatherData(inputField.value);
    setTimeout(() => {
      fetchForecastData(inputField.value);
    }, 100);
  }
});

function fetchWeather() {
  const element = document.querySelector(".weather-info");
  element.innerHTML = "";

  fetchWeatherData(inputField.value);
  setTimeout(() => {
    fetchForecastData(inputField.value);
  }, 100);
}

async function fetchWeatherData(q) {
  try {
    let queryUrl = `${baseUrl}/current.json?q=${q}&key=${apiKey}`;
    let response = await fetch(queryUrl);

    if (!response.ok) {
      throw new Error("Unable to retrieve the data for: " + q);
    }

    let data = await response.json();
    cardWeather = new WeatherCardGenerator({ ...data });
    cardWeather.generateCard();
    cardWeather.addHistoryCard();
  } catch (err) {
    console.log(err);
  }
}

async function fetchForecastData(q) {
  try {
    let queryUrl = `${baseUrl}/forecast.json?q=${q}&days=3&tp=24&key=${apiKey}`;
    let response = await fetch(queryUrl);

    let data = await response.json();
    console.log(data);

    for (let fc of data.forecast.forecastday) {
      cardWeatherData = new WeatherCardGenerator({ ...data }, fc);
      console.log(fc);
      cardWeatherData.generateForeCastCardTemplate();
      cardWeatherData.generateForeCard();
    }

    if (!response.ok) {
      throw new Error("Unable to retrieve data for: " + q);
    }
  } catch (err) {
    console.log(err);
  }
}

class WeatherCardGenerator {
  constructor(
    {
      location: { name, country } = {},
      current: {
        temp_c,
        wind_kph,
        wind_dir,
        uv,
        pressure_mb,
        precip_mm,
        condition: { icon, text } = {},
      },
    } = {},
    forecastWeather = null
  ) {
    this.name = name;
    this.temp = temp_c;
    this.image = icon;
    this.country = country;
    this.condition = text;
    this.wind = wind_kph;
    this.wind_dir = wind_dir;
    this.uv = uv;
    this.pressure = pressure_mb;
    this.precip = precip_mm;

    if (forecastWeather) {
      this.date = forecastWeather.date;
      this.temp = forecastWeather.day.avgtemp_c;
      this.condition = forecastWeather.day.condition.text;
      this.image = forecastWeather.day.condition.icon;
      this.wind = forecastWeather.day.maxwind_kph;
      this.uv = forecastWeather.day.uv;
      this.sunrise = forecastWeather.astro.sunrise;
      this.sunset = forecastWeather.astro.sunset;
    }
  }

  generateCard() {
    const element = document.querySelector(".weather-info");
    const newDiv = document.createElement("div");

    newDiv.innerHTML = this.generateCardTemplate();
    newDiv.classList.add(
      "weather-card",
      "roboto-font",
      "justify-left",
      "card-today"
    );

    element.insertAdjacentElement("beforeend", newDiv);
  }

  generateForeCard() {
    const element = document.querySelector(".weather-info");
    const newDiv = document.createElement("div");

    newDiv.innerHTML = this.generateForeCastCardTemplate();
    newDiv.classList.add("weather-card", "roboto-font", "justify-left");

    element.appendChild(newDiv);
  }

  generateCardTemplate() {
    return `
          <h2>Today</h2>
          <h3>${this.name}</h3>
          <div class="justify-temp-icon">
              <h1>${this.temp}°C</h1>
              <img src="https:${this.image.replace("64x64", "128x128")}" />
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
                  <span></span>
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
        `;
  }

  generateForeCastCardTemplate() {
    return `
          <h2>${this.date}</h2>
          <h3>${this.name}</h3>
          <div class="justify-temp-icon">
              <h1>${this.temp}°C</h1>
              <img src="https:${this.image.replace("64x64", "128x128")}" />
          </div>
          <h3>${this.country}</h3>
          <h4 class="cs">${this.condition}</h4>
          <div class="grid-info"> 
              <div class="item-info">
                  <span><i class="fa-solid fa-wind"></i></span>
                  <span>${this.wind} Km/H</span>
              </div>
              <div class="item-info">
                  <span><i class="fa-solid fa-sun"></i></span>
                  <span>${this.uv} UV</span>
              </div>
              <div class="item-info">
                  <span><i class="bi bi-sunrise"></i></span>
                  <span>${this.sunrise}</span>
              </div>
              <div class="item-info">
                  <span><i class="bi bi-sunset"></i></span>
                  <span>${this.sunset}</span>
              </div>
          </div>
        `;
  }

  addHistoryCard () {
    let historyBox = document.querySelector('.history-box');

    if (!queryHistory.includes(this.name)) {
      
      queryHistory.push(this.name);
      
      let newDiv = document.createElement('div');
      newDiv.innerHTML = this.createHistoryCard();

      newDiv.classList.add('history-card');
      
      historyBox.insertAdjacentElement('beforeend', newDiv);

    }
  }
  
  createHistoryCard() {
    return `      
            <h4>${this.name}</h4>
            <h3>${this.temp}</h3>
            <img src="${this.image}">
          `
  }
}
