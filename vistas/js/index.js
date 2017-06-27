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

function esNullOVacio(param){
    return param == undefined || param == "" || param == null || param == "undefined" || param.length == 0 ;
}

function guardarMarco(accion){
    // El único requisito para guardarlo es que tenga un nombre
    // El número de filas y columnas es relativo, puede ser todo 0 si hace falta
    if($("#nombreMarco")[0].checkValidity()){
        // Estructura JSON del marco
        var marco = {nombre: $("#nombreMarco").val(), idUsuario: sessionStorage.getItem("token"), filas: [], columnas: [], separaciones: [], direcciones: []};

        // Recuperamos Filas 
        var colores = "";
        var separaciones = "";
        var direcciones = [];
        var i = 0;
        $(".fila").each(function(){
            colores += $(this).attr("data-color") + ",";
            if($(this).find(".split").length == 0) separaciones += "1,";
            else separaciones += $(this).find(".split").length + ",";
            direcciones.push([]);
            $(this).find(".direccion i").each(function(){
                if($(this).hasClass("fa-long-arrow-right"))
                    direcciones[i].push("fa-long-arrow-right");
                else
                    direcciones[i].push("fa-long-arrow-left");
            });
            i++;
        });
        colores = colores.substr(0 , colores.length - 1);
        marco.filas.push([$(".fila").length, colores]);
        separaciones = separaciones.substr(0 , separaciones.length - 1);
        marco.separaciones.push([separaciones]);
        marco.direcciones = direcciones;
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
    $.post(handler,{idMarco: idMarcoActual, 
                    idUsuario: marco.idUsuario, 
                    nombre: marco.nombre, 
                    filas: JSON.stringify(marco.filas), 
                    columnas: JSON.stringify(marco.columnas),
                    separaciones: JSON.stringify(marco.separaciones),
                    direcciones: JSON.stringify(marco.direcciones)
                    }, 
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

function eliminarMarcoUsuario(id){
    $("#mensajeConfirmacion").html("Eliminando Marco");
    $(".fa-spin").addClass("fa-cog");
    $("#modalMarco").modal("hide");
    $("#modalConfirmacion").modal("show");
    $.post("/marcos/eliminar", {idMarco: id}, function(data){
        if(data != "-1"){
            $("#mensajeConfirmacion").html("Marco eliminado correctamente");
            $(".fa-spin").addClass("fa-check-circle").css("color","green");
            
            $("#listaMarcos").append(recuperarMarcosUsuario());
        } else {
            $("#mensajeConfirmacion").html("Lo lamentamos, no hemos podido eliminar el marco");
            $(".fa-spin").addClass("fa-times-circle").css("color","red");
        }
        $(".fa-spin").removeClass("fa-spin");
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
    $("#listaMarcos").html("");
    if($("#listaMarcos").html() != ""){
        $("#tablaListaMarcos").dataTable().fnDestroy();
    }
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
                formatearBotonesTabla();
                $("#tablaListaMarcos_paginate a").on("click", function () { formatearBotonesTabla(); });
            }
        });

        t.on('search.dt', function () { setTimeout(function () { formatearBotonesTabla(); }, 100); });
        
}

function formatearBotonesTabla(){
    $("#tablaListaMarcos_paginate").addClass("text-center").find("a").addClass("btn btn-primary");
    $("#tablaListaMarcos_previous").addClass("pull-left");
    $("#tablaListaMarcos_next").addClass("pull-right");
    $("#tablaListaMarcos_paginate a").on("click", function () { formatearBotonesTabla(); });
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
            marco.separaciones = JSON.parse(marco.separaciones);
            if(esNullOVacio(marco.direcciones)) marco.direcciones = [[],[],[]];
            else marco.direcciones = JSON.parse(marco.direcciones);
            $("#btnActualizar").prop("disabled", false);
            $("#btnEliminar").prop("disabled", false);
            $("#btnGuardar").prop("disabled", false);
            $("#contenido").html($("<div>").html(""));
            var total = marco.filas[0][0];
            var color = marco.filas[0][1].split(",");
            var separaciones = marco.separaciones[0][0].split(",");
            
            for (var i = 0; i < total; i++) {
                switch(i){
                    case 0:
                        crearNivelSuperior(color[i], marco.columnas[i][1], separaciones[i], marco.direcciones[i]);
                        break;
                    case 1:
                        $("#contenido > div:nth-last-child(1)").after(formatearFila(crearContenedorFilas(color[i]), separaciones[i], marco.direcciones[i]));
                        cambiarColor2("fila" + numFilas, color[i]);
                        break;
                    default:
                        crearNivelInferior(color[i], marco.columnas[i-1][1], separaciones[i], marco.direcciones[i]);
                        break;
                }
            }
        }
    });
}

function lanzarModal(accion){
    var titulo = "";
    var icono = "fa-paper-plane";
    $("#modalMarco input").show();
    $("#lblNombre").show();
    switch(accion){
        case "actualizar": 
            titulo = "Actualizar Marco";
            $("#nombreMarco").val(nombreMarcoActual).attr("placeholder",nombreMarcoActual);
        break;
        case "guardar":
            titulo = "Guardar Marco";
        break;
        case "eliminar":
            titulo = "Eliminar Marco";
            $("#modalMarco input").hide();
            $("#lblNombre").hide();
            icono = "fa-trash-o";
        break;
    }

    $("#btnEnviar").html("<i class='fa " + icono + "'></i> " + accion);
    
    $("#btnEnviar").attr("onclick",(accion == "eliminar" ? "eliminarMarcoUsuario('" + idMarcoActual + "')" : "guardarMarco('" + accion + "')"));

    $("#labelConfirmacion").html("¿Está seguro que desea " + accion + " este marco?");
    $("#modalMarco .modal-title").html(titulo);

    $("#modalMarco").modal('show');
}

function desbloquearBotones(){
    $("#btnGuardar").prop("disabled", false);
    $("#btnEliminar").prop("disabled", false);
    $("#btnActualizar").prop("disabled", false);
}

function reestablecerBody(){
    setTimeout(function(){$("body").css("padding-right","0");},500);
}