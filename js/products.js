const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_ASC_BY_COST = "costUp";
const ORDER_DESC_BY_COST = "costDown";
const ORDER_DESC_BY_PROD_SOLD_COUNT = "soldCount";
var currentSortCriteria = undefined;
var minCost = undefined;
var maxCost = undefined;
var currentProductsArray = [];
var productRows = [];

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductsArray = resultObj.data;
            sortAndShowProducts(ORDER_ASC_BY_NAME, currentProductsArray);
        }
        productRows = document.getElementById("prod-list-container").getElementsByClassName("row");
    });

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCostAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortByCostDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortBySoldCount").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_PROD_SOLD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCostMin").value = "";
        document.getElementById("rangeFilterCostMax").value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductsList(currentProductsArray);
        filterProducts(productRows);
    });

    document.getElementById("rangeFilterCost").addEventListener("click", function () {

        minCost = document.getElementById("rangeFilterCostMin").value;
        maxCost = document.getElementById("rangeFilterCostMax").value;

        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0) {
            minCost = parseInt(minCost);
        }
        else {
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0) {
            maxCost = parseInt(maxCost);
        }
        else {
            maxCost = undefined;
        }

        showProductsList(currentProductsArray);
        filterProducts(productRows);
    });

    document.getElementById("inputFilterNameDesc").addEventListener("keyup", function () {

        filterProducts(productRows);
    });
});

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PROD_SOLD_COUNT) {
        result = array.sort(function (a, b) {
            let aSoldCount = parseInt(a.soldCount);
            let bSoldCount = parseInt(b.soldCount);

            if (aSoldCount > bSoldCount) { return -1; }
            if (aSoldCount < bSoldCount) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_ASC_BY_COST) {
        result = array.sort(function (a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost < bCost) { return -1; }
            if (aCost > bCost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_COST) {
        result = array.sort(function (a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost > bCost) { return -1; }
            if (aCost < bCost) { return 1; }
            return 0;
        });
    }
    return result;
}

function filterProducts(productRows) {
    filterText = document.getElementById("inputFilterNameDesc").value.toUpperCase();

    for (var i = 0; i < productRows.length; i += 1) {

        if (productRows[i].dataset.filterName.toUpperCase().includes(filterText) || productRows[i].dataset.filterDesc.toUpperCase().includes(filterText)) {
            productRows[i].parentNode.style.display = "block";
        } else {
            productRows[i].parentNode.style.display = "none";
        }
    }
}

function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined) {
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    showProductsList(currentProductsArray);
    filterProducts(productRows);
}

function showProductsList(array) {

    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let product = array[i];

        if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost))) {

            /*    htmlContentToAppend += `
                <div class="list-group-item list-group-item-action">
                    <div class="row" onclick="showInfo('`+product.name+`');" data-filter-name="`+product.name+`" data-filter-desc="`+product.description+`" >
                        <div class="col-3">
                            <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">                    
                        </div>
                        <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1">`+ product.name +`</h4>                                                                                              
                                <small class="text-muted">` + product.soldCount + ` vendidos</small>
                            </div>
                            <div>
                                <p>` + product.description +`</p>                                               
                            </div>
                            <div class= "bottomCost">
                                <h3>` + product.currency + ` ` + product.cost + `</h3>
                            </div>   
                        </div>
                    </div>
                </div>
                `*/
            htmlContentToAppend += `
            <div class="col-md-6">
                <div class="card mb-4 box-shadow" onclick="showInfo('`+ product.name + `');" data-filter-name="` + product.name + `" data-filter-desc="` + product.description + `">
                  <img class="card-img-top" alt="` + product.description + `" style="height: 100%; width: 100%; display: block;" src="` + product.imgSrc + `" data-holder-rendered="true">
                  <div class="card-body">
                    <div class="d-flex">
                        <p class="card-text">`+ product.name + ` - </p><span class="card-text text-muted"> ` + product.soldCount + ` vendidos</span>
                    </div>  
                    <p class="card-text">` + product.description + `</p>                                        
                  </div>
                  <div class="card-footer bg-transparent border-0">
                  <p class="card-text">` + product.currency + ` ` + product.cost + `</p>
                  </div>
                </div>
              </div>`;
        }
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}

function showInfo(productName) {
    //localStorage.setItem("selectedProduct",productName);
    window.location.replace("product-info.html");

}