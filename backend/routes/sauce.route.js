
// Déclaration du routeur
const express = require('express');
const sauceRoute = express.Router();

// Importation des middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Importation du controller sauce
const sauceCtrl = require('../controllers/sauce.controller.js');


// Enregitrement des sauces dans la base de données
sauceRoute.post('/', auth, multer, sauceCtrl.createSauce);
//Mettre à jour une sauce existante
sauceRoute.put('/:id', auth, multer, sauceCtrl.modifySauce);
//Suppression d'une sauces
sauceRoute.delete('/:id', auth, sauceCtrl.deleteSauce);
//Récupération de la liste des sauces
sauceRoute.get('/', auth, sauceCtrl.getAllSauces);
//Récupération d'une sauce spécifique
sauceRoute.get('/:id', auth, sauceCtrl.getOneSauce);
//Like et Dislike des sauces
sauceRoute.post('/:id/like', auth, sauceCtrl.likeSauce);

// Exportation du routeur
module.exports = sauceRoute;