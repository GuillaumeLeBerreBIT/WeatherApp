const baseUrl = "https://api.weatherapi.com/v1"
const apiKey = "eae56411965046928cc212140252506"

const inputField = document.querySelector('#query');

inputField.addEventListener('keypress', (event) => {
    
    if (event.key == "Enter") {

        // console.log(inputField.value);
        let data = fetchWeatherData(inputField.value);


    };
});

async function fetchWeatherData (q) {
    
    try{
        let queryUrl = `${baseUrl}/current.json?q=${q}&key=${apiKey}`;
        let response = await fetch(queryUrl);
        
        if (!response.ok) {
            throw new Error('Unable to retrieve the data for: ' + q);
        }

        // let data = await response.json(); // Need to await the response to get the data from the Promises returned from Fetch. 
        // console.log(await response.json());

        await response.json().then(data => {
            const element = document.querySelector('.weather-info');
            const newDiv = document.createElement('div');
            console.log(data);
            newDiv.innerHTML = `
            <h1>${data.location.name}</h1>
            <div>${JSON.stringify(data)}</div>

            `;
            element.appendChild(newDiv);
        })


    } catch (err) {
        console.log(err);
    }
}