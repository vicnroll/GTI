// Importar
var express = require('express');
var dbUsuarios = require("mongoose");
dbUsuarios.connect('mongodb://localhost:27017/usuarios', function(error){
    if(error) console.log('Error de conexión a MongoDB: %s\n\n\n', error);
    else console.log('Conectado a UsuariosDB\n\n\n');
});

var UsuarioSchema = dbUsuarios.Schema({
    nombreUsuario: {type: String, required: true},
    password: {type: String, required: true},
    nombre: {type: String, required: true},
    apellido: {type: String}
});

var ModeloUsuario = dbUsuarios.model('Usuario', UsuarioSchema);

var dbMarcos = require("mongoose");
dbMarcos.connect('mongodb://localhost:27017/marcos', function(error){
    if(error) console.log('Error de conexión a MongoDB: %s\n\n\n', error);
    else console.log('Conectado a MarcosDB\n\n\n');
});

var MarcoSchema = dbMarcos.Schema({
    nombre: {type: String},
    idUsuario: {type: String},
    filas: {type: String},
    columnas: {type: String},
    separaciones: {type: String},
    direcciones: {type:String},
    fechaCreacion: {type: String},
    fechaActualizacion: {type: String}
});

var ModeloMarco  = dbMarcos.model('Modelos', MarcoSchema);

// instanciar
var app = express();

// Configuración
app.configure(function() {  
    // Localización de los ficheros estÃ¡ticos
    //app.use(express.static('C:\Users\simbl\Desktop\ServerNode\public'))
    app.use(express.static(__dirname + '/vistas'));
    // Muestra un log de todos los request en la consola        
    app.use(express.logger('dev')); 
    // Permite cambiar el HTML con el método POST                   
    app.use(express.bodyParser());
    // Simula DELETE y PUT                      
    app.use(express.methodOverride());                  
});

// Rutas de nuestro API
app.post('/usuarios/buscar', function(req, res) {
    console.log("[%s] BUSCANDO USUARIO: %s ; %s;", new Date(), req.body.nombreUsuario, req.body.password);
    ModeloUsuario.findOne({ nombreUsuario: req.body.nombreUsuario, password: req.body.password }, function(error, fUsuario){
        if(error){
            console.error("[%s] ERROR BUSCANDO USUARIO: %s",  new Date(), error);
            res.send("-1");
        }else{
            if(fUsuario == "" || fUsuario == null){
                console.log("[%s] 404 USUARIO NO ENCONTRADO",  new Date());
                res.send("-1");
            } else {
                console.log("[%s] ENCONTRADO USUARIO: %s",  new Date(), fUsuario._id);
                var data = {id: fUsuario._id , nombreUsuario: fUsuario.nombreUsuario}
                res.send(data);
            }
        }
    });
});

app.post('/usuarios/registrar', function(req, res) {
    
    console.log("[%s] REGISTRANDO USUARIO: %s ; %s;", new Date(), req.body.nombreUsuario, req.body.password);

    ModeloUsuario.findOne({ nombreUsuario: usuario.nombreUsuario }, function(error, fUsuario){
        if(error){
            console.error("[%s] ERROR BUSCANDO USUARIO: %s",  new Date(), error);
            res.send("-1");
        }else{
            if(fUsuario == "" || fUsuario == null){
                var usuario = new ModeloUsuario({
                    nombreUsuario: req.body.nombreUsuario,
                    password: req.body.password,
                    nombre: req.body.nombre,
                    apellido: req.body.apellido
                });
                usuario.save(function(error, fUsuario){
                    if(error){
                        console.error("[%s] ERROR REGISTRANDO USUARIO: %s",  new Date(), error);
                    }else{
                        console.log("[%s] USUARIO REGISTRADO: %s",  new Date(), fUsuario._id);
                        var data = {id: fUsuario._id , nombreUsuario: fUsuario.nombreUsuario};
                        res.send(data);
                    }
                });
            } else {
                console.log("[%s] INTENTO DE REGISTRO DE USUARIO EXISTENTE: %s",  new Date(), fUsuario._id);
                res.send("-2");
            }
        }
    });
});

app.post('/usuarios/eliminar', function(req, res) {
    console.log("[%s] ELIMINANDO USUARIO: %s ; %s;", new Date(), usuario.nombreUsuario, usuario.password);
    ModeloUsuario.remove({ nombreUsuario: req.body.nombreUsuario, password: req.body.password }, function(error, res){
        if(error) console.log("[%s] USUARIO NO BORRADO", new Date());
        else console.log("[%s] USUARIO BORRADO", new Date());
    });
});

// Rutas de nuestro API
app.post('/marcos/buscar', function(req, res) {
    console.log("[%s] BUSCANDO MARCO: %s ", new Date(),  req.body.idUsuario);

    ModeloMarco.findOne({idUsuario: req.body.idUsuario, _id: req.body.idMarco}, function(error, fMarco){
        if(error){
            console.error("[%s] ERROR BUSCANDO MARCO: %s",  new Date(), error);
            res.send("-1");
        }else{
            if(fMarco == "" || fMarco == null){
                console.log("[%s] 404 MARCO NO ENCONTRADO",  new Date());
                res.send("-1");
            } else {
                console.log("[%s] ENCONTRADO MARCO: '%s' ; %s",  new Date(), fMarco.nombre);
                res.send(fMarco);
            }
        }
    });
});

app.post('/marcos/recuperar', function(req, res) {
    console.log("[%s] BUSCANDO MARCOS: %s ", new Date(),  req.body.idUsuario);
    
    ModeloMarco.find({ idUsuario: req.body.idUsuario },function(error, fMarcos){
        if(error){
            console.error("[%s] ERROR BUSCANDO MARCOS: %s",  new Date(), error);
            res.send("-1");
        }else{
            if(fMarcos == "" || fMarcos == null){
                console.log("[%s] 404 MARCOS NO ENCONTRADOS",  new Date());
                res.send("-1");
            } else {
                console.log("[%s] ENCONTRADOS MARCOS: %s marcos",  new Date(), fMarcos.length);
                
                var data = [];
                for (var i = 0; i < fMarcos.length; i++) {
                    data.push({id: fMarcos[i]._id, nombre: fMarcos[i].nombre});
                    console.log("[%s] Nombre: %s , usuario: %s\n",  new Date(), fMarcos[i].nombre,fMarcos[i].idUsuario);
                }
                
                res.contentType('application/json');
                res.send(data);
            }
        }
    });
});

app.post('/marcos/guardar', function(req, res) {

    console.log("[%s] GUARDANDO MARCO: '%s'  del usuario: '%s'", new Date(), req.body.nombre, req.body.idUsuario);
    ModeloMarco.findOne({ nombre: req.body.nombre, idUsuario: req.body.idUsuario }, function(error, fMarco){
        if(error){
            console.error("[%s] ERROR BUSCANDO MARCO: %s",  new Date(), error);
            res.send("-1");
        }else{
            if(fMarco == "" || fMarco == null){
                var marco = new ModeloMarco({
                    nombre: req.body.nombre,
                    idUsuario: req.body.idUsuario,
                    filas: req.body.filas,
                    columnas: req.body.columnas,
                    separaciones: req.body.separaciones,
                    direcciones: req.body.direcciones,
                    fechaCreacion: new Date()
                });
                marco.save(function(error, fMarco){
                    if(error){
                        console.error("[%s] ERROR GUARDANDO MARCO: %s",  new Date(), error);
                    }else{
                        console.log("[%s] MARCO GUARDADO: %s",  new Date(), fMarco._id);
                        var data = {id: fMarco._id , nombre: fMarco.nombre};
                        res.send(data);
                    }
                });
            } else {
                console.error("[%s] ERROR GUARDANDO MARCO: %s",  new Date(), "Este marco ya existe");
                res.send("-1");
            }
        }
    });
});

app.post('/marcos/actualizar', function(req, res) {
    console.log("[%s] ACTUALIZANDO MARCO: %s ; %s;", new Date(), req.body.nombre, req.body.idMarco); //, idUsuario: req.body.idUsuario
    ModeloMarco.findOne({ _id: req.body.idMarco }, function(error, fMarco){
        if(error) {
            console.log("[%s] MARCO %s NO BORRADO", new Date(), req.body.nombre);
            res.send("-1");
        }
        else {
            if(fMarco != "" && fMarco != null){
                console.log("[%s] MARCO %s ENCONTRADO: nombre: ' %s '", new Date(), fMarco.nombre);
                fMarco.nombre = req.body.nombre;
                fMarco.filas = req.body.filas;
                fMarco.columnas = req.body.columnas;
                fMarco.separaciones = req.body.separaciones;
                fMarco.direcciones = req.body.direcciones;
                fMarco.fechaActualizacion = new Date();

                fMarco.save(function(error, fMarco){
                    if(error) console.error("[%s] ERROR ACTUALIZANDO MARCO: %s",  new Date(), error);
                    else {
                        console.log("[%s] MARCO %s ACTUALIZADO", new Date()), fMarco.nombre;
                        res.send("1");
                    }
                });
            } else {
                console.error("[%s] ERROR ACTUALIZANDO MARCO: %s",  new Date(), "Marco vacío");
            }
        }
    });
});

app.post('/marcos/eliminar', function(req, res) {
    console.log("[%s] ELIMINANDO MARCO: %s;", new Date(), req.body.idMarco); //, idUsuario: req.body.idUsuario
    ModeloMarco.remove({ _id: req.body.idMarco }, function(error, fMarco){
        if(error) {
            console.log("[%s] MARCO NO BORRADO", new Date());
            res.send("-1");
        } else {
            console.log("[%s] MARCO BORRADO", new Date());
            res.send("1");
        }
    });
});

// escuchar
app.listen(8080, function() {  
    console.log('App iniciada, escuchando en el puesto 8080');
});