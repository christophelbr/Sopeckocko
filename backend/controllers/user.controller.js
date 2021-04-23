const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken pour création des TOKEN
const bcrypt = require('bcrypt'); // Importation de bcrypt pour hashage du mdp
const User = require('../models/user.model.js');

//Permet aux utilisateurs de créer un compte
exports.signup = (req, res, next) => {

    // Vérification du mdp
    let pwd = req.body.password; 
    if (pwd.match( /[0-9]/g) && 
            pwd.match( /[A-Z]/g) && 
            pwd.match(/[a-z]/g) && 
            pwd.match( /[^a-zA-Z\d]/g) &&
            pwd.length >= 10) {
                
    //Si mot de passe assez robuste : hasher le mot de passe
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //on créer le nouvel utilisateur
            const user = new User({
                email: req.body.email, 
                password: hash
            });
            //on l'enregistre dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    }

    // Si le mot de passe n'est pas assez complexe
    else {
    console.log("Votre mot de passe est faible") ;
    return res.status(500).json({ error: 'Votre mot de passe doit comprter au moins 10 caractère, une majuscule, une miniscule, un chiffre'});
    }
}


//Permet aux utilisateurs existants de se loguer
exports.login = (req, res, next) => {
    //Trouver le user correspondant à l'email
    User.findOne({ email: req.body.email })
    .then(user => {
        if(!user) {  // Si user non trouvé
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        }
        //On compare le mdp envoyé avec la requête avec le hash enregistré dans l e document user
        bcrypt.compare(req.body.password, user.password)  
        //On reçoit un boolean pour savoir si la comparaison est valable ou non
        .then(valid => {
            if (!valid) { 
                // Si non valable (mauvais mot de passe)
                return res.status(401).json({ error: 'Mot de passe incorrect !'})
            }
                // Si mot de passe correct
            res.status(200).json({
                userId: user._id, 
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                  )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};