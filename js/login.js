//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
//CLIENT_ID_TESTING
//const CLIENT_ID = "880069710415-2f4rpegucor1qqghmgke263m6h8g3k39.apps.googleusercontent.com";
//CLIENT_ID PROD
const CLIENT_ID = "880069710415-9m83rj0jleuh55bsfct1gart0c9ta3d0.apps.googleusercontent.com";

var currentUser;
var googleUser = {};

document.addEventListener("DOMContentLoaded", function (e) {
  showGoogleButton();
  startApp();

  document.getElementById("btnLogIn").addEventListener("click", function () {
    loginWithForm();
  });

});

function showGoogleButton() {

  let htmlContentToAppend = "";
  htmlContentToAppend += `<button id= "btnGoogle" class="btn btn-lg btn-google btn-block text-uppercase" type="submit"><i class="fab fa-google mr-2""></i> Iniciar Sesion con Google</button>`
  document.getElementById("botonGoogle").innerHTML = htmlContentToAppend;
}

var startApp = function () {
  gapi.load('auth2', function () {
    auth2 = gapi.auth2.init({
      client_id: CLIENT_ID,     
      cookiepolicy: 'single_host_origin',
      scope: 'profile',
    });
    attachSignin(document.getElementById('btnGoogle'));
  });
};

function attachSignin(element) {
  console.log(element.id);
  auth2.attachClickHandler(element, {},
    function (googleUser) {
      currentUser ='{'+
                    '"firstName":"' + googleUser.getBasicProfile().getGivenName() +
                    '",  "lastName":"' + googleUser.getBasicProfile().getFamilyName() +
                    '", "email":"' + googleUser.getBasicProfile().getEmail() +
                    '"}';
     // window.localStorage.clear();
      window.localStorage.setItem("currentUser", currentUser);
      /* document.getElementById('botonGoogle').innerText = "Sesión iniciada como: " +
           googleUser.getBasicProfile().getName();  */
      window.location.replace("home.html");
    }, function (error) {
      //alert(JSON.stringify(error, undefined, 2));
      window.location.reload();
    });
}

function loginWithForm() {

  let email = document.getElementById("inputEmail").value;
  let firstName = email.substr(0, email.indexOf('@'));
  var currentUser =
                    '{' +
                    '"firstName":"' + firstName +
                    '","lastName":"' + "" +
                    '", "email":"' + email +
                    '"}';
 // window.localStorage.clear();
  window.localStorage.setItem("currentUser", currentUser);
}