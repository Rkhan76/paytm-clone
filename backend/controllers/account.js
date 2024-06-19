const { default: mongoose } = require('mongoose')
const { STATUS_CODE } = require('../constant/httpStatusCode')
const {Account} = require('../models/user')

async function handleChechkAccountBalance(req, res){
    const id = req._id

    console.log(id)

    const account = await Account.findOne({ userId: id})

    if(!account){
        return res.status(STATUS_CODE.NOT_FOUND).json({ msg: "there is no such bank account"})
    }

    return res.json({ balance: account.balance})
}

async function handleTransaction(req, res){
    const session = await mongoose.startSession()

    session.startTransaction()
    const  { amount , to } = req.body

    // Fetch the account within the transaction

    const account = await Account.findOne({ userId: req.id }).session(session)

    if(!account || account.balance < amount){
        await session.abortTransaction()
        return res.status(400).json({
            msg: "Insufficient balance"
        })
    }

    const toAccount = await Account.findOne({ userId: to }).session(session)

    if(!toAccount){
        await session.abortTransaction()
        return res.status(400).json({
          msg: 'Invalid Account',
        })
    }

    //perform the transfer
    await Account.updateOne({ userId: req.userId}, { $inc: { balance: -amount }}).session(session)
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session)

    //commit the transaction
    await session.commitTransaction()
    return res.json({
        msg: "Transfer successfull"
    })
}


module.exports = {
  handleChechkAccountBalance,
  handleTransaction,
}