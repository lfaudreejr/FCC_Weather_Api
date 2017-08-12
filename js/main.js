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
    var lat;
    var long;

    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(success, error);

    function success(position) {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      var location = get(
        "https://api.apixu.com/v1/current.json?key=key&q=" + lat + "," + long
      ).then(
        function(location) {
          console.log(location);
          city.textContent =
            location.location.name + ", " + location.location.region;
          icon.setAttribute(
            "src",
            "https://" + location.current.condition.icon
          );
          p.innerHTML = location.current.temp_f + "&deg;F";
          description.textContent = "'" + location.current.condition.text + "'";
        },
        function(err) {
          alert("Connection refused");
        }
      );

      var forecast = get(
        "https://api.apixu.com/v1/forecast.json?key=key&q=" +
          lat +
          "," +
          long +
          "&days=4"
      ).then(
        function(forecast) {
          console.log(forecast);
          var next = document.getElementById("next_day");
          var next_icon = document.getElementById("next_icon");
          var second_day = document.getElementById("second_day");
          var second_icon = document.getElementById("second_icon");
          var third_day = document.getElementById("third_day");
          var third_icon = document.getElementById("third_icon");
          next.innerHTML =
            "Tomorrow: " +
            forecast.forecast.forecastday[1].day.maxtemp_f +
            " &deg;F";
          next_icon.setAttribute(
            "src",
            "https://" + forecast.forecast.forecastday[1].day.condition.icon
          );
          second_day.innerHTML =
            "Day After: " +
            forecast.forecast.forecastday[2].day.maxtemp_f +
            " &deg;F";
          second_icon.setAttribute(
            "src",
            "https://" + forecast.forecast.forecastday[2].day.condition.icon
          );
          third_day.innerHTML =
            "Third day: " +
            forecast.forecast.forecastday[3].day.maxtemp_f +
            " &deg;F";
          third_icon.setAttribute(
            "src",
            "https://" + forecast.forecast.forecastday[3].day.condition.icon
          );
        },
        function(err) {
          alert("Connection refused");
        }
      );
    }

    function error(error) {
      alert("Unable to retrieve your location");
    }
  })();
};
