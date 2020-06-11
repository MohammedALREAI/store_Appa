const mongoose = require('mongoose')
const Schema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'user',
    },
})

module.exports = mongoose.model('FacebookUser', Schema)
