'use strict';
 const mongoose = require('../../config/mongoose');
 const userSchema = require('./schemas').userSchema;

 const models = {

    User: mongoose.model('User', userSchema)

 };

 module.exports = models;