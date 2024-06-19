const  { z } = require('zod')

const userSignupDetail = z.object({
  userName: z
    .string()
    .min(5, { message: 'Must be 5 or more characters long' })
    .max(30, { message: 'Must be 30 or fewer characters long' }),
  firstName: z
    .string()
    .max(50, { message: 'Must be 30 or fewer characters long' }),
  firstName: z
    .string()
    .max(50, { message: 'Must be 30 or fewer characters long' }),
  password: z
    .string()
    .min(6, { message: 'Must be 6 or more characters long' }),
})

const userSigninDetail = z.object({
  userName: z.string(),
  password: z.string()
})

const updateUserInfoSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().optional(),
    oldPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Check if password is provided without oldPassword
      if (data.password && !data.oldPassword) {
        return false
      }
      return true
    },
    {
      message: 'Old password is required when updating the password',
      path: ['oldPassword'], // This path points to where the error should appear
    }
  )


module.exports = {
  userSigninDetail,
  userSignupDetail,
  updateUserInfoSchema,
}