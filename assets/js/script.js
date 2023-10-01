var searchBox = document.getElementById("search-box");
var searchBtn = document.getElementById("search-btn");
var searchHistory = document.getElementById("search-history");

var todaysForcastEl = document.getElementById("todays-forcast")
var weatherCardsDivEl = document.getElementById("weather-cards")

var API_KEY = "c4047111e773c593d1a19bf05058a6b8"

// search listener
searchBtn.addEventListener("click", function(event) {
    
    var searchInput = searchBox.value;
    
    if (searchInput == "" ||  searchInput == null || searchInput == " ") { 
        return;
    }

    // clear the search box.
    searchBox.value = "";

    // invoke api to search for data
    displayWeatherForcast(searchInput)

  });

// function for logging the search history to the web page.
function logSearch(searchInput) {

    var history = localStorage.getItem("history");
    if (history === null) {
        var h = [searchInput]
        localStorage.setItem("history", JSON.stringify(h))
    }else {
        savedHistory = JSON.parse(history)
        if (!savedHistory.includes(searchInput)){
            savedHistory.push(searchInput)
            localStorage.setItem("history", JSON.stringify(savedHistory))           
        }
    }

    loadSearchHistory()
    return;
}

function loadSearchHistory() {
    
    searchHistory.innerHTML = "";
    var history = JSON.parse(localStorage.getItem("history"));
    
    for (var i = 0; i < history.length; i++) {
        var searchEntry = document.createElement("button");
        searchEntry.classList.add("historyBtn")
        searchEntry.textContent = history[i];
        searchHistory.appendChild(searchEntry);
    }
    addEventHandlersToSearchHistory()
    return;
}

 function displayWeatherForcast(location) {
     // in order to get the forcast we need the cordinates for the city. 
    // this function will return the cordinates of the city we are searching for.

    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            getWeatherDetails(data[0].lat, data[0].lon)
            logSearch(location);
        })
 }

function getWeatherDetails(lat, lon) {
     // get the forcast using the cordinates of a city.
     // then update the web page with the relevant data.

    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    fetch(currentWeatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){

            var city = data.name;
            var date = new Date(data.dt * 1000).toLocaleDateString()
            var temp = data.main.temp;
            var wind = data.wind.speed;
            var humidity = data.main.humidity;

            var currentWeatherCard = `<div class="d-flex"> 
                                        <h3>${city} (${date})</h3>
                                        <img class='img' src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
                                      </div>
                                      <h6>Temp: ${temp} °F</h6>
                                      <h6>Wind: ${wind} MPH</h6>
                                      <h6>Humidity: ${humidity} %</h6>
                                      `;

            todaysForcastEl.innerHTML = currentWeatherCard
        });

    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){

            weatherCardsDivEl.innerHTML = "";

            // this api call returns multiple temperaturs for each day. 
            // skipping 7 each iteration will result in one temp reading per day.
            for (var i = 7; i < data.list.length; i+=7) {
                    date = new Date(data.list[i].dt * 1000).toLocaleDateString()
                    temp = data.list[i].main.temp;
                    wind = data.list[i].wind.gust;
                    humidity = data.list[i].main.humidity;
    
                    var weatherCard = `<li class="card bg-primary text-white">
                                            <h3>${date}</h6>
                                            <img class='img' src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png">
                                            <h6>Temp: ${temp} °F</h6>
                                            <h6>Wind: ${wind} MPH</h6>
                                            <h6>Humidity ${humidity} %</h6>
                                        </li>`
                    weatherCardsDivEl.insertAdjacentHTML("beforeend", weatherCard)
                }
            });
    
    // log seach input to the search history
    loadSearchHistory()
}

function addEventHandlersToSearchHistory(){
    // this function iterates the button elements children of search history
    // and creates a event lister for each one so we can get the weather
    // for a previous search.

    var buttons = document.querySelectorAll("#search-history button")
    
    // this loop iterations the button elements and adds an event listener
    buttons.forEach(button => {
        button.addEventListener("click", function() {
            displayWeatherForcast(this.textContent)
        })
})
    return;
}

loadSearchHistory()