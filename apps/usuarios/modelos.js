'use strict';
const mongoose = require("../../config/mongoose/index"),
    Schema = mongoose.Schema,
    Usuario = mongoose.model("usuario", new Schema({
        nombreUsuario: {type: String, unique: true},
        password: {type: String},
        nombre: {type: String},
        apellidos: {type: String}
    }));

module.exports = Usuario;