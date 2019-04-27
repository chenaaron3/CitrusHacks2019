

function previewFile(){
   var preview = document.getElementById('imagePreview');
   var file = document.getElementById('imageUpload').files[0];
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

  var plasticRef = storageRef.child('plastic.jpg');

  var file = document.getElementById('imageUpload').files[0];
  plasticRef.put(file).then(function(snapshot) {
    console.log('Uploaded a blob or file!');
  });
};