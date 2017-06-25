function cambiarLogin() {
    $("#login").toggleClass("hidden");
    $("#registro").toggleClass("hidden");
}

$("#btnLogin").on('click',function (event) {
    event.preventDefault();
    var destino = ((sessionStorage.getItem("destino") == null || sessionStorage.getItem("destino") == "undefined" || sessionStorage.getItem("destino") == "")  ? "index.html" : sessionStorage.getItem("destino"));
    
    sessionStorage.clear();
    
    nombre = $("#nombreUsuarioLogin").val();
    pass = $("#passwordLogin").val();
    $.post("/usuarios/buscar",{nombreUsuario: nombre,password: pass}, function(data){
        if(data != "-1"){
            sessionStorage.setItem("token", data.id);
            sessionStorage.setItem("nombreUsuario", data.nombreUsuario);
            location.href = destino;
        } else {
            alert("Lo lamentamos, no hemos ningún usuario");
        }
    });
});

$("#btnRegistro").on('click',function (event) {
    event.preventDefault();
    var destino = ((sessionStorage.getItem("destino") == null || sessionStorage.getItem("destino") == "undefined" || sessionStorage.getItem("destino") == "")  ? "index.html" : sessionStorage.getItem("destino"));
    
    sessionStorage.clear();
    
    nombreUsuario = $("#nombreUsuarioRegistro").val();
    pass = $("#passwordRegistro").val();
    nombre = $("#nombreRegistro").val();
    apellidos = $("#apellidosRegistro").val();

    $.post("/usuarios/registrar",{nombreUsuario: nombreUsuario,nombre: nombre, apellidos: apellidos, password: pass}, function(data){
        if(data == "-1"){
            alert("Lo lamentamos, no hemos podido registrar al usuario");
        } else if(data == "-2"){
            alert("El nombre de usuario ya existe, por favor, elija otro.");
        }else {
            sessionStorage.setItem("token", data.id);
            sessionStorage.setItem("nombreUsuario", data.nombreUsuario);
            location.href = destino;
        }
    });
});