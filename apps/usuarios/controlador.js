'use strict';

var mongoose = require('mongoose');
var usuarios = require('./config/routers/usuario');
mongoose.connect('mongodb://localhost:8080/usuarios', function(error){
   if(error){
      throw error; 
   }else{
      console.log('Conectado a MongoDB');
   }
});

var UsuarioSchema = mongoose.Schema({
    nombreUsuario: {type: String, required: true},
    password: {type: String, required: true},
    nombre: {type: String, required: true},
    apellido: {type: String}
});

var UsuarioModelo = mongoose.model('Usuario', UsuarioSchema);
usuario.setModel(UsuarioModelo);

app.get('/usuarios/buscar', usuarios.index);
app.get('/usuarios/obj', usuarios.create);
app.post('/usuarios/create', usuarios.store);
app.get('/usuarios/:id', usuarios.show);
app.delete('/usuarios/:id', usuarios.destroy);