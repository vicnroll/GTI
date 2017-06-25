'use strict';
const mongoose = require("mongoose");

mongoose.connect("http://localhost:27017/usuarios");

module.exports = mongoose;