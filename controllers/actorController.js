const createActorController = (db) => {
  // GET all actors
  const getAllActors = async (request, response) => {
    try {
      const actors = await db.all(`
        SELECT * FROM actors
        ORDER BY actor_id;
      `)

      response.status(200).json(actors)
    } catch (error) {
      console.error(error.message)
      response.status(500).json({ error: 'Internal Server Error' })
    }
  }

  // GET actor by ID
  const getActorById = async (request, response) => {
    try {
      const { actorId } = request.params

      const actor = await db.get(
        'SELECT * FROM actors WHERE actor_id = ?',
        [actorId],
      )

      if (!actor) {
        return response.status(404).json({ error: 'Actor not found' })
      }

      response.status(200).json(actor)
    } catch (error) {
      console.error(error.message)
      response.status(500).json({ error: 'Internal Server Error' })
    }
  }

  // POST add actor
  const addActor = async (request, response) => {
    try {
      const { actor_name, phone } = request.body

      if (
        typeof actor_name !== 'string' ||
        actor_name.trim() === '' ||
        typeof phone !== 'string' ||
        phone.trim() === ''
      ) {
        return response.status(400).json({
          error: 'Actor name and phone are required',
        })
      }

      const result = await db.run(
        `INSERT INTO actors (actor_name, phone)
         VALUES (?, ?)`,
        [actor_name.trim(), phone.trim()],
      )

      response.status(201).json({
        message: 'Actor added successfully',
        actorId: result.lastID,
      })
    } catch (error) {
      console.error(error.message)
      response.status(500).json({ error: 'Internal Server Error' })
    }
  }

  // PUT update actor
  const updateActor = async (request, response) => {
    try {
      const { actorId } = request.params
      const { actor_name, phone } = request.body

      if (
        typeof actor_name !== 'string' ||
        actor_name.trim() === '' ||
        typeof phone !== 'string' ||
        phone.trim() === ''
      ) {
        return response.status(400).json({
          error: 'Actor name and phone are required',
        })
      }

      const result = await db.run(
        `UPDATE actors
         SET actor_name = ?, phone = ?
         WHERE actor_id = ?`,
        [actor_name.trim(), phone.trim(), actorId],
      )

      if (result.changes === 0) {
        return response.status(404).json({ error: 'Actor not found' })
      }

      response.status(200).json({
        message: 'Actor updated successfully',
      })
    } catch (error) {
      console.error(error.message)
      response.status(500).json({ error: 'Internal Server Error' })
    }
  }

  // DELETE actor
  const deleteActor = async (request, response) => {
    try {
      const { actorId } = request.params

      const result = await db.run(
        'DELETE FROM actors WHERE actor_id = ?',
        [actorId],
      )

      if (result.changes === 0) {
        return response.status(404).json({ error: 'Actor not found' })
      }

      response.status(200).json({
        message: 'Actor deleted successfully',
      })
    } catch (error) {
      console.error(error.message)
      response.status(500).json({ error: 'Unable to delete actor' })
    }
  }

  return {
    getAllActors,
    getActorById,
    addActor,
    updateActor,
    deleteActor,
  }
}

module.exports = createActorController