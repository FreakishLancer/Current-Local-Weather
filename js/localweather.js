class User {
    constructor(userGeoData) { // Accepts the JSON from IPInfo API.
        this._lat = userGeoData.loc.split(",")[0];
        this._long = userGeoData.loc.split(",")[1];
        this._city = userGeoData.city;
        this._region = userGeoData.region;
        this._country = userGeoData.country;
        this._postal = userGeoData.postal;

        if (this._country === "US") {
            this.isCelsius = false;
            this.tempUnit = "imperial"
        }
        else {
            this.isCelsius = true;
            this.tempUnit = "metric"
        }

        this.currentWeatherAPI = `http://api.openweathermap.org/data/2.5/weather?lat=${this._lat}&lon=${this._long}&units=${this.tempUnit}&appid=40e3305e7c9e05d406ca2147ad14d791 `;
    }

    convertTemp() {
        if (this.isCelsius) {
            this.tempUnit = "metric";
            this.isCelsius = false;
        }
        else {
            this.tempUnit = "imperial";
            this.isCelsius = true;
        }
    }
}

$(document).ready(() => {

    $.getJSON("https://ipinfo.io", geoData => {
        let user = new User(geoData);
        $.getJSON(user.currentWeatherAPI, currentWeatherData => {
            console.log(user.currentWeatherAPI);
        });
    });
});