//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
var selectedProduct = "";
var productInfo = [];

document.addEventListener("DOMContentLoaded", function (e) {

    // selectedProduct = localStorage.getItem("selectedProduct");    

    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productInfo = resultObj.data;

            showProductInfo(productInfo);
            showRelatedProducts(productInfo.relatedProducts);              
        }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productComments = resultObj.data;

            showComments(productComments);
            showAverageScore();

            document.getElementById("add-comment-btn").addEventListener("click", function () {

            });                      
        }
    });


});

function showProductInfo(productInfo) {

    let htmlImgCarousel = "";
    let htmlProductImages = "";

    let htmlProductInfo = "";

    //Recorro el array de imágenes y creo un DIV para cada elemento, poniendo el primero en ACTIVE para el carousel.
    for (let i = 0; i < productInfo.images.length; i++) {

        if (i == 0) {
            htmlProductImages += `        
            <div class="carousel-item active"> 
            <img class="d-block w-100" src="`+ productInfo.images[i] + `" alt="imagenProducto">
            </div>`
        } else {
            htmlProductImages += `        
            <div class="carousel-item"> 
            <img class="d-block w-100" src="`+ productInfo.images[i] + `" alt="imagenProducto">
            </div>`
        }
    }

    //Creo el carousel concatenando las imágenes creadas anteriormente.
    htmlImgCarousel += `
    <div id="product-img-carousel" class="carousel slide" data-ride="carousel" data-interval= "2500">
        <div class="carousel-inner">
        `
        + htmlProductImages +
        `
        </div>
        <a class="carousel-control-prev" href="#product-img-carousel" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Anterior</span>
        </a>
        <a class="carousel-control-next" href="#product-img-carousel" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Siguiente</span>
        </a>
    </div>`

    //Agrego el carousel a la página y lo inicio.
    document.getElementById("product-img").innerHTML = htmlImgCarousel;
    $('#product-img-carousel').carousel();

    //Armo el HTML que contiene la info del producto
    htmlProductInfo += ` 
    <div id="rowProductSoldCount" class= "row">    
    <p class="text-muted">Nuevo - `+ productInfo.soldCount + ` vendidos</p>
    </div>
    <div id="rowProductName" class= "row">
        <h3>`+ productInfo.name + `</h3>    
    </div>
    <div id="rowProductSoldCount" class= "row">
    <p>`+ productInfo.description + `</p>
    </div>    
    <div id="rowProductCost" class= "row">    
        <h1>`+ productInfo.currency + " " + productInfo.cost + `</h1>    
    </div>    
    <div id="rowBuyButton" class= "row">    
    <button id="buyProductButton" type="button" class="btn btn-primary btn-lg">Comprar</button>    
    </div>    
    `
    //Agrego la info a la página.
    document.getElementById("product-info").innerHTML = htmlProductInfo;
}

function showAverageScore() {

    let starRating = ``;
    let averageScoreHtml = ``;
    let averageScore = 0;
    let sumScores = 0;
    let scores = getUserScoreArray();
    let averageScoreText = "";

    for (let i = 0; i < scores.length; i++) {
        let score = scores[i];
        sumScores += score;
    }
    averageScore = sumScores / scores.length;
    starRating = getStarRating(averageScore);

    averageScoreHtml += `<span>` + averageScore + `</span>`;
    averageScoreText += `<p class="text-muted">Promedio entre ` + scores.length + ` comentarios</p>`;;


    document.getElementById("product-average-score").innerHTML += averageScoreHtml;
    document.getElementById("product-average-stars").innerHTML += starRating;
    document.getElementById("product-average-stars").innerHTML += averageScoreText;


}

function showComments(commentsArray) {

    let comments = commentsArray.sort(function (a, b) {
        return new Date(b.dateTime) - new Date(a.dateTime);
    });

    let htmlComments = "";

    for (let i = 0; i < comments.length; i++) {

        let comment = comments[i];
        let stars = ``;

        stars = getStarRating(comment.score);

        htmlComments += `
            <div class= "row user-comment" data-user-score="`+ comment.score + `">
            <p class="text-muted">`+ comment.user + ` - ` + comment.dateTime + ` - Puntuación: ` + stars + `</p>            
            </div>
            <div class= "row">
            <p>`+ comment.description + `</p>
            </div>
            <hr>
            `;
    }

    document.getElementById("product-comment").innerHTML += htmlComments;
}

function showRelatedProducts(relatedProductsArray) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productList = resultObj.data;

            let htmlRelatedProducts = "";

            for (let i = 0; i < relatedProductsArray.length; i++) {
                let relatedProductPosition = relatedProductsArray[i];
                let relatedProduct = productList[relatedProductPosition];

                htmlRelatedProducts += `
                <div class= "col-lg-3 col-md-4 col-6 border-0">
                    <div id="related-product-img" class= "row">
                        <img class="img-fluid p-2" src="`+ relatedProduct.imgSrc + `">                                              
                    </div>                   
                    <div id="related-product-nfo" class= "row p-2">
                    <p>`+ relatedProduct.name + `</p> 
                    <p>`+ relatedProduct.description + `</p>
                    </div>
                    <div class= "row p-2">
                    <a href="product-info.html">Ver</a>
                    </div>                     
                </div>`
            }
            document.getElementById("related-products").innerHTML = htmlRelatedProducts;
        }
    })
}

function getUserScoreArray() {

    let scores = [];
    commentRows = document.getElementById("product-comment").getElementsByClassName("user-comment");

    for (var i = 0; i < commentRows.length; i += 1) {

        scores[i] = parseInt(commentRows[i].dataset.userScore);
    }
    return scores;
}

function getStarRating(score) {

    let starRating = ``;

    for (let i = 1; i <= MAX_RATING; i++) {
        if (i <= Math.round(score)) {
            starRating += '<i class="fa fa-star checked"></i>';
        } else {
            starRating += '<i class="fa fa-star"></i>';
        }
    }
    return starRating;
}

function addComment(){

}