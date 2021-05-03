const mongoose = require('mongoose');
const { Schema } = mongoose;

const MovieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    country: {
        type: String,
        required: true
    },
    year:{
        type: Number,
        required: true
    },
    cover:{
        type: String,
        required: true
    },
    trailer:{
        type: String,
    }

});

module.exports = Movie = mongoose.model('movies', MovieSchema);