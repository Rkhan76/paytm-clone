const jwt = require("jsonwebtoken")
const  { JWT_SECRET } = require('../config')

function setter(credentials){
    const { userName, _id } = credentials

    const token = jwt.sign({
        userName,
        _id
    }, JWT_SECRET)

    return token
}


module.exports = {
    setter
}


