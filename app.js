const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const personsRouter = require('./controllers/persons')
const mongoose = require('mongoose')

console.log('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { 
  useFindAndModify: false, 
  useCreateIndex: true, 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(result => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/persons', personsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app