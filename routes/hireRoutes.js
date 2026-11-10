const express = require('express')

const createHireController = require('../controllers/hireController')

const createHireRoutes = (db) => {
  const router = express.Router()

  const {
    createHire,
    getAllHires,
    getHireById,
    returnCostume,
    getHireDetails,
  } = createHireController(db)

  // GET all hires
  router.get('/', getAllHires)

  // GET hire details with actor and costume names
  router.get('/details', getHireDetails)

  // GET hire by ID
  router.get('/:hireId', getHireById)

  // POST create a hire
  router.post('/', createHire)

  // PUT return a costume
  router.put('/:hireId/return', returnCostume)

  return router
}

module.exports = createHireRoutes