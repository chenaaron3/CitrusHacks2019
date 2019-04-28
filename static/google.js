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
        onSignIn(googleUser);
      }, function(error) {
        alert(JSON.stringify(error, undefined, 2));
      });
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var em = profile.getEmail().toString();
  var token = googleUser.getAuthResponse().id_token.toString();
  console.log('ID: ' + token); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + em); // This is null if the 'email' scope is not present.

  $.get('/', { email: em, id_token: token }, function(data) {
    console.log("PRINTING OUT POST DATA");
    console.log(data);
  }, "text");
}


