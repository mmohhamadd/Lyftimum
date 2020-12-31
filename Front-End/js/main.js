let state = 0;
var mymap = L.map("mapid").setView([35.704008, 51.40872], 13);
let origin;
let destination;
let firstpolyline;


var GeoSearchControl = window.GeoSearch.GeoSearchControl;
var OpenStreetMapProvider = window.GeoSearch.OpenStreetMapProvider;

// remaining is the same as in the docs, accept for the var instead of const declarations
var provider = new OpenStreetMapProvider({
  params: {
    countrycodes: 'ir,IR'
  }
});

var searchControl = new GeoSearchControl({
  style: 'bar',
  provider: provider,
});


mymap.addControl(searchControl);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWhzYW5zaDk3IiwiYSI6ImNraW5lbGVyYjEyNnQyeWp6aDVwc291MW4ifQ.1d-Wat6Ytx3KtpP6bUtgBQ",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "your.mapbox.access.token",
  }
).addTo(mymap);

var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(mymap);
}

function centerLeafletMapOnMarker(map, marker) {
  var latLngs = [ marker.getLatLng() ];
  var markerBounds = L.latLngBounds(latLngs);
  map.fitBounds(markerBounds , {padding: [100, 100]});
}

function drawLinebetween(origin, destination ){
  var pointA = new L.LatLng(origin.lat, origin.lng);
  var pointB = new L.LatLng(destination.lat, destination.lng);
  var pointList = [pointA, pointB];
  firstpolyline = new L.Polyline(pointList, {
    color: '#3ACCE1',
    weight: 3,
    opacity: 0.7,
    smoothFactor: 1
});
mymap.addLayer(firstpolyline);//For show
}

function centerLeafletMapOnpath(map, o_lat, o_lng, d_lat, d_lng) {
  map.fitBounds([
    [o_lat, o_lng],
    [d_lat, d_lng]
  ], {padding: [100,100]});
}


function setCoordinates(e) {
  let Lat = e.latlng.lat;
  let Lng = e.latlng.lng;

  console.log(Lat, Lng);
  console.log(state);
  if (state === 0) {
    origin = e.latlng;
    origin_marker = L.marker([Lat, Lng])
      .addTo(mymap)
      .bindPopup("<b>Origin</b>")
      .openPopup();
    $.get(
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=".concat(
        Lat,
        "&lon=",
        Lng
      ),
      function (data) {
        let origin_name = data.address.neighbourhood;
        console.log(data.address.road);
        document.getElementById('description').innerHTML = '<span id="origin">'.concat(
          origin_name,
          '</span style="color:"><span style="color: #A1A3AC"> to </span><span id="destination">...</span>'
        );
      }
    );
    
    state = 1;
    mymap.setView([origin.lat, origin.lng], 14); 
    // centerLeafletMapOnMarker(mymap, origin_marker);
  } else if (state === 1) {
    destination = e.latlng;
    destination_marker = L.marker([Lat, Lng])
      .addTo(mymap)
      .bindPopup("<b>Destination</b>")
      .openPopup();
    $.get(
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=".concat(
        Lat,
        "&lon=",
        Lng
      ),
      function (data) {
        let destination_name = data.address.neighbourhood;
        console.log(data.address);
        document.getElementById("destination").innerHTML = destination_name;
      }
    );

    document.getElementById("acceptButton").style.display = "inline-block";

    state = 2;
    centerLeafletMapOnpath(mymap, origin.lat, origin.lng, destination.lat, destination.lng);
    drawLinebetween(origin, destination);
  } else if (state === 2) {
    document.getElementById("acceptButton").style.display = "none";
    origin = e.latlng;
    mymap.removeLayer(origin_marker);
    mymap.removeLayer(destination_marker);
    mymap.removeLayer(firstpolyline);
    origin_marker = L.marker([Lat, Lng])
      .addTo(mymap)
      .bindPopup("<b>Origin</b>")
      .openPopup();

    $.get(
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=".concat(
        Lat,
        "&lon=",
        Lng
      ),
      function (data) {
        let origin_name = data.address.neighbourhood;
        console.log(data.address.road);
        document.getElementById(
          "description"
        ).innerHTML = '<span id="origin">'.concat(
          origin_name,
          '</span><span style="color: #A1A3AC"> to </span><span id="destination">...</span>'
        );
      }
    );
    state = 1;
    // centerLeafletMapOnMarker(mymap, origin_marker);
    mymap.setView([origin.lat, origin.lng], 13); 
    mymap.removeLayer(firstpolyline);
  }
}


  

mymap.on("click", onMapClick);
mymap.on("click", setCoordinates);
mymap.addControl(searchControl);




async function fetch_prices() {

  let tap30_requestData = {
    "origin":{"latitude": origin.lat,
    "longitude": origin.lng },
    "destinations":[{"latitude": destination.lat ,"longitude": destination.lng}]
  };

  let usersPromise = await fetch("https://tap33.me/api/v2.3/ride/preview", {
    headers: {
      "x-authorization" : "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo1OTAwNzYsInJvbGUiOiJQQVNTRU5HRVIiLCJjaXR5IjoiVEVIUkFOIn0sImlhdCI6MTYwNTMxMDg4NiwiYXVkIjoiZG9yb3Noa2U6YXBwIiwiaXNzIjoiZG9yb3Noa2U6c2VydmVyIiwic3ViIjoiZG9yb3Noa2U6dG9rZW4ifQ.N8MIJEEoEnoXb7jr7AReONJyR73mLd4Wq1bhr7cYEgrxMMVOYRTPop0vRbJ-FSiUKlWWATwCGmIthVzm3ktEdw" ,
      "Content-Type": "application/json",
    },

    method: "POST",
    body: JSON.stringify(tap30_requestData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Got non-2XX response from API server.");
      }
      return response.json();
    })
    .then((json) => {
      tap30_price = json.data.categories[1].services[0].prices[0].passengerShare;
      var baseRow = document.getElementById("baseRow");
      baseRow.innerHTML = "<div class='base__arrow col-1'><img src='./img/ico.svg' onclick='backArrow()' alt=up-arrow' /></div><div class='col-5'><div id='tap30Price' onclick='tap30_redirect()' class='base__place--tap30'>".concat(
        "Tap30: ",
        tap30_price,
        "</div></div><div class='col-5'><div id='snappPrice' onclick='snapp_redirect()' class='base__place--snapp'>Wait!</div></div>"
      );
    });

  let snapp_requestData = {
    points: [
      {
        "lat": String(origin.lat.toFixed(14)),
        "lng": String(origin.lng.toFixed(14)),
      },
      {
        "lat": String(destination.lat.toFixed(14)),
        "lng": String(destination.lng.toFixed(14)),
      },
      null,
    ],
    waiting: null,
    tag: 0,
    round_trip: false,
    voucher_code: null,
    service_types: [1, 2],
  };
  var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
  targetUrl = 'https://app.snapp.taxi/api/api-base/v2/passenger/newprice/s/6/0'

  let usersPromise_snapp = await fetch(
    proxyUrl + targetUrl,
    {
      headers: {
        'authorization' : 'Bearer eyJhbGciOiJSUzUxMiIsImtpZCI6Ino4YTRsNG9PRkVxZ2VoUllEQlpQK2ZwclBuTERMbWFia3NsT3hWVnBMTkUiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsicGFzc2VuZ2VyIl0sImVtYWlsIjoibW1vaGhhbWFkZEBnbWFpbC5jb20iLCJleHAiOjE2MTAwOTY4ODMsImlhdCI6MTYwODg4NzI4MywiaXNzIjoxLCJqdGkiOiJzY2dXQTBhUUVldUpyd0lBckJCTTVZK210ZjRMQVVxcGlQQzRJMmxWWDN3Iiwic2lkIjoiMWxUaDJxMEw5RUk5N29rblhCTFFlMDFJTFpVIiwic3ViIjoiem9CSzJOSnl5TzJtOHlZIn0.qEbqt-WLTnx8VtNGCVh9C0xtMvbyKeIgkLZsE0wCYQN1ikwYLbTZCokwtw4VqRUnH2cEyhLEADvZzBMpB-T_R9utuGGRf3drZdAWLhebbTO_8dOUVMd3WipIeubY9UxSQptPsGBpirzVmzjUMoMMZRYOO-QbMs03yVhziZnAB8HwBz05drYDy14pfwZb61JgOtXQxVanoScjQcup3JAiI8ZVh9-j88EbaQVEqloBFyGPsUnhqKdp71nlM5fzq87oaW0x5Ks_DNsy9IqkDtObbw0FeODnFDQlE_IMYlNDz6lfeij89Bb6o2sxShAgRFAjTRavxB21VIIpmTlpeX57MBXyinkgK0xL8qy99Nu6uUZiwjpZMIPc5Tvxqiq3_4OkQzz_cWevMaGz8iGEP7xdzhotGVTrMdNnXKAtsjnYvioLmtwulWJZQ0QmGo7F-eQcae2SH2o5XO12_cIlpzKqtA9pxE30vmRcvLF0FSIqxjswvsigIxfTvKPpxdkAWZERJN-bjMUN8xPtyi6QB0u5tpAlYWXlq11w15lQuI0IBIe4ETC1mTVkagzTDnQGlOdAs_QENAURSKOZfQZu9-lLqOQw0Z9jL4RJzw2OyGFwCFpvFS7KK8N8sci0QDctyoZKgKjreovHlK80k7lEPT7-ZlXHT-sGg4hswSw0Gjbu72g',
        'content-type' : 'application/json'
      },

      method: 'POST',
      body: JSON.stringify(snapp_requestData),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Got non-2XX response from API server.");
      }
      return response.json();
    })
    .then((json) => {
      snapp_price = json.data.prices[0].final/10;
      var baseRow = document.getElementById("snappPrice");
      baseRow.innerHTML = "Snapp: ".concat(snapp_price);
      console.log(snapp_price)
    });
}


function acceptButtonClicked(){
    state = 3;
    fetch_prices();
}

function tap30_redirect(){
  window.location.replace('https://app.tapsi.cab/');
}

function snapp_redirect(){
  window.location.replace('https://app.snapp.taxi/pre-ride?utm_source=website&utm_medium=webapp-button');
}


function backArrow(){
    if (state === 0){
        window.location.replace('index.html');
    }
    if (state == 3){
      mymap.removeLayer(origin_marker);
      mymap.removeLayer(destination_marker);
      mymap.removeLayer(firstpolyline);
      var baseRow = document.getElementById("baseRow");
      baseRow.innerHTML = "<div class='base__place col-9'><h5 id='description'>Choose your origin and destination</h5></div><div class='base__accept col-3'><button id='acceptButton' class='btn__accept' onclick='acceptButtonClicked()'>Accept</button></div>"
      document.getElementById("acceptButton").style.display = "none";
      state = 0;
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
  document.getElementById("acceptButton").style.display = "none";
});
