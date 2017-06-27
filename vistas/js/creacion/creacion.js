const esPrimera = true;
const esIntermedia = false;

var nombreMarcoActual = "";
var idMarcoActual = "";
var numFilas = 0;
var numSeparador = 0;
var numColumnas = 0;
var numPilares = 0;

var defaultColor = "#F05F40"; 
var defaultSeparaciones = "1";
//var defaultMarco = {"filas":[[2,"#f05f40,#004080"]],"columnas":[[3,"Bottom,Top,Top"]]};
var defaultMarco = {"filas":[[4,"#004000,#f05f40,#004080,#ff80ff"]],"columnas":[[3,"Top,Bottom,Top"],[3,"Bottom,Top,Top"],[3,"Top,Top,Bottom"]]};
var columnasDefault = "Bottom,Top,Top";
$(document).ready(function(){
    cambiarDireccionListener();
    inputListener();
    recuperarMarcosUsuario();
});

function crearInputColor(color){
  return $("<input>").attr("id","color" + numFilas).attr("type","color").attr("value",color).attr("onchange","cambiarColor('color" + numFilas + "')").addClass("pull-right margenInterno");
}

function crearContenedorFilas(color){
    var contenedor = $("<div>").addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12 margenInterno contenedorFila");
    contenedor.append(crearFila(color)).append(crearInputColor(color));
    
    return contenedor;
}

function crearFila(color){
    numFilas++;
    var fila = $("<div>").attr("id","fila" + numFilas).addClass("col-xs-10 col-sm-10 col-md-10 col-lg-10 bordeFino altoMinimoElemento margenInterno fila");
    return fila;
}

function formatearFila(fila, separaciones, direcciones){
    $(fila).find(".separador").remove();
    var numSeparaciones = "";
    var idFila = "";

    if(esNullOVacio(separaciones)){
        numSeparaciones = defaultSeparaciones;
        idFila = numFilas;
    } else {
        numSeparaciones = separaciones + "";
        idFila = $(fila).find(".fila").attr("id").split("ila")[1];
    }
    var strDirecciones;
    if(esNullOVacio(direcciones)) {
        strDirecciones = ["fa-long-arrow-right","fa-long-arrow-left"];
    } else {
        strDirecciones = direcciones;
    }
     
    switch(numSeparaciones){
        case "1": 
            $(fila).find(".fila").append($("<div>").addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12 separador split text-center")
                    .append($("<span>").attr("onclick","separarFila('fila" + idFila + "')").append($("<i>").addClass("fa fa-columns fa-2x"))));
        break;
        case "2":
            $(fila).find(".fila").append($("<div>").addClass("col-xs-5 col-sm-5 col-md-5 col-lg-5 separador split text-center")
                    .append($("<span>").attr("onclick","separarFila('fila" + idFila + "')").append($("<i>").addClass("fa fa-columns fa-2x")))
                    .append($("<span>").attr("onclick","juntarFila('fila" + idFila + "')").append($("<i>").addClass("fa fa-times fa-2x"))))
                .append($("<div>").addClass("col-xs-2 col-sm-2 col-md-2 col-lg-2 separador direccion text-center").css("margin-top","0")
                    .append($("<span>").attr("onclick","cambiarDireccionSeparador('#separador" + numSeparador + "')").append($("<i id='separador" + (numSeparador++) + "'>").addClass("fa " + strDirecciones[0] + " fa-4x"))))
                .append($("<div>").addClass("col-xs-5 col-sm-5 col-md-5 col-lg-5 separador split text-center")
                    .append($("<span>").attr("onclick","separarFila('fila" + idFila + "')").append($("<i>").addClass("fa fa-columns fa-2x")))
                    .append($("<span>").attr("onclick","juntarFila('fila" + idFila + "')").append($("<i>").addClass("fa fa-times fa-2x"))));
        break
        case "3": 
            $(fila).find(".fila").append($("<div>").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3 separador split text-center")
                    .append($("<span>").attr("onclick","juntarFila('fila" + idFila + "')").append($("<i>").addClass("fa fa-times fa-2x"))))
                .append($("<div>").addClass("col-xs-2 col-sm-2 col-md-2 col-lg-2 separador direccion text-center").css("margin-top","0")
                    .append($("<span>").attr("onclick","cambiarDireccionSeparador('#separador" + numSeparador + "')").append($("<i id='separador" + (numSeparador++) + "'>").addClass("fa " + strDirecciones[1] + " fa-4x"))))
                .append($("<div>").addClass("col-xs-2 col-sm-2 col-md-2 col-lg-2 separador split text-center")
                    .append($("<span>").attr("onclick","juntarFila('fila" + idFila + "')").append($("<i>").addClass("fa fa-times fa-2x"))))
                .append($("<div>").addClass("col-xs-2 col-sm-2 col-md-2 col-lg-2 separador direccion text-center").css("margin-top","0")
                    .append($("<span>").attr("onclick","cambiarDireccionSeparador('#separador" + numSeparador + "')").append($("<i id='separador" + (numSeparador++) + "'>").addClass("fa " + strDirecciones[0] + " fa-4x"))))
                .append($("<div>").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3 separador split text-center")
                    .append($("<span>").attr("onclick","juntarFila('fila" + idFila + "')").append($("<i>").addClass("fa fa-times fa-2x"))));
        break;
        case 4: 
            $(fila).find(".fila").append($("<div>").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3 separador split text-center")
                    .append($("<span>").attr("onclick","juntarFila('fila" + idFila + "')").append($("<i>").addClass("fa fa-times fa-2x"))))
                .append($("<div>").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3 separador split text-center")
                    .append($("<span>").attr("onclick","juntarFila('fila" + idFila + "')").append($("<i>").addClass("fa fa-times fa-2x"))))
                .append($("<div>").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3 separador split text-center")
                    .append($("<span>").attr("onclick","juntarFila('fila" + idFila + "')").append($("<i>").addClass("fa fa-times fa-2x"))))
                .append($("<div>").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3 separador split text-center")
                    .append($("<span>").attr("onclick","juntarFila('fila" + idFila + "')").append($("<i>").addClass("fa fa-times fa-2x"))));
        break;
    }
    
    return fila;
}

function cambiarDireccionSeparador(idSeparador){
    $(idSeparador).toggleClass("fa-long-arrow-right fa-long-arrow-left");
}

function separarFila(idFila){
    var numSeparaciones = $("#" + idFila).find(".split").length;

    if(numSeparaciones < 3){
        $("#" + idFila).parent().replaceWith(formatearFila($("#" + idFila).parent(), numSeparaciones + 1));
    }
}

function juntarFila(idFila){
    var numSeparaciones = $("#" + idFila).find(".split").length;

    if(numSeparaciones < 4){
        $("#" + idFila).parent().replaceWith(formatearFila($("#" + idFila).parent(), numSeparaciones - 1));
    }
}

function crearColumna(primeraColumna, direccion, totalColumnas){
    var clases = "";
    var onclick = "";
    var fa = "";
    if(totalColumnas > 1){
        onclick = "eliminarPilar('#pilar" + numPilares + "')";
        fa = "fa-minus";
    }
        
    switch(totalColumnas){
        case 1:
            clases = "col-lg-offset-4 col-md-offset-4 col-sm-offset-4 col-xs-2 col-sm-2 col-md-2 col-lg-2 altoMinimoElementoInterno margenInterno pilar";
        break;
        case 2:
            if(primeraColumna)
                clases = "col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xs-2 col-sm-2 col-md-2 col-lg-2 altoMinimoElementoInterno margenInterno pilar";
            else
                clases = "col-lg-offset-4 col-md-offset-4 col-sm-offset-4 col-xs-2 col-sm-2 col-md-2 col-lg-2 altoMinimoElementoInterno margenInterno pilar";
        break;
        case 3:
            clases = "col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xs-2 col-sm-2 col-md-2 col-lg-2 altoMinimoElementoInterno margenInterno pilar";
        break;
    }
    var offset = (primeraColumna ? "0" : "0");
    
    var columna = $("<div id='pilar" + (numPilares++) + "'>").addClass(clases).css("padding-left","0 !important")
        .append($("<span>").attr("onclick", onclick).append($("<i>").addClass("fa " + fa)))
        .append($("<div>").addClass("text-center arrowText arrow" + direccion).append($("<i>").addClass("margenInterno fa fa-refresh fa-2x")));
    return columna;
}

function eliminarPilar(idPilar){
    var idColumna = "#" + $(idPilar).parents(".columna").attr("id");
    $(idPilar).remove();

    var numPilares = $(idColumna).find(".pilar").length;
    if(numPilares < 4){
        var columnas = "";
        $(idColumna).find(".arrowText").each(function(){ columnas += ($(this).hasClass("arrowTop") ? "Top," : "Bottom,"); });
        if(!esNullOVacio(columnas)) columnas = columnas.substr(0, columnas.length - 1);
        $(idColumna).replaceWith(crearContenedorColumnas(columnas));
    }
    cambiarDireccionListener();
}

function crearPilar(idColumna){

    var numPilares = $(idColumna).find(".pilar").length;
    if(numPilares < 3){
        var columnas = "";
        $(idColumna).find(".arrowText").each(function(){ columnas += ($(this).hasClass("arrowTop") ? "Top," : "Bottom,"); });
        var contenedor = crearContenedorColumnas(columnas + "Top");
        if(contenedor.find(".pilar").length == 3) contenedor.find("#btn" + (numColumnas-1)).prop("disabled", true);
        $(idColumna).replaceWith(contenedor);
    }
    cambiarDireccionListener();
}

function crearContenedorColumnas(columnas){
    var columna = columnas.split(",");
    var contenedor = $("<div id='columna" + numColumnas + "'>").addClass("col-xs-10 col-sm-10 col-md-10 col-lg-10 margenInterno columna")
                        .append($("<div>").addClass("col-xs-1 col-sm-1 col-md-1 col-lg-1")
                            .append($("<button id='btn" + numColumnas + "'>").attr("onclick","crearPilar('#columna" + (numColumnas++)  + "')").addClass("btn btn-primary").css("margin-top","35px").append($("<i>").addClass("fa fa-plus"))));
    
    for (var i = 0; i < columna.length; i++) {
        contenedor.append(crearColumna((i == 0 ? true : false), columna[i], columna.length));   
    }

    return contenedor;
}

function crearNivelSuperior(color, columnas, separaciones, direcciones){
    desbloquearBotones();
    var contenidoVacio = ($("#contenido > div").length == 1 ? true : false);

    if(esNullOVacio(columnas)) columnas = columnasDefault;
    if(esNullOVacio(color)) color = defaultColor;
    if(esNullOVacio(separaciones)) separaciones = defaultSeparaciones;

    if(contenidoVacio && columnas == columnasDefault && color == defaultColor){
        $("#contenido > div:nth-child(1)").before(formatearFila(crearContenedorFilas(defaultColor), separaciones, direcciones));
        cambiarColor("color" + numFilas);
    }
    $("#contenido > div:nth-child(1)").before(formatearFila(crearContenedorFilas(color), separaciones, direcciones));
    cambiarColor("color" + numFilas);
    $("#contenido > div:nth-child(1)").after(crearContenedorColumnas(columnas));
    if($("#columna" + numFilas).find(".pilar").length == 3) $("#btn" + numFilas).prop("disabled", true);
    cambiarDireccionListener();
}

function crearNivelInferior(color, columnas,separaciones, direcciones){
    desbloquearBotones();
    var contenidoVacio = ($("#contenido > div").length == 1 ? true : false);

    if(esNullOVacio(columnas)) columnas = columnasDefault;
    if(esNullOVacio(color)) color = defaultColor;
    if(esNullOVacio(separaciones)) separaciones = defaultSeparaciones;

    if(contenidoVacio && columnas == columnasDefault && color == defaultColor){
        $("#contenido > div:nth-last-child(1)").after(formatearFila(crearContenedorFilas(defaultColor), separaciones, direcciones));
        cambiarColor("color" + numFilas);
    }
    $("#contenido > div:nth-last-child(1)").after(formatearFila(crearContenedorFilas(color), separaciones, direcciones));
    cambiarColor("color" + numFilas);
    $("#contenido > div:nth-last-child(1)").before(crearContenedorColumnas(columnas));
    if($("#columna" + numFilas).find(".pilar").length == 3) $("#btn" + numFilas).prop("disabled", true);
    cambiarDireccionListener();
}

function cambiarDireccionListener(){
    $(".fa-refresh").unbind();
    $(".fa-refresh").on('click', function(){
        $(this).parent().toggleClass("arrowTop");
        $(this).parent().toggleClass("arrowBottom");
    });
}

function inputListener(){
    $("input.nombreMarco").unbind();

    $("input.nombreMarco").focusin(function(){
        if(!$(this)[0].checkValidity()){
            $(this).addClass("bordeError");
        } else {
            $(this).removeClass("sinBorde");
            $(this).addClass("conBorde");
        }
        
    });
    $("input.nombreMarco").focusout(function(){
        if(!$(this)[0].checkValidity()){
            $(this).addClass("bordeError");
        } else {
            $(this).removeClass("bordeError");
            $(this).addClass("sinBorde");
            $(this).removeClass("conBorde");
        }
    });
}

function cambiarColor(idInput){
    var color = $("#" + idInput).val();
    var idFila = "#fila" + idInput.split("lor")[1];
    $(idFila).css("background-color",color);
    $(idFila).attr("data-color",color);
}

function cambiarColor2(idInput){
    var color = $("#" + idInput).next("input").val();
    $("#" + idInput).css("background-color",color);
    $("#" + idInput).attr("data-color",color);
}