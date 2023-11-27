const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const tempDir = path.join(__dirname, "temp");
const controllersDir = path.join(tempDir, "src/controllers");

function runCommand(command) {
	return execSync(command).toString();
}

beforeAll(() => {
	// Crée un dossier temporaire
	fs.mkdirSync(tempDir);

	// Mock la fonction mkdirSync pour créer le dossier controllers
	jest.spyOn(fs, "mkdirSync").mockImplementation((dir) => {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
	});
});

afterAll(() => {
	// Supprime le dossier temporaire après les tests
	runCommand(`rm -r ${tempDir}`);
});

describe("make:controller command", () => {
	it("should create a controller simple file", () => {
		try {
			const output = runCommand(
				`node ${path.resolve(
					process.cwd(),
					"index.js"
				)} make:controller`
			);
			console.log(output);
		} catch (error) {
			console.error(error);
			throw error;
		}
		// Exécute la commande CLI pour créer un fichier controller

		// Vérifie si le dossier controllers a été créé
		expect(fs.existsSync(controllersDir)).toBeTruthy();

		// Vérifie si le fichier controller a été créé avec le contenu attendu
		const controllerFilePath = path.join(
			controllersDir,
			"testControllers.js"
		);
		expect(fs.existsSync(controllerFilePath)).toBeTruthy();

		const fileContent = fs.readFileSync(controllerFilePath, "utf8");
		expect(fileContent).toContain(
			"const browse = async (req, res, next) => {"
		);

		// Rétablit le comportement normal de mkdirSync
		fs.mkdirSync.mockRestore();
	});
});
