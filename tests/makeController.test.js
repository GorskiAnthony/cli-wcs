const execa = require("execa");
const fs = require("fs").promises;
const path = require("path");

const makeController = async (choice) =>
	new Promise((resolve, reject) => {
		const commandArgs = ["index.js", "make:controller"];
		const subprocess = execa("node", commandArgs);

		subprocess.stdout.on("data", async (data) => {
			if (data.includes("Quel est le nom du controller ?")) {
				subprocess.stdin.write(choice.nom + "\n");
			}
			if (
				data.includes(
					"Voulez-vous générer toutes les méthodes du controller ? (B.R.E.A.D)"
				)
			) {
				subprocess.stdin.write(choice.option + "\n");
			}
		});

		subprocess.on("close", async (code) => {
			if (code !== 0) {
				reject(new Error(`La commande a échoué avec le code ${code}`));
				return;
			}

			// Construire le chemin du fichier de contrôleur
			const filePath = path.resolve(
				__dirname,
				"../src/controllers",
				`${choice.nom}Controllers.js`
			);

			// Vérifie que le fichier a bien été créé
			try {
				await fs.access(filePath);
			} catch (error) {
				reject(new Error(`Le fichier ${filePath} n'a pas été créé`));
				return;
			}

			// Vérifie que le contenu du fichier est correct (contient le nom du controller)
			const fileContent = await fs.readFile(filePath, "utf-8");
			if (
				!fileContent.includes(`const browse = async (req, res, next) => {
  // Ton code ici
};`)
			) {
				reject(new Error("Le contenu du fichier n'est pas correct"));
				return;
			}
			resolve();
		});
	});

const cleanup = async (choice) => {
	// Construire le chemin du fichier de contrôleur
	const filePath = path.resolve(
		__dirname,
		"../src/controllers",
		`${choice.nom}Controllers.js`
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

describe("make:controller", () => {
	test("with simple file", async () => {
		await makeController({ nom: "test", option: "false" });
		expect(true).toBe(true);
		await cleanup({ nom: "test" });
	});

	test("with complex file", async () => {
		await makeController({ nom: "test", option: "true" });
		expect(true).toBe(true);
		await cleanup({ nom: "test" });
	});
});
