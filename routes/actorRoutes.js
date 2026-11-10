const express = require('express')

const createActorController = require('../controllers/actorController')

const createActorRoutes = (db) => {
  const router = express.Router()

  const {
    getAllActors,
    getActorById,
    addActor,
    updateActor,
    deleteActor,
  } = createActorController(db)

  // GET all actors
  router.get('/', getAllActors)

  // GET actor by ID
  router.get('/:actorId', getActorById)

  // POST add actor
  router.post('/', addActor)

  // PUT update actor
  router.put('/:actorId', updateActor)

  // DELETE actor
  router.delete('/:actorId', deleteActor)

  return router
}

module.exports = createActorRoutes