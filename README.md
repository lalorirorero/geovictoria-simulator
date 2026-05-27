# GeoVictoria · Simulador de Ventas con Voz

Simulador de roleplay para ejecutivos comerciales con:
- Perfiles DISC reales (D, I, S, C)
- Cliente responde con VOZ (ElevenLabs)
- Ejecutivo habla por microfono (Web Speech API)
- Evaluacion Sandler con puntaje al terminar

## Setup en 4 pasos

### 1. Clonar e instalar
```bash
npm install
```

### 2. Obtener claves API

**Anthropic (Claude):**
- Ve a https://console.anthropic.com
- Settings > API Keys > Create Key
- Copia la clave

**ElevenLabs (voces):**
- Ve a https://elevenlabs.io → Sign up (gratis)
- Ve a tu perfil > API Key
- Copia la clave (el plan gratuito incluye ~10,000 caracteres/mes)

### 3. Configurar variables de entorno
Edita el archivo `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=...
```

### 4. Correr localmente
```bash
npm run dev
```
Abre http://localhost:3000

## Deploy en Vercel (5 minutos)

1. Sube el proyecto a GitHub
2. Ve a https://vercel.com → New Project → importa tu repo
3. En "Environment Variables" agrega:
   - ANTHROPIC_API_KEY
   - ELEVENLABS_API_KEY
4. Click Deploy

## Notas
- El microfono funciona solo en HTTPS (Vercel lo maneja automaticamente)
- En localhost puede pedir permiso de microfono — acepta
- Chrome y Edge tienen mejor soporte de Web Speech API que Firefox
