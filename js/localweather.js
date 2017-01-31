class User {
    constructor(userGeoData) { // Accepts the JSON from IPInfo API.
        this._lat = userGeoData.loc.split(",")[0];
        this._long = userGeoData.loc.split(",")[1];
        this._city = userGeoData.city;
        this._region = userGeoData.region;
        this._country = userGeoData.country;
        this._postal = userGeoData.postal;

        this._country === "US" ? this.setToImperial() : this.setToMetric();

        this.currentWeatherAPI = `http://api.openweathermap.org/data/2.5/weather?lat=${this._lat}&lon=${this._long}&units=${this.measUnit}&appid=40e3305e7c9e05d406ca2147ad14d791 `;
    }

    convertTemp(temp) {
        if (this.isMetric) {
            temp = ((temp * 9) / 5) + 32;
            return temp;
        }
        else {
            temp = ((temp - 32) * 5) / 9;
            return temp;
        }
    }

    convertWindSpeed(windSpeed) {
        if (this.isMetric) {
            windSpeed *= 2.2369362920544;
            return windSpeed;
        }
        else {
            windSpeed *= 0.44704;
            return windSpeed;
        }
    }

    convertMeasUnit() {
        this.isMetric ? this.setToImperial() : this.setToMetric();
    }

    setToMetric() {
        this.isMetric = true;
        this.measUnit = "metric";
        this.tempCode = "C";
        this.speedUnit = "mps";
    }

    setToImperial() {
        this.isMetric = false;
        this.measUnit = "imperial";
        this.tempCode = "F";
        this.speedUnit = "mph";
    }
}

const weatherBackgrounds = {
    "clear sky": "https://static.pexels.com/photos/105234/pexels-photo-105234.jpeg",
    "few clouds": "https://static.pexels.com/photos/3768/sky-sunny-clouds-cloudy.jpg",
    "scattered clouds": "https://static.pexels.com/photos/46160/field-clouds-sky-earth-46160.jpeg",
    "broken clouds": "https://www.pixelstalk.net/wp-content/uploads/2016/07/Weather-Desktop-Image-Download-Free.jpg",
    "shower rain": "https://static.pexels.com/photos/17739/pexels-photo.jpg",
    "rain": "https://www.pixelstalk.net/wp-content/uploads/2016/07/Weather-Background-HD.jpg",
    "thunderstorm": "https://www.publicdomainpictures.net/pictures/160000/velka/eclairs-foudre-et-nuages-sombres-1456251710RTZ.jpg",
    "snow": "https://static.pexels.com/photos/72458/pexels-photo-72458.jpeg",
    "mist": "https://upload.wikimedia.org/wikipedia/commons/0/01/Krakow_Wawel_i_Leg_przed_wschodem_Slonca.jpg"
};

$(document).ready(() => {

    $.getJSON("https://ipinfo.io", geoData => {
        let user = new User(geoData);

        $("#user-location").text(`${user._city}, ${user._region}, ${user._country} ${user._postal}`);

        $.getJSON(user.currentWeatherAPI, currentWeatherData => {
            let currentTemp = currentWeatherData.main.temp;
            let weatherDesc = currentWeatherData.weather[0].description;
            let weatherIcon = currentWeatherData.weather[0].icon;
            let windSpeed = currentWeatherData.wind.speed;
            let humidity = currentWeatherData.main.humidity;

            console.log(weatherDesc);

            $("#temperature").html(`${Math.round(currentTemp)}&deg; ${user.tempCode}`);
            $("#weather-description").text(`${weatherDesc}`);
            $("#weather-icon").attr("src", `https://openweathermap.org/img/w/${weatherIcon}.png`);
            $("#humidity").html(`${humidity}%`);
            $("#wind-speed").html(`${Math.round(windSpeed)} ${user.speedUnit}`);
            $("body").css("background-image", `url(${weatherBackgrounds[weatherDesc]}`);
            console.log(weatherBackgrounds[weatherDesc]);

            $(".unit-change").on("click", () => {
                currentTemp = Math.round(user.convertTemp(currentTemp))
                windSpeed = Math.round(user.convertWindSpeed(windSpeed))

                user.convertMeasUnit();

                $("#temperature").html(`${currentTemp}&deg; ${user.tempCode}`);
                $("#wind-speed").html(`${windSpeed} ${user.speedUnit}`);
            });
        });
    });
});