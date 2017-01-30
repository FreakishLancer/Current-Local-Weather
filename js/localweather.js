class User {
    constructor(userGeoData) { // Accepts the JSON from IPInfo API.
        this.lat = userGeoData.loc.split(",")[0];
        this.long = userGeoData.loc.split(",")[1];

        this.city = userGeoData.city;
        this.region = userGeoData.region;
        this.country = userGeoData.country;
        this.postal = userGeoData.postal;
        
        this.currentWeatherAPI = `http://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.long}&appid=40e3305e7c9e05d406ca2147ad14d791 `;
    }
}

$(document).ready(() => {

    $.getJSON("https://ipinfo.io", geoData => { // Ipinfo.io seems to be more accurate than Navigator.geolocation.
        const user = new User(geoData);
        $.getJSON(user.currentWeatherAPI, currentWeatherData => {
            
        });
    });
});