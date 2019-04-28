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
  var name = profile.getName();
  var profPic = profile.getImageUrl();
  console.log('ID: ' + token); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + name);
  console.log('Image URL: ' + profPic);
  console.log('Email: ' + em); // This is null if the 'email' scope is not present.

  $.get('/', { email: em, id_token: token, name:name, profPic:profPic }, function(data) {
      document.location.href = '/map?email=' + em + "&name=" + name + "&profPic=" + profPic + "&id_token=" + token;
  });
}


