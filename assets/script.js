//Set global variables
var $cityList = [];

var weatherEl=document.querySelector("#current-weather-container");
var cityForm=document.querySelector("#search-form");
var weatherTitle = document.querySelector("#forecast");
var cityInput=document.querySelector("#city");
var forecastFiveEl = document.querySelector("#fiveday-container");
var citySearch = document.querySelector("#searched-city");
var previousCityEl = document.querySelector("#prev-search-buttons");

var formSubmit = function(event){
    event.preventDefault();  //prevents parent/child elements from receiving an event.
    var city = cityInput.value.trim(); //removes empty spaces for  the user's input city string.
    if(city){
        fiveDay(city);
        weatherInfo(city);
        cityInput.value = ""; //clears input after submitted
        $cityList.unshift({city}); //unshift adds the entered city to the beginning of the array of previously-searched cities.
    } else{
        alert("Please enter a state or city"); //if nothing was input.
    }
    saveHistory();
    previousCitySearch(city);
}

var saveHistory = function(){
    localStorage.setItem("$cityList", JSON.stringify($cityList));  //Saves to localStorage.
};

var weatherInfo = function(city){
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    var apiKey = "2cbaf139d7de9f18dd13fb948e5a516f"

    fetch(apiURL).then(function(response){

        response.json().then(function(data){ //acquires weather data from URL for display.
            weatherData(data, city);

        });
    });
};

var weatherData = function(weather, searchCity){
   weatherEl.textContent= "";  
   citySearch.textContent=searchCity;

   var currentDate = document.createElement("span") //element for current date
   currentDate.textContent="(" + moment(weather.dt.value).format("M/DD/YYYY") + ")";
   citySearch.appendChild(currentDate);
   
   var windEl = document.createElement("span");  //element for wind speed
   windEl.textContent = "Wind: " + weather.wind.speed + " MPH";
   windEl.classList = "list-group-item"
   
   var humidityEl = document.createElement("span");  //element for humidity
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"

   var temperatureEl = document.createElement("span"); //eleemnt to show temperature
   temperatureEl.textContent = "Temperature: " + ((weather.main.temp * 1.8) + 32).toFixed(2) + " °F";
   temperatureEl.classList = "list-group-item" //for css styling.
      
   var weatherImg = document.createElement("img") //element for weather image
   weatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearch.appendChild(weatherImg);
   
   weatherEl.appendChild(windEl);   // adds element to container
   weatherEl.appendChild(humidityEl);
   weatherEl.appendChild(temperatureEl); 
}

var fiveDay = function(city){  //api and url for the 5 day forecast
    var apiKey = "2cbaf139d7de9f18dd13fb948e5a516f"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`

    fetch(apiURL).then(function(response){

        response.json().then(function(data){
           renderFiveDay(data);
        });
    });
};

var renderFiveDay = function(weather){
    forecastFiveEl.textContent = ""
    weatherTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=3; i < forecast.length; i=i+8){ // a list of weather conditions starting at noon of each day for 5 days.
       var dailyForecast = forecast[i];

       var forcastDisplay=document.createElement("div");
       forcastDisplay.classList = "card bg-dark text-light m-3"; //sets the forecast as a card display.

       var weatherDate = document.createElement("h5") //dates for all 5 days of corecast
       weatherDate.textContent= moment(dailyForecast.dt).format("M/DD/YYYY");
       weatherDate.classList = "text-center"
       forcastDisplay.appendChild(weatherDate);

       var weatherImg = document.createElement("img") // weather icon.
       weatherImg.classList = "card-body text-center";
       weatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       forcastDisplay.appendChild(weatherImg);

       var forecastTemp=document.createElement("span");  // element for 5 day forecast display
       forecastTemp.textContent = "Temp: " + ((dailyForecast.main.temp*1.8)+32).toFixed(2) + " °F";
       forecastTemp.classList = "card-body text-center p-1";

       forcastDisplay.appendChild(forecastTemp);

       var forecastWind=document.createElement("span"); //element foor wind speed
       forecastWind.classList = "card-body text-center p-1";
       forecastWind.textContent = "Wind: " + dailyForecast.wind.speed + "  MPH";

       forcastDisplay.appendChild(forecastWind);

       var forecastHumidity=document.createElement("span"); //element for humidity
       forecastHumidity.classList = "card-body text-center p-1";
       forecastHumidity.textContent = "Humidity: " + dailyForecast.main.humidity + " %";

       forcastDisplay.appendChild(forecastHumidity);
       forecastFiveEl.appendChild(forcastDisplay);
    }
}

var previousCitySearch = function(previousCitySearch){

    previousCitySearchEl = document.createElement("button");  //created eleements for weather data from previous seatch
    previousCitySearchEl.textContent = previousCitySearch;
    previousCitySearchEl.classList = "d-flex w-100 btn-light p-3";
    previousCitySearchEl.setAttribute("type", "submit");
    previousCitySearchEl.setAttribute("data-city",previousCitySearch)
    previousCityEl.append(previousCitySearchEl);
}

var pastHandler = function(event){  //shows weather info of previous searched cities.
    var city = event.target.getAttribute("data-city")
    if(city){
        weatherInfo(city);
        fiveDay(city);
    }
}

cityForm.addEventListener("submit", formSubmit);  //event listeners to make it clickable
previousCityEl.addEventListener("click", pastHandler);