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
// Inicializa el SDK y devuelve { ZOHO, pageData, user }.
// pageData trae el contexto del boton (Entity, EntityId, etc.) cuando
// el widget se abre desde un boton de registro/lista.
export function initZoho() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const ZOHO = await loadZohoSdk();
    const pageData = await new Promise((resolve) => {
      let settled = false;
      const done = (d) => {
        if (settled) return;
        settled = true;
        resolve(d || {});
      };
      try {
        ZOHO.embeddedApp.on("PageLoad", (d) => done(d));
        ZOHO.embeddedApp.init();
      } catch (e) {
        done({});
      }
      // Salvaguarda: no bloquear para siempre si PageLoad no llega.
      setTimeout(() => done({}), 8000);
    });
    let user = null;
    try {
      const res = await ZOHO.CRM.CONFIG.getCurrentUser();
      user = (res && res.users && res.users[0]) || null;
    } catch {}
    return { ZOHO, pageData, user };
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

// Cierra el popup del widget (si Zoho lo abrio como popup).
export async function closeWidget() {
  try {
    const ZOHO = await loadZohoSdk();
    if (ZOHO && ZOHO.CRM && ZOHO.CRM.UI && ZOHO.CRM.UI.Popup && ZOHO.CRM.UI.Popup.close) {
      await ZOHO.CRM.UI.Popup.close();
    }
  } catch {}
}
