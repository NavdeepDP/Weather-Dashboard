$(document).ready(function () {

    console.log("Document ready");


    /**
     * GLOBAL VARIABLES
     * 
     */
    var citySearchedArray = [];
    var apiKey = "2842c543a47bff9e50ce56442373ab59";

    /**
     * 
     * DOM ELEMENTS
     */

    // City search button
    var citySearchBtn = $("#city-search-button");
    // City name input box
    var cityNameInput = $("#city-name");
    // city history table body
    var cityHistoryTableBody = $("#city-history-table");

    // current weather condition elements
    var currCityNameEl = $("#current-city");
    var currTempEl = $("#current-temperature");
    var currHumidityEl = $("#current-humidity");
    var currWindSpeedEl = $("#current-speed");
    var currUvIndexEl = $("#current-uvindex");
    var currWeatherImageEl = $("#current-image");
    var currDateEl = $("#current-date");

    // weather forecast group
    var cardGroupDiv = $("#weather-forecast-card-group");
    var weatherDisplayDiv = $("#weather-display-main-col");


    /**
     * 
     * FUNCTION DEFINITIONS
     */

    // Function to display already searched cities
    function renderCityNames() {

        cityHistoryTableBody.empty();

        for (var i = 0; i < citySearchedArray.length; i++) {
            // add city name to the already searched city list

            var cityRow = $("<tr>");
            var cityCol = $("<td>");
            cityCol.text(citySearchedArray[i]);
            cityRow.attr("data-value", citySearchedArray[i]);
            cityRow.addClass("citySearchHistoryRecord");
            cityRow.append(cityCol);
            cityHistoryTableBody.append(cityRow);
        }

        localStorage.setItem("citySearchHistory", JSON.stringify(citySearchedArray));
    }


    // Function to  get display five day forecast
    function getAndDisplayFiveDayForecast(cityName) {
        var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial" + "&appid=" + apiKey;
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (fiveDayForecast) {
            console.log(fiveDayForecast);


            var lastForecastDate = ""
            cardGroupDiv.empty();

            for (var i = 0; i < fiveDayForecast.list.length; i++) {
                //console.log("dt_txt: " + fiveDayForecast.list[i].dt_txt);
                var forecastDateString = fiveDayForecast.list[i].dt_txt;
                var forecastDate = moment(forecastDateString).format("DD-MM-YYYY");
                var todayDate = moment().format("DD-MM-YYYY");



                if ((todayDate !== forecastDate) && (lastForecastDate !== forecastDate)) {
                    // console.log("Forecast Data");
                    var icon =  fiveDayForecast.list[i].weather[0].icon ;
                    if(icon.includes('n'))
                    {
                        icon = icon.replace('n', 'd');
                    }
                    var imageSrc = "https://openweathermap.org/img/wn/" + icon + ".png";
                    lastForecastDate = forecastDate;

                    var cardDiv = $("<div>");
                    // cardDiv.addClass("col-sm-2");

                    var cardOutlineDiv = $("<div>");
                    cardOutlineDiv.addClass("card text-white bg-primary mb-3 mr-2");
                    cardOutlineDiv.attr("style", "width: 9rem;")

                    var cardHeaderDiv = $("<div>");
                    cardHeaderDiv.addClass("card-header");
                    cardHeaderDiv.attr("style", "padding-left:5px");
                    var date = $("<span>");
                    dateFormatted = moment(fiveDayForecast.list[i].dt_txt).format("MM/DD/YYYY");
                    date.text(dateFormatted);
                    cardHeaderDiv.append(date);


                    var cardBodyDiv = $("<div>");
                    cardBodyDiv.addClass("card-body");
                    cardBodyDiv.attr("style", "padding-left:5px; padding-bottom:5px; padding-top:5px");

                    var image = $("<img>");
                    image.attr("src", imageSrc);
                    var temp = $("<p>");
                    temp.text("Temp: " + fiveDayForecast.list[i].main.temp + "°F");
                    var humidity = $("<p>");
                    humidity.text("Humidity: " + fiveDayForecast.list[i].main.humidity + "%");
                    cardBodyDiv.append(image, temp, humidity);


                    cardOutlineDiv.append(cardHeaderDiv, cardBodyDiv);
                    cardDiv.append(cardOutlineDiv);
                    cardGroupDiv.append(cardDiv);


                }

            }

        });
    }


    // Function to display current weather conditions
    function displayCurrentWeather(cityName) {


        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + apiKey;

        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (cityWeather) {
            console.log(cityWeather);

            currCityNameEl.text(cityWeather.name);
            currTempEl.text(cityWeather.main.temp);
            currWindSpeedEl.text(cityWeather.wind.speed);
            currHumidityEl.text(cityWeather.main.humidity);

            var image = $("<img>");
            var imageSrc = "https://openweathermap.org/img/wn/" + cityWeather.weather[0].icon + "@2x.png";
            image.attr("src", imageSrc);
            currWeatherImageEl.empty();
            currWeatherImageEl.append(image);

            // UV Index 
            var lat = cityWeather.coord.lat;
            var lon = cityWeather.coord.lon;

            var uvIndexQuery = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
            $.ajax({
                url: uvIndexQuery,
                method: "GET"

            }).then(function (uvIndexResponse) {
                console.log(uvIndexResponse);
                currUvIndexEl.text(uvIndexResponse.value);
                var uvIndexValue = uvIndexResponse.value;
                currUvIndexEl.css("background-color", "");
                if((uvIndexValue >= 0) && (uvIndexValue < 3))
                   currUvIndexEl.css("background-color", "green");
                else if((uvIndexValue >= 3) && (uvIndexValue < 6))
                   currUvIndexEl.css("background-color", "yellow");
                else if((uvIndexValue >= 6) && (uvIndexValue < 8))
                   currUvIndexEl.css("background-color", "orange");
                else if((uvIndexValue >= 8) && (uvIndexValue < 11))
                   currUvIndexEl.css("background-color", "red");
                else if(uvIndexValue >= 11) 
                   currUvIndexEl.css("background-color", "violet");
            });

            //set the current date
            var currentDayVar = moment();
            //console.log(currentDayVar.format("MM/DD/YYYY"));
            var currentDayString = currentDayVar.format("MM/DD/YYYY");
            currDateEl.text("(" + currentDayString + ")");

            // add the city to the array
            if (citySearchedArray.indexOf(cityWeather.name) === -1)
                citySearchedArray.push(cityWeather.name);
            // render city names
            renderCityNames();

            getAndDisplayFiveDayForecast(cityWeather.name);

            // display the weather display div
            weatherDisplayDiv.show();

        });

    }

    // Function to get city search history from local storage
    function onDocumentLoad() {

        var searchHistory = JSON.parse(localStorage.getItem("citySearchHistory"));
        if(searchHistory !== null)
        {
            citySearchedArray = searchHistory;
        }
        if(citySearchedArray.length > 0 )
        {
            renderCityNames();
        }        

    }

    /***
     * FUNCTION CALLS
     */

    // Get the city search history
    onDocumentLoad();

    /**
     * EVENT HANDLERS
     * 
     */


    // Event Handler for city search button
    citySearchBtn.on("click", function (event) {

        event.preventDefault();

        console.log("City search button clicked");

        // get the city name from input text box
        var cityName = cityNameInput.val();
        console.log(cityName);

        // display current weather conditions for  the city
        displayCurrentWeather(cityName);

    });

    // Event handler for city search history

    $(document).on("click", ".citySearchHistoryRecord", function (event) {
        event.preventDefault();
        console.log("History Row clicked");

        var cityName = $(this).attr("data-value");
        console.log("History Row clicked: " + cityName);

        displayCurrentWeather(cityName);

    });

});