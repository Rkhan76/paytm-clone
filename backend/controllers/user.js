const {User, Account} = require('../models/user')
const { z } = require('zod')
const bcrypt = require('bcrypt')
const saltRounds = 10
const { STATUS_CODE } = require('../constant/httpStatusCode')
const {
  userSigninDetail,
  userSignupDetail,
  updateUserInfoSchema,
} = require('../type')

const { setter } = require('../utils/cred')

async function handleUserSignup(req, res) {
  try {
    // Validate request body with Zod schema
    userSignupDetail.parse(req.body)

    const { userName, firstName, lastName, password } = req.body

    const checkUserExists = await User.findOne({ userName })

    if (checkUserExists) {
      return res
        .status(STATUS_CODE.CONFLICT)
        .json({ msg: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const userSignupResult = await User.create({
      userName,
      firstName,
      lastName,
      password: hashedPassword,
    })

    if (!userSignupResult) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ msg: 'Signup failed, please try again' })
    }

    // Create new account 
    const userId = userSignupResult._id

    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000
    })

    return res.status(STATUS_CODE.CREATED).json({ msg: 'Signup successful' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        msg: 'Validation failed',
        errors: error.errors, // This will provide detailed validation error messages
      })
    }
    return res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ msg: 'An unexpected error occurred' })
  }
}

async function handleUserSignin(req, res) {
  const result = userSigninDetail.safeParse(req.body)

  if (!result.success) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      msg: 'Validation failed',
      errors: result.error.errors,
    })
  }

  const { userName, password } = req.body

  const userSinginResult = await User.findOne({ userName })

  if (!userSinginResult) {
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ msg: 'There is no user with this username' })
  }

  const checkPassword = await bcrypt.compare(
    password,
    userSinginResult.password
  )

  if (!checkPassword) {
    return res
      .status(STATUS_CODE.UNAUTHORIZED)
      .json({ msg: 'Your username or password is not correct' })
  }

  const token = setter(userSinginResult)

  return res.status(STATUS_CODE.OK).json({ msg: 'Signin successful', token })
}

async function handleUserInfoUpdate(req, res) {
  const result = updateUserInfoSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      msg: 'Validation failed',
      errors: result.error.errors,
    })
  }

  const userName = req.userName
  const { firstName, lastName, password, oldPassword } = req.body

  const userData = await User.findOne({ userName })

  if (!userData) {
    return res.status(STATUS_CODE.NOT_FOUND).json({ msg: 'User not found' })
  }

  if (password && oldPassword) {
    const checkPassword = await bcrypt.compare(oldPassword, userData.password)
    if (!checkPassword) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ msg: 'Incorrect old password' })
    }

    req.body.password = await bcrypt.hash(password, saltRounds)
  }

  const updateData = { firstName, lastName }
  if (password) {
    updateData.password = req.body.password
  }

  const updateStatus = await User.findOneAndUpdate({ userName }, updateData, {
    new: true,
  })

  if (!updateStatus) {
    return res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Failed to update user data' })
  }

  return res
    .status(STATUS_CODE.OK)
    .json({ msg: 'Update successful', user: updateStatus })
}

async function handleOtherUserDetails(req, res) {
  const filter = req.query.filter || ''

  try {
    const regex = new RegExp(filter, 'i') // 'i' for case-insensitive matching

    const users = await User.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    })

    return res.status(STATUS_CODE.OK).json({
      users: users.map((user) => ({
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    })
  } catch (error) {
    console.error('Error fetching user details:', error)
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      msg: 'An unexpected error occurred while fetching user details',
    })
  }
}

module.exports = {
  handleUserSignup,
  handleUserSignin,
  handleUserInfoUpdate,
  handleOtherUserDetails
}
