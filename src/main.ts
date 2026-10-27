import './styles/main.css'; import { Game } from './core/Game';
const root=document.querySelector<HTMLElement>('#app');
if(!root)throw new Error('Élément #app introuvable');
const canvas=document.createElement('canvas'); const gl=canvas.getContext('webgl2')??canvas.getContext('webgl');
if(!gl){root.innerHTML='<main class="unsupported"><h1>WebGL indisponible</h1><p>Orellana Racing nécessite un navigateur récent avec l’accélération graphique activée.</p></main>';}else{new Game(root).init().catch((error:unknown)=>{console.error(error);root.innerHTML='<main class="unsupported"><h1>Démarrage impossible</h1><p>Rechargez la page ou essayez un navigateur récent.</p></main>';});}
