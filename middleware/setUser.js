const User = require('../models/User')
const jwt = require('jsonwebtoken')
module.exports = async function setUser(req, res, next) {
    let decoded
    try {
        decoded = req.header('auth')
            ? jwt.verify(req.header('auth'), process.env.SECRET)
            : null
        req.user = decoded ? await User.findById(decoded.id) : decoded
        next()
        console.log('setUser mid called', req.user)
    } catch (error) {
        console.log('jwt error: ', error)
        req.user = null
        next()
    }
}
