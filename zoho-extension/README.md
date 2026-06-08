# Variante empaquetada (extensión ZET) — opcional

Esta carpeta es una **alternativa** al registro del widget por URL externa
(ver `../INTEGRACION_ZOHO.md`, que es el camino recomendado). Sirve si
prefieres instalar el roleplay como **extensión empaquetada** con el
**Zoho Extension Toolkit (ZET)** en vez de pegar la Base URL en el panel.

## Por qué solo redirige

La app real es **Next.js** y necesita servidor para sus rutas `/api/*`
(Claude, ElevenLabs, evaluación). Por eso **no** puede vivir como archivos
estáticos dentro del paquete del widget. `app/widget.html` solo **redirige**
al despliegue de Vercel; como ese iframe sigue siendo hijo del contenedor de
Zoho, el Embedded App SDK (que carga la app de Vercel) se comunica igual con
Zoho y guarda el resultado a nombre del usuario logueado.

> Antes de empaquetar, edita la URL de Vercel en **dos** lugares:
> `plugin-manifest.json` (whiteListedDomains / cspDomains) y `app/widget.html`.

## Empaquetar e instalar

```bash
npm install -g zoho-extension-toolkit   # provee el comando `zet`
cd zoho-extension
zet validate                            # valida el plugin-manifest.json
zet pack                                # genera dist/<extension>.zip
```

Luego en Zoho CRM: **Setup → Developer Space → Extensions / Zoho Marketplace
(modo privado) → Upload** el ZIP de `dist/`, e instálalo en tu organización.
Al instalar, el widget queda disponible para asociarlo a un **Custom Button**
con acción **Invoke a Widget** (igual que en el camino por URL externa).

## Estructura

```
zoho-extension/
├── plugin-manifest.json   # declara el widget (location crm.custombutton)
└── app/
    └── widget.html        # redirige al despliegue de Vercel
```

> Nota: el esquema exacto de `plugin-manifest.json` puede variar según la
> versión de ZET/tu edición de Zoho. Si `zet validate` reporta una clave,
> ajústala según el mensaje — la estructura aquí es la base estándar para un
> widget de Custom Button de CRM.
