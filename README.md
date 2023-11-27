<h1 align="center">Bienvenue sur cli-wcs 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/GorskiAnthony/wcs-cli#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/GorskiAnthony/wcs-cli/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://twitter.com/Gorski_anthony" target="_blank">
    <img alt="Twitter: Gorski_anthony" src="https://img.shields.io/twitter/follow/Gorski_anthony.svg?style=social" />
  </a>
</p>

> Ce package permet de générer des controllers, des models pour le repository de la [Wild Code School](https://github.com/WildCodeSchool/js-template-fullstack) en ligne de commande.

### 🏠 [Homepage](https://github.com/GorskiAnthony/wcs-cli#readme)

## Install

```sh
npm install -g cli-wcs
```

## Liste des commandes

```sh
cli-wcs make:controller <nom_du_fichier> # Créer un controller
cli-wcs make:manager <nom_du_fichier> # Créer un model
```

## Flags

```sh
cli-wcs make:controller <nom_du_fichier> -a # Créer un controller avec les méthodes browse, read, edit, add et destroy
cli-wcs make:manager <nom_du_fichier> -a # Créer un model avec les méthodes create, read, update et delete
```

## Usage

Il faut se placer dans le dossier `backend` du repository de la [Wild Code School](https://github.com/WildCodeSchool/js-template-fullstack) pour utiliser ce package correctement.

Avec `<nom_du_fichier>` qui est le nom du fichier que vous voulez créer écrit en **minuscule** et sans les noms `controller` ou `manager`.

```sh
cli-wcs make:controller <nom_du_fichier>
# OU
npx cli-wcs make:controller <nom_du_fichier>
```

## Exemples

```sh
cli-wcs make:controller user
# OU
npx cli-wcs make:controller user -a
```

```sh
cli-wcs make:manger user -a
# OU
npx cli-wcs make:manager user
```

Pour plus d'exemples, il faut se rendre dans le dossier [examples](./examples) du repository.

## Auteur

👤 **Anthony Gorski**

-   𝕏 - (Twitter): [@Gorski_Anthony](https://twitter.com/Gorski_Anthony)
-   GitHub: [@GorskiAnthony](https://github.com/GorskiAnthony)

## 🤝 Contributing

Les contributions, les problèmes et les demandes de fonctionnalités sont les bienvenus !<br />N'hésitez pas à consulter la page des [issues](https://github.com/GorskiAnthony/wcs-cli/issues).

## Affichez votre soutien

Donnez un ⭐️ si ce projet vous a aidé !

## 📝 License

Copyright © 2023 [Anthony gorski](https://github.com/GorskiAnthony).<br />
This project is [ISC](https://github.com/GorskiAnthony/wcs-cli/blob/master/LICENSE) licensed.

---

### 🗃️ Version

-   **v1.0.0** - Version 1 stable de la CLI `cli-wcs`

---

### 👋 Qui suis-je ?

Je suis **Anthony Gorski**, développeur web et formateur à la [Wild Code School](https://www.wildcodeschool.com/fr-FR).
