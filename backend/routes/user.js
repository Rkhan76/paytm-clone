const express = require("express")
const { authenticationMiddleware } = require('../middleware/auth')
const {
  handleUserSignup,
  handleUserSignin,
  handleUserInfoUpdate,
  handleOtherUserDetails,
} = require('../controllers/user')


const router = express.Router()

router.post("/signup", handleUserSignup)
router.post('/signin', handleUserSignin)
router.put('/update', authenticationMiddleware, handleUserInfoUpdate)
router.get('/bulk', authenticationMiddleware, handleOtherUserDetails)

module.exports = router