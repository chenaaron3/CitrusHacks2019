var map, infoWindow, pos;
var currentMarker;
var iconBase = "https://achenheroku.herokuapp.com/static/Images/ping_";
var email = document.getElementById("email").textContent;
var name = document.getElementById("name").textContent;
var profPic = document.getElementById("profPic").textContent;
var id = document.getElementById("id").textContent;

console.log(email);
console.log(id);
console.log(name);
console.log(profPic);
addUser();

$("#myModal").on('show.bs.modal', function(){
   alert("Hello World!");
});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 10,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false
  });
  infoWindow = new google.maps.InfoWindow;

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