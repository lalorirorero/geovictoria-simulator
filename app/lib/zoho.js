"use client";
// ─── Zoho Embedded App SDK (cliente) ─────────────────────────────
// Helpers para correr el simulador como WIDGET dentro de Zoho CRM.
// El widget se ejecuta en un iframe; al usar el SDK desde el navegador,
// las operaciones de API corren con la SESION del usuario logueado en
// Zoho, por lo que el registro creado queda automaticamente a su nombre.

const SDK_URL = "https://live.zwidgets.com/js-sdk/1.2/ZohoEmbededAppSDK.min.js";

// El modulo destino. Es el API name real (la URL muestra "CustomModule89",
// pero el API name del modulo es Rolplay_Academia).
export const ROLEPLAY_MODULE = "Rolplay_Academia";

// ¿Estamos dentro de un iframe? (Zoho carga el widget embebido.)
export function isEmbedded() {
  try {
    return window.self !== window.top;
  } catch {
    return true; // si el acceso cross-origin falla, asumimos embebido
  }
}

// ¿El widget fue abierto desde Zoho? Marcado por el parametro ?source=zoho
// que configuramos en la URL base del widget (ver INTEGRACION_ZOHO.md).
export function isZohoSource() {
  try {
    return new URLSearchParams(window.location.search).get("source") === "zoho";
  } catch {
    return false;
  }
}

let sdkPromise = null;
export function loadZohoSdk() {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("SSR"));
    if (window.ZOHO && window.ZOHO.embeddedApp) return resolve(window.ZOHO);
    const s = document.createElement("script");
    s.src = SDK_URL;
    s.async = true;
    s.onload = () => resolve(window.ZOHO);
    s.onerror = () => reject(new Error("No se pudo cargar el SDK de Zoho"));
    document.head.appendChild(s);
  });
  return sdkPromise;
}

let initPromise = null;
// Inicializa el SDK y devuelve { ZOHO, pageData, user, inZoho }.
// - pageData: contexto del boton cuando el widget se abre desde la lista,
//   p. ej. { Entity, EntityId: [...], ButtonPosition: "ListView" }.
// - inZoho: true solo si el evento PageLoad realmente disparo, es decir,
//   estamos corriendo DENTRO del contenedor de Zoho (no un iframe cualquiera).
//   Lo usamos como senal segura para saltar el login.
export function initZoho() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const ZOHO = await loadZohoSdk();
    const result = await new Promise((resolve) => {
      let settled = false;
      const done = (pageData, inZoho) => {
        if (settled) return;
        settled = true;
        resolve({ pageData: pageData || {}, inZoho });
      };
      try {
        ZOHO.embeddedApp.on("PageLoad", (d) => done(d, true));
        ZOHO.embeddedApp.init();
      } catch (e) {
        done({}, false);
      }
      // Salvaguarda: si PageLoad no llega (no estamos en Zoho), seguimos.
      setTimeout(() => done({}, false), 8000);
    });
    let user = null;
    if (result.inZoho) {
      try {
        const res = await ZOHO.CRM.CONFIG.getCurrentUser();
        user = (res && res.users && res.users[0]) || null;
      } catch {}
    }
    return { ZOHO, pageData: result.pageData, user, inZoho: result.inZoho };
  })();
  return initPromise;
}

// Crea un registro en el modulo de roleplays. Devuelve el detalle del SDK.
export async function insertRoleplayRecord(apiData) {
  const ZOHO = await loadZohoSdk();
  const res = await ZOHO.CRM.API.insertRecord({
    Entity: ROLEPLAY_MODULE,
    APIData: apiData,
    Trigger: ["workflow"],
  });
  return res;
}

// Cierra el popup del widget. Usa closeReload() para refrescar la vista de
// lista (y que el registro recien creado aparezca); cae a close() si no esta.
export async function closeWidget() {
  try {
    const ZOHO = await loadZohoSdk();
    const Popup = ZOHO && ZOHO.CRM && ZOHO.CRM.UI && ZOHO.CRM.UI.Popup;
    if (Popup && Popup.closeReload) {
      await Popup.closeReload();
    } else if (Popup && Popup.close) {
      await Popup.close();
    }
  } catch {}
}

// Navega a la ficha (detail view) del registro recien creado y cierra el popup.
// Si no se puede abrir la ficha, cae a cerrar el popup normalmente.
export async function openRecordAndClose(recordId) {
  const ZOHO = await loadZohoSdk();
  let opened = false;
  try {
    if (recordId && ZOHO && ZOHO.CRM && ZOHO.CRM.UI && ZOHO.CRM.UI.Record && ZOHO.CRM.UI.Record.open) {
      await ZOHO.CRM.UI.Record.open({ Entity: ROLEPLAY_MODULE, RecordID: String(recordId) });
      opened = true;
    }
  } catch {}
  try {
    const Popup = ZOHO && ZOHO.CRM && ZOHO.CRM.UI && ZOHO.CRM.UI.Popup;
    if (Popup) {
      // Si abrimos la ficha, cerramos sin recargar el listado.
      if (opened && Popup.close) await Popup.close();
      else if (Popup.closeReload) await Popup.closeReload();
      else if (Popup.close) await Popup.close();
    }
  } catch {}
}
