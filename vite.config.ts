import { defineConfig } from 'vite';
const buildStamp = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Europe/Paris' }).format(new Date());
export default defineConfig({ base: '/', define: { __BUILD_STAMP__: JSON.stringify(buildStamp) }, build: { target: 'es2022', sourcemap: true }, test: { environment: 'jsdom', include: ['src/**/*.test.ts'] } });
