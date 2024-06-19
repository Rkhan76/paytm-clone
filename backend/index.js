const express = require('express')
const { connectToMongoDB } = require('./db')
const cors = require('cors')
const mainRouter = require('./routes/index')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', mainRouter)

connectToMongoDB('mongodb://127.0.0.1:27017/paytm-clone')
  .then(() => {
    console.log('mongodb connected successfully')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
