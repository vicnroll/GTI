'use strict';
const mongoose = require("../../config/mongoose"),
    Schema = mongoose.Schema;

const schemas = {
    schemaUsuario : Schema({
        nombreUsuario: {type: String, unique: true},
        password: {type: String},
        nombre: {type: String},
        apellidos: {type: String}
    })
};

module.expots = schemas;