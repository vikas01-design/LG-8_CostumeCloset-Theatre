const createCostumeController = (db) => {
  // GET all costumes with optional era search
  const getAllCostumes = async (request, response) => {
    try {
      const { era } = request.query

      let query = 'SELECT * FROM costumes'
      let params = []

      if (era) {
        query += ' WHERE era LIKE ?'
        params.push(`%${era}%`)
      }

      query += ' ORDER BY costume_id'

      const costumes = await db.all(query, params)

      response.status(200).json(costumes)
    } catch (error) {
      console.error(error.message)
      response.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  // GET costume by ID
  const getCostumeById = async (request, response) => {
    try {
      const { costumeId } = request.params

      const costume = await db.get(
        'SELECT * FROM costumes WHERE costume_id = ?',
        [costumeId],
      )

      if (!costume) {
        return response.status(404).json({
          error: 'Costume not found',
        })
      }

      response.status(200).json(costume)
    } catch (error) {
      console.error(error.message)
      response.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  // POST add costume
  const addCostume = async (request, response) => {
    try {
      const { name, era } = request.body

      if (
        typeof name !== 'string' ||
        name.trim() === '' ||
        typeof era !== 'string' ||
        era.trim() === ''
      ) {
        return response.status(400).json({
          error: 'Costume name and era are required',
        })
      }

      const result = await db.run(
        `INSERT INTO costumes (name, era)
         VALUES (?, ?)`,
        [name.trim(), era.trim()],
      )

      response.status(201).json({
        message: 'Costume added successfully',
        costumeId: result.lastID,
      })
    } catch (error) {
      console.error(error.message)
      response.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  // PUT update costume
  const updateCostume = async (request, response) => {
    try {
      const { costumeId } = request.params
      const { name, era } = request.body

      if (
        typeof name !== 'string' ||
        name.trim() === '' ||
        typeof era !== 'string' ||
        era.trim() === ''
      ) {
        return response.status(400).json({
          error: 'Costume name and era are required',
        })
      }

      const result = await db.run(
        `UPDATE costumes
         SET name = ?, era = ?
         WHERE costume_id = ?`,
        [name.trim(), era.trim(), costumeId],
      )

      if (result.changes === 0) {
        return response.status(404).json({
          error: 'Costume not found',
        })
      }

      response.status(200).json({
        message: 'Costume updated successfully',
      })
    } catch (error) {
      console.error(error.message)
      response.status(500).json({
        error: 'Internal Server Error',
      })
    }
  }

  // DELETE costume
  const deleteCostume = async (request, response) => {
    try {
      const { costumeId } = request.params

      const result = await db.run(
        'DELETE FROM costumes WHERE costume_id = ?',
        [costumeId],
      )

      if (result.changes === 0) {
        return response.status(404).json({
          error: 'Costume not found',
        })
      }

      response.status(200).json({
        message: 'Costume deleted successfully',
      })
    } catch (error) {
      console.error(error.message)
      response.status(500).json({
        error: 'Unable to delete costume',
      })
    }
  }

  return {
    getAllCostumes,
    getCostumeById,
    addCostume,
    updateCostume,
    deleteCostume,
  }
}

module.exports = createCostumeController