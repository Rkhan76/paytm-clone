const jwt = require("jsonwebtoken")
const  { JWT_SECRET } = require('../config')

function setter(credentials){
    const { userName } = credentials

    const token = jwt.sign({
        userName
    }, JWT_SECRET)

    return token
}


module.exports = {
    setter
}


