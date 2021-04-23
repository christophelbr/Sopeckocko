// Importation du model sauce
const Sauce = require('../models/sauce.model.js');

// Déclaration regex pour sécurisation du formulaire
const regex = /[^a-zA-Z\d ,;:]/g;

// Création des sauces
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    //Si caractère NOK
    if (sauceObject.name.match(regex) ||
        sauceObject.manufacturer.match(regex) ||
        sauceObject.description.match(regex) ||
        sauceObject.mainPepper.match(regex)) {
        return res.status(500).json({ error: 'caractère interdit' });
    }
    // Si non création de la sauce
    else {
        //Suppression de l'id venant du frontend
        delete sauceObject._id;
        const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

        });
        sauce.save()
            .then(() => res.status(201).json({ message: 'Sauce créée !' }))
            .catch(error => res.status(400).json({ error }));
    }
};

// Modification des sauces
exports.modifySauce = (req, res, next) => {
    //Si caractère NOK
     const sauceObject = JSON.parse(req.body.sauce);
    if (sauceObject.name.match(regex) ||
        sauceObject.manufacturer.match(regex) ||
        sauceObject.description.match(regex) ||
        sauceObject.mainPepper.match(regex)) {
        return res.status(500).json({ error: 'caractère interdit' });
    } 
    // Si non, modification de la sauce
    else {
        //Si il y a une photo :
        const sauceUpdate = req.file ?
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } :
            //Sinon :
            { ...req.body };
        //Mise à jour de l'objet :
        Sauce.updateOne({ _id: req.params.id }, { ...sauceUpdate, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
            .catch(error => res.status(400).json({ error }));
    }

};
// Suppression des sauces
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Voir toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};
// Trouver une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//Like/Dislike une sauce :
exports.likeSauce = (req, res, next) => {
    // Récupération des  informations de la sauce
    Sauce.findOne({ _id: req.params.id })

        .then(sauce => {
            // Selon la valeur recue pour 'like' dans la requête :
            switch (req.body.like) {
                //Si dislike :
                case -1:
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(201).json({ message: 'Dislike !' }))
                        .catch(error => res.status(400).json({ error }))
                    break;

                //Si -1 Like ou -1 Dislike :
                case 0:
                    //Cas -1 Like :
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: ' Like retiré !' }))
                            .catch(error => res.status(400).json({ error }))
                    }

                    //Cas -1 dislike :
                    if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: ' Dislike retiré !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                //Cas +1 Like :
                case 1:
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(201).json({ message: 'Like ajouté !' }))
                        .catch(error => res.status(400).json({ error }));
                    break;
                default:
                    return res.status(500).json({ error });
            }
        })
        .catch(error => res.status(500).json({ error }))
}