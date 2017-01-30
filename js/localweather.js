let lat;
let long;
let currentWeatherAPI;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        currentWeatherAPI = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=40e3305e7c9e05d406ca2147ad14d791 `;

        $.getJSON(currentWeatherAPI, weatherData => {
            
            $("#test").text(`${weatherData.name}, ${weatherData.sys.country} accuracy of ${position.coords.accuracy} meters.`);
            console.log(weatherData.name);
        });
    });
}

