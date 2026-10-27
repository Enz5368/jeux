# Orellana Racing V1

Jeu de course arcade 3D low-poly jouable dans le navigateur, sur PC et mobile. La V1 propose un contre-la-montre solo de trois tours sur **Dust Valley**, quatre pilotes et quatre capacités intégrées à la conduite.

## Jouer en local

Prérequis : Node.js 22 LTS et npm.

```bash
npm ci
npm run dev
```

- Z/W/↑ : accélérer ; S/↓ : freiner et reculer.
- Q/A/← et D/→ : tourner.
- Espace : déraper ; Shift : pouvoir ; R : repositionner ; Échap : pause.
- Sur téléphone : commandes multitouch en paysage, avec option d'accélération automatique.

## Vérifications

```bash
npm run typecheck
npm run test
npm run build
npm run preview
```

Les tests couvrent activation, expiration et recharge des pouvoirs, checkpoints et tours dans l'ordre, pause du chronomètre, meilleurs temps et perte de focus des commandes.

## Architecture prête pour la V2 multijoueur

- `src/core` : boucle à pas fixe, simulation Rapier et rendu Three.js.
- `src/controls` : clavier et Pointer Events multitouch.
- `src/racing`, `src/abilities`, `src/storage` : règles testables sans rendu.
- `src/vehicles`, `src/tracks`, `src/camera` : monde visuel procédural.
- `src/network` : contrat V2 typé pour serveur autoritaire, IDs joueur, salons privés, commandes séquencées et snapshots WebSocket (maximum 8 joueurs).

La simulation ne dépend ni de Three.js ni du DOM. En V2, le serveur exécutera la même logique à pas fixe ; le client enverra ses commandes numérotées et interpolera les snapshots autoritaires. Le transport WebSocket est injectable mais inactif en V1 : aucun faux mode multijoueur n'est affiché.

## Déploiement TrueNAS / Dockge

Le dépôt correspond uniquement à `/mnt/Sites/projects/jeux/app/`. Ne placez jamais `base/`, `photos/`, `uploads/`, `data/`, `backups/`, secrets ou `.env` dans ce dépôt.

Le `Dockerfile` construit le site avec Node puis le sert avec Nginx sur le port interne **8080**. Dans Dockge, adaptez `compose.example.yml` à la stack située sous `/mnt/Sites/projects/jeux/deploy/`. Le contexte de build doit viser `/mnt/Sites/projects/jeux/app/`. Aucun volume persistant n'est nécessaire en V1.

Le service Cloudflare Tunnel devra pointer vers `http://orellana-racing:8080` s'il partage le même réseau Docker, ou vers l'adresse/port explicitement publiés sur le NAS selon l'architecture existante. Inspectez le tunnel et les réseaux existants avant toute modification. Le DNS de `jeux.orellanatech.fr` doit encore être vérifié ; ce dépôt ne le configure pas.

## Limites connues

- La conduite et l'interface doivent être validées sur téléphones physiques (Safari iOS et Chrome Android).
- La V1 utilise des modèles procéduraux et n'inclut ni audio ni adversaires IA.
- L'objectif 30/60 FPS dépend du matériel ; les qualités ajustent pixel ratio et ombres.
- Le raccourci et les collisions détaillées avec les barrières sont réservés à une itération du circuit.
- Le serveur multijoueur V2 n'est pas implémenté, seulement ses frontières d'architecture et son protocole client.
