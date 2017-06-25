var Usuario;
exports.setModel = function(modelo){
   Usuario = modelo;
};
exports.buscar = function(req, res){
   Usuario.find({}, function(error, usuarios){
      if(error){
         res.sendfile(__dirname + '/index.html');
      }else{
         res.render('usuarios/index', {
            usuarios: usuarios
         });
      }
   })
};
exports.create = function(req, res){
    res.render('usuarios/save', {
      put: false,
      action: '/usuarios/',
      usuario: new Usuario({
          nombreUsuario: '',
          password: '',
          nombre: '',
          apellido: ''
      })
   });
};
exports.store = function(req, res){
   var usuario = new Usuario({
       nombreUsuario: req.body.nombreUsuario,
       password: req.body.password,
       nombre: req.body.nombre,
       apellido: req.body.apellido
   });

   console.log("[%s] REGISTRANDO USUARIO: %s ; %s;", new Date(), usuario.nombreUsuario, usuario.password);
   usuario.save(function(error, fUsuario){
      if(error){
          console.error("[%s] ERROR REGISTRANDO USUARIO: %s",  new Date(), error);
      }else{ 
         console.log("[%s] USUARIO REGISTRADO: %s",  new Date(), fUsuario._id);
      }
   });
   
};
exports.show = function(req, res){
    var usuario = new Usuario({
        nombreUsuario: req.body.nombreUsuario,
        password: req.body.password
    });
    console.log("[%s] BUSCANDO USUARIO: %s ; %s;", new Date(), usuario.nombreUsuario, usuario.password);
    Usuario.find(usuario, function(error, fUsuario){
        if(error){
            console.error("[%s] ERROR BUSCANDO USUARIO: %s",  new Date(), error);
            res.render("");
        }else{
            if(fUsuario == ""){
                console.log("[%s] 404 USUARIO NO ENCONTRADO",  new Date());
                return "404 USUARIO NO ENCONTRADO";
            } else {
                console.log("[%s] ENCONTRADO USUARIO: %s",  new Date(), fUsuario._id);
                res.body = fUsuario;
            }
        }
    });
};

exports.destroy = function(req, res){
   //
};