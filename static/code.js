var map, infoWindow, pos;
var currentMarker;
var iconBase = "https://achenheroku.herokuapp.com/static/Images/ping_";

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 10,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false
  });
  infoWindow = new google.maps.InfoWindow;
  addUser();
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      currentMarker = new google.maps.Marker({
        position: pos,
        map: map,
        animation: google.maps.Animation.DROP
      })
      
      map.setCenter(pos);
      map.addListener('click', function(e) {
        currentMarker.setMap(null);
        currentMarker = new google.maps.Marker({
          position: e.latLng,
          map: map,
          animation: google.maps.Animation.DROP,

        });
        map.panTo(e.latLng);
      });

      /*document.getElementById('ping').onclick = function() {
      	console.log("clicked ping " + pos)
        addLocation(new google.maps.LatLng(pos), map, 5, 'gs://citrushack2019-a7dd9.appspot.com/download.jpg');
        getRealTimeUpdates(map);
      };*/

      getRealTimeUpdates(map);

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}