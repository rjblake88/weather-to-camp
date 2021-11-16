

function getCampsites() {
    var apiUrl = "https://developer.nps.gov/api/v1/campgrounds?stateCode=CA&limit=50&start=0&api_key=UvgAMzaiAVvGaHIArhZU2CAxBdpxtaKQBrhjcWMO";
    fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data.data[0].latitude + "  " + data.data[0].longitude);
    });
};

getCampsites();

$("#search-btn").on("click", function() {
    navigator.geolocation.getCurrentPosition(success, error, options);

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }


    function success(pos) {
        var crd = pos.coords;
        var mymap = L.map('map').setView([crd.latitude, crd.longitude], 9);

        L.marker([36.4646681174428, -118.66967218847]).addTo(mymap);
        L.marker([34.0143426535482, -119.367763068282]).addTo(mymap);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(mymap);
    }
});

$("#map").on("click", function() { 
    $("#card1").removeAttr("style");
});