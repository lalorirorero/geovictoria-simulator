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
> no hace falta manifest: basta la Base URL. Si prefieres empaquetarlo como
> extensión, dilo y agrego el `plugin-manifest.json` + estructura ZET.

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
- Si el popup del widget **no** propaga el permiso de micrófono (algunos
  contenedores de Zoho no incluyen `allow="microphone"` en el iframe), el
  reconocimiento de voz no arrancará. En ese caso, abre el widget como
  **Web Tab** a pantalla completa, o agrega un botón que abra
  `https://.../?source=zoho` en una **pestaña nueva** (ahí el micrófono no
  está restringido por el iframe). Avísame y lo dejo como fallback automático.

---

## Mapeo de datos (qué se guarda en el registro)

Al terminar, se crea un registro con `Estado = "Evaluado"`,
`Agente_Dapta = "Victoria - Entrenamiento Primera Reunión"`,
`Owner = usuario logueado`, más:

### Escenario (de lo elegido en el widget)
| Campo del módulo | Origen en el widget |
|---|---|
| `Name` | `{nombre} · {cargo} · {industria}` |
| `Industria` | Industria → picklist (Retail→Retail Enterprise, Outsourcing→Outsourcing General, Construccion→Construcción, Plantas Productivas→Planta Productiva) |
| `Rol_dentro_de_la_empresa` | Rol (RRHH/Operaciones/TI) |
| `Pa_s` | País elegido |
| `Cargo` | Cargo generado del prospecto |
| `N_mero_Empleados` | Dotación de la industria |
| `Nivel_de_dificultad` | `Medio: prospecto neutral con algunas objeciones` (por defecto) |

### Evaluación — 12 criterios de Primera Reunión
Cada criterio escribe un **booleano** (cumplió sí/no) y su **comentario**:

| Criterio (booleano / comentario) | Etapa |
|---|---|
| `Se_estableci_el_contrato_previo_con_el_prospecto` / `…1` | UFC |
| `Se_realiz_la_presentaci_n_de_roles_y_empresas_de` / `…1` | UFC |
| `El_SDR_inicia_la_llamada_de_manera_clara_y_r_pid` / `…a` | UFC |
| `El_SDR_ajusta_el_saludo_o_la_introducci_n1` / `…` | UFC |
| `Se_obtuvo_informaci_n_sobre_la_cantidad_de_emplea` / `…1` | Modelo |
| `Se_identific_el_sistema_actual_de_control_de_asi` / `…1` | Modelo |
| `Se_exploraron_claramente_los_dolores_problemas1` / `…` | Pain |
| `Se_discutieron_los_sue_os_o_deseos_del_prospecto1` / `…` | Pain |
| `Se_explor_si_existe_un_presupuesto_asignado_o_un1` / `…` | Budget |
| `Se_identificaron_los_pasos_del_proceso_de_compra1` / `…` | Decisión |
| `Se_discutieron_los_plazos_del_prospecto_para_toma1` / `…` | Decisión |
| `Se_defini_un_siguiente_paso_claro_y_concreto_co` / `…1` | Decisión |

La fórmula `Nota_Final_Primera_Reuni_n` se calcula sola a partir de estos
booleanos (no se escribe directo: es de solo lectura).

### Feedback
| Campo | Origen |
|---|---|
| `Puntos_fuertes_detectados` | `puntos_fuertes` del coach |
| `Oportunidades_de_mejora` | `oportunidades` del coach |
| `Recomendaci_n_pr_ctica_para_tu_pr_ximo_roleplay` | `recomendacion` / `general` |

---

## ¿Hacen falta campos nuevos?

**No para guardar el resultado**: el módulo ya tiene la rúbrica completa
(booleano + comentario por criterio), las notas por fórmula y los campos de
feedback. Solo faltaría —y es **opcional**— un campo para la **transcripción
completa** de la conversación (hoy el módulo solo guarda audio por URL en
`Audio_Rolplay`). Si lo quieres, puedo crear un campo `textarea`
(p. ej. `Transcripcion_Roleplay`) y guardarlo ahí.

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
