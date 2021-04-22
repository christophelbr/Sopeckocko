const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // Permet de s'assurer d'avoir un seul compte pour un adresse mail

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique : true },
    password : { type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);