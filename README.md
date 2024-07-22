# Cineside

Cineside est une application de films réalisée pendant ma formation à la Wild Code School. Elle utilise, React JS, Express, Tailwind CSS, et Flowbite UI. Les informations proviennent de l'API The Movie Database (TMDb), et permet d'avoir plein d'informations telles que la date de sortie, le casting, des recommandations.
Elle va surtout permettre aux utilisateurs de se créer une liste de films favoris à regarder en famille, entre amis...

## Features

Films à l'affiche

Films les mieux notés

Filtres de recherche par nom, année ou par genre.

Ajouter ses films préférées à une liste de favoris.


## Technologies utilisées

![MIT License](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![MIT License](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![MIT License](https://img.shields.io/badge/tailwindcss-0F172A?&logo=tailwindcss)

API: The Movie Database (TMDb) API.

## Installation

### Pré-requis:

Node.js (version >= 12.0.0).

npm or yarn package manager.

### Cloner le repo:

```bash
git clone git@github.com:AnthonyChampion/CinesideV2.git
cd CinesideV2
```

### Installation des dépendences

```bash
npm install
or
yarn install
```

### Set up TMDb API dans le dossier client:

Obtenez une clé unique de TMDB.

Créer un .env comme le .env.sample and ajouter votre API key:

```
.env 

VITE_API_KEY=YOUR_VITE_API_KEY

VITE_API_URL=YOUR_VITE_API_URL

```

### Set up dossier server:

Créer un .env comme le .env.sample  and ajouter vos données:

```
.env 

DB_HOST=DB_HOST
DB_PORT=DB_PORT
DB_USERNAME=DB_USERNAME
DB_PASSWORD=DB_PASSWORD
DB_DATABASE=DB_NAME
JWT_SECRET=JWT_SECRET
PORT=PORT
```

## Démarrer l'application

```
npm run dev
```

## Amusez-vous bien !


