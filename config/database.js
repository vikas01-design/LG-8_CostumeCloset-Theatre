const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const path = require('path')

const dbPath = path.join(__dirname, '../database/costume_closet.db')

let db = null

const initializeDB = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    // Enable foreign key constraints
    await db.exec('PRAGMA foreign_keys = ON;')

    // Create Actors Table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS actors (
        actor_id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor_name TEXT NOT NULL,
        phone TEXT NOT NULL
      );
    `)

    // Create Costumes Table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS costumes (
        costume_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        era TEXT NOT NULL
      );
    `)

    // Create Hires Table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS hires (
        hire_id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor_id INTEGER NOT NULL,
        costume_id INTEGER NOT NULL,
        hire_date TEXT NOT NULL,
        return_date TEXT NOT NULL,
        returned INTEGER DEFAULT 0,
        FOREIGN KEY (actor_id) REFERENCES actors(actor_id),
        FOREIGN KEY (costume_id) REFERENCES costumes(costume_id),
        CHECK (returned IN (0, 1))
      );
    `)

    // Prevent a costume from having multiple active hires
await db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS unique_active_costume_hire
  ON hires(costume_id)
  WHERE returned = 0;
`)

    // Insert sample actors
await db.run(`
  INSERT OR IGNORE INTO actors (actor_id, actor_name, phone)
  VALUES
    (1, 'Asha', '9876543210'),
    (2, 'Ravi', '9876543211'),
    (3, 'Priya', '9876543212'),
    (4, 'Arjun', '9876543213'),
    (5, 'Sneha', '9876543214');
`)

// Insert sample costumes
await db.run(`
  INSERT OR IGNORE INTO costumes (costume_id, name, era)
  VALUES
    (1, 'Royal King Costume', 'Medieval'),
    (2, 'Warrior Costume', 'Ancient'),
    (3, 'Victorian Dress', 'Victorian'),
    (4, 'Queen Costume', 'Medieval'),
    (5, 'Soldier Costume', 'Modern'),
    (6, 'Roman Emperor Costume', 'Ancient'),
    (7, 'Princess Costume', 'Medieval'),
    (8, 'Pirate Costume', 'Historical'),
    (9, 'Knight Armour', 'Medieval'),
    (10, 'Egyptian Pharaoh Costume', 'Ancient'),
    (11, 'Traditional Saree', 'Traditional'),
    (12, 'Greek Goddess Costume', 'Ancient'),
    (13, 'Mughal Royal Costume', 'Mughal'),
    (14, 'Colonial Dress', 'Colonial'),
    (15, 'Royal Queen Costume', 'Medieval');
`)

    console.log('Database connected successfully')
    console.log('Actors, Costumes and Hires tables created successfully')

    return db
  } catch (error) {
    console.error(`Database initialization error: ${error.message}`)
    throw error
  }
}

module.exports = initializeDB