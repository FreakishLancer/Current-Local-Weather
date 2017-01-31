class User {
    constructor(userGeoData) { // Accepts the JSON from IPInfo API.
        this._city = userGeoData.city;
        this._region = userGeoData.region;
        this._country = userGeoData.country;
        this._postal = userGeoData.postal;
        this._ip = userGeoData.ip;

        this._country === "US" ? this.setToImperial() : this.setToMetric();

        this.currentWeatherAPI = `https://api.apixu.com/v1/current.json?key=0d9bbab21529400c99a153247173101&q=${this._ip} `; // Using APIXU.
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
            windSpeed *= 0.621371;
            return windSpeed;
        }
        else {
            windSpeed *= 1.60934;
            return windSpeed;
        }
    }

    convertMeasUnit() {
        this.isMetric ? this.setToImperial() : this.setToMetric();
    }

    setToMetric() {
        this.isMetric = true;
        this.tempCode = "C";
        this.speedUnit = "kph";
    }

    setToImperial() {
        this.isMetric = false;
        this.tempCode = "F";
        this.speedUnit = "mph";
    }
}

$(document).ready(() => {

    $.getJSON("https://ipinfo.io", geoData => { // Gets JSON from IPInfo API.
        let user = new User(geoData);

        $("#user-location").text(`${user._city}, ${user._region}, ${user._country} ${user._postal}`);

        $.getJSON(user.currentWeatherAPI, currentWeatherData => {
            let currentTemp = user.isMetric ? currentWeatherData.current.temp_c : currentWeatherData.current.temp_f;
            let weatherDesc = currentWeatherData.current.condition.text;
            let weatherIcon = currentWeatherData.current.condition.icon;
            let windSpeed = user.isMetric ? currentWeatherData.current.wind_kph : currentWeatherData.current.wind_mph;
            let humidity = currentWeatherData.current.humidity;

            console.log(windSpeed);
            console.log(currentWeatherData.current.wind_kph);

            const weatherBackgrounds = {
                "clear": "https://static.pexels.com/photos/105234/pexels-photo-105234.jpeg",
                "cloud": "https://www.pixelstalk.net/wp-content/uploads/2016/07/Weather-Desktop-Image-Download-Free.jpg",
                "Overcast": "https://www.publicdomainpictures.net/pictures/30000/velka/sunlight-through-clouds.jpg",
                "drizzle": "https://static.pexels.com/photos/17739/pexels-photo.jpg",
                "rain": "https://www.pixelstalk.net/wp-content/uploads/2016/07/Weather-Background-HD.jpg",
                "thunder": "https://www.publicdomainpictures.net/pictures/160000/velka/eclairs-foudre-et-nuages-sombres-1456251710RTZ.jpg",
                "snow": "https://static.pexels.com/photos/72458/pexels-photo-72458.jpeg",
                "sleet": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Sleet_on_the_ground.jpg",
                "ice": "https://upload.wikimedia.org/wikipedia/commons/a/a3/2013-01-24_Ice_pellets_and_glaze_from_freezing_rain_on_a_car_during_the_day_in_Elko%2C_Nevada.jpg",
                "Mist": "https://upload.wikimedia.org/wikipedia/commons/0/01/Krakow_Wawel_i_Leg_przed_wschodem_Slonca.jpg"
            };

            let weatherWords = Object.keys(weatherBackgrounds);
            let backgroundURL;

            for (let i = 0; i < weatherWords.length; i++) {
                if (weatherDesc.includes(weatherWords[i])) {
                    backgroundURL = weatherBackgrounds[weatherWords[i]];
                    break;
                }
            }

            $("#temperature").html(`${Math.round(currentTemp)}&deg; ${user.tempCode}`);
            $("#weather-description").text(`${weatherDesc}`);
            $("#weather-icon").attr("src", `https:${weatherIcon}`);
            $("#humidity").html(`${humidity}%`);
            $("#wind-speed").html(`${Math.round(windSpeed)} ${user.speedUnit}`);
            $("body").css("background-image", `url(${backgroundURL})`);

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