var googleUser = {};
var startApp = function() {
  gapi.load('auth2', function(){
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id: '876422418130-atpik8jvn83t8bgnr8j14aj8pbcjp51t.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      //scope: 'additional_scope'
    });
    attachSignin(document.getElementById('login'));
  });
};

function attachSignin(element) {
  console.log(element.id);
  auth2.attachClickHandler(element, {},
      function(googleUser) {
        /*document.getElementById('name').innerText = "Signed in: " +
            googleUser.getBasicProfile().getName();*/
      }, function(error) {
        alert(JSON.stringify(error, undefined, 2));
      });
}


