// Importation des modules
const express = require('express'); // ajout du routeur express
const bodyParser = require('body-parser'); //ajout de body-parser au projet : permet extraction d'objet JSON
const mongoose = require('mongoose'); // ajout de mangoose : permet la gestione de la BDD 
const path = require('path'); // Gestion du système de fichiers
const helmet = require('helmet');// Protection de l'application avec helmet
const mongooseLogin = require('./environnement'); //Importation des identifiants MongoDB

// Importation des routes
const sauceRoutes = require('./routes/sauce.route.js');
const userRoutes = require('./routes/user.route.js');

// Application express
const app = express();

// Connexion à MongoDB
mongoose.connect(`mongodb+srv://${mongooseLogin.login}:${mongooseLogin.password}@${mongooseLogin.dbUrl}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Correction des erreurs de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Protection de l'application avec helmet
app.use(helmet());

// Utilisation de bodyParser par l'application
app.use(bodyParser.json());

// Définition du chemin pour enregistremnet des photos sur le backend
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;