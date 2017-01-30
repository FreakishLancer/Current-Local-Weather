let lat;
let long;
let currentWeatherAPI;

$(document).ready(() => {
    $.getJSON("https://ipinfo.io", geoData => { // Ipinfo.io seems to be more accurate than Navigator.geolocation.
        let posCoords = geoData.loc.split(",");
        lat = posCoords[0];
        long = posCoords[1];
        currentWeatherAPI = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=40e3305e7c9e05d406ca2147ad14d791 `;
        
        $.getJSON(currentWeatherAPI, currentWeatherData => {
            console.log(currentWeatherData.name);
        });
    });
});