// ─── Mapeo simulador → modulo Rolplay_Academia (campos propios RP_) ──
// Esta iniciativa (roleplay desde la app web) escribe en campos EXCLUSIVOS
// con prefijo RP_, creados solo para este flujo, para no cruzarse con los
// campos que llena Dapta. La rubrica es la de "Primera Reunion"
// (descubrimiento Sandler): 12 criterios sí/no + comentario, mas la nota
// final como numero (snapshot que escribe la app).

// Valor por defecto de dificultad (el simulador no la pide hoy).
export const DEFAULT_DIFICULTAD = "Medio: prospecto neutral con algunas objeciones";

// ─── Los 12 criterios de Primera Reunion → campos propios RP_ ─────
// Cada criterio tiene un campo booleano (cumplio si/no) y un campo de texto
// pareja (comentario). `group` agrupa en las 5 etapas Sandler para la UI.
export const CRITERIA = [
  { key: "ufc_contrato",            group: "ufc",      label: "Estableció el contrato previo (UFC)",       bool: "RP_UFC_Contrato",        text: "RP_UFC_Contrato_Det" },
  { key: "ufc_roles",               group: "ufc",      label: "Presentó roles y empresas",                 bool: "RP_UFC_Roles",           text: "RP_UFC_Roles_Det" },
  { key: "apertura_clara",          group: "ufc",      label: "Inició la llamada de forma clara y rápida",  bool: "RP_Apertura_Clara",      text: "RP_Apertura_Clara_Det" },
  { key: "apertura_saludo",         group: "ufc",      label: "Ajustó el saludo / la introducción",         bool: "RP_Apertura_Saludo",     text: "RP_Apertura_Saludo_Det" },
  { key: "modelo_empleados",        group: "modelo",   label: "Obtuvo la cantidad de empleados",            bool: "RP_Modelo_Empleados",    text: "RP_Modelo_Empleados_Det" },
  { key: "modelo_sistema",          group: "modelo",   label: "Identificó el sistema actual de marcaje",    bool: "RP_Modelo_Sistema",      text: "RP_Modelo_Sistema_Det" },
  { key: "pain_dolores",            group: "pain",     label: "Exploró claramente los dolores",             bool: "RP_Pain_Dolores",        text: "RP_Pain_Dolores_Det" },
  { key: "pain_suenos",             group: "pain",     label: "Discutió sueños / deseos del prospecto",     bool: "RP_Pain_Suenos",         text: "RP_Pain_Suenos_Det" },
  { key: "budget_presupuesto",      group: "budget",   label: "Exploró el presupuesto",                     bool: "RP_Budget_Presupuesto",  text: "RP_Budget_Presup_Det" },
  { key: "decision_proceso",        group: "decision", label: "Identificó los pasos del proceso de compra", bool: "RP_Decision_Proceso",    text: "RP_Decision_Proceso_Det" },
  { key: "decision_plazos",         group: "decision", label: "Discutió los plazos de decisión",            bool: "RP_Decision_Plazos",     text: "RP_Decision_Plazos_Det" },
  { key: "decision_siguiente_paso", group: "decision", label: "Definió un siguiente paso claro",            bool: "RP_Decision_Sgte_Paso",  text: "RP_Decision_Paso_Det" },
];

// Etapas Sandler para la UI de resultados (deriva de los criterios).
export const STAGES = [
  { key: "ufc",      label: "Rapport y UFC" },
  { key: "modelo",   label: "Modelo Operacional" },
  { key: "pain",     label: "Identificación del Dolor" },
  { key: "budget",   label: "Calificación de Budget" },
  { key: "decision", label: "Proceso de Decisión" },
];

function clip(v, max) {
  if (v == null) return undefined;
  const s = String(v);
  return s.length > max ? s.slice(0, max) : s;
}

// Deriva el puntaje 0-10 por etapa a partir de los criterios cumplidos,
// para que la UI de resultados muestre las 5 etapas.
export function deriveStageView(evaluation) {
  const crit = (evaluation && evaluation.criterios) || {};
  const view = {};
  for (const stage of STAGES) {
    const items = CRITERIA.filter((c) => c.group === stage.key).map((c) => ({
      ...c,
      met: !!(crit[c.key] && crit[c.key].met),
      comment: (crit[c.key] && crit[c.key].comment) || "",
    }));
    const met = items.filter((i) => i.met).length;
    view[stage.key] = {
      score: items.length ? Math.round((met / items.length) * 10) : 0,
      met,
      total: items.length,
      items,
    };
  }
  return view;
}

// Nota final 0-10 (snapshot): mismo calculo que el "Puntaje general" de la UI
// (promedio de las 5 etapas + adaptacion DISC).
export function computeFinalScore(evaluation) {
  const view = deriveStageView(evaluation);
  const stageScores = STAGES.map((s) => view[s.key].score);
  const disc = (evaluation && evaluation.disc_adaptation && evaluation.disc_adaptation.score) || 0;
  const all = [...stageScores, disc];
  return Math.round(all.reduce((a, b) => a + b, 0) / all.length);
}

// Construye el APIData para insertRecord en Rolplay_Academia usando SOLO los
// campos propios RP_ (mas Name, Owner y la transcripcion). No toca los campos
// de la rubrica de Dapta ni la formula Nota_Final_Primera_Reuni_n.
// scenario: { recordName, disc, industria, rol, pais, cargo, nombre,
//             empleados, dificultad }
export function buildRoleplayApiData({ scenario, evaluation, user, transcript }) {
  const data = {
    Name: clip(scenario.recordName, 120),
    RP_Fecha_Evaluacion: new Date().toISOString().slice(0, 10),
  };

  // Dueño = usuario logueado en Zoho.
  if (user && user.id) data.Owner = { id: String(user.id) };

  // ── Escenario (campos propios) ──
  if (scenario.disc) data.RP_DISC = scenario.disc;
  if (scenario.industria) data.RP_Industria = scenario.industria;
  if (scenario.rol) data.RP_Rol = scenario.rol;
  if (scenario.pais) data.RP_Pais = clip(scenario.pais, 100);
  if (scenario.cargo) data.RP_Cargo = clip(scenario.cargo, 255);
  if (scenario.nombre) data.RP_Nombre_Cliente = clip(scenario.nombre, 255);
  if (Number.isFinite(scenario.empleados)) data.RP_Num_Empleados = scenario.empleados;
  data.RP_Dificultad = clip(scenario.dificultad || DEFAULT_DIFICULTAD, 255);

  // ── Notas (numero snapshot) ──
  data.RP_Nota_Final = computeFinalScore(evaluation);
  const discScore = evaluation && evaluation.disc_adaptation && evaluation.disc_adaptation.score;
  if (Number.isFinite(discScore)) data.RP_Nota_DISC = discScore;

  // ── Criterios (booleano + comentario) ──
  const crit = (evaluation && evaluation.criterios) || {};
  for (const c of CRITERIA) {
    const item = crit[c.key];
    if (!item) continue;
    data[c.bool] = !!item.met;
    const comment = clip(item.comment, 255);
    if (comment) data[c.text] = comment;
  }

  // ── Feedback ──
  const pf = clip(evaluation && evaluation.puntos_fuertes, 2000);
  if (pf) data.RP_Puntos_Fuertes = pf;
  const op = clip(evaluation && evaluation.oportunidades, 2000);
  if (op) data.RP_Oportunidades = op;
  const rec = clip((evaluation && (evaluation.recomendacion || evaluation.general)) || "", 2000);
  if (rec) data.RP_Recomendacion = rec;

  // ── Transcripcion completa (textarea large, 32k) ──
  const tr = clip(transcript, 32000);
  if (tr) data.Transcripci_n_Roleplay = tr;

  return data;
}
