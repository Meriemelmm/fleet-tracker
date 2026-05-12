# Fleet Tracker

## Description

Fleet Tracker est une application web full-stack de gestion de flotte de véhicules. Elle combine un backend Node.js/Express avec une base de données MongoDB et un frontend React/Vite pour permettre aux administrateurs et chauffeurs de suivre et gérer les camions, remorques, pneus et trajets.

## Fonctionnalités principales

- Authentification sécurisée avec JWT
- Gestion des camions, remorques, pneus et trajets
- Gestion des utilisateurs et rôles `admin` / `chauffeur`
- Dashboard administrateur pour visualiser et gérer la flotte
- Interface chauffeur pour consulter ses trajets
- Envoi de notifications email via Nodemailer
- Déploiement via Docker Compose

## Technologies utilisées

- Backend : Node.js, Express, Mongoose
- Frontend : React, Vite, Redux Toolkit
- Base de données : MongoDB
- Authentification : JWT
- Style / UI : Tailwind CSS
- Outils : Docker, Docker Compose, Axios, Nodemailer

## Installation

1. Cloner le dépôt :

```bash
git clone https://github.com/Meriemelmm/fleet-tracker
cd fleet-tracker
```

2. Installer les dépendances du backend :

```bash
cd fleet-tracker-backend
npm install
```

3. Installer les dépendances du frontend :

```bash
cd ../fleet-tracker-frontend
npm install
```

4. Démarrer les services en local :

```bash
# lancer le backend
cd ../fleet-tracker-backend
npm run dev

# dans un second terminal, lancer le frontend
cd ../fleet-tracker-frontend
npm run dev
```

5. Démarrer avec Docker Compose :

```bash
docker-compose up --build
```

## Configuration des variables d'environnement

Créer le fichier `fleet-tracker-backend/.env` avec les variables suivantes :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fleet-tracker
JWT_SECRET=votre_secret_jwt
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=votre_email_mailtrap
EMAIL_PASS=votre_mot_de_passe_mailtrap
FROM_EMAIL=noreply@fleet-tracker.com
FROM_NAME=Fleet Tracker
FRONTEND_URL=http://localhost:3000
```

Créer éventuellement un fichier `fleet-tracker-frontend/.env` si le frontend utilise des variables d'environnement :

```env
VITE_API_URL=http://localhost:5001
```

> En mode Docker, l'URL du backend est `http://localhost:5001` et le frontend est servi sur `http://localhost:3001`.

## Utilisation du projet

1. Ouvrir l'application frontend dans le navigateur :
   - En local : `http://localhost:3000`
   - En Docker : `http://localhost:3001`
2. Se connecter avec un compte existant ou utiliser les données seed si configurées.
3. Accéder aux routes selon le rôle :
   - `admin` : gestion de la flotte, des utilisateurs, des pneus et des trajets
   - `chauffeur` : consultation de ses trajets
4. Gérer les entités depuis l'interface administrateur et suivre l'activité de la flotte.

## Structure du projet

```text
fleet-tracker/
├── docker-compose.yml
├── fleet-tracker-backend/
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
       ├── models/
│       ├── routes/
│       ├── seed/
│       ├── service/
│       └── utils/
└── fleet-tracker-frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── assets/
        ├── components/
        ├── config/
        ├── features/
        ├── pages/
        ├── router/
        ├── services/
        ├── store/
        └── styles/
```

## API endpoints

- `POST /auth/login` : authentification utilisateur
- `POST /auth/register` : création d'un compte utilisateur
- `GET /camions` : liste des camions
- `POST /camions` : création d'un camion
- `PUT /camions/:id` : mise à jour d'un camion
- `DELETE /camions/:id` : suppression d'un camion
- `GET /remorques` : liste des remorques
- `POST /remorques` : création d'une remorque
- `GET /pneus` : liste des pneus
- `POST /pneus` : ajout d'un pneu
- `GET /trajets` : liste des trajets
- `POST /trajets` : création d'un trajet
- `GET /admin` : endpoints administrateur




