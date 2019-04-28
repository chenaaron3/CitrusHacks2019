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

function addUser() {
	console.log("adding new user")
	var docRef = firestore.doc("users/" + email);
	if (!docRef.exists){
		console.log("user doesn't exist, creating new one");
		docRef.set({
			name: name,
			email: email,
			imageUrl: profPic,
			token: id,
			points: 0,
			pingsPosted: 0,
			pingsContributed: 0
		}).then(function() {
			console.log("user saved")
		}).catch(function(error) {
			console.log("Got an error: ", error);
		})
	}
	
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
		var d = new Date();
		var dateString = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
		docRef.set({
			lat: latLng.lat(),
			long: latLng.lng(),
			severity: severitylevel,
			imageUrl: image,
			date: dateString,
			description: description

		}).then(function() {
			console.log("position saved")
		}).catch(function(error) {
			console.log("Got an error: ", error);
		})

		subRef = firestore.doc("locations/" + posToString(latLng) + "/users/" + email);
		subRef.set({
			email: email,
			name: name

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
			var storageRef = storage.ref();
			var name = marker.getPosition().lat().toString() + marker.getPosition().lng().toString();
			var childRef = storageRef.child(name);
			childRef.delete();
			doc.ref.delete();

		})
	})
	
	for (var i = 0; i < markersArray.length; i++) {
		if (markersArray[i].getPosition().equals(marker.getPosition())) {
			markersArray[i].setMap(null);
			markersArray.splice(i,1);
      		break;
   		}
	}
}

function createMarker(latlng, date, severity, imageUrl, description) {
	severity = severity.toString();
	console.log("severity" + severity);
	console.log("icon: " + iconBase + severity + ".png");
	var marker = new google.maps.Marker({
		position: latlng,
		icon: iconBase + severity + ".png",
		map: map
	});


	var docRef = firestore.collection("users").doc(email);
	docRef.get().then(function(doc) {
	    docRef.update({
	    	"pingsPosted": doc.data().pingsPosted + 1,
	    	"points": doc.data().points + 1
	    })
	});



	var grReference = storage.refFromURL(imageUrl);
	var infowindow = new google.maps.InfoWindow();

	var downloadUrl = grReference.getDownloadURL().then(function(url){
		var con = `<div class="container" style="font-family:TeenageAngst">
						<div class="col">
							<div class="row-2">
								<center><h1><strong>` + date + ` - Level ` + severity + `</strong></h1></center>` +
							`</div>
							<div class="row-sm container">
								<div class="row">
									<div class="col-sm">
										<h3>` + description + `</h3>
									</div>
									<div class="col-sm">
										<img src=` + url + ` height="100" alt="" id="imagePreview" align="right" onclick="openPreview(this.src)">
									</div>
								</div>
							</div>
							<div class="row-sm container">
								<div class="row">
									<div class="col-sm">
										<center>
											<button class="clean" onclick="openCleanMenu(` + date + `,` + severity + `)"></button>										
										</center>
									</div>
									<div class="col-sm">
										<center>
											<button class="delete" onclick="deleteMarker(` + marker.getPosition().lat() + `,` +  marker.getPosition().lng() + `)">
											</button>
										</center>
									</div>
								</div>
							</div>
						</div>
					</div>`;
		console.log(con);
		infowindow.setContent(con);
	});

	marker.addListener('click', function() {
		if (isInfoWindowOpen(infowindow)){
		    infowindow.close();
		} else {
		    infowindow.open(map, marker)
		}

	});
	// marker.addListener('rightclick', function() {
	// 	removeMarker(marker);

	// });

	markersArray.push(marker);
}

function openPreview(src)
{
	console.log(src);
	document.getElementById("previewModalImg").src = src;
	$("#previewModal").modal();
}

function openCleanMenu(date, severity)
{
	console.log("opening clean menu with date: " + date + " severity: " + severity);
	$("#cleanModal").modal();
	document.getElementById("sendButton").addEventListener("click", function(e) {
	var docRef = firestore.collection("users").doc(email);
	docRef.get().then(function(doc) {
	    docRef.update({
	    	"pingsContributed": doc.data().pingsContributed + 1,
	    	"points": doc.data().points + 2 * severity
	    })
	});
});
}

function deleteMarker(lat, lng)
{
	console.log("deleting marker: " + lat + " " + lng);
	removeMarker(new google.maps.Marker({position:{lat:lat, lng:lng}}));
}

function isInfoWindowOpen(infoWindow){
    var map = infoWindow.getMap();
    return (map !== null && typeof map !== "undefined");
}




$("#profileModal").on('show.bs.modal',function()
{
	document.getElementById("profilePicture").src = profPic;
	var docRef = firestore.collection("users").doc(email);
	docRef.get().then(function(doc) {
	    if (doc.exists) {
	    	console.log(doc.data().points);
	    	document.getElementById("points").textContent = doc.data().points + " points";
	    	document.getElementById("posted").textContent = doc.data().pingsPosted + " pings posted";
	    	document.getElementById("contributed").textContent = doc.data().pingsContributed + " pings contributed";
	    } 
	}).catch(function(error) {
	    console.log("Error getting document:", error);
});
});
