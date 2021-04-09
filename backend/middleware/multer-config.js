const multer = require('multer'); // Importation de multer

const MYME_TYPES =  {
    'image/jpg' : 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Création d'un de config pour multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // On génère le nom de fichier
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');//remplaces les ' ' par des '_' dans les noms de fichiers
        // Utimisation de MYME TYPES pour gerer les extensions des fichiers
        const extension = MYME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

//Exportation de multer
module.exports = multer({storage: storage}).single('image');