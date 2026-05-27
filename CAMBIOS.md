# Cambios aplicados sobre el ZIP original (v3)

Resumen de las correcciones aplicadas para que el proyecto quede listo
para desplegar a producción.

## 1. Modelos Claude actualizados — estrategia híbrida

| Ruta | Modelo | Justificación |
|---|---|---|
| `app/api/chat/route.js` | `claude-haiku-4-5` | Rol del cliente DISC. Conversacional, respuestas cortas, se llama ~15 veces por sesión. Haiku 4.5 es 3x más barato y más rápido que Sonnet, ideal para chatbots en tiempo real con TTS encima. |
| `app/api/evaluate/route.js` | `claude-sonnet-4-6` | Coach Sandler. Análisis del transcript completo + JSON estructurado. Se llama 1 vez por sesión, así que el costo extra de Sonnet es marginal y la calidad del análisis vale el upgrade. |

ZIP original venía con `claude-sonnet-4-20250514` en ambas rutas (Sonnet 4
original, modelo casi de un año atrás).

**Costo estimado para 10 ejecutivos × 3 sesiones/semana:** ~3 USD/mes.

## 2. Manejo de errores en las rutas API

Las tres rutas (`/api/chat`, `/api/tts`, `/api/evaluate`) ahora envuelven
las llamadas externas en `try/catch` y devuelven `status: 500` con un
mensaje legible cuando Anthropic o ElevenLabs fallan.

Antes: si Anthropic devolvía 4xx, el cliente se quedaba colgado sin
feedback al usuario.

## 3. `.env.local` con placeholders claros

Se reemplazaron los valores `tu_clave_anthropic_aqui` por placeholders
más explícitos y se agregó comentario recordando NO subirlo a GitHub.

## Lo que NO se tocó (fidelidad al diseño original)

- **Prompts DISC y de evaluación Sandler** — exactamente como vienen
  en el ZIP original.
- **Voces ElevenLabs** — siguen siendo Adam/Bella/Rachel/Domi con
  `eleven_multilingual_v2`.
- **Industrias, nombres y cargos** — sin cambios.
- **UI completa** — flujo lobby → briefing → call → evaluating → results.
- **Reconocimiento de voz** — `lang = "es-CL"` hardcodeado.

## Warnings no críticos para Fase 1

1. **Sin autenticación** — cualquiera con la URL consume tus créditos.
2. **Sin persistencia** — transcripciones y evaluaciones no se guardan.
3. **Sin métricas de uso** — no sabrás cuántas sesiones hace cada uno.
4. **Web Speech API solo en Chrome y Edge** — avisa a tu equipo.

Estos cuatro se atacan en Fase 2 si el MVP demuestra valor.
