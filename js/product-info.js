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
    <div id="product-img-carousel" class="carousel slide" data-ride="carousel" data-interval= "2000">
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
    <div id="rowProductCategory-SoldCount" class= "row">    
    <p class="text-muted">Categoría: `+productInfo.category+` | Nuevo - `+ productInfo.soldCount + ` vendidos</p>
    </div>
    <div id="rowProductName" class= "row">
        <h3>`+ productInfo.name + `</h3>    
    </div>
    <div id="rowProductDescription" class= "row">
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
    starRating = getStarRatingHtml(averageScore);

    averageScoreHtml += `<span>` + averageScore.toFixed(1) + `</span>`;
    averageScoreText += `<p class="text-muted">Promedio entre ` + scores.length + ` comentarios</p>`;;


    document.getElementById("product-average-score").innerHTML = averageScoreHtml;
    document.getElementById("product-average-stars").innerHTML = "";
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
        let date = new Date(comment.dateTime);
        let formattedDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        stars = getStarRatingHtml(comment.score);

        htmlComments += `
        <hr>
            <div class= "row user-comment" data-user-score="`+ comment.score + `" data-user-date="` + formattedDate + `">
            <div class= "col">
                <p class="text-muted">`+ comment.user + ` - ` + formattedDate + ` - Puntuación: ` + stars + `</p>            
                <p class="m-0">`+ comment.description + `</p>
            </div>
            </div>            
          
            `;
    }

    document.getElementById("latest-comments").innerHTML += htmlComments;
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

function getStarRatingHtml(score) {

    let starRating = ``;
    let roundedScore = Math.round(score);

    if (roundedScore === MAX_RATING) {

        for (let i = 1; i <= roundedScore; i++) {
            starRating += '<span class="fa fa-star static-star-max"></span>';
        }
    } else if (roundedScore > 1 & roundedScore < MAX_RATING) {
        for (let i = 1; i <= roundedScore; i++) {
            starRating += '<span class="fa fa-star static-star"></span>';
        }
    } else if (roundedScore === 1) {
        for (let i = 1; i <= roundedScore; i++) {
            starRating += '<span class="fa fa-star static-star-1"></span>';

        }
    }

    for (let i = roundedScore + 1; i <= MAX_RATING; i++) {
        starRating += '<span class="fa fa-star"></span>';
    }

    return starRating;
}

function getUserScoreInput() {

    let cantCheckedStars = 0;

    for (var i = 1; i <= MAX_RATING; i++) {
        var star = document.getElementById("user-comment-star-" + i);
        if (star.checked) {
            cantCheckedStars = star.value;
        }
    }
    return cantCheckedStars;
}

function addComment() {

    let htmlComment = ``;
    let userName = currentUser.firstName + " " + currentUser.lastName;
    let score = getUserScoreInput();
    let stars = getStarRatingHtml(score);
    let today = new Date();
    let currentDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " - " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let comment = document.getElementById("product-user-comment").value;


    htmlComment += `
    <hr>
            <div class= "row user-comment" data-user-score="`+ score + `">
            <div class= "col">
                <p class="text-muted">`+ userName + ` - ` + currentDate.toString() + ` - Puntuación: ` + stars + `</p>            
                <p class="m-0">`+ comment + `</p>
            </div>
            </div>            
            
            `;

            $("#latest-comments").prepend($(htmlComment).hide().fadeIn(800));
            showAverageScore();                       
}