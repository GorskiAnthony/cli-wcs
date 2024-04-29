const inputManager = {
  type: "input",
  name: "nom",
  message: "Quel est le nom du repository ?",
  validate: (value) => {
    const nameManagerRegex = /^[a-z]{3,}$/;
    if (!nameManagerRegex.test(value)) {
      return "Le nom du repository doit être en minuscule et sans espace et contenir au moins 3 caractères";
    } else {
      return true;
    }
  },
};

const confirmManager = {
  type: "confirm",
  name: "option",
  message: "Voulez-vous générer toutes les méthodes du repository ? (C.R.U.D)",
};

const promptManager = { inputManager, confirmManager };

module.exports = promptManager;
