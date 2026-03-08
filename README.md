# 📓 Mat's Notes

**Mat's Notes** est une application web/mobile de **prise de notes par séances**, conçue pour un usage professionnel ou personnel structuré — suivi de patients, journal de bord, carnets de séances, notes de terrain.

L'application fonctionne directement dans le navigateur et peut être installée comme **application mobile (PWA)**.

---

## ✏️ Fonctionnalités principales

✅ Création et gestion de notes multi-séances
✅ Organisation par séances (paragraphes) avec séparateurs visuels
✅ Archivage des séances par bloc
✅ Export PDF par sélection de séances
✅ Sauvegarde locale automatique
✅ Synchronisation Firebase multi-appareils
✅ Espaces partagés collaboratifs
✅ Espaces locaux personnels
✅ Nuancier de couleurs vives pour catégoriser les notes
✅ Liste "Aujourd'hui" pour les notes du jour
✅ Calcul de distance IK (aller-retour)
✅ Gestion des adresses et navigation GPS
✅ Import / Export JSON complet
✅ Avatar personnalisé
✅ Interface optimisée mobile
✅ Mode sombre

Mat's Notes permet de travailler **sans papier**, directement depuis smartphone ou tablette.

---

## 🗂️ Organisation des notes

### Séances
Chaque note peut contenir **plusieurs séances** (paragraphes), séparées visuellement. Les séances s'affichent en ordre décroissant dans l'éditeur — la plus récente toujours en haut.

### Espaces
- **Notes personnelles** — votre espace principal, synchronisé sur tous vos appareils
- **Espaces locaux** — espaces privés stockés localement et synchronisés via Firebase
- **Espaces partagés** — espaces collaboratifs accessibles à plusieurs utilisateurs

### Archives de séances
Les séances en cours peuvent être archivées en bloc, et restent consultables et exportables en PDF à tout moment.

---

## 📄 Export PDF

Depuis une note ou une archive de séances :

1. Appuyer sur le bouton **⬇ PDF** dans la barre d'outils
2. Sélectionner les séances à inclure
3. Télécharger le PDF généré

Par défaut, la première séance (la plus ancienne) est pré-sélectionnée. Un bouton **Tout sélectionner** permet de cocher toutes les séances en un clic.

---

## 📱 Installation (Application Mobile)

Mat's Notes peut être installé comme une vraie application :

### Android / Chrome

1. Ouvrir l'application dans le navigateur
2. Menu ⋮
3. **Ajouter à l'écran d'accueil**

### iOS / Safari

1. Ouvrir l'application
2. Bouton **Partager**
3. **Sur l'écran d'accueil**

---

## 🔄 Synchronisation multi-appareils

Mat's Notes utilise **Firebase / Firestore** pour synchroniser vos données en temps réel.

- Connexion par **email / mot de passe** ou **compte Google**
- Toutes vos notes personnelles et espaces locaux sont synchronisés automatiquement
- Fonctionne également **hors ligne** — les données sont sauvegardées localement et synchronisées à la reconnexion

### Règles Firestore requises

Pour que la synchronisation des espaces locaux fonctionne, ajoutez ces règles dans votre **Firebase Console → Firestore → Règles** :

```
match /users/{userId}/data/{docId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

match /users/{userId}/localSpaces/{spaceId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

## 💾 Sauvegarde des données

Les notes sont stockées localement **et** synchronisées sur Firebase.

Vous pouvez :

* Exporter toutes vos notes en `.json` (avec sélection des espaces)
* Importer une sauvegarde existante
* Continuer à travailler hors ligne

---

## ☕ Soutenir le projet

Mat's Notes est développé indépendamment, sans publicité.

Si cette application vous aide au quotidien, vous pouvez soutenir son développement :

👉 **https://ko-fi.com/supermatv2**

Votre soutien permet de :

* Ajouter de nouvelles fonctionnalités
* Maintenir l'application gratuite
* Améliorer les performances et la stabilité
* Continuer le développement mobile

Chaque café aide réellement le projet ❤️

---

## 🚀 Philosophie

> Créer des outils utiles, simples, rapides et accessibles partout.

Pas de tracking.
Pas de publicité.
Juste noter.

---

## 🧑‍💻 Développement

Application développée en :

* HTML
* CSS
* JavaScript Vanilla
* Firebase / Firestore (auth + sync)
* Progressive Web App (PWA)
* jsPDF (export PDF côté client)

---

## 📜 Licence

Projet personnel — utilisation libre pour usage personnel.

---

## ⭐ Aider autrement

Si vous aimez Mat's Notes :

* 🔁 Partagez le projet
* ☕ Soutenez via Ko-fi

👉 https://ko-fi.com/supermatv2
