const esPrimera = true;
const esIntermedia = false;
var jsonFiles = new Array();
var numFicheros = 0;
var numFilas = 0;
var numSeparador = 0;
var numEdicion = 0;
var defaultColor = "#F05F40"; 
var defaultSeparaciones = "3";
//var defaultMarco = {"filas":[[2,"#f05f40,#004080"]],"columnas":[[3,"Bottom,Top,Top"]]};
var defaultMarco = {"filas":[[4,"#004000,#f05f40,#004080,#ff80ff"]],"columnas":[[3,"Top,Bottom,Top"],[3,"Bottom,Top,Top"],[3,"Top,Top,Bottom"]]};
var columnasDefault = "Bottom,Top,Top";
$(document).ready(function(){
    recuperarMarcosUsuario();
});

function crearContenedorFilas(color){
    return crearFila(color);
}
function crearFila(color){
    numFilas++;
    return $("<div>").attr("id","fila" + numFilas).addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12 bordeFino altoMinimoElemento margenInterno fila");
}

function formatearFila(fila, separaciones, direcciones){
    $(fila).find(".split").remove();
    var numSeparaciones = "";
    var idFila = "";
    
    if(esNullOVacio(separaciones)){
        numSeparaciones = defaultSeparaciones;
        idFila = numFilas;
    } else {
        numSeparaciones = separaciones + "";
        idFila = $(fila).attr("id").split("ila")[1];
    }
    if(esNullOVacio(direcciones)) {
        direcciones = ["fa-long-arrow-right","fa-long-arrow-left"];
    } else {
        strDirecciones = direcciones;
    }
    
    switch(numSeparaciones){
        case "1": 
            fila.append($("<div>").addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12 separador split text-center")
                    .append($("<span id='edicion" + numEdicion + "'>").attr("onclick","editarSeparacion('#edicion" + (numEdicion++) + "')").append($("<i>").addClass("fa fa-pencil-square-o fa-2x"))));
        break;
        case "2":
            fila.append($("<div>").addClass("col-xs-6 col-sm-5 col-md-5 col-lg-5 separador split text-center")
                    .append($("<span id='edicion" + numEdicion + "'>").attr("onclick","editarSeparacion('#edicion" + (numEdicion++) + "')").append($("<i>").addClass("fa fa-pencil-square-o fa-2x"))))
                .append($("<div>").addClass("col-xs-2 col-sm-2 col-md-2 col-lg-2 separador direccion text-center").css("margin-top","0")
                    .append($("<span>").attr("onclick","cambiarDireccionSeparador('#separador" + numSeparador + "')").append($("<i id='separador" + (numSeparador++) + "'>").addClass("fa " + strDirecciones[0] + " fa-4x"))))
                .append($("<div>").addClass("col-xs-5 col-sm-5 col-md-5 col-lg-5 separador split text-center")
                    .append($("<span id='edicion" + numEdicion + "'>").attr("onclick","editarSeparacion('#edicion" + (numEdicion++) + "')").append($("<i>").addClass("fa fa-pencil-square-o fa-2x"))));
        break
        case "3": 
            fila.append($("<div>").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3 separador split text-center")
                    .append($("<span id='edicion" + numEdicion + "'>").attr("onclick","editarSeparacion('#edicion" + (numEdicion++) + "')").append($("<i>").addClass("fa fa-pencil-square-o fa-2x"))))
                .append($("<div>").addClass("col-xs-2 col-sm-2 col-md-2 col-lg-2 separador direccion text-center").css("margin-top","0")
                    .append($("<span>").attr("onclick","cambiarDireccionSeparador('#separador" + numSeparador + "')").append($("<i id='separador" + (numSeparador++) + "'>").addClass("fa " + strDirecciones[0] + " fa-4x"))))
                .append($("<div>").addClass("col-xs-2 col-sm-2 col-md-2 col-lg-2 separador split text-center")
                    .append($("<span id='edicion" + numEdicion + "'>").attr("onclick","editarSeparacion('#edicion" + (numEdicion++) + "')").append($("<i>").addClass("fa fa-pencil-square-o fa-2x"))))
                .append($("<div>").addClass("col-xs-2 col-sm-2 col-md-2 col-lg-2 separador direccion text-center").css("margin-top","0")
                    .append($("<span>").attr("onclick","cambiarDireccionSeparador('#separador" + numSeparador + "')").append($("<i id='separador" + (numSeparador++) + "'>").addClass("fa " + strDirecciones[1] + " fa-4x"))))
                .append($("<div>").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3 separador split text-center")
                    .append($("<span id='edicion" + numEdicion + "'>").attr("onclick","editarSeparacion('#edicion" + (numEdicion++) + "')").append($("<i>").addClass("fa fa-pencil-square-o fa-2x"))));
        break;
        case 4: 
            fila.append($("<div>").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3 split text-center")
                    .append($("<span>").attr("onclick","editarSeparacion('fila" + idFila + "')").append($("<i>").addClass("fa fa-pencil-square-o fa-2x"))))
                .append($("<div>").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3 split text-center")
                    .append($("<span>").attr("onclick","editarSeparacion('fila" + idFila + "')").append($("<i>").addClass("fa fa-pencil-square-o fa-2x"))))
                .append($("<div>").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3 split text-center")
                    .append($("<span>").attr("onclick","editarSeparacion('fila" + idFila + "')").append($("<i>").addClass("fa fa-pencil-square-o fa-2x"))))
                .append($("<div>").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3 split text-center")
                    .append($("<span>").attr("onclick","editarSeparacion('fila" + idFila + "')").append($("<i>").addClass("fa fa-pencil-square-o fa-2x"))));
        break;
    }
    
    return fila;
}

function editarSeparacion(idSeparador) {
    $("#summernote").summernote({ 
        height: 200 });
    $("#modalEdicion").modal("show");
}

function cambiarDireccionSeparador(idSeparador){
    $(idSeparador).toggleClass("fa-long-arrow-right fa-long-arrow-left");
}

function crearColumna(primeraColumna, direccion, totalColumnas){
    var clases = "";
    switch(totalColumnas){
        case 1:
            clases = "col-lg-offset-5 col-md-offset-5 col-sm-offset-5 col-xs-2 col-sm-2 col-md-2 col-lg-2 altoMinimoElementoInterno margenInterno pilar";
        break;
        case 2:
            if(primeraColumna)
                clases = "col-lg-offset-2 col-md-offset-2 col-sm-offset-2 col-xs-2 col-sm-2 col-md-2 col-lg-2 altoMinimoElementoInterno margenInterno pilar";
            else
                clases = "col-lg-offset-4 col-md-offset-4 col-sm-offset-4 col-xs-2 col-sm-2 col-md-2 col-lg-2 altoMinimoElementoInterno margenInterno pilar";
        break;
        case 3:
            if(primeraColumna)
                clases = "col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-xs-2 col-sm-2 col-md-2 col-lg-2 altoMinimoElementoInterno margenInterno pilar";
            else
                clases = "col-lg-offset-2 col-md-offset-2 col-sm-offset-2 col-xs-2 col-sm-2 col-md-2 col-lg-2 altoMinimoElementoInterno margenInterno pilar";
        break;
    }
    var offset = (primeraColumna ? "0" : "0");
    
    var columna = $("<div>").addClass(clases)
        .append($("<div>").addClass("text-center arrowText arrow" + direccion).append($("<i>").addClass("margenInterno fa fa-refresh fa-2x")));
    return columna;
}

function crearContenedorColumnas(columnas){
    var columna = columnas.split(",");
    var contenedor = $("<div>").addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12 margenInterno columna");
    for (var i = 0; i < columna.length; i++) {
        contenedor.append(crearColumna((i == 0 ? true : false), columna[i], columna.length));   
    }
    
    return contenedor;
}

function crearDireccion(direccion){
    var offset = (primeraColumna ? "2" : "1");
    
    var columna = $("<div>").addClass("col-lg-offset-" + offset + " col-md-offset-" + offset + " col-sm-offset-" + offset + " col-xs-offset-" + offset + " col-xs-2 col-sm-2 col-md-2 col-lg-2 altoMinimoElementoInterno margenInterno pilar")
    .append($("<div>").addClass("text-center arrowText arrow" + direccion));
    return columna;
}

function crearNivelSuperior(color, columnas, separacion, direcciones){
    $("#contenido > div:nth-child(1)").before(formatearFila(crearFila(color), separacion, direcciones));
    cambiarColor2("fila" + numFilas, color);
    $("#contenido > div:nth-child(1)").after(crearContenedorColumnas(columnas));
}

function crearNivelInferior(color, columnas, separacion, direcciones){
    $("#contenido > div:nth-last-child(1)").after(formatearFila(crearFila(color), separacion, direcciones));
    cambiarColor2("fila" + numFilas, color);
    
    $("#contenido > div:nth-last-child(1)").before(crearContenedorColumnas(columnas));
}

function cambiarColor2(idInput, color){
    $("#" + idInput).css("background-color",color);
    $("#" + idInput).attr("data-color",color);
}

function listarDocumentos(){
    var files = $("#file1").prop("files");
    var jsonFilesAux = new Array();
    for (var i = 0; i < files.length; i++) {
        jsonFilesAux.push(files[i]);
    }
    $("#file1").val("");

    pintarListaFicheros(jsonFilesAux);
    
    //<a onclick="eliminarTagDocPrinc()"><i class="fa fa-times"></i></a><a id="docPrincipal" href="#" onclick="previewDoc(&quot;docPrincipal&quot;)" class="gris">  losherederos.pdf </a>
}

function pintarListaFicheros(jsonFilesAux){
    if((numFicheros + jsonFilesAux.length) < 4) {
        numFicheros = numFicheros + jsonFilesAux.length;
        for (var i = 0; i < jsonFilesAux.length; i++) {
            jsonFiles.push(jsonFilesAux[i]);
            var name = jsonFilesAux[i].name;
            $("#documentos").append("<div id='divdocadjun" + i + "'><a class='cursor'><i class='fa fa-times cruzRoja'></i></a><a id='docadjun" + i + "' class='cursor gris'> " + name + "</a><br /></div>");
        }
    }
    
}