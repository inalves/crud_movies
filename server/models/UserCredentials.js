const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserCredentialsShema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
    
});

module.exports = User = mongoose.model('users', UserCredentialsShema);