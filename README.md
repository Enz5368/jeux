# jeux

Site hébergé automatiquement sur le NAS OrellanaTech.

## Structure du projet

Le dépôt GitHub correspond uniquement au dossier :

```
/mnt/Sites/projects/jeux/app/
```

Tout ce qui est créé dans ce dépôt peut être modifié depuis VS Code puis envoyé avec Git.

## Dossiers persistants du NAS

```
/mnt/Sites/projects/jeux/
├── app/        → dépôt GitHub / code source
├── base/       → bases de données
├── photos/     → photos persistantes
├── uploads/    → fichiers envoyés par les utilisateurs
├── data/       → autres données persistantes
├── backups/    → sauvegardes
└── deploy/     → fichiers techniques de déploiement
```

## Règle importante

À mettre dans GitHub : code, pages, composants, CSS, JavaScript, images statiques et configuration non sensible.

À ne pas mettre dans GitHub : bases actives, photos utilisateurs, uploads, sauvegardes, mots de passe, clés API et secrets.

## Utilisation avec VS Code

```bash
git pull
git add .
git commit -m "Mise à jour du site"
git push
```

Le déploiement est ensuite automatique.

Domaine : https://jeux.orellanatech.fr
