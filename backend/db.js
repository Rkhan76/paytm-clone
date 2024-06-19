const mongoose = require('mongoose')

function connectToMongoDB(url) {
  return mongoose.connect(url)
}

module.exports = {
  connectToMongoDB,
}

// 'mongodb+srv://rakshaankhan1:khan@94124@cluster0.nihhxkf.mongodb.net/'
//mongodb://localhost:27017/