const express = require('express')
const { authenticationMiddleware } = require('../middleware/auth')
const {
  handleChechkAccountBalance,
  handleTransaction,
} = require('../controllers/account')

const router = express.Router()

router.get('/balance', authenticationMiddleware, handleChechkAccountBalance)
router.post('/transfer', authenticationMiddleware, handleTransaction)

module.exports = router 