//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
const CLIENT_ID = "880069710415-2f4rpegucor1qqghmgke263m6h8g3k39.apps.googleusercontent.com";

document.addEventListener("DOMContentLoaded", function(e){
    showGoogleButton();   
});

function showGoogleButton(){

    let htmlContentToAppend = "";
    
   /* htmlContentToAppend += `<button class="btn btn-lg btn-google btn-block text-uppercase" type="submit"><i class="fab fa-google mr-2"></i> Iniciar Sesion con Google</button>`*/
htmlContentToAppend += `<button class="btn btn-lg btn-google btn-block text-uppercase" type="submit" onClick="signIn()"><i class="fab fa-google mr-2 customGPlusSignIn""></i> Iniciar Sesion con Google</button>`

    document.getElementById("botonGoogle").innerHTML = htmlContentToAppend;
}

var googleUser = {};
  function signIn() {    
    gapi.load('auth2', function(){            
      auth2 = gapi.auth2.init({
        client_id: CLIENT_ID,                
        cookiepolicy: 'single_host_origin',      
      });
      alert("asdasds");
      alert(googleUser.getBasicProfile().getName());
    });
  };

  /*function attachSignin(element) {
    console.log(element.id);
    auth2.attachClickHandler(element, {},
        function(googleUser) {
          document.getElementById('botonGoogle').innerText = "Signed in: " +
              googleUser.getBasicProfile().getName();
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }*/