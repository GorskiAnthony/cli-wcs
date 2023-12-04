#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

const { createPromptModule } = require("inquirer");
const prompt = createPromptModule();

const capitalize = require("./services/capitalize");
const promptController = require("./services/promptController");
const promptManager = require("./services/promptManager");

const VERSION = "1.2.5";

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
		let fileContent = "";

		// Ajouter du contenu supplémentaire si l'option --all est spécifiée
		if (choice.option) {
			fileContent = fs.readFileSync(
				__dirname + "/templates/controllers/controllersAll.mustache",
				"utf8"
			);
		} else {
			fileContent = fs.readFileSync(
				__dirname + "/templates/controllers/controllersUnique.mustache",
				"utf8"
			);
		}

		const controllers = mustache.render(fileContent);

		// Créer le fichier avec le contenu
		fs.writeFileSync(filePath, controllers, (err) => {
			if (err) throw err;
		});
		console.log(
			chalk.greenBright(
				`Le fichier ${
					choice.nom
				}Controllers a était créé avec succès : ${path.relative(
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
		let fileContent = "";

		// ajouter des lignes supplémentaires si l'option CRUD est spécifiée
		if (choice.option) {
			fileContent = fs.readFileSync(
				__dirname + "/templates/managers/managerAll.mustache",
				"utf8"
			);
		} else {
			fileContent = fs.readFileSync(
				__dirname + "/templates/managers/managerUnique.mustache",
				"utf8"
			);
		}

		// Remplacer les variables dans le template
		fileContent = mustache.render(fileContent, {
			table: choice.nom,
			className: capitalize(choice.nom),
		});

		// Créer le fichier avec le contenu
		fs.writeFileSync(filePath, fileContent, (err) => {
			if (err) throw err;
		});

		console.log(
			chalk.greenBright(
				`Le fichier ${capitalize(
					choice.nom
				)}Manager a était créé avec succès : ${path.relative(
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
		let fileContent = fs.readFileSync(
			__dirname + "/templates/managers/abstract.mustache",
			"utf8"
		);

		fileContent = mustache.render(fileContent);

		// Créer le fichier avec le contenu
		fs.writeFileSync(filePath, fileContent, (err) => {
			if (err) throw err;
		});

		console.log(
			chalk.greenBright(
				`Le fichier 'AbstractManager' a était créé avec succès : ${path.relative(
					process.cwd(),
					filePath
				)}`
			)
		);
	});

// Analyser les arguments de la ligne de commande
program.parse(process.argv);
