const express = require('express')
const initializeDB = require('./config/database')
const createActorRoutes = require('./routes/actorRoutes')
const createCostumeRoutes = require('./routes/costumeRoutes')
const createHireRoutes = require('./routes/hireRoutes')

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

let db = null

// Initialize database and start server
const initializeDBAndServer = async () => {
  try {
    db = await initializeDB()

    app.use('/actors', createActorRoutes(db))
    app.use('/costumes', createCostumeRoutes(db))
    app.use('/hires', createHireRoutes(db))

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error(`Server initialization failed: ${error.message}`)
    process.exit(1)
  }
}

// Root route
app.get('/', (request, response) => {
  response.status(200).json({
    message: 'Welcome to CostumeCloset Theatre API',
  })
})

initializeDBAndServer()

module.exports = app