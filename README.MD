Pour lancer l'application : 

        - cloner le backend puis lancer npm i 
        executer : nodemon server

        - cloner frontend/dwj-projet6/ puis lancer npm i
        exectuter : ng serve

        - Se rendre sur la page : loaclhost:4200


l'application respecte les préconisations de l'OWASP :
        -  Injection : des REGEX sont utilisés pour la saisi des formulaires
        -  Piratage de session : Politique de mots de passe renforcée, minumum 10 carcatère, exigence de 1 chiffre, 1 minuscule, 1 majuscule, 1 caractère spécial
        -  Exposition des données sensibles : Les mots de passes sont chiffrés avec 'bcrypt', ils n'apparaissent en clair pas sur la base de données
        -  Cross-Site Scripting  (XSS): utilisation du middleware Helmet 
        -  Monitoring de l'application : utilisation du middleware express-status-monitor, consultation sur http://localhost:3000/status
                