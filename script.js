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
            cityRow.append(cityCol);
            cityHistoryTableBody.append(cityRow);
        }
    }


    // Function to  get display five day forecast
    function getAndDisplayFiveDayForecast(cityName) {
        var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial" + "&appid=" + apiKey;
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (fiveDayForecast) {
            console.log(fiveDayForecast);

            
            var lastForecastDate =""
            cardGroupDiv.empty();

            for (var i = 0; i < fiveDayForecast.list.length; i++) {
                console.log("dt_txt: " + fiveDayForecast.list[i].dt_txt);
                var forecastDateString = fiveDayForecast.list[i].dt_txt;
                var forecastDate = moment(forecastDateString).format("DD-MM-YYYY");
                var todayDate = moment().format("DD-MM-YYYY");
                
                

                if ((todayDate !== forecastDate) && (lastForecastDate !== forecastDate))
                {
                    console.log("Forecast Data");
                    var imageSrc = "http://openweathermap.org/img/wn/" + fiveDayForecast.list[i].weather[0].icon + ".png";
                    lastForecastDate = forecastDate;

                    var cardDiv = $("<div>");
                    // cardDiv.addClass("col-sm-2");

                    var cardOutlineDiv = $("<div>");
                    cardOutlineDiv.addClass("card text-white bg-primary mb-3 mr-2");
                    cardOutlineDiv.attr("style", "width: 9rem;")
                    
                    var cardHeaderDiv = $("<div>");
                    cardHeaderDiv.addClass("card-header");
                    cardHeaderDiv.attr("style","padding-left:5px");                    
                    var date = $("<span>");
                    dateFormatted = moment(fiveDayForecast.list[i].dt_txt).format("MM/DD/YYYY");
                    date.text(dateFormatted);
                    cardHeaderDiv.append(date);


                    var cardBodyDiv = $("<div>");
                    cardBodyDiv.addClass("card-body");
                    cardBodyDiv.attr("style","padding-left:5px; padding-bottom:5px; padding-top:5px");
                    
                    var image = $("<img>");
                    image.attr("src", imageSrc);
                    var temp = $("<p>");
                    temp.text("Temp: " + fiveDayForecast.list[i].main.temp +  "°F");
                    var humidity =$("<p>");
                    humidity.text("Humidity: " + fiveDayForecast.list[i].main.humidity + "%");
                    cardBodyDiv.append(image,temp, humidity);


                    cardOutlineDiv.append(cardHeaderDiv, cardBodyDiv);
                    cardDiv.append(cardOutlineDiv);
                    cardGroupDiv.append(cardDiv);


                }     
                else if (lastForecastDate === forecastDate)
                {
                    console.log("same date Data");
                }               
                else
                {
                    console.log("current Data");
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
            var imageSrc = "http://openweathermap.org/img/wn/" + cityWeather.weather[0].icon + "@2x.png";
            image.attr("src", imageSrc);
            currWeatherImageEl.empty();
            currWeatherImageEl.append(image);

            // currWeatherImageEl.attr("src", imageSrc);


            // UV Index 
            var lat = cityWeather.coord.lat;
            var lon = cityWeather.coord.lon;


            var uvIndexQuery = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
            $.ajax({
                url: uvIndexQuery,
                method: "GET"

            }).then(function (uvIndexResponse) {
                console.log(uvIndexResponse);
                currUvIndexEl.text(uvIndexResponse.value);
            });

            //set the current date
            var currentDayVar = moment();
            console.log(currentDayVar.format("MM/DD/YYYY"));
            var currentDayString = currentDayVar.format("MM/DD/YYYY");
            currDateEl.text("(" + currentDayString + ")");

            getAndDisplayFiveDayForecast(cityWeather.name);

        });

    }

    /***
     * FUNCTION CALLS
     */



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

        // add the city to the array
        if (citySearchedArray.indexOf(cityName) === -1)
            citySearchedArray.push(cityName);
        // render city names
        renderCityNames();

    });



});