const AbstractRepository = require("./AbstractRepository");

class UserRepository extends AbstractRepository {
	constructor() {
		// Call the constructor of the parent class (AbstractRepository)
		// and pass the table name "user" as configuration
		super({ table: "user" });
	}

	// The Rs of CRUD - Read operations
	async read(id) {
		// Execute the SQL SELECT query to retrieve a specific item by its ID
		const [rows] = await this.database.query(
			`select * from ${this.table} where id = ?`,
			[id]
		);

		// Return the first row of the result, which represents the item
		return rows[0];
	}

	async readAll() {
		// Execute the SQL SELECT query to retrieve all items from the "user" table
		const [rows] = await this.database.query(`select * from ${this.table}`);

		// Return the array of items
		return rows;
	}
}

module.exports = UserRepository;
