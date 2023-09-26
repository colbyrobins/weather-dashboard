var searchBox = document.getElementById("search-box");
var searchBtn = document.getElementById("search-btn");

var searchHistory = document.getElementById("search-history");

var API_KEY = "c4047111e773c593d1a19bf05058a6b8"

// search listener
searchBtn.addEventListener("click", function(event) {
    
    var searchInput = searchBox.value;
    console.log(searchInput);

    // clear the search box.
    searchBox.value = "";
    // log seach input to the search history
    logSearch(searchInput);

    // invoke api to search for data
    var cords = getGeoCordinates(searchInput)
    // display the data.

  });

// function for logging the search history to the web page.
function logSearch(searchInput) {
    var searchEntry = document.createElement("div");
    searchEntry.textContent = searchInput;
    searchHistory.appendChild(searchEntry);
}

 // in order to get the forcast we need the cordinates for the city. 
 // this function will return the cordinates of the city we are searching for.
 function getGeoCordinates(location) {
    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            fetchWeatherData(data[0].lat, data[0].lon)
        })
 }

 // get the forcast using the cordinates of a city.
function fetchWeatherData(lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            console.log(data)
        })
}