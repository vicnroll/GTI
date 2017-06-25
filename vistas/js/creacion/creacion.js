const esPrimera = true;
const esIntermedia = false;

var nombreMarcoActual = "";
var idMarcoActual = "";
var numFilas = 0;
var defaultColor = "#F05F40"; 
//var defaultMarco = {"filas":[[2,"#f05f40,#004080"]],"columnas":[[3,"Bottom,Top,Top"]]};
var defaultMarco = {"filas":[[4,"#004000,#f05f40,#004080,#ff80ff"]],"columnas":[[3,"Top,Bottom,Top"],[3,"Bottom,Top,Top"],[3,"Top,Top,Bottom"]]};
var columnasDefault = "Bottom,Top,Top";
$(document).ready(function(){
    cambiarDireccionListener();
    inputListener();
    recuperarMarcosUsuario();
    //cargarEstructuraMarco(defaultMarco);
});

function crearFila(color){
    numFilas++;
    var fila = $("<div>").addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12 bordeFino altoMinimoElemento margenInterno fila");
    fila.append($("<input>").attr("id","color" + numFilas).attr("type","color").attr("value",color).attr("onchange","cambiarColor('color" + numFilas + "')").addClass("pull-right margenInterno"));
    return fila;
}

function crearColumna(primeraColumna, direccion){
    var offset = (primeraColumna ? "2" : "1");
    
    var columna = $("<div>").addClass("col-lg-offset-" + offset + " col-md-offset-" + offset + " col-sm-offset-" + offset + " col-xs-offset-" + offset + " col-xs-2 col-sm-2 col-md-2 col-lg-2 altoMinimoElementoInterno margenInterno pilar")
    .append($("<div>").addClass("text-center arrowText arrow" + direccion).append($("<i>").addClass("margenInterno fa fa-refresh fa-2x")));
    return columna;
}

function crearContenedorColumnas(columnas){
    var columna = columnas.split(",");
    var contenedor = $("<div>").addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12 margenInterno columna");
    for (var i = 0; i < columna.length; i++) {
        contenedor.append(crearColumna((i == 0 ? true : false), columna[i]));   
    }
    
    return contenedor;
}

function crearNivelSuperior(color, columnas){
    var contenidoVacio = ($("#contenido > div").length == 1 ? true : false);

    if(columnas == "undefined" || columnas == "" || columnas == null) columnas = columnasDefault;
    if(color == null || color == "undefined" || color == "") color = defaultColor;

    if(contenidoVacio && columnas == columnasDefault && color == defaultColor){
        $("#contenido > div:nth-last-child(1)").after(crearFila(defaultColor));
        cambiarColor("color" + numFilas);
    }

    $("#contenido > div:nth-child(1)").before(crearFila(color));
    cambiarColor("color" + numFilas);
    $("#contenido > div:nth-child(1)").after(crearContenedorColumnas(columnas));

    cambiarDireccionListener();
}

function crearNivelInferior(color, columnas){
    var contenidoVacio = ($("#contenido > div").length == 1 ? true : false);

    if(columnas == "undefined" || columnas == "" || columnas == null) columnas = columnasDefault;
    if(color == null || color == "undefined" || color == "") color = defaultColor;

    if(contenidoVacio){
        $("#contenido > div:nth-last-child(1)").before(crearFila(defaultColor));
        cambiarColor("color" + numFilas);
    }

    $("#contenido > div:nth-last-child(1)").after(crearFila(color));
    cambiarColor("color" + numFilas);
    $("#contenido > div:nth-last-child(1)").before(crearContenedorColumnas(columnas));
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
    $("#" + idInput).parent().css("background-color",color);
}

function guardarMarco(accion){
    // El único requisito para guardarlo es que tenga un nombre
    // El número de filas y columnas es relativo, puede ser todo 0 si hace falta
    if($("#nombreMarco")[0].checkValidity()){
        // Estructura JSON del marco
        var marco = {nombre: $("#nombreMarco").val(), idUsuario: sessionStorage.getItem("token"), filas: [], columnas:[]};

        // Recuperamos Filas 
        var colores = "";
        $(".fila").each(function(){
            colores += $(this).find("input").val() + ",";
        });
        colores = colores.substr(0 , colores.length - 1);
        marco.filas.push([numFilas, colores]);

        // Recuperamos Columnas
        $(".columna").each(function () {
            var totalPilares = $(this).find(".pilar").length;
            var direcciones = "";
            $(this).find(".pilar .arrowText").each(function(){
                if($(this).hasClass("arrowBottom")) direcciones += "Bottom,";
                else direcciones += "Top,";
            });
            direcciones = direcciones.substr(0, direcciones.length - 1)
            marco.columnas.push([totalPilares, direcciones]);
        });

        console.log(JSON.stringify(marco));

        enviarMarco(marco, accion);
    } else {
        // No tiene nombre 
        $("input.current.nombreMarco").addClass("bordeError");
    }
}

function enviarMarco(marco, accion){

    var handler = "";
    switch(accion){
        case "actualizar": 
            handler = "/marcos/actualizar";
            $("#mensajeConfirmacion").html("Reajustando Marco");
            $(".fa-spin").addClass("fa-cog");
        break;
        case "guardar": 
            handler = "/marcos/guardar";
            $("#mensajeConfirmacion").html("Creando Marco");
            $(".fa-spin").addClass("fa-cog");
        break;
    }
    
    $("#modalMarco").modal("hide");
    $("#modalConfirmacion").modal("show");
    $.post(handler,{idMarco: idMarcoActual, idUsuario: marco.idUsuario, nombre: marco.nombre, filas: JSON.stringify(marco.filas), columnas: JSON.stringify(marco.columnas)}, 
    function(data){
        $(".fa-spin").removeClass("fa-cog");
        $(".fa-spin").removeClass("fa-spinner");
        if(data != "-1"){
            if(accion == "guardar"){
                var data = $("#tablaListaMarcos").dataTable().fnAddData({id: data.id, nombre: data.nombre});
                var row = $("#tablaListaMarcos").dataTable().fnSettings().aoData[data[0]].nTr;
                $("#tablaListaMarcos tr").removeClass("current");
                $(row).addClass("current");
                nombreMarcoActual = marco.nombre;
                idMarcoActual = data.id;
            } 
            
            $("#tablaListaMarcos .current a").text(marco.nombre);
            
            $("#mensajeConfirmacion").html("Marco " + (accion == "guardar" ? "guardado" : "actualizado") + " correctamente");
            $(".fa-spin").addClass("fa-check-circle").css("color","green");
        
        } else {
            $("#mensajeConfirmacion").html("Lo lamentamos, no hemos ningún usuario");
            $(".fa-spin").addClass("fa-times-circle").css("color","red");
        }
        $(".fa-spin").removeClass("fa-spin");
    });
}

function eliminarMarcosUsuario(id){
    $.post("/marcos/eliminar", {idMarco: id}, function(data){
        if(data != "-1"){
            cargarListaMarcos(data);
        } else {
            $("#listaMarcos").append(cargarListaNuevoMarco());
        }
    });
}

function recuperarMarcosUsuario(){
    $.post("/marcos/recuperar", {idUsuario: sessionStorage.getItem("token")}, function(data){
        if(data != "-1"){
            cargarTablaMarcos(data);
        } else {
            $("#listaMarcos").append(cargarListaNuevoMarco());
        }
    });
}

function cargarTablaMarcos(historial){
    var t = $("<table>").attr("id","tablaListaMarcos").addClass("table stripe col-xs-12 col-sm-12 col-md-12 col-lg-12")
                .append($("<thead>").append($("<tr>").append($("<th>").html("idMarco")).append($("<th>").html("Descripción")))
                .append($("<tbody>")));
                
    $("#listaMarcos").append(t);
    var indice = 0;
    t.DataTable({
            "aaData": historial,
            "columns": [
                { "data": "id" },
                { "data": "nombre" }
            ],
            "columnDefs": [
                    { "visible": true, "sClass": "hidden", "searchable": false, "targets": 0 },
                    { "visible": true, "searchable": true, "targets": 1, 
                        "sClass": "text-center",
                        "render": function (data) {
                                    indice++;
                                    return "<a id='marco" + indice + "' class='text-center' style='cursor: pointer' href=javascript:cargarEstructuraMarco('#marco" + indice + "')>" + data + "</a>";
                                }
                    }
            ],
            "fnInitComplete": function () {
                $("#tablaListaMarcos_paginate").addClass("text-center").find("a").addClass("btn btn-primary");
                $("#tablaListaMarcos_previous").addClass("pull-left");
                $("#tablaListaMarcos_next").addClass("pull-right");
            }
        });

        t.on('search.dt', function () {
                    setTimeout(function () { 
                         $("#tablaListaMarcos_paginate").addClass("text-center").find("a").addClass("btn btn-primary");
                         $("#tablaListaMarcos_previous").addClass("pull-left");
                         $("#tablaListaMarcos_next").addClass("pull-right");
                     }, 100);
                });
}

function cargarListaMarcoGuardado(idMarco, nombre, indice){
    var elemento = $("<fieldset>").addClass("col-xs-12 col-sm-11 col-md-12 col-lg-12")
                        .append($("<p>").addClass("col-xs-12 col-sm-11 col-md-12 col-lg-12 input-group")
                            .append($("<a>").attr("id","marco" + indice).html(indice + " - " + nombre).attr("href","#")
                                .addClass("col-xs-12 col-sm-11 col-md-12 col-lg-12")));
    return elemento;
}

function cargarListaNuevoMarco(){
    var elemento = $("<fieldset>").addClass("col-xs-12 col-sm-11 col-md-12 col-lg-12")
                        .append($("<p>").addClass("col-xs-12 col-sm-11 col-md-12 col-lg-12 input-group")
                            .append($("<input>").attr("id","NuevoMarco").attr("placeholder","Sin título").attr("name","NuevoMarco").attr("type","text")
                                .addClass("col-xs-12 col-sm-11 col-md-12 col-lg-12 sinBorde form-control bordeError current nombreMarco "))
                            .append($("<span>").addClass("input-group-addon").attr("onclick","guardarMarco('-1')").append($("<i>").addClass("fa fa-floppy-o"))));
    return elemento;
}

function cargarEstructuraMarco(idEnlace){
    nombreMarcoActual = $(idEnlace).text();
    $("#tablaListaMarcos tr").removeClass("current");
    $(idEnlace).parents("tr").addClass("current");

    idMarcoActual = $(idEnlace).parents("tr").find("td.hidden").text();
    
    $.post("/marcos/buscar", {idMarco: idMarcoActual, idUsuario: sessionStorage.getItem("token")}, function(marco) {
        if(marco != "-1"){
            marco.filas = JSON.parse(marco.filas);
            marco.columnas = JSON.parse(marco.columnas);

            $("#btnActualizar").prop("disabled", false);

            $("#contenido").html($("<div>").html(""));
            var total = marco.filas[0][0];
            var color = marco.filas[0][1].split(",");
            for (var i = 1; i <= total; i++) {
                switch(i){
                    case 1:
                        crearNivelSuperior(color[i-1], marco.columnas[i-1][1]);
                        break;
                    case 2:
                        $("#contenido > div:nth-last-child(1)").after(crearFila(color[i-1]));
                        cambiarColor("color" + numFilas);
                        break;
                    default:
                        crearNivelInferior(color[i-1], marco.columnas[i-2][1]);
                        break;
                }
            }
        }
    });
}

function lanzarModal(accion){
    var titulo = "";

    switch(accion){
        case "actualizar": 
            titulo = "Actualizar Marco";
            $("#nombreMarco").val(nombreMarcoActual).attr("placeholder",nombreMarcoActual);
        break;
        case "guardar":
            titulo = "Guardar Marco";
        break;
    }

    $("#modalEnviar").attr("onclick","guardarMarco('" + accion + "')");

    $("#labelConfirmacion").html("¿Está seguro que desea " + accion + " este marco?");
    $("#labelConfirmacion .modal-title").html(titulo);

    $("#modalMarco").modal('show');
}