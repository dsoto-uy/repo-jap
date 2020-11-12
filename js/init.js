
const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

const MAX_RATING = 5;
var currentUser = "";


var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function (url) {
  var result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

document.addEventListener("DOMContentLoaded", function (e) {
  //ENTREGA 4: Se obtiene el usuario logueado y se convierte en un objeto
  currentUser = JSON.parse(localStorage.getItem("currentUser"));

  //ENTREGA 4:Si no existe usuario logueado (currentUser es null), se agrega a la NavBar el link para iniciar sesión
  if (currentUser === null) {
    document.getElementById("navBarOptions").innerHTML += `  
  <a class="py-2 d-none d-md-inline-block" id="signInLink" href="index.html">Iniciar Sesión</a>
  `;
  } else {
    //ENTREGA 4: Si existe usuario logueado, se agrega a la navBar un botón con el nombre de usuario y un DropDown con acceso al carrito, perfil y a cerrar sesión.
    navBarUserMenu(currentUser);
  }
});

//ENTREGA 4: Se crea la función para agregar el botón con funcionalidad DropDown en la barra de navegación.
//El dropdown contiene acceso al carrito, perfil de usuario y a la funcionalidad de cerrar sesión.
//Se usa el evento onclick del link de cerrar sesión para ejecutar la función signOut(), detallada mas abajo.
function navBarUserMenu(user) {

  document.getElementById("navBarOptions").innerHTML += `
  <div id="currentUserDropdown" class="dropdown">
  <button id="currentUserDropdownBtn" class="btn btn-primary py-2 d-none d-md-inline-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">`+ user.firstName + " " + user.lastName + `</button>
    <div class="dropdown-menu dropdown-menu-right animate slideIn">
      <a class="dropdown-item m-0" href="cart.html"><i class="fas fa-shopping-cart mr-2"></i> Mi Carrito</a>
      <a class="dropdown-item m-0" href="my-profile.html"><i class="fas fa-user mr-2"></i> Mi Perfil</a>
      <div class="dropdown-divider m-0"></div>
      <a class="dropdown-item m-0" onclick="signOut();" href="index.html"><i class="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión</a>
    </div>
  </div>  
`;

}

//ENTREGA 4: Se crea la funcion signOut() la cual se activa cuando el usuario hace click en "Cerrar Sesión". 
//Esta función quita del localStorage al usuario logueado y redirige a la pantalla de login (index.html).
function signOut() {

  if (currentUser != null) { //chequeo si existe usuario, puede no ser necesario ya que si no hay usuario no hay botón para cerrar sesión.

    localStorage.removeItem("currentUser");
    currentUser = null;
  }
}