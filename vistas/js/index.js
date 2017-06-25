$(document).ready(function() {
    setTimeout(function() {
        if(sessionStorage.getItem("token")){
            $("#cuenta").append($("<span>").html("Cerrar Sesión (" + sessionStorage.getItem("nombreUsuario")+ ")"));
        } else {
            $("#cuenta").append($("<span>").html(" Acceder"));
        }
    }, 200);
});

function cerrarSesion(){
    sessionStorage.clear();
    location.href = "login.html";
}

function controlAcceso(destino){
    if(sessionStorage.getItem("token") == null || sessionStorage.getItem("token") == "undefined" || sessionStorage.getItem("token") == ""){
        sessionStorage.setItem("destino",destino);
        location.href = "login.html";
    } else {
        location.href = destino;
    }
}