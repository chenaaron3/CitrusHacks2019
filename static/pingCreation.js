function previewFile(){
   var preview = document.getElementById('imagePreview');
   var file    = document.getElementById('imageUpload').files[0];
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