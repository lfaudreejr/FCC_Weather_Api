window.onload = function() {
  "use strict";
  function get(url) {
    return new Promise(function(resolve, reject) {
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", url, true);
      xhttp.onload = function() {
        if (xhttp.status == 200) {
          resolve(JSON.parse(xhttp.response));
        } else {
          reject(xhttp.statusText);
        }
      };
      xhttp.onerror = function() {
        reject(xhttp.statusText);
      };
      xhttp.send();
    });
  }

  (function getLocation() {
    var icon = document.getElementById("icon");
    var p = document.getElementById("temp");
    var city = document.getElementById("city");
    var description = document.getElementById("description");
    var next = document.getElementById("next_day");
    var next_icon = document.getElementById("next_icon");
    var second_day = document.getElementById("second_day");
    var second_icon = document.getElementById("second_icon");
    var third_day = document.getElementById("third_day");
    var third_icon = document.getElementById("third_icon");
    var lat;
    var long;
    var weatherObj = new Object();

    function success(position) {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      makeWeatherObj();
    }

    function error(error) {
      alert("Unable to retrieve your location");
    }

    var getCurrentWeather = function getCurrentWeather() {
      return get(
        "https://api.apixu.com/v1/current.json?key=1391c71edd784b36b89143112172104&q=" +
          lat +
          "," +
          long
      );
    };

    var getForecast = function getForecast() {
      return get(
        "https://api.apixu.com/v1/forecast.json?key=1391c71edd784b36b89143112172104&q=" +
          lat +
          "," +
          long +
          "&days=4"
      );
    };

    function makeWeatherObj() {
      Promise.resolve(getForecast()).then(function(results) {
        weatherObj.current = results.current;
        weatherObj.forecast = results.forecast.forecastday;
        weatherObj.location = results.location;
        console.log("Weather: ", weatherObj);
        setCurrentWeather();
        setForecast();
      });
    }

    function setCurrentWeather() {
      city.textContent =
        weatherObj.location.name + ", " + weatherObj.location.region;
      icon.setAttribute("src", "https://" + weatherObj.current.condition.icon);
      p.innerHTML = weatherObj.current.temp_f + "&deg;F";
      description.textContent = "'" + weatherObj.current.condition.text + "'";
    }

    function setForecast() {
      next.innerHTML =
        "Tomorrow: " + weatherObj.forecast[1].day.maxtemp_f + " &deg;F";
      next_icon.setAttribute(
        "src",
        "https://" + weatherObj.forecast[1].day.condition.icon
      );
      second_day.innerHTML =
        "Day After: " + weatherObj.forecast[2].day.maxtemp_f + " &deg;F";
      second_icon.setAttribute(
        "src",
        "https://" + weatherObj.forecast[2].day.condition.icon
      );
      third_day.innerHTML =
        "Third day: " + weatherObj.forecast[3].day.maxtemp_f + " &deg;F";
      third_icon.setAttribute(
        "src",
        "https://" + weatherObj.forecast[3].day.condition.icon
      );
    }

    navigator.geolocation.getCurrentPosition(success, error);
    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser");
      return;
    }
  })();
};
