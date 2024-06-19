const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config') // Ensure this is destructured correctly from your config file
const { STATUS_CODE } = require('../constant/httpStatusCode')

function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(STATUS_CODE.FORBIDDEN)
      .json({ msg: 'Token is not provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    if (!decoded) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        msg: 'You are not authorized to proceed. Please sign in with valid credentials',
      })
    }

    if (decoded.userName) {
      req.userName = decoded.userName
    }

    next()
  } catch (error) {
    console.error('Error during authentication:', error)
    return res
      .status(STATUS_CODE.FORBIDDEN)
      .json({ msg: 'Something went wrong while authenticating' })
  }
}

module.exports = {
  authenticationMiddleware,
}
