const jwt = require('jsonwebtoken')
module.exports = function (obj) {
    const token = jwt.sign(obj, process.env.SECRET, {
        expiresIn: '1day',
    })
    return token
}
