const execa = require("execa");
const fs = require("fs").promises;
const path = require("path");

const makeAbstract = async () =>
	new Promise((resolve, reject) => {
		const commandArgs = ["index.js", "make:abstract"];
		const subprocess = execa("node", commandArgs);

		subprocess.on("close", async (code) => {
			if (code !== 0) {
				reject(new Error(`La commande a échoué avec le code ${code}`));
				return;
			}

			// Construire le chemin du fichier de model
			const filePath = path.resolve(
				__dirname,
				"../src/models",
				`AbstractManager.js`
			);

			// Vérifie que le fichier a bien été créé
			try {
				await fs.access(filePath);
			} catch (error) {
				reject(new Error(`Le fichier ${filePath} n'a pas été créé`));
				return;
			}

			// Vérifie que le contenu du fichier est correct
			const fileContent = await fs.readFile(filePath, "utf-8");
			if (!fileContent.includes(`class AbstractManager`)) {
				reject(new Error("Le contenu du fichier n'est pas correct"));
				return;
			}
			resolve();
		});
	});

const cleanup = async () => {
	const filePath = path.resolve(
		__dirname,
		"../src/models",
		`AbstractManager.js`
	);

	try {
		// Supprimer le fichier
		await fs.unlink(filePath);
		console.log(`Fichier ${filePath} supprimé avec succès.`);
	} catch (error) {
		console.error(
			`Erreur lors de la suppression du fichier ${filePath}: ${error.message}`
		);
	}
};

describe("make:abstract", () => {
	test("create simple file", async () => {
		await makeAbstract();
		expect(true).toBe(true);
		await cleanup();
	});
});
