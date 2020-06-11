const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
})
schema.methods.validPassword = function (password) {
    return this.password == password
}
schema.pre('validate', function () {
    this.role = 'user'
})
module.exports = mongoose.model('User', schema)
