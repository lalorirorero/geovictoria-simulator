# Guía de implementación — Roleplay GeoVictoria en Zoho CRM

Runbook clic-por-clic para dejar operativo el roleplay como widget de Zoho CRM.
El código y los campos del CRM ya están listos; aquí está lo que falta hacer en
las consolas (Vercel + Zoho), que es configuración de UI.

- **Módulo:** `Roleplays Academia` (`Rolplay_Academia`).
- **Origen de registros de la app:** `Canal_Roleplay = "Web App"`.
- **Campos propios del flujo:** prefijo `RP_` (no se cruzan con Dapta).
- **Sin login:** el acceso es solo desde Zoho; la sesión de Zoho autentica.

---

## Recursos necesarios
- Proyecto en **Vercel** ya conectado al repo (no hay que crear nada nuevo).
- Variables de entorno en Vercel: `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`.
- **Zoho CRM como administrador** (permisos *Module Customization* y
  *Developer Space*).
- Usuarios en **Chrome o Edge** (soporte de micrófono / Web Speech API).

---

## Paso 1 — Confirmar el despliegue en Vercel
1. Al mergear los cambios al repo, Vercel **redespliega solo**.
2. Verifica en el dashboard de Vercel que el último deploy está **Ready**.
3. Anota la URL pública, por ejemplo:
   `https://geovictoria-simulator.vercel.app`

> Esta URL es la **Base URL** del widget (Paso 3).

---

## Paso 2 — Crear la sección y mover los campos (UI, una sola vez)
1. **Setup (⚙) → Customization → Modules and Fields → `Roleplays Academia`.**
2. Pestaña **Layouts** → abre el layout principal (Standard).
3. Desde la bandeja de la izquierda, arrastra **`New Section`** al cuerpo del
   layout y nómbrala **`Roleplay Simulador (Web)`**. Déjala de 2 columnas.
4. Arrastra a esa sección **todos** los campos con prefijo **`RP_`** (están en
   "Unused Fields" / campos sin asignar) y el campo **`Transcripción Roleplay`**.
   - Sugerencia de orden: primero escenario (`RP_DISC`, `RP_Industria`, `RP_Rol`,
     `RP_Pais`, `RP_Cargo`, `RP_Nombre_Cliente`, `RP_Num_Empleados`,
     `RP_Dificultad`), luego notas (`RP_Nota_Final`, `RP_Nota_DISC`), luego los
     12 criterios (booleano + su `_Det`), luego feedback
     (`RP_Puntos_Fuertes`, `RP_Oportunidades`, `RP_Recomendacion`),
     `RP_Fecha_Evaluacion` y al final `Transcripción Roleplay`.
5. Deja **`Canal_Roleplay`** donde está (arriba, como clasificador del registro).
6. Click **Save Layout**.

---

## Paso 3 — Registrar el widget (UI)
1. **Setup → Developer Space / Developer Hub → Widgets.**
2. Click **Create New Widget**.
3. Completa:
   - **Name:** `Roleplay GeoVictoria`
   - **Type:** `Button` (si el formulario lo pide)
   - **Hosting:** `External`
   - **Base URL:** la URL de Vercel del Paso 1
     (p. ej. `https://geovictoria-simulator.vercel.app/`)
4. Click **Save**.

---

## Paso 4 — Crear el botón "Ejecutar Roleplay" (UI)
1. **Setup → Customization → Modules and Fields → `Roleplays Academia` →**
   pestaña **`Links and Buttons` → `+ New Button`**.
2. Completa:
   - **Button Name:** `Ejecutar Roleplay`
   - **Description (opcional):** "Inicia un roleplay de venta por voz."
   - **Place the button in:** **`List View`**
   - **What action would you perform:** **`Invoke a Widget`** → selecciona
     **`Roleplay GeoVictoria`**.
3. Click **Save**.

---

## Paso 5 — Permisos (UI)
1. **Botón:** en la pantalla del botón, asígnalo a los **perfiles** de los SDR
   que deban verlo.
2. **Campos:** en el layout (Paso 2) → *Field Permissions* (o en Setup →
   Security Control → Profiles), deja los campos **`RP_`** y **`Canal_Roleplay`**
   en **read/write** para los perfiles de SDR (si quedan ocultos, el guardado
   puede fallar o no se verán los resultados).
3. **Módulo:** confirma que el perfil del SDR puede **crear** registros en
   `Roleplays Academia` (el registro se crea con la sesión del usuario).

---

## Paso 6 — Probar dentro de Zoho
1. Abre la **lista** de *Roleplays Academia* → click **Ejecutar Roleplay**.
2. Acepta el permiso de **micrófono** la primera vez.
3. Configura un escenario, haz un roleplay corto y **cuelga**.
4. Verifica:
   - Aparece el banner **"Resultado guardado en Zoho a nombre de …"**.
   - Al cerrar, la lista se refresca y aparece **tu registro nuevo** con
     `Canal_Roleplay = Web App`, los campos `RP_` llenos y `RP_Nota_Final`.
5. ⚠️ **Micrófono bloqueado:** si el popup de Zoho no permite el micrófono, la
   app muestra **"Abrir a pantalla completa ↗"**. Ese es el único punto que
   conviene validar bien en tu entorno (en pantalla completa se practica con
   voz, pero ahí no se guarda en el CRM).

---

## Verificación rápida (opcional, por API)
Para confirmar que llegan registros de la app:

```
COQL:
select Name, Canal_Roleplay, RP_Nota_Final, RP_DISC, Owner, Created_Time
from Rolplay_Academia
where Canal_Roleplay = 'Web App'
order by Created_Time desc
limit 10
```

---

## Resumen de qué quedó hecho por código/API (no tienes que hacerlo tú)
- App con **modo widget** (Embedded App SDK): detecta Zoho, toma al usuario
  logueado, crea el registro a su nombre y refresca la lista al cerrar.
- **Sin login** (se eliminó la contraseña).
- **38 campos `RP_`** + `Transcripción Roleplay` creados en el módulo.
- La app marca **`Canal_Roleplay = "Web App"`** y escribe solo en campos `RP_`.
- **Fallback de micrófono** integrado.
- Headers para embeber en Zoho (`frame-ancestors`, `Permissions-Policy`).
- Variante opcional empaquetada en `zoho-extension/` (ZET) si algún día se
  prefiere instalar como extensión en vez de URL externa.
