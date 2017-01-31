class User {
    constructor(userGeoData) { // Accepts the JSON from IPInfo API.
        this._lat = userGeoData.loc.split(",")[0];
        this._long = userGeoData.loc.split(",")[1];
        this._city = userGeoData.city;
        this._region = userGeoData.region;
        this._country = userGeoData.country;
        this._postal = userGeoData.postal;

        this._country === "US" ? this.setToImperial() : this.setToMetric();

        this.currentWeatherAPI = `http://api.openweathermap.org/data/2.5/weather?lat=${this._lat}&lon=${this._long}&units=${this.tempUnit}&appid=40e3305e7c9e05d406ca2147ad14d791 `;
    }

    convertUnit(temp) {
        if (this.isMetric) {
            temp = Math.round((temp * 9) / 5) + 32;
            this.setToImperial();
            return temp;
        }
        else {
            temp = Math.round((temp - 32) * 5) / 9;
            this.setToMetric();
            return temp;
        }
    }

    setToMetric() {
        this.isMetric = true;
        this.tempUnit = "metric";
        this.tempCode = "C";
        this.speedUnit = "meter(s)/sec";
    }

    setToImperial() {
        this.isMetric = false;
        this.tempUnit = "imperial";
        this.tempCode = "F";
        this.speedUnit = "mile(s)/hour";
    }
}

$(document).ready(() => {

    $.getJSON("https://ipinfo.io", geoData => {
        let user = new User(geoData);

        $("#user-location").text(`${user._city}, ${user._region}, ${user._country} ${user._postal}`);

        $.getJSON(user.currentWeatherAPI, currentWeatherData => {
            let currentTemp = Math.round(currentWeatherData.main.temp);
            let weatherParam = currentWeatherData.weather[0].main;
            let weatherDesc = currentWeatherData.weather[0].description;
            let weatherIcon = currentWeatherData.weather[0].icon;

            console.log(weatherDesc);

            $("#temperature").html(`${currentTemp} ${user.tempCode}`);
            $("#weather-description").text(`${weatherDesc}`);
            $("#weather-icon").attr("src", `https://openweathermap.org/img/w/${weatherIcon}.png`);

            $("#temperature").on("click", () => {
                 currentTemp = user.convertUnit(currentTemp);
                $("#temperature").html(`${currentTemp} ${user.tempCode}`);
            });
        });
    });
});