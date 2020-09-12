$(document).ready(function () {

    console.log("Document ready");


    /**
     * GLOBAL VARIABLES
     * 
     */
    var citySearchedArray = [];


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

        // add the city to the array
        if (citySearchedArray.indexOf(cityName) === -1)
            citySearchedArray.push(cityName);
        // render city names
        renderCityNames();

    });



});