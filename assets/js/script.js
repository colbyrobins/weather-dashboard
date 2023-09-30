var searchBox = document.getElementById("search-box");
var searchBtn = document.getElementById("search-btn");
var searchHistory = document.getElementById("search-history");

var todaysForcastEl = document.getElementById("todays-forcast")
var weatherCardsDivEl = document.getElementById("weather-cards")

var API_KEY = "c4047111e773c593d1a19bf05058a6b8"

// search listener
searchBtn.addEventListener("click", function(event) {
    
    var searchInput = searchBox.value;

    // clear the search box.
    searchBox.value = "";
    // log seach input to the search history
    logSearch(searchInput);

    // invoke api to search for data
    getCityCordinates(searchInput)

  });

// function for logging the search history to the web page.
function logSearch(searchInput) {
    var searchEntry = document.createElement("div");
    searchEntry.textContent = searchInput;
    searchHistory.appendChild(searchEntry);
}

 // in order to get the forcast we need the cordinates for the city. 
 // this function will return the cordinates of the city we are searching for.
 function getCityCordinates(location) {
    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            getWeatherDetails(data[0].lat, data[0].lon)
        })
 }

 // get the forcast using the cordinates of a city.
function getWeatherDetails(lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
                        
            weatherCardsDivEl.innerHTML = "";

            for (var i = 0; i <= 5; i++) {
                if (i == 0) {
                    var currentWeatherCard = `<h3>${data.city.name}</h3>
                                  <h6>Temp: ${data.list[0].main.temp}</h6>
                                  <h6>Wind: ${data.list[0].wind.gust}</h6>
                                  <h6>Humidity: ${data.list[0].main.humidity}</h6>`;
                    todaysForcastEl.innerHTML = currentWeatherCard
                } else {
                    date = data.list[0].dt_txt.split(" ")[0];
                    temp = data.list[i].main.temp;
                    wind = data.list[i].wind.gust;
                    humidity = data.list[i].main.humidity;
    
                    var weatherCard = `<li class="card">
                                            <h3>${date}</h6>
                                            <h6>Icon</h6>
                                            <h6>Temp: ${temp}</h6>
                                            <h6>Wind: ${wind}</h6>
                                            <h6>Humidity ${humidity}</h6>
                                        </li>`
                    weatherCardsDivEl.insertAdjacentHTML("beforeend", weatherCard)
                }
                
            }

        })
}