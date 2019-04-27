
var storage = firebase.storage();

var storageRef = storage.ref();

//var file = ... // use the Blob or File API
storageRef.put(file).then(function(snapshot) {
  console.log('Uploaded a blob or file!');
});