

function previewFile(previewID, fileID){
   var preview = document.getElementById(previewID);
   var file = document.getElementById(fileID).files[0];
   var reader  = new FileReader();

   reader.onloadend = function () {
   	   console.log(reader.result);
       preview.src = reader.result;
   }

   if (file) {
       reader.readAsDataURL(file); //reads the data as a URL
   } else {
       preview.src = "";
   }
}

document.getElementById('uploadButton').onclick = function() {
  console.log("uploading file to firestore")

  var storageRef = storage.ref();

  var latlng = currentMarker.getPosition();
  var name = posToString(latlng)
  var description = document.getElementById('description').value;
  var plasticRef = storageRef.child(name);

  var radioValue = $("input[name='intensity']:checked").val();
            

  var file = document.getElementById('imageUpload').files[0];
  plasticRef.put(file).then(function(snapshot) {
    console.log('Uploaded a blob or file!'); 
    addLocation(latlng, radioValue, 'gs://citrushack2019-a7dd9.appspot.com/' + name, description);
    getRealTimeUpdates(map);
  });

};