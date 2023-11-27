#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs");
const path = require("path");
const capitalize = require("./services/capitalize");

program
	.version("1.0.0")
	.description("CLI pour générer des fichiers controller.");

// Commande avec option
program
	.command("info")
	.description("Affiche des informations")
	.option("-v, --version", "Affiche la version")
	.action((options) => {
		if (options.version) {
			console.log("Version 1.0.0");
		} else {
			console.log("Informations générales.");
		}
	});

// Nouvelle commande make:controller
program
	.command("make:controller <nom>")
	.description("Crée un fichier controller dans le dossier Controller")
	.option("-a, --all", "Génère un fichier complet")
	.action((nom, options) => {
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
			`${nom.toLowerCase()}Controllers.js`
		);

		// Contenu du fichier
		let fileContent = `const tables = require("../tables");

const browse = async (req, res, next) => {
  // Ton code ici
};

`;

		// Ajouter du contenu supplémentaire si l'option --all est spécifiée
		if (options.all) {
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

		console.log(`Fichier controller créé avec succès : ${filePath}`);
	});

// Nouvelle commande make:manager
program
	.command("make:manager <nom>")
	.description("Crée un fichier manager dans le dossier Managers")
	.option("-a, --all", "Génère un fichier complet")
	.action((nom, options) => {
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
			`${capitalize(nom)}Manager.js`
		);

		// Contenu du fichier
		let fileContent = `
const AbstractManager = require("./AbstractManager");

class ${capitalize(nom)}Manager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "${nom}" as configuration
    super({ table: "${nom.toLowerCase()}" });
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
    // Execute the SQL SELECT query to retrieve all items from the "${nom}" table
    const [rows] = await this.database.query(\`select * from \${this.table}\`);

    // Return the array of items
    return rows;
  }

  ${
		options.all
			? `
  // The C of CRUD - Create operation
  async create(item) {
    // Execute the SQL INSERT query to add a new item to the "${nom}" table
    const [result] = await this.database.query(
      \`insert into \${this.table} (title) values (?)\`,
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
  `
			: ""
  }
}

module.exports = ${capitalize(nom)}Manager;
`;

		// Créer le fichier avec le contenu
		fs.writeFileSync(filePath, fileContent);

		console.log(`Fichier manager créé avec succès : ${filePath}`);
	});

// Analyser les arguments de la ligne de commande
program.parse(process.argv);
