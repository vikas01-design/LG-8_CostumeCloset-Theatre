const createHireController = (db) => {

  // POST - Hire a costume
  const createHire = async (request, response) => {
    try {
      const { actor_id, costume_id, hire_date, return_date } = request.body

      // Validate input
      if (
        !Number.isInteger(actor_id) ||
        !Number.isInteger(costume_id) ||
        !hire_date ||
        !return_date
      ) {
        return response.status(400).json({
          error: 'Actor ID, costume ID, hire date and return date are required',
        })
      }

      // Check whether actor exists
      const actor = await db.get(
        'SELECT * FROM actors WHERE actor_id = ?',
        [actor_id],
      )

      if (!actor) {
        return response.status(404).json({
          error: 'Actor not found',
        })
      }

      // Check whether costume exists
      const costume = await db.get(
        'SELECT * FROM costumes WHERE costume_id = ?',
        [costume_id],
      )

      if (!costume) {
        return response.status(404).json({
          error: 'Costume not found',
        })
      }

      // Check whether the costume is already hired
      const activeHire = await db.get(
        `SELECT hire_id
         FROM hires
         WHERE costume_id = ? AND returned = 0`,
        [costume_id],
      )

      if (activeHire) {
        return response.status(409).json({
          error: `Costume ${costume_id} is already hired`,
        })
      }

      // Insert hire record
      const result = await db.run(
        `INSERT INTO hires
         (actor_id, costume_id, hire_date, return_date, returned)
         VALUES (?, ?, ?, ?, 0)`,
        [actor_id, costume_id, hire_date, return_date],
      )

      return response.status(201).json({
        message: 'Costume hired successfully',
        hireId: result.lastID,
      })

    } catch (error) {
      console.error(error.message)

      // Handle database-level duplicate active hire protection
      if (error.code === 'SQLITE_CONSTRAINT') {
        return response.status(409).json({
          error: `Costume ${request.body.costume_id} is already hired`,
        })
      }

      return response.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  // GET - Retrieve all hires
  const getAllHires = async (request, response) => {
    try {
      const hires = await db.all(`
        SELECT * FROM hires
        ORDER BY hire_id;
      `)

      response.status(200).json(hires)

    } catch (error) {
      console.error(error.message)
      response.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  // GET - Retrieve hire by ID
  const getHireById = async (request, response) => {
    try {
      const { hireId } = request.params

      const hire = await db.get(
        'SELECT * FROM hires WHERE hire_id = ?',
        [hireId],
      )

      if (!hire) {
        return response.status(404).json({
          error: 'Hire record not found',
        })
      }

      response.status(200).json(hire)

    } catch (error) {
      console.error(error.message)
      response.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  // PUT - Return a costume
  const returnCostume = async (request, response) => {
    try {
      const { hireId } = request.params

      const hire = await db.get(
        'SELECT * FROM hires WHERE hire_id = ?',
        [hireId],
      )

      if (!hire) {
        return response.status(404).json({
          error: 'Hire record not found',
        })
      }

      if (hire.returned === 1) {
        return response.status(400).json({
          error: 'Costume has already been returned',
        })
      }

      await db.run(
        'UPDATE hires SET returned = 1 WHERE hire_id = ?',
        [hireId],
      )

      response.status(200).json({
        message: 'Costume returned successfully',
      })

    } catch (error) {
      console.error(error.message)
      response.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  // GET - Hires with actor and costume names using JOIN
  const getHireDetails = async (request, response) => {
    try {
      const hires = await db.all(`
        SELECT
          hires.hire_id,
          actors.actor_name,
          costumes.name AS costume_name,
          hires.hire_date,
          hires.return_date,
          hires.returned
        FROM hires
        JOIN actors
          ON hires.actor_id = actors.actor_id
        JOIN costumes
          ON hires.costume_id = costumes.costume_id
        ORDER BY hires.hire_id;
      `)

      response.status(200).json(hires)

    } catch (error) {
      console.error(error.message)
      response.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  // Export all controller functions
  return {
    createHire,
    getAllHires,
    getHireById,
    returnCostume,
    getHireDetails,
  }
}

module.exports = createHireController