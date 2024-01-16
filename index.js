#!/usr/bin/env node

const path = require("node:path");
const fs = require("node:fs");
const { program } = require("commander");
const mustache = require("mustache");
const { createPromptModule } = require("inquirer");
const prompt = createPromptModule();

const { success, error } = require("./services/log");
const capitalize = require("./services/capitalize");
const promptController = require("./services/promptController");
const promptManager = require("./services/promptManager");
const createFolderIfNotExists = require("./services/createFolderIfNotExists");

const VERSION = "2.0.0";

/**
 * @description
 * Permet de connaître la version de l'application
 */
program
  .version(VERSION)
  .description("CLI pour générer des fichiers controller et des managers.");

/**
 * @description
 * Permet d'afficher des informations
 */
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

/**
 * @description
 * Permet de créer un fichier controller
 * Celui ci utilise la librairie inquirer pour poser des questions à l'utilisateur et récupérer ses réponses
 * Il utilise aussi la librairie mustache pour générer le contenu du fichier
 */
program
  .command("make:controller")
  .alias("m:c")
  .description("Créer un fichier controller dans le dossier controller")
  .action(async () => {
    const choice = await prompt([
      promptController.inputController,
      promptController.confirmController,
    ]);

    const projectRoot = process.cwd();
    const srcFolder = path.join(projectRoot, "src");
    const controllerFolder = path.join(srcFolder, "controllers");

    // Vérifier si le dossier src existe, sinon le créer
    createFolderIfNotExists(srcFolder);

    // Vérifier si le dossier Controller existe, sinon le créer
    createFolderIfNotExists(controllerFolder);

    // Chemin complet du fichier à créer
    const filePath = path.join(
      controllerFolder,
      `${choice.nom.toLowerCase()}Actions.js`,
    );

    // Si le fichier existe déjà, on ne le crée pas
    if (fs.existsSync(filePath)) {
      return error(
        `Le fichier ${choice.nom}Actions.js existe déjà : ${path.relative(
          process.cwd(),
          filePath,
        )}`,
      );
    }

    // Contenu du fichier
    let fileContent = "";

    // Ajouter du contenu supplémentaire si l'utilisateur a choisi l'option BREAD
    if (choice.option) {
      fileContent = fs.readFileSync(
        __dirname + "/templates/controllers/controllersAll.mustache",
        "utf8",
      );
    } else {
      fileContent = fs.readFileSync(
        __dirname + "/templates/controllers/controllersUnique.mustache",
        "utf8",
      );
    }

    fileContent = mustache.render(fileContent);

    // Créer le fichier avec le contenu
    fs.writeFileSync(filePath, fileContent, (err) => {
      if (err) throw err;
    });
    success(
      `Le fichier ${
        choice.nom
      }Actions.js a été créé avec succès : ${path.relative(
        process.cwd(),
        filePath,
      )}`,
    );
  });

/**
 * @description
 * Permet de créer un fichier models
 * Celui ci utilise la librairie inquirer pour poser des questions à l'utilisateur et récupérer ses réponses et la librairie mustache pour générer le contenu du fichier
 */
program
  .command("make:repository")
  .alias("m:r")
  .description("Créer un fichier manager dans le dossier database/models")
  .action(async () => {
    const choice = await prompt([
      promptManager.inputManager,
      promptManager.confirmManager,
    ]);

    const projectRoot = process.cwd();
    const databaseFolder = path.join(projectRoot, "database");
    const managerFolder = path.join(databaseFolder, "models");

    // Vérifier si le dossier src existe, sinon le créer
    createFolderIfNotExists(databaseFolder);

    // Vérifier si le dossier Managers existe, sinon le créer
    createFolderIfNotExists(managerFolder);

    // Chemin complet du fichier à créer
    const filePath = path.join(
      managerFolder,
      `${capitalize(choice.nom)}Repository.js`,
    );

    // Si le fichier existe déjà, on ne le crée pas
    if (fs.existsSync(filePath)) {
      return error(
        `Le fichier ${capitalize(
          choice.nom,
        )}Repository.js existe déjà : ${path.relative(
          process.cwd(),
          filePath,
        )}`,
      );
    }

    // Contenu du fichier
    let fileContent = "";

    // ajouter des lignes supplémentaires si l'utilisateur a choisi l'option CRUD
    if (choice.option) {
      fileContent = fs.readFileSync(
        __dirname + "/templates/managers/managerAll.mustache",
        "utf8",
      );
    } else {
      fileContent = fs.readFileSync(
        __dirname + "/templates/managers/managerUnique.mustache",
        "utf8",
      );
    }

    // Remplacer les variables dans le template
    fileContent = mustache.render(fileContent, {
      table: choice.nom,
      className: `${capitalize(choice.nom)}Repository`,
    });

    // Créer le fichier avec le contenu
    fs.writeFileSync(filePath, fileContent, (err) => {
      if (err) throw err;
    });

    success(
      `Le fichier ${capitalize(
        choice.nom,
      )}Repository.js a été créé avec succès : ${path.relative(
        process.cwd(),
        filePath,
      )}`,
    );
  });

/**
 * @description
 * Permet de créer un fichier abstract
 * Celui ci est assez simple, il utilise la librairie mustache pour générer le contenu du fichier uniquement.
 */
program
  .command("make:abstract")
  .alias("m:a")
  .description("Créer un fichier abstract dans le dossier database/models")
  .action(async () => {
    const projectRoot = process.cwd();
    const srcFolder = path.join(projectRoot, "database");
    const managerFolder = path.join(srcFolder, "models");

    // Vérifier si le dossier src existe, sinon le créer
    createFolderIfNotExists(srcFolder);

    // Vérifier si le dossier Managers existe, sinon le créer
    createFolderIfNotExists(managerFolder);

    // Chemin complet du fichier à créer
    const filePath = path.join(managerFolder, `AbstractRepository.js`);

    // Contenu du fichier
    let fileContent = fs.readFileSync(
      __dirname + "/templates/managers/abstract.mustache",
      "utf8",
    );

    fileContent = mustache.render(fileContent);

    // Créer le fichier avec le contenu
    fs.writeFileSync(filePath, fileContent, (err) => {
      if (err) throw err;
    });

    success(
      `Le fichier AbstractRepository.js a été créé avec succès : ${path.relative(
        process.cwd(),
        filePath,
      )}`,
    );
  });

// Analyser les arguments de la ligne de commande
program.parse(process.argv);
