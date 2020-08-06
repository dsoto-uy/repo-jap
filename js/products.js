//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
var productsArray = [];

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            productsArray = resultObj.data;            
            showProductsList(productsArray);                        
        }      
    });        
});

function showProductsList(array){

    let htmlContentToAppend = "";
    for(let i = 0; i < array.length; i++){
        let product = array[i];

        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">                    
                </div>
                <div class="col hasProductCostst">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ product.name +`</h4>                                                                                              
                        <small class="text-muted">` + product.soldCount + ` vendidos</small>
                    </div>
                    <div>
                        <p>` + product.description +`</p>                                               
                    </div>
                    <div class= "bottomCost">
                        <h3>` + product.cost + ` ` + product.currency + `</h3>
                    </div>
                    
                    
                    
                </div>
            </div>
        </div>
        `

        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}