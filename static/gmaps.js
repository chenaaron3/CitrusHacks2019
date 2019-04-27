// Initialize Firebase
var config = {
	apiKey: "AIzaSyBRUeNxucAPyphAtZWgxSWR_fCPIJPvAfo",
	authDomain: "citrushack2019-a7dd9.firebaseapp.com",
	databaseURL: "https://citrushack2019-a7dd9.firebaseio.com",
	projectId: "citrushack2019-a7dd9",
	storageBucket: "citrushack2019-a7dd9.appspot.com",
	messagingSenderId: "876422418130"
};
firebase.initializeApp(config);

var firestore = firebase.firestore();
var storage = firebase.storage();

var markersArray = [];


function posToString(latLng) {
	return latLng.lat().toString() + latLng.lng().toString();
}

function isNewMarker(latlng) {
	for (var i = 0; i < markersArray.length; i++) {
		if (markersArray[i].getPosition().equals(latlng)) {
			return false;
		}
	}
	return true;
}


getRealTimeUpdates = function(map) {
	console.log("updating")
	firestore.collection("locations")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            myData = doc.data();
            if (isNewMarker(new google.maps.LatLng(myData.lat, myData.long))) {
            	console.log(doc.id, " => ", myData);
            	latlng = {lat: myData.lat, lng: myData.long};
            	createMarker(latlng, myData.date, myData.severity, myData.imageUrl, myData.description);
            }
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}


function addLocation(latLng, severitylevel, image, description) {
	console.log(latLng);
	var docRef = firestore.doc("locations/" + posToString(latLng));
	console.log(docRef);
	if (!docRef.exists){
		console.log("marker doesn't exist, creating new one");
		docRef.set({
			lat: latLng.lat(),
			long: latLng.lng(),
			severity: severitylevel,
			imageUrl: image,
			date: (new Date()).toString(),
			description: description
		}).then(function() {
			console.log("position saved")
		}).catch(function(error) {
			console.log("Got an error: ", error);
		})
	}	
}

function removeMarker(marker) {
	console.log(marker.getPosition())
	firestore.collection("locations")
	.where("lat", "==", marker.getPosition().lat())
	.where("long", "==", marker.getPosition().lng())
	.get()
	.then(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			doc.ref.delete();
		})
	})
	
	marker.setMap(null);
	for (var i = 0; i < markersArray.length; i++) {
		if (markersArray[i].getPosition().equals(marker.getPosition())) {
			markersArray.splice(i,1);
      		break;
   		}
	}
}

function createMarker(latlng, date, severity, imageUrl, description) {
	var marker = new google.maps.Marker({
		position: latlng,
		icon: trashicon,
		map: map
	});
	console.log("imgurl: " + imageUrl);
	var grReference = storage.refFromURL(imageUrl);
	console.log("Reference: " + grReference);


	var infowindow = new google.maps.InfoWindow();
	var downloadUrl = grReference.getDownloadURL().then(function(url){
		var con = '<strong>' + date + '- Level ' + severity + '</strong><br> <img src=' + url + ' height="50" alt="" id="imagePreview">' + description;
		console.log("con: " + con);
		infowindow.setContent(con);
	});

	// console.log("dnldurl: " + downloadUrl);
	// console.log("dnldurl string: " + downloadUrl.toString());

	// var con = '<strong>' + date + '- Level ' + severity + '</strong><br> <img src=' + downloadUrl + ' height="200" alt="" id="imagePreview">' + description;
	// console.log("con: " + con);

	// var infowindow = new google.maps.InfoWindow({
 //          content: con
 //        });

	marker.addListener('click', function() {
		//removeMarker(marker);
		infowindow.open(map, marker)
	});
	markersArray.push(marker);
}