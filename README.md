# AploseFrameworkNg

AploseFrameworkNg est un projet **Angular/Ionic** conçu pour être utilisé avec le framework backend Aplose. Il facilite la création d'applications mobiles connectées à des ressources backend telles que des ERP (Dolibarr), des systèmes de paiement (Stripe), l'authentification (Google, interne, Dolibarr), ainsi que des solutions de visio-conférence (Vizulive).  
Note : ce framework fonctionne avec la partie backend présente ici : https://github.com/Aplose/AploseFramework  

## Caractéristiques

- **Développement mobile rapide** : Utilisation d'**Ionic** pour créer des applications mobiles multi-plateformes (iOS/Android) avec une base Angular.
- **Intégration fluide avec le backend** : Connexion simple avec le framework backend basé sur Spring pour accéder aux ressources d'ERP, services de paiement, authentification et autres.
- **UI/UX moderne** : Exploite les composants d'**Ionic** pour offrir une expérience utilisateur native sur les appareils mobiles.
- **Extensible** : Facile à étendre pour intégrer de nouvelles fonctionnalités selon les besoins des clients.

## Prérequis

"@angular/common": "^18.1.4",

"@angular/core": "^18.1.4",

"@stripe/stripe-js": "^4.4.0",

"ngx-indexed-db": "^19.0.0",

"ngx-stripe": "^18.1.0",

"@capacitor/android": "^6.0.0",

"@capacitor/app": "^6.0.0",

"@capacitor/core": "^6.1.0",

"@capacitor/haptics": "^6.0.0",

"@capacitor/keyboard": "^6.0.0",

"@capacitor/status-bar": "^6.0.0",

"@ionic/angular": "^8.3.0",

"@angular/localize": "^18.1.4"

## Installation

1. Clonez le dépôt :
   
   ```bash
   git clone https://github.com/votre-utilisateur/AploseFrameworkNg.git
   ```

2. Accédez au dossier du projet :
   
   ```bash
   cd AploseFrameworkNg
   ```

3. Installez les dépendances nécessaires :
   
   ```bash
   npm install
   ```

4. Configurez les paramètres d'environnement (API URL, clés d'authentification, etc.) dans le fichier `src/environments/environment.ts` pour pointer vers votre backend et services tiers (ex. Stripe, Google Auth).

## Utilisation

### Démarrer le projet

Pour lancer l'application en mode développement :

```bash
ionic serve
```

Cela démarrera le serveur local et ouvrira l'application dans le navigateur.

### Construction pour la production

Pour compiler l'application pour une distribution en production, utilisez la commande suivante :

```bash
ionic build --prod
```

Cette commande génère les fichiers optimisés dans le répertoire `www` qui peuvent ensuite être déployés sur un serveur.

## Fonctionnalités principales

- **Connexion avec l'ERP Dolibarr** : Accédez aux fonctionnalités de l'ERP via l'API REST exposée par le backend.
- **Paiements avec Stripe** : Gérez les paiements directement depuis l'application grâce à l'intégration avec Stripe.
- **Authentification Google** : Permet l'authentification sécurisée des utilisateurs via Google.
- **Visio-conférence avec Vizulive** : Intégration de la visio-conférence pour des réunions directement dans l'application.

## Personnalisation

Le projet est entièrement personnalisable. Vous pouvez ajouter ou modifier des composants Angular/Ionic, ajuster le style et intégrer de nouvelles API backend selon les besoins spécifiques de votre projet.

## Déploiement

Vous pouvez déployer l'application sur des plateformes comme **Google Play** et **Apple App Store** après avoir compilé le projet pour Android et iOS. Pour cela, assurez-vous d'avoir configuré les certificats requis et suivez la documentation officielle d'Ionic pour le déploiement sur mobile.

## Licence

Ce projet est sous licence MIT. Veuillez consulter le fichier `LICENSE` pour plus de détails.

## Contributions

Les contributions sont bienvenues ! Si vous avez des idées pour améliorer l'application ou si vous souhaitez signaler des bugs, n'hésitez pas à créer une **issue** ou à soumettre une **pull request**.

---

Cette documentation permet de bien orienter les utilisateurs et développeurs intéressés par la partie front-end du projet. Vous pouvez l'adapter à vos besoins spécifiques ou ajouter des sections pour détailler des fonctionnalités particulières.
