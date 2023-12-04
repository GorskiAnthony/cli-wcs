const database = require("<votre chemin de db>"); // Remplacer le chemin par le chemin correct de votre fichier de config

class AbstractManager {
	constructor({ table }) {
		// Get the database connection from the global object
		this.database = database;

		// Store the table name in the instance
		this.table = table;
	}
}

module.exports = AbstractManager;
