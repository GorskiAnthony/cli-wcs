const AbstractRepository = require("./AbstractRepository");

class PostRepository extends AbstractRepository {
	constructor() {
		// Call the constructor of the parent class (AbstractRepository)
		// and pass the table name "post" as configuration
		super({ table: "post" });
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
		// Execute the SQL SELECT query to retrieve all items from the "post" table
		const [rows] = await this.database.query(`select * from ${this.table}`);

		// Return the array of items
		return rows;
	}

	// The C of CRUD - Create operation
	async create(item) {
		// Execute the SQL INSERT query to add a new item to the "post" table
		const [result] = await this.database.query(
			`insert into ${this.table} (title) values (?)`,
			[item.title]
		);

		// Return the ID of the newly inserted item
		return result.insertId;
	}

	// The U of CRUD - Update operation
	async update(item) {
		// TODO: Implement the update operation to modify an existing item
	}

	// The D of CRUD - Delete operation
	async delete(id) {
		// TODO: Implement the delete operation to remove an item by its ID
	}
}

module.exports = PostRepository;
