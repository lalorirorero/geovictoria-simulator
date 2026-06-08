# Integración con Zoho CRM — Roleplay como Widget

Esta guía explica cómo usar el simulador de roleplay **dentro de Zoho CRM**:
el usuario entra al módulo, presiona un botón, se abre el widget, hace el
roleplay y al terminar el resultado se guarda en un **registro nuevo** del
módulo, **a nombre del usuario logueado**.

- **Módulo destino:** `Rolplay_Academia` (etiqueta: "Roleplays Academia").
  La URL de Zoho lo muestra como `CustomModule89`, pero el **API name real**
  es `Rolplay_Academia`.
- **Rúbrica usada:** *Primera Reunión* (descubrimiento Sandler). Llena los 12
  criterios booleano+comentario que alimentan la fórmula
  `Nota_Final_Primera_Reuni_n`.

---

## Cómo funciona (resumen técnico)

1. El widget es **esta misma app Next.js** (la que ya está en Vercel).
2. La app carga el **Zoho Embedded App SDK** y llama
   `ZOHO.embeddedApp.on("PageLoad", …)` + `ZOHO.embeddedApp.init()`. El evento
   `PageLoad` **solo dispara dentro del contenedor de Zoho**; cuando dispara,
   la app sabe que está corriendo como widget y entonces:
   - Salta la pantalla de contraseña (la sesión de Zoho es la autenticación).
   - Obtiene al **usuario logueado** con `ZOHO.CRM.CONFIG.getCurrentUser()`.
   - (Un iframe ajeno **no** recibe `PageLoad`, así que el login no se salta
     fuera de Zoho. El parámetro `?source=zoho` es opcional: solo adelanta la
     carga del SDK.)
3. El usuario configura el escenario y hace el roleplay como siempre.
4. Al colgar, el coach evalúa la conversación y la app crea un registro con
   `ZOHO.CRM.API.insertRecord({Entity:"Rolplay_Academia", APIData:{…}})`. Como
   la llamada usa la **sesión del usuario**, el registro queda creado y
   **asignado a su nombre** (campo `Owner`).
5. Al pulsar **Cerrar**, la app llama `ZOHO.CRM.UI.Popup.closeReload()`, que
   cierra el popup y **refresca la lista** para que el registro nuevo aparezca.

Archivos relevantes:
- `app/lib/zoho.js` — carga e inicialización del SDK, `insertRecord`, cierre.
- `app/lib/zohoRoleplay.js` — mapeo escenario + evaluación → campos del módulo.
- `app/page.js` — modo widget (`zohoMode`), guardado y UI de resultados.
- `next.config.js` — headers `frame-ancestors` y `Permissions-Policy` para
  poder embeber la app y usar el micrófono dentro del iframe.

---

## Paso 1 — Desplegar la app en Vercel

Despliega normalmente (ya tienes el proyecto). Asegúrate de tener las variables
`ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY` y la de la contraseña en Vercel.
Anota la URL pública, por ejemplo:

```
https://geovictoria-simulator.vercel.app
```

La **URL del widget** será esa misma con `?source=zoho`:

```
https://geovictoria-simulator.vercel.app/?source=zoho
```

> El parámetro `source=zoho` es lo que activa el modo widget (salta el login y
> habilita el guardado en Zoho).

---

## Paso 2 — Registrar el widget en Zoho (hosting externo)

1. En Zoho CRM ve a **Setup (Configuración) → Developer Space (Espacio de
   Desarrollador) → Widgets** y pulsa **Create New Widget** (Crear widget).
2. Completa el formulario:
   - **Name:** `Roleplay GeoVictoria`
   - **Type:** `Button` (si el formulario lo pide; es el tipo de widget que se
     invoca desde un botón).
   - **Hosting:** **External** (Hospedaje externo).
   - **Base URL:** la URL pública de la app en Vercel, p. ej.
     `https://geovictoria-simulator.vercel.app/`
     (la raíz sirve la app; funciona como `index.html` del widget).
     Puedes añadir `?source=zoho` al final, pero **no es obligatorio**: la app
     detecta sola que corre dentro de Zoho.
3. Guarda. Quedará un widget que podrás asociar a un botón en el Paso 3.

> **¿Hosting interno o paquete (ZET/Sigma)?** El `plugin-manifest.json` y el
> CLI `zet` solo son necesarios si hospedas el widget *dentro* de Zoho (zip) o
> lo publicas como extensión en el Marketplace. Para **URL externa en Vercel**
> no hace falta manifest: basta la Base URL. Si prefieres el camino empaquetado,
> ya está la estructura lista en **`zoho-extension/`** (ver su `README.md`):
> `plugin-manifest.json` + un `widget.html` que redirige a la app de Vercel.

---

## Paso 3 — Crear el botón "Ejecutar Roleplay" en la lista

1. **Configuración → Personalización → Módulos y Campos →** módulo
   **`Roleplays Academia`** **→ pestaña `Links and Buttons` → `+ New Button`**.
2. Configura:
   - **Nombre:** `Ejecutar Roleplay`
   - **¿Dónde colocar el botón? (Place the button in):** **`List View`**
     (vista de lista). Si también lo quieres dentro de un registro, agrega
     otro en *View Page*.
   - **Acción al hacer clic (Action):** **`Invoke a Widget`** (Invocar un
     widget) y selecciona el widget **`Roleplay GeoVictoria`** del paso 2.
3. Guarda y asigna el botón a los perfiles que deban verlo.

Resultado: en la lista del módulo aparece **Ejecutar Roleplay**; al pulsarlo,
Zoho abre el widget (la app) en un popup.

---

## Paso 4 — Permitir el micrófono en el iframe ⚠️ importante

El roleplay usa **micrófono** (Web Speech API) y **audio** (ElevenLabs). Para
que funcione dentro del iframe del widget:

- La app ya envía `Permissions-Policy: microphone=(self)` (ver `next.config.js`).
- El navegador pedirá permiso de micrófono la primera vez; el usuario debe
  **Permitir**.
- **Fallback automático (ya implementado):** al iniciar la llamada la app
  comprueba el acceso al micrófono. Si el popup del widget **no** propaga el
  permiso (algunos contenedores de Zoho no incluyen `allow="microphone"` en el
  iframe), la app muestra un aviso y un botón **"Abrir a pantalla completa ↗"**
  que abre el simulador en una pestaña nueva, donde el micrófono no está
  restringido por el iframe.
  - Ojo: en esa pestaña a pantalla completa **no hay sesión de Zoho**, así que
    el resultado **no se guarda solo** en el CRM (es para practicar con voz).
    Para guardado automático, el roleplay debe completarse **dentro** del
    widget con el micrófono permitido.

---

## Mapeo de datos (qué se guarda en el registro)

> **Campos exclusivos:** este flujo escribe SOLO en campos propios con prefijo
> **`RP_`** (creados para esta iniciativa) + `Name`, `Owner` y la transcripción.
> **No toca** los campos de la rúbrica de Dapta ni la fórmula
> `Nota_Final_Primera_Reuni_n`, así no se cruzan los dos flujos.

Al terminar, se crea un registro con `Owner = usuario logueado`,
`Name = {nombre} · {cargo} · {industria}`, `Canal_Roleplay = "Web App"`
(distingue el origen frente a "Dapta Teléfono") y `RP_Fecha_Evaluacion = hoy`,
más:

### Escenario (de lo elegido en el widget)
| Campo `RP_` | Tipo | Origen |
|---|---|---|
| `RP_DISC` | picklist | Perfil DISC del cliente (D/I/S/C) |
| `RP_Industria` | picklist | Industria elegida |
| `RP_Rol` | picklist | Rol del prospecto |
| `RP_Pais` | picklist | País elegido |
| `RP_Cargo` | texto | Cargo generado del prospecto |
| `RP_Nombre_Cliente` | texto | Nombre del cliente simulado |
| `RP_Num_Empleados` | entero | Dotación de la industria |
| `RP_Dificultad` | texto | Nivel de dificultad |

### Notas (número, snapshot que escribe la app)
| Campo `RP_` | Origen |
|---|---|
| `RP_Nota_Final` | Puntaje general 0-10 (promedio de las 5 etapas + DISC) |
| `RP_Nota_DISC` | Puntaje de adaptación al perfil DISC (0-10) |

### Evaluación — 12 criterios de Primera Reunión
Cada criterio escribe un **booleano** (cumplió sí/no) y su **comentario**:

| Etapa | Booleano `RP_` | Comentario `RP_` |
|---|---|---|
| UFC | `RP_UFC_Contrato` | `RP_UFC_Contrato_Det` |
| UFC | `RP_UFC_Roles` | `RP_UFC_Roles_Det` |
| UFC | `RP_Apertura_Clara` | `RP_Apertura_Clara_Det` |
| UFC | `RP_Apertura_Saludo` | `RP_Apertura_Saludo_Det` |
| Modelo | `RP_Modelo_Empleados` | `RP_Modelo_Empleados_Det` |
| Modelo | `RP_Modelo_Sistema` | `RP_Modelo_Sistema_Det` |
| Pain | `RP_Pain_Dolores` | `RP_Pain_Dolores_Det` |
| Pain | `RP_Pain_Suenos` | `RP_Pain_Suenos_Det` |
| Budget | `RP_Budget_Presupuesto` | `RP_Budget_Presup_Det` |
| Decisión | `RP_Decision_Proceso` | `RP_Decision_Proceso_Det` |
| Decisión | `RP_Decision_Plazos` | `RP_Decision_Plazos_Det` |
| Decisión | `RP_Decision_Sgte_Paso` | `RP_Decision_Paso_Det` |

### Feedback y transcripción
| Campo | Origen |
|---|---|
| `RP_Puntos_Fuertes` | `puntos_fuertes` del coach |
| `RP_Oportunidades` | `oportunidades` del coach |
| `RP_Recomendacion` | `recomendacion` / `general` |
| `Transcripci_n_Roleplay` | transcripción completa de la conversación |

---

## Campos creados para esta iniciativa

Se crearon **38 campos exclusivos `RP_`** (8 escenario + 2 notas + 24 criterios
[12 sí/no + 12 comentarios] + 3 feedback + 1 fecha) más el campo
`Transcripci_n_Roleplay` (textarea *large*, 32k). Ninguno se comparte con
Dapta. La nota final del flujo Dapta (`Nota_Final_Primera_Reuni_n`) **no** se
ve afectada por estos registros porque la app no marca sus booleanos.

### Paso 5 — Agrupar los campos en su propia sección (UI, una vez)

Los campos ya existen, pero la **sección** (agrupación visual) no se puede crear
por API; hazlo una sola vez en el editor de layout:

1. **Setup → Personalización → Módulos y Campos → `Roleplays Academia` →
   Layouts →** abre el layout principal.
2. Arrastra **`+ New Section`** y nómbrala **`Roleplay Simulador (Web)`**.
3. Arrastra a esa sección todos los campos con prefijo **`RP_`** (aparecen en
   la bandeja de campos sin asignar) y el campo **`Transcripción Roleplay`**.
4. **Guardar layout.**

Así el flujo de la app queda visualmente separado del de Dapta.

---

## Probar

1. Fuera de Zoho la app se comporta normal: **sí** pide contraseña (el login
   solo se salta dentro del contenedor de Zoho, cuando dispara `PageLoad`).
2. Dentro de Zoho, pulsa **Ejecutar Roleplay**, completa un roleplay corto y
   verifica que:
   - No pidió contraseña.
   - Al terminar aparece el banner "Resultado guardado en Zoho a nombre de …".
   - Se creó un registro nuevo en *Roleplays Academia* a tu nombre, con
     `Estado = Evaluado`, el escenario y los criterios marcados.
   - Al pulsar **Cerrar**, la lista se refresca y muestra el registro nuevo.
