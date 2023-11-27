const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const capitalize = require("../services/capitalize");

function runCommand(command) {
	return execSync(command).toString();
}

describe("CLI commands", () => {
	afterEach(() => {
		// Nettoyer les fichiers générés après chaque test
		fs.rm(path.join(__dirname, "temp"), { recursive: true });
	});

	test("info command displays version", () => {
		const output = runCommand("./index.js info -v");
		expect(output).toContain("Version 1.0.0");
	});

	test("info command displays general information", () => {
		const output = runCommand("./index.js info");
		expect(output).toContain("Informations générales.");
	});

	describe("make:controller command", () => {
		test("creates a controller file", () => {
			const controllerName = "test";
			runCommand(`./index.js make:controller ${controllerName}`);

			const filePath = path.join(
				__dirname,
				"..",
				"src",
				"controllers",
				`${controllerName.toLowerCase()}Controllers.js`
			);
			expect(fs.existsSync(filePath)).toBe(true);
		});

		test("creates a complete controller file with --all option", () => {
			const controllerName = "CompleteController";
			runCommand(`./index.js make:controller ${controllerName} -a`);

			const filePath = path.join(
				__dirname,
				"..",
				"src",
				"controllers",
				`${controllerName.toLowerCase()}Controllers.js`
			);
			expect(fs.existsSync(filePath)).toBe(true);

			const fileContent = fs.readFileSync(filePath, "utf-8");
			expect(fileContent).toContain(
				"const read = async (req, res, next) =>"
			);
			expect(fileContent).toContain(
				"const edit = async (req, res, next) =>"
			);
			expect(fileContent).toContain(
				"const add = async (req, res, next) =>"
			);
			expect(fileContent).toContain(
				"const destroy = async (req, res, next) =>"
			);
		});

		test("creates a simple controller file without --all option", () => {
			const controllerName = "SimpleController";
			runCommand(`./index.js make:controller ${controllerName}`);

			const filePath = path.join(
				__dirname,
				"..",
				"src",
				"controllers",
				`${controllerName.toLowerCase()}Controllers.js`
			);
			expect(fs.existsSync(filePath)).toBe(true);

			const fileContent = fs.readFileSync(filePath, "utf-8");
			expect(fileContent).toContain(
				'const tables = require("../tables");'
			);
			expect(fileContent).toContain(
				"const browse = async (req, res, next) =>"
			);
			expect(fileContent).not.toContain(
				"const read = async (req, res, next) =>"
			);
			expect(fileContent).not.toContain(
				"const edit = async (req, res, next) =>"
			);
			expect(fileContent).not.toContain(
				"const add = async (req, res, next) =>"
			);
			expect(fileContent).not.toContain(
				"const destroy = async (req, res, next) =>"
			);
		});
	});
	describe("make:manager command", () => {
		test("creates a manager file", () => {
			const managerName = "test";
			runCommand(`./index.js make:manager ${managerName}`);

			const filePath = path.join(
				__dirname,
				"..",
				"src",
				"models",
				`${capitalize(managerName)}Manager.js`
			);
			expect(fs.existsSync(filePath)).toBe(true);
		});

		test("creates a complete manager file with --all option", () => {
			const managerName = "CompleteManager";
			runCommand(`./index.js make:manager ${managerName} -a`);

			const filePath = path.join(
				__dirname,
				"..",
				"src",
				"models",
				`${capitalize(managerName)}Manager.js`
			);
			expect(fs.existsSync(filePath)).toBe(true);

			const fileContent = fs.readFileSync(filePath, "utf-8");
			expect(fileContent).toContain(
				"async create(item) {",
				"async update(item) {",
				"async delete(id) {"
			);
		});

		test("creates a simple manager file without --all option", () => {
			const managerName = "SimpleManager";
			runCommand(`./index.js make:manager ${managerName}`);

			const filePath = path.join(
				__dirname,
				"..",
				"src",
				"models",
				`${capitalize(managerName)}Manager.js`
			);
			expect(fs.existsSync(filePath)).toBe(true);

			const fileContent = fs.readFileSync(filePath, "utf-8");
			expect(fileContent).toContain(
				`const AbstractManager = require("./AbstractManager");`,
				`class ${capitalize(
					managerName
				)}Manager extends AbstractManager {`,
				`constructor() { super({ table: "${managerName.toLowerCase()}" }); }`
			);
			expect(fileContent).not.toContain(
				"async create(item) {",
				"async update(item) {",
				"async delete(id) {"
			);
		});
	});
});
