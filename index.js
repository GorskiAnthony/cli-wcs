#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const { createPromptModule } = require("inquirer");
const prompt = createPromptModule();

const capitalize = require("./services/capitalize");
const promptController = require("./services/promptController");
const promptManager = require("./services/promptManager");

const VERSION = "1.1.2";

program
	.version(VERSION)
	.description("CLI pour générer des fichiers controller et des managers.");

// Commande avec option
program
	.command("info")
	.description("Affiche des informations")
	.option("-v, --version", "Affiche la version")
	.action((options) => {
		if (options.version) {
			console.log(`Version: ${VERSION}`);
		} else {
			console.log("Aucune option spécifiée");
		}
	});

// Nouvelle commande make:controller
program
	.command("make:controller")
	.description("Crée un fichier controller dans le dossier Controller")
	.action(async () => {
		const choice = await prompt([
			promptController.inputController,
			promptController.confirmController,
		]);

		const projectRoot = process.cwd();
		const srcFolder = path.join(projectRoot, "src");
		const controllerFolder = path.join(srcFolder, "controllers");

		// Vérifier si le dossier src existe, sinon le créer
		if (!fs.existsSync(srcFolder)) {
			fs.mkdirSync(srcFolder);
		}

		// Vérifier si le dossier Controller existe, sinon le créer
		if (!fs.existsSync(controllerFolder)) {
			fs.mkdirSync(controllerFolder);
		}

		// Chemin complet du fichier à créer
		const filePath = path.join(
			controllerFolder,
			`${choice.nom.toLowerCase()}Controllers.js`
		);

		// Contenu du fichier
		let fileContent = `const browse = async (req, res, next) => {
  // Ton code ici
};

`;

		// Ajouter du contenu supplémentaire si l'option --all est spécifiée
		if (choice.option) {
			fileContent += `
const read = async (req, res, next) => {
  // Ton code pour la fonction read ici
};

const edit = async (req, res, next) => {
  // Ton code pour la fonction edit ici
};

const add = async (req, res, next) => {
	  // Ton code pour la fonction add ici
};

const destroy = async (req, res, next) => {
	  // Ton code pour la fonction destroy ici
};


module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
};
`;
		} else {
			fileContent += `module.exports = {
  browse,
};
`;
		}

		// Créer le fichier avec le contenu
		fs.writeFileSync(filePath, fileContent);

		console.log(
			chalk.greenBright(
				`Le fichier 'controller' a était créé avec succès : ${path.relative(
					process.cwd(),
					filePath
				)}`
			)
		);
	});

// Nouvelle commande make:manager
program
	.command("make:manager")
	.description("Crée un fichier manager dans le dossier Managers")
	.action(async () => {
		const choice = await prompt([
			promptManager.inputManager,
			promptManager.confirmManager,
		]);

		const projectRoot = process.cwd();
		const srcFolder = path.join(projectRoot, "src");
		const managerFolder = path.join(srcFolder, "models");

		// Vérifier si le dossier src existe, sinon le créer
		if (!fs.existsSync(srcFolder)) {
			fs.mkdirSync(srcFolder);
		}

		// Vérifier si le dossier Managers existe, sinon le créer
		if (!fs.existsSync(managerFolder)) {
			fs.mkdirSync(managerFolder);
		}

		// Chemin complet du fichier à créer
		const filePath = path.join(
			managerFolder,
			`${capitalize(choice.nom)}Manager.js`
		);

		// Contenu du fichier
		let fileContent = `// Import the AbstractManager class
const AbstractManager = require("./AbstractManager");

class ${capitalize(choice.nom)}Manager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "${choice.nom}" as configuration
    super({ table: "${choice.nom}" });
  }
  
  // The Rs of CRUD - Read operations
  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    const [rows] = await this.database.query(
      \`select * from \${this.table} where id = ?\`,
      [id]
    );

    // Return the first row of the result, which represents the item
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "${
		choice.nom
	}" table
    const [rows] = await this.database.query(\`select * from \${this.table}\`);

    // Return the array of items
    return rows;
  }

  ${
		choice.option
			? `
  // The C of CRUD - Create operation
  async create(item) {
    // Execute the SQL INSERT query to add a new item to the "${choice.nom}" table
    const [result] = await this.database.query(
      \`insert into \${this.table} (title) values (?)\`,
      [item.title]
    );

    // Return the ID of the newly inserted item
    return result.insertId;
  }

	// The U of CRUD - Update operation
	async update(item) {
		// Execute the SQL UPDATE query to update an existing item in the "${choice.nom}" table
		const [result] = await this.database.query(
			\`update \${this.table} set title = ? where id = ?\`,
			[item.title, item.id]
		);
		return result.affectedRows;
	}

	// The D of CRUD - Delete operation
	async delete(id) {
		// Execute the SQL DELETE query to remove the item from the "${choice.nom}" table
		const [result] = await this.database.query(
			\`delete from \${this.table} where id = ?\`,
			[id]
		);
		return result.affectedRows;
	}
  `
			: ""
  }
}

module.exports = ${capitalize(choice.nom)}Manager;
`;

		// Créer le fichier avec le contenu
		fs.writeFileSync(filePath, fileContent);

		console.log(
			chalk.green(
				`Le fichier 'manager' a était créé avec succès : ${path.relative(
					process.cwd(),
					filePath
				)}`
			)
		);
	});

// Nouvelle commande make:abstract
program
	.command("make:abstract")
	.description("Crée un fichier abstract dans le dossier Managers")
	.action(async () => {
		const projectRoot = process.cwd();
		const srcFolder = path.join(projectRoot, "src");
		const managerFolder = path.join(srcFolder, "models");

		// Vérifier si le dossier src existe, sinon le créer
		if (!fs.existsSync(srcFolder)) {
			fs.mkdirSync(srcFolder);
		}

		// Vérifier si le dossier Managers existe, sinon le créer
		if (!fs.existsSync(managerFolder)) {
			fs.mkdirSync(managerFolder);
		}

		// Chemin complet du fichier à créer
		const filePath = path.join(managerFolder, `AbstractManager.js`);

		// Contenu du fichier
		let fileContent = `const database = require("<votre chemin de db>"); // Remplacer le chemin par le chemin correct de votre fichier de config

class AbstractManager {
	constructor({ table }) {
		// Get the database connection from the global object
		this.database = database;

		// Store the table name in the instance
		this.table = table;
	}
}

module.exports = AbstractManager;
`;

		// Créer le fichier avec le contenu
		fs.writeFileSync(filePath, fileContent);

		console.log(
			chalk.green(
				`Le fichier 'abstract' a était créé avec succès : ${path.relative(
					process.cwd(),
					filePath
				)}`
			)
		);
	});

// Analyser les arguments de la ligne de commande
program.parse(process.argv);
