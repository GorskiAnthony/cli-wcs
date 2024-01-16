// Import database client
const database = require("<chemin de votre db>"); // Remplacer le chemin par le chemin correct de votre fichier de config

// Provide database access through AbstractRepository class
class AbstractRepository {
  constructor({ table }) {
    if (this.constructor === AbstractRepository) {
      throw new TypeError(
        "Abstract class 'AbstractRepository' cannot be instantiated directly",
      );
    }

    // Store the table name
    this.table = table;

    // Provide access to the database client
    this.database = database;
  }
}

// Ready to export
module.exports = AbstractRepository;
