const execa = require("execa");
const fs = require("node:fs").promises;
const path = require("node:path");

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
          "Voulez-vous générer toutes les méthodes du controller ? (B.R.E.A.D)",
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
        `${choice.nom}Actions.js`,
      );

      // Vérifie que le fichier a bien été créé
      try {
        await fs.access(filePath);
      } catch (error) {
        reject(new Error(`Le fichier ${filePath} n'a pas été créé`));
        return;
      }

      // Vérifie que le contenu du fichier est correct
      let fileContent = await fs.readFile(filePath, "utf-8");
      let fileContentLines = fileContent.split("\n").map((line) => line.trim());

      let expectedContent = `const browse = async (req, res, next) => {
  // Ton code pour la fonction browse ici
};`;
      let expectedContentLines = expectedContent
        .split("\n")
        .map((line) => line.trim());

      for (let i = 0; i < expectedContentLines.length; i++) {
        if (fileContentLines[i] !== expectedContentLines[i]) {
          reject(
            new Error(
              `La ligne ${i + 1} du fichier n'est pas correcte. Attendu: "${
                expectedContentLines[i]
              }", Obtenu: "${fileContentLines[i]}"`,
            ),
          );
          return;
        }
      }
      resolve();
    });
  });

const cleanup = async (choice) => {
  // Construire le chemin du fichier de contrôleur
  const filePath = path.resolve(
    __dirname,
    "../src/controllers",
    `${choice.nom}Actions.js`,
  );

  try {
    // Supprimer le fichier
    await fs.unlink(filePath);
    console.log(`Fichier ${filePath} supprimé avec succès.`);
  } catch (error) {
    console.error(
      `Erreur lors de la suppression du fichier ${filePath}: ${error.message}`,
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
