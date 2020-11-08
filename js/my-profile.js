const MAX_IMG_SIZE_IN_BYTES = 2097152;
var cropper;

function getProfileStarRatingHtml(score) {

    let starRating = ``;
    let roundedScore = Math.round(score);

    if (roundedScore === MAX_RATING) {

        for (let i = 1; i <= roundedScore; i++) {
            starRating += '<span class="fa fa-star static-star-max" style="font-size:20px" ></span>';
        }
    } else if (roundedScore > 1 & roundedScore < MAX_RATING) {
        for (let i = 1; i <= roundedScore; i++) {
            starRating += '<span class="fa fa-star static-star" style="font-size:20px"></span>';
        }
    } else if (roundedScore === 1) {
        for (let i = 1; i <= roundedScore; i++) {
            starRating += '<span class="fa fa-star static-star-1" style="font-size:20px"></span>';

        }
    }

    for (let i = roundedScore + 1; i <= MAX_RATING; i++) {
        starRating += '<span class="fa fa-star" style="font-size:20px"></span>';
    }

    return starRating;
}

function showProfileStarRating() {

    let htmlProfileStarRating = ``;

    htmlProfileStarRating = `
    <p><strong>Calificación como vendedor</strong></p>           
    <p>`+ getProfileStarRatingHtml(5) + `</p>
    <p><strong>Calificación como comprador</strong></p>           
    <p>`+ getProfileStarRatingHtml(4) + `</p>
    `;
    document.getElementById("profile-star-rating").innerHTML += htmlProfileStarRating;
}

function loadFile(event) {
    if (event.target.files[0] != null) {
        var imgFile = event.target.files[0];
        var validFormat = hasValidFormat(imgFile);
        var validSize = hasValidSize(imgFile);

        if (validFormat & validSize) {
            htmlImage = ``;

            htmlImage = `<img id="profile-image-preview" src="" style="width:400px;height:400px;" alt="Picture"></img>`;

            document.getElementById("profile-img-container").innerHTML = htmlImage;

            let image = document.getElementById('profile-image-preview');
            image.src = URL.createObjectURL(event.target.files[0]);
            cropper = new Cropper(image, {
                aspectRatio: 4 / 4,
                viewMode: 1,
                minContainerWidth: 400,
                minContainerHeight: 400,
                minCanvasWidth: 400,
                minCanvasHeight: 400,
                minCropBoxWidth: 25,
                minCropBoxHeight: 25,
                crop(event) {
                    console.log(event.detail.x);
                    console.log(event.detail.y);
                    console.log(event.detail.width);
                    console.log(event.detail.height);
                    console.log(event.detail.rotate);
                    console.log(event.detail.scaleX);
                    console.log(event.detail.scaleY);
                },
            });

            document.getElementById("btn-crop").classList.remove("d-none");
        } else {
            if (!validFormat)
                alert("El archivo Seleccionado no es una imagen compatible");
            else if (!validSize) {
                alert("La imagen debe de pesar menos de 2MB");
            }
        }
    }
}

function loadCurrentUser() {
    let user = JSON.parse(localStorage.getItem("currentUser"));

    document.getElementById("titulo-nombre-apellido").innerHTML = user.firstName + " " + user.lastName;
    document.getElementById("nombre").value = user.firstName == "" ? "" : user.firstName;
    document.getElementById("apellido").value = user.lastName == "" ? "" : user.lastName;
    document.getElementById("edad").value = user.age == "" ? "" : user.age;
    document.getElementById("telefono").value = user.phoneNumber == "" ? "" : user.phoneNumber;
    document.getElementById("imagen-perfil").src = user.profileImage == "" ? "img/avatar.png" : user.profileImage;
    document.getElementById("email").value = user.email == "" ? "" : user.email;
    document.getElementById("currentUserDropdownBtn").innerHTML = user.firstName + " " + user.lastName;
}

function saveUserInfo() {

    let camposCompletos = true;
    let elementosParaValidar = document.getElementById("profile").querySelectorAll("input");

    for (elemento of elementosParaValidar) {

        switch (elemento.id) {

            case "nombre":
                if (elemento.value.trim() == "") {
                    camposCompletos = false;
                    elemento.classList.add("error");
                    document.getElementById(elemento.id + "-error").textContent = "Este campo no puede quedar vacío";
                } else {
                    elemento.classList.remove("error");
                    document.getElementById(elemento.id + "-error").textContent = "";
                }
                break;
            case "apellido":
                if (elemento.value.trim() == "") {
                    camposCompletos = false;
                    elemento.classList.add("error");
                    document.getElementById(elemento.id + "-error").textContent = "Este campo no puede quedar vacío";
                } else {
                    elemento.classList.remove("error");
                    document.getElementById(elemento.id + "-error").textContent = "";
                }
                break;
            case "email":
                if (elemento.value.trim() == "") {
                    camposCompletos = false;
                    elemento.classList.add("error");
                    document.getElementById(elemento.id + "-error").textContent = "Este campo no puede quedar vacío";
                } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(elemento.value)) {
                    camposCompletos = false;
                    elemento.classList.add("error");
                    document.getElementById(elemento.id + "-error").textContent = "Formato de Email incorrecto";
                } else {
                    elemento.classList.remove("error");
                    document.getElementById(elemento.id + "-error").textContent = "";
                }
                break;
        }
    }
    if (camposCompletos) {

        try {
            var newUserInfo =
                '{' +
                '"firstName":"' + document.getElementById("nombre").value +
                '","lastName":"' + document.getElementById("apellido").value +
                '",  "age":"' + document.getElementById("edad").value +
                '", "email":"' + document.getElementById("email").value +
                '",  "phoneNumber":"' + document.getElementById("telefono").value +
                '",  "profileImage":"' + document.getElementById("imagen-perfil").src +
                '"}';
            currentUser = newUserInfo;

            window.localStorage.setItem("currentUser", currentUser);
            loadCurrentUser();
            showSuccessfullMessage("Perfil actualizado correctamente!");
            setTimeout(function () {
                $(".alert").alert('close');
            }, 2000)
        } catch (error) {
            console.error(error);
            showErrorMessage("Hubo un error al actualizar tu perfil, intenta de nuevo mas tarde");
            setTimeout(function () {
                $(".alert").alert('close');
            }, 2000)
        }
    }

}

function hasValidFormat(img) {
    var imgName = img.name;
    var idxDot = imgName.lastIndexOf(".") + 1;
    var extFile = imgName.substr(idxDot, imgName.length).toLowerCase();
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
        return true;
    } else {
        return false;
    }
}

function hasValidSize(img) {
    if (img.size > MAX_IMG_SIZE_IN_BYTES) {
        return false;
    } else {
        return true;
    };
}

function showSuccessfullMessage(message) {
    let htmlMessage = ``;

    htmlMessage = `
    <div class="alert alert-success alert-dismissible fade show m-0" role="alert">
        <strong>`+ message + `</strong>.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
        </button>
    </div>`;

    document.getElementById("message-area").innerHTML = htmlMessage;
}

function showErrorMessage(message) {
    let htmlMessage = ``;

    htmlMessage = `
    <div class="alert alert-danger alert-dismissible fade show m-0" role="alert">
        <strong>Upss!</strong> `+ message + `.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
        </button>
    </div>`;

    document.getElementById("message-area").innerHTML = htmlMessage;
}

document.addEventListener("DOMContentLoaded", function (e) {

    if (currentUser == null) {
        document.getElementById("profile-container").innerHTML = `
        <div class="border border-danger rounded m-3 text-center">
            <p class="m-3">Para ver tu perfil debes <a href="index.html" class="text-info">Iniciar Sesión</a></p>
        </div > `;
    } else {

        document.getElementById("imagen-perfil").addEventListener('click', function () {

            $('#modal').modal({ backdrop: 'static', keyboard: false })
            $('#modal').modal('show');
        });

        document.getElementById("btn-crop").addEventListener('click', function () {

            let dataURL = cropper.getCroppedCanvas().toDataURL('image/png');
            document.getElementById("imagen-perfil").src = dataURL;
            document.getElementById("profile-img-container").innerHTML = "";
            document.getElementById("btn-crop").classList.add("d-none");
            $('#modal').modal('hide');
        });

        document.getElementById("btn-modal-close").addEventListener('click', function () {

            document.getElementById("profile-img-container").innerHTML = "";
            document.getElementById("btn-crop").classList.add("d-none");
        });

        showProfileStarRating();
        loadCurrentUser();
    }
});