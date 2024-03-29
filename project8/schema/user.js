"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */

var mongoose = require('mongoose');

var recordSchema = new mongoose.Schema({
    object_id: mongoose.Schema.Types.ObjectId,
    parent_object_id: mongoose.Schema.Types.ObjectId,
    user_id: mongoose.Schema.Types.ObjectId,
    type: String,
    date_time: { type: Date, default: Date.now },
});

// create a schema
var userSchema = new mongoose.Schema({
    login_name: String,
    first_name: String, // First name of the user.
    last_name: String,  // Last name of the user.
    location: String,    // Location  of the user.
    description: String,  // A brief user description
    occupation: String ,   // Occupation of the user.
    // password: String,
    password_digest: String,
    salt: String,
    mentioned:[mongoose.Schema.Types.ObjectId],//photo id array
    favorites: [mongoose.Schema.Types.ObjectId],//photo id array
    records: [{ type: mongoose.Schema.Types.ObjectId, ref: "Record" }]
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);
var Record = mongoose.model("Record",recordSchema);

// make this available to our users in our Node applications
module.exports = {User, Record};
