const express = require('express')

const createCostumeController = require('../controllers/costumeController')

const createCostumeRoutes = (db) => {
  const router = express.Router()

  const {
    getAllCostumes,
    getCostumeById,
    addCostume,
    updateCostume,
    deleteCostume,
  } = createCostumeController(db)

  // GET all costumes and search by era
  router.get('/', getAllCostumes)

  // GET costume by ID
  router.get('/:costumeId', getCostumeById)

  // POST add costume
  router.post('/', addCostume)

  // PUT update costume
  router.put('/:costumeId', updateCostume)

  // DELETE costume
  router.delete('/:costumeId', deleteCostume)

  return router
}

module.exports = createCostumeRoutes