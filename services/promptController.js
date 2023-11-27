const inputController = {
	type: "input",
	name: "nom",
	message: "Quel est le nom du controller ?",
	validate: (value) => {
		const nameControllerRegex = /^[a-z]{3,}$/;
		if (!nameControllerRegex.test(value)) {
			return "Le nom du controller doit être en minuscule et sans espace et contenir au moins 3 caractères";
		} else {
			return true;
		}
	},
};

const confirmController = {
	type: "confirm",
	name: "option",
	message:
		"Voulez-vous générer toutes les méthodes du controller ? (B.R.E.A.D)",
};

const promptController = { inputController, confirmController };

module.exports = promptController;
