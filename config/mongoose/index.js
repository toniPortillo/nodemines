'use strict';
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/auth', function(err) {
    if(err) throw err;

    console.log('Successfully connected');
});

module.exports = mongoose;