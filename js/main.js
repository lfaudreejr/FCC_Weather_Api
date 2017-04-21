window.onload = (function()
{
	"use strict";
	
  function get(url)
  {
    return new Promise(function(resolve, reject)
    {
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", url, true);
      xhttp.onload = function()
      {
        if(xhttp.status == 200)
        {
          resolve(JSON.parse(xhttp.response));
        } 
        else 
        {
          reject(xhttp.statusText);
        }
      };
      xhttp.onerror = function()
      {
        reject(xhttp.statusText);
      };
      xhttp.send();
    });
  }

  (function getLocation()
  {
    var icon = document.getElementById("icon");
    var p = document.getElementById("temp");
    var city = document.getElementById("city");
    var description = document.getElementById("description");
    var lat;
    var long;

    if(navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(function(position){
        lat = position.coords.latitude;
        long = position.coords.longitude;

        var location = get("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=imperial&appid=283fdf4c8b4ef4052398942d7fcc1cb9")
        .then(function(location)
        {
          console.log(location);
          city.textContent = location.name + ", " + location.sys.country;
          icon.setAttribute("src", "http:openweathermap.org/img/w/" + location.weather[0].icon + ".png");
          p.innerHTML = "Your current temp: " + location.main.temp + "&deg;F";
          description.textContent = "'" + location.weather[0].description + "'";
        });


        var forecast = get("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&cnt=4&units=imperial&appid=283fdf4c8b4ef4052398942d7fcc1cb9")
        .then(function(forecast)
        {
          console.log(forecast);
          var next = document.getElementById('next_day');
          var next_icon = document.getElementById('next_icon');
          var second_day = document.getElementById('second_day');
          var second_icon = document.getElementById('second_icon');
          var third_day = document.getElementById('third_day');
          var third_icon = document.getElementById('third_icon');
          next.innerHTML = "The temperature for tomorrow is: " + forecast.list[1].main.temp + " &deg;F";
          next_icon.setAttribute("src", "http:openweathermap.org/img/w/" + forecast.list[1].weather[0].icon + ".png");
          second_day.innerHTML = "The temperature for the day after tomorrow will be: " + forecast.list[2].main.temp + " &deg;F";
          second_icon.setAttribute("src", "http:openweathermap.org/img/w/" + forecast.list[2].weather[0].icon + ".png");
          third_day.innerHTML = "The temperature for the third day will be: " + forecast.list[3].main.temp + " &deg;F";
          third_icon.setAttribute("src", "http:openweathermap.org/img/w/" + forecast.list[3].weather[0].icon + ".png");
        });
      });

    }
    else
    {
      p.textContent("Geolocation not supported by this browser");
    }
  })();

})

