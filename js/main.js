window.onload = (function()
{

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
          p.innerHTML = "You current temp: " + location.main.temp + "&deg;F";
          description.textContent = "'" + location.weather[0].description + "'";
        });


        var forecast = get("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&cnt=4&units=imperial&appid=283fdf4c8b4ef4052398942d7fcc1cb9")
        .then(function(forecast)
        {
          console.log(forecast);
          var one = document.getElementById('f_one');
          one.innerHTML = "The temperature for tomorrow is: " + forecast.list[1].main.temp + " &deg;F";
        });
      });

    }
    else
    {
      p.textContent("Geolocation not supported by this browser");
    }
  })();

})

