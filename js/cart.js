const VIDEOGAMES_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json"
const DOLAR = "USD"; //código de la moneda DOLAR
const PESO_UY = "UYU"; // código de la moneda PESOS
const CAMBIO_DOLAR_UYU = 40; //valor de 1 dolar en pesos, se usa para las conversiones
const CURRENCY_LIST = [{ id: "USD", description: "Dólar (U$S)" }, { id: "UYU", description: "Peso Uruguayo ($)" }]; // lista de monedas disponibles
//lista de opciones de envío disponibles
const SHIPPING_OPTIONS = [{ id: "STANDARD", description: "Standard 12 a 15 dias", shippingPercentage: 5 }, { id: "EXPRESS", description: "Express 5 a 8 días", shippingPercentage: 7 }, { id: "PREMIUM", description: "Premium 2 a 5 días", shippingPercentage: 15 }];
const DEFAULT_CURRENCY = CURRENCY_LIST[0]; //moneda predeterminada, se inicializa con la primer opción disponible
const DEFAULT_SHIPPING = SHIPPING_OPTIONS[0];

var selectedCurrency = DEFAULT_CURRENCY.id; // última moneda seleccionada, se inicializa con el valor de la moneda predeterminada.
var selectedShipping = DEFAULT_SHIPPING; //último metodo de envìo seleccionado, se inicializa con la primer opción disponible.

//función para mostrar el dropdown de selección de monedas, toma como parámetro un array conteniendo las monedas.
function showCartCurrencySelector(currencyArray) {

    //inicializo una variable que va a contener solo las opciones del dropdown de monedas.
    htmlCurrencyDropDownOptions = ``;

    //recorro el array de monedas y agrego, al html de las opciones, un botón por cada item del array.
    //agrego como value del botón el ID de moneda ("UYU","USD") y como texto agrego la descripción.
    /*se usa la función setCurrency(moneda,texto) que toma el id de la moneda (value del botón) y la descripción (texto del botón) 
    para asignarlo al texto del botòn principal del dropdown*/
    currencyArray.forEach(currency => {

        htmlCurrencyDropDownOptions += `
        <button class="dropdown-item currency-dropdown-item" onclick="setCurrency(this.value,this.innerText);" value="`+ currency.id + `" href="#">` + currency.description + `</button>`;

    });

    // inicializo el html de la estructura del dropdown y le concateno el html de las opciones.
    //se pone como descripción inicial la descripción de la moneda default.
   let htmlCurrencyDropdown = `
    <div class="dropdown">
        <button class="btn btn-secondary btn-sm dropdown-toggle text-right selectorMoneda " type="button" id="dropdownCurrencyButton" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">`+ DEFAULT_CURRENCY.description +
        `</button>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">`
        + htmlCurrencyDropDownOptions +
        `</div>
    </div>
    <div class=" mr-3 pt-1 text-center">
        Mostrar moneda en:
    </div>
    `;
    document.getElementById("cart-currency").innerHTML = htmlCurrencyDropdown;//se agrega el elemento a la página
}

//muestra los productos y los totales a partir de un array de productos
function showCartProductsAndTotalCost(array) {
    
    let htmlProduct = ``; //defino la variable que va a contener el html de productos
    let posProd = 0; //defino un contador para ayudar a identificar los productos.

    //recorro los productos
    array.forEach(product => {

        let subtotalProducto = setCurrencyFormat(convertirMoneda(product.currency, (product.unitcost * product.count))); //convierto el subtotal del producto de acuerdo a la moneda seleccionada
        let unitCost = setCurrencyFormat(convertirMoneda(product.currency, product.unitCost)); //convierto el costo unitario de acuerdo a la moneda seleccionada

        //agrego un id al costo unitario para identificarlo al cambiar la moneda
        //el el input de cantidad agrego un campo data que me dice la posición del subtotal que estoy cambiando.
        //en la columna del subtotal agrego un campo "data-currency" para guardar la moneda original y un campo "data-unitCost" para guardar el precio unitario en la moneda original.
        htmlProduct += `<tr class= "row">
                            <td scope="col" class="col"><img class="img-thumbnail" src="`+ product.src + `" alt="producto"></td>
                            <td scope="col" class="col">`+ product.name + `</td>
                            <td scope="col" class="col" id="prod-` + posProd + `-unitcost">` + unitCost + `</td>
                            <td scope="col" class="col">
                            <input class="form-control prodCant" data-posProd="`+ posProd + `" name="prod-cant" type="number" min="1" placeholder="Cant." value ="` + product.count + `" ></input>                        
                            </td>
                            <td scope="col" class="col" data-currency="`+ product.currency + `" data-unitCost="` + product.unitCost + `" id="prod-` + posProd + `-subtotal"><strong>` + subtotalProducto + `</strong></td>
                        </tr>`
        posProd++; //aumento el contador en cada iteración.
    });

    document.getElementById("cart-products").innerHTML = htmlProduct; //agregan los productos a la página
    
    actualizarImportes(selectedShipping.shippingPercentage);// Actualizo los totales de acuerdo al default shipping

    var element = document.getElementsByName("prod-cant"); //Obtengo todos los input de cantidad de producto (el nombre es el mismo en todos) para agregar los listeners.

    //recorro los input y agrego el listener por cada uno
    element.forEach(element => {
        element.addEventListener('change', function () {
            
            let selectedPercentage; //inicalizo una variable para guardar el porcentaje seleccionado
            let htmlShippingOptions = document.getElementsByName("radio-shipping-option"); // obtengo todos los radio button del tipo de envío

            //recorro los radiobutton y tomo el valor del que se encuentra seleccionado
            htmlShippingOptions.forEach(option => {
                if (option.checked) {
                    selectedPercentage = option.value; //guardo el valor en la variable selectedPercentaje
                }
            });
            actualizarImportes(selectedPercentage); //actualizo los totales usando el porcentaje seleccionado.
        });
    });


}

//muestra las opciones de envío, toma como parámetro el array de opciones de envío SHIPPING_OPTIONS
function showShippingOptions(shippingOptionsArray) {

    //inicializo la variable que va a contener el html de los tipos de envío
   let htmlOptions = ``;

    //recorro el array de opciones 
    shippingOptionsArray.forEach(shippingOption => {

        //si el id del elemento coincide con el id default del envío, lo marco como checked
        if (shippingOption.id == selectedShipping.id) {
            htmlOptions += `
        <div class="radio">
        <label><input type="radio" name="radio-shipping-option" onclick="actualizarImportes(`+ shippingOption.shippingPercentage + `);" value=` + shippingOption.shippingPercentage + ` checked> ` + shippingOption.description + " (" + shippingOption.shippingPercentage + `%)</label>
        </div>
        `;
        }//si no coincide, simplemente lo agrego.
        else {
            htmlOptions += `
            <div class="radio">
            <label><input type="radio" name="radio-shipping-option" onclick="actualizarImportes(`+ shippingOption.shippingPercentage + `);" value=` + shippingOption.shippingPercentage + `> ` + shippingOption.description + " (" + shippingOption.shippingPercentage + `%)</label>
            </div>
            `;
        }
    });

    let htmlShippingOptions = `<h4 class="mb-3" > Tipo de Envío</h4 >`+ htmlOptions; //agrego un título a los tipos de envío y le concateno las opciones

    document.getElementById("shipping-options").innerHTML = htmlShippingOptions; //agrego el html a la página
}

//función que setea la moneda seleccionada por el usuario y actualiza todos los importes en base a dicha moneda.
function setCurrency(moneda, texto) {

    selectedCurrency = moneda; //guardo la moneda que viene como parametro en la variable global selectedCurrency
    document.getElementById("dropdownCurrencyButton").innerText = texto; // cambio el texto del botòn principal del dropdown por la descripción de la moneda seleccionada.
    let selectedPercentage; //defino una variable que va a guardar el porcentaje seleccionado.
    htmlShippingOptions = document.getElementsByName("radio-shipping-option"); //obtengo mediante el nombre, la colección de los radiobutton de los tipos de envío.
    
    // recorro los elementos radiobutton 
    htmlShippingOptions.forEach(option => {
        if (option.checked) { 
            selectedPercentage = option.value; //si el radiobutton está seleccionado, guardo el porcentaje en la variable selectedPercentage.
        }
    });
    actualizarImportes(selectedPercentage); //actualizo los importes de acuerdo al porcentaje de envío.
}

//función para formatear un importe de acuerdo a la moneda seleccionada
function setCurrencyFormat(importe) {

    //creo el objeto currencyFormatter a partir del constructor NumberFormat que me permite dar formato a la moneda de acuerdo a la moneda seleccionada y la localización.
    let currencyFormatter = new Intl.NumberFormat('es-UY', {
        style: 'currency',
        currency: selectedCurrency, //le paso la moneda seleccionada actualmente.
    });
    return currencyFormatter.format(importe); //devuelve el importe formateado de acuerdo a la moneda.
}
    
//actualiza los importes en la página, toma como parámetro el costo de envío.
function actualizarImportes(porcentajeCostoEnvio) {
    let total = 0; //inicializo el total del carrito en 0
    var arrayElementsCantidad = document.getElementsByName("prod-cant"); //tomo todos los elementos input de cantidad

    //por cada elemento cantidad, uso la propiedad data que guarda la posición del mismo para encontrar el subtotal y el costo unitario.
    arrayElementsCantidad.forEach(element => {
        let elementSubtotal = document.getElementById("prod-" + element.dataset.posprod + "-subtotal"); //guardo el subtotal del producto.
        let elementUnitCost = document.getElementById("prod-" + element.dataset.posprod + "-unitcost"); //guardo el costo unitario del producto.

        let unitCostMonedaOriginal = elementSubtotal.dataset.unitcost; //obtengo el costo unitario del producto, el cual se encuentra en su moneda original.
        let subtotalMonedaOriginal = elementSubtotal.dataset.unitcost * element.value; //obtengo el subtotal en la moneda original, multiplicando el costo unitario original por la cantidad seleccionada.

        let nuevoUnitCost = convertirMoneda(elementSubtotal.dataset.currency, unitCostMonedaOriginal); //cambio el importe del costo unitario según el tipo de cambio.
        let nuevoSubtotal = convertirMoneda(elementSubtotal.dataset.currency, subtotalMonedaOriginal); //cambio el importe del subtotal según el tipo de cambio.

        elementUnitCost.innerHTML = setCurrencyFormat(nuevoUnitCost);//le doy formato al costo unitario de acuerdo a la moneda seleccionada.
        elementSubtotal.innerHTML = `<strong> ` + setCurrencyFormat(nuevoSubtotal) + `</strong>`; //le doy formato al subtotal del producto de acuerdo a la moneda seleccionada.
       

        total += nuevoSubtotal; //sumo el subtotal del producto al gran total del carrito
    });

    let costoEnvio = porcentajeCostoEnvio == 0 ? 0 : total * porcentajeCostoEnvio / 100; //calculo el costo de envío.

    document.getElementById("subtotal").innerHTML = setCurrencyFormat(total); //le doy formato al subtotal de acuerdo a la moneda seleccionada.
    document.getElementById("costoEnvio").innerHTML = setCurrencyFormat(costoEnvio); //le doy formato al costo de envío de acuerdo a la moneda seleccionada.
    document.getElementById("total").innerHTML = setCurrencyFormat(total + costoEnvio); //le doy formato al total de acuerdo a la moneda seleccionada.
}

//recibe un id de moneda y el importe en dicha moneda. Devuelve el importe convertido a la moneda seleccionada.
    function convertirMoneda(moneda, importe) {
        switch (moneda) {
            case selectedCurrency: 
                return importe; //si la moneda es igual a la moneda seleccionada por el usuario, no se realiza conversión y devuelve el mismo importe.
                break;
            case PESO_UY:
                return importe / CAMBIO_DOLAR_UYU; //si es en pesos, lo convierte a dolares usando el tipo de cambio.
            case DOLAR:
                return importe * CAMBIO_DOLAR_UYU; //si es en dolares, lo convierte a pesos usando el tipo de cambio.
                break;
        }
    }

    document.addEventListener("DOMContentLoaded", function (e) {
        fetch(VIDEOGAMES_URL)                   //
            .then(response => response.json())  //obtengo la lista de videojuegos
            .then(result => {                   //
                showCartProductsAndTotalCost(result.articles) //muestro los productos y costos totales.
                showShippingOptions(SHIPPING_OPTIONS); //muestro los tipos de de envío.
                showCartCurrencySelector(CURRENCY_LIST); //muestro el selector de monedas.
            })
            .catch(err => console.log(err));



    });