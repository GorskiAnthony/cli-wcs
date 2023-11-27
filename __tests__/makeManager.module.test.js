const execa = require("execa");
const fs = require("fs").promises;
const path = require("path");
const capitalize = require("../services/capitalize");

const makeManager = async (choice) =>
	new Promise((resolve, reject) => {
		const commandArgs = ["index.js", "make:manager"];
		const subprocess = execa("node", commandArgs);

		subprocess.stdout.on("data", async (data) => {
			if (data.includes("Quel est le nom du manager ?")) {
				subprocess.stdin.write(choice.nom + "\n");
			}
			if (
				data.includes(
					"Voulez-vous générer toutes les méthodes du manager ? (C.R.U.D)"
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
				"../src/models",
				`${choice.nom}Manager.js`
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
				!fileContent.includes(
					`class ${capitalize(
						choice.nom
					)}Manager extends AbstractManager`
				)
			) {
				reject(new Error("Le contenu du fichier n'est pas correct"));
				return;
			}
			resolve();
		});
	});

describe("make:manager", () => {
	test("with simple file", async () => {
		await makeManager({ nom: "test", option: "false" });
		expect(true).toBe(true);
	});

	test("with complex file", async () => {
		await makeManager({ nom: "test", option: "true" });
		expect(true).toBe(true);
	});
});
