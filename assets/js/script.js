//Load recent searches from local storage

loadData();
function loadData() {
    if (localStorage.getItem("searches")) {
        var searches = JSON.parse(localStorage.getItem("searches"));
        
        for (var i=0; i < searches.length; i++) {
            allCampsites(searches[i]);
        }
    }
};


// Load Map

var mymap = L.map('map').setView([39.833338, -98.890899], 4);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);


// Get Campsite Coords/Name/Url

function allCampsites(state) {
    Promise.all([
        fetch("https://developer.nps.gov/api/v1/campgrounds?stateCode=" + state + "&limit=50&start=0&api_key=UvgAMzaiAVvGaHIArhZU2CAxBdpxtaKQBrhjcWMO"),
        fetch("https://developer.nps.gov/api/v1/campgrounds?stateCode=" + state + "&limit=50&start=50&api_key=UvgAMzaiAVvGaHIArhZU2CAxBdpxtaKQBrhjcWMO")
    ]).then(function (responses) {

        return Promise.all(responses.map(function (response) {
            return response.json();
        }));
    }).then(function (data) {

        for (var k=0; k < data.length; k++) {
            for (var i=0; i < data[k].data.length; i++) {    
                getCampsiteWeather(data[k].data[i].latitude, data[k].data[i].longitude, data[k].data[i].name, data[k].data[i].url, data[k].data[i].campsites.totalSites);
            }
        }
        
    })
}


// Search By State & Save Search to Local Storage

var searches = [];
$("#search-btn").on("click", function() {
    var state = $("#search-bar").val();
    

    allCampsites(state);    

    searches.push($("#search-bar").val());
    localStorage.setItem('searches', JSON.stringify(searches));
});



// Get Weather With Campsite Coords & Display

function getCampsiteWeather(lat, lon, campsiteName, campsiteUrl, totalSites) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude={part}&appid=a17effb6e2f6f4faab4898274ceedfa4";
    fetch(apiUrl)
      .then(function(response) {
        return response.json();
        })
    .then(function(data) {

        var marker = L.marker([lat, lon]).addTo(mymap);
        
        marker.bindPopup("<img src='http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png'>" + "<br><b>" + campsiteName + "</b><br><a href=" + campsiteUrl + "  target='_blank'>" + campsiteUrl + "</a><br><br id='"+ lat +"'>" + lat + " <br id='"+ lon +"'>" + lon + "<br><br> Total Sites: " + totalSites + "<br>" + "<b> Current Weather:  "  + data.current.weather[0].description + ", " + (Math.round(((((data.current.temp)-273.15)*1.8)+32))) + " °F<b><br>").openPopup();
    });
};


// Clear Local Storage & Reload Page

$("#clear-btn").on("click", function() {
    localStorage.clear();
    location.reload();
});