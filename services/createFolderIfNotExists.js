const { success } = require("./log");
const fs = require("fs");

// Fonction pour vérifier et créer un dossier si nécessaire
module.exports = function createFolderIfNotExists(folderPath) {
	// remove process.cwd() from path
	const newfolderPath = folderPath.replace(process.cwd(), "");

	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath);
		success(`Le dossier ${newfolderPath} est créé`);
	}
};
