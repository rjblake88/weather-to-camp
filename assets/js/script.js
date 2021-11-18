// Load Map & Markers

var mymap = L.map('map').setView([39.833338, -98.890899], 4);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);


// Get Campsite Coords/name/Url

function getCampsites(state) {
    var apiUrl = "https://developer.nps.gov/api/v1/campgrounds?stateCode=" + state + "&limit=50&start=0&api_key=UvgAMzaiAVvGaHIArhZU2CAxBdpxtaKQBrhjcWMO";
    fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            for (var i=0; i < data.data.length; i++) {
            getCampsiteWeather(data.data[i].latitude, data.data[i].longitude, data.data[i].name, data.data[i].url);
            }
        });
};


// Search By State

$("#search-btn").on("click", function() {
    var state = $("#search-bar").val();
    getCampsites(state);
});


// Get Weather With Campsite Coords & Display

function getCampsiteWeather(lat, lon, campsiteName, campsiteUrl) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude={part}&appid=b451e261be7a552705f2a22389c1a371";
    fetch(apiUrl)
      .then(function(response) {
        return response.json();
        })
    .then(function(data) {
        var marker = L.marker([lat, lon]).addTo(mymap);
        marker.bindPopup("<b>" + campsiteName + "</b><br><a href=" + campsiteUrl + "  target='_blank'>" + campsiteUrl + "</a><br><b> Current Weather: " + data.current.weather[0].description + ", " + (Math.round(((((data.current.temp)-273.15)*1.8)+32))) + " °F</b>" ).openPopup();
        console.log(data);
    });
};