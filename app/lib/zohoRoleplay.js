// ─── Mapeo simulador → modulo Rolplay_Academia (Primera Reunion) ──
// Traduce el escenario elegido en el widget y la evaluacion del coach
// a los campos exactos del modulo de Zoho. La rubrica usada es la de
// "Primera Reunion" (descubrimiento Sandler), que alimenta la formula
// Nota_Final_Primera_Reuni_n via los campos booleanos de cada criterio.

// Industria del simulador (4 opciones) → picklist Industria (22 opciones).
export const INDUSTRY_MAP = {
  "Retail": "17. Retail Enterprise",
  "Outsourcing": "13. Outsourcing General",
  "Construccion": "3. Construcción",
  "Plantas Productivas": "15. Planta Productiva",
};

// Rol del prospecto → picklist Rol_dentro_de_la_empresa.
export const ROL_MAP = {
  "Recursos Humanos": "Gerente de Recursos Humanos",
  "Operaciones": "Encargado de Operaciones",
  "Tecnologia": "Jefe de Tecnología (TI)",
};

// Valor por defecto de dificultad (el simulador no la pide hoy).
export const DEFAULT_DIFICULTAD = "Medio: prospecto neutral con algunas objeciones";

// Etiqueta del agente: ancla el registro a la rubrica de Primera Reunion.
export const AGENTE_DAPTA = "Victoria - Entrenamiento Primera Reunión";

// ─── Los 12 criterios de Primera Reunion ────────────────────────
// Cada criterio tiene un campo booleano (cumplio si/no) y un campo de
// texto pareja (comentario, 255). El sufijo "1" del API name varia por
// campo: estos valores fueron verificados contra la metadata del modulo.
// `group` agrupa los criterios en las 5 etapas Sandler para la UI.
export const CRITERIA = [
  { key: "ufc_contrato",            group: "ufc",      label: "Estableció el contrato previo (UFC)",       bool: "Se_estableci_el_contrato_previo_con_el_prospecto",  text: "Se_estableci_el_contrato_previo_con_el_prospecto1" },
  { key: "ufc_roles",               group: "ufc",      label: "Presentó roles y empresas",                 bool: "Se_realiz_la_presentaci_n_de_roles_y_empresas_de",  text: "Se_realiz_la_presentaci_n_de_roles_y_empresas_de1" },
  { key: "apertura_clara",          group: "ufc",      label: "Inició la llamada de forma clara y rápida",  bool: "El_SDR_inicia_la_llamada_de_manera_clara_y_r_pid",  text: "El_SDR_inicia_la_llamada_de_manera_clara_y_r_pida" },
  { key: "apertura_saludo",         group: "ufc",      label: "Ajustó el saludo / la introducción",         bool: "El_SDR_ajusta_el_saludo_o_la_introducci_n1",        text: "El_SDR_ajusta_el_saludo_o_la_introducci_n" },
  { key: "modelo_empleados",        group: "modelo",   label: "Obtuvo la cantidad de empleados",            bool: "Se_obtuvo_informaci_n_sobre_la_cantidad_de_emplea", text: "Se_obtuvo_informaci_n_sobre_la_cantidad_de_emplea1" },
  { key: "modelo_sistema",          group: "modelo",   label: "Identificó el sistema actual de marcaje",    bool: "Se_identific_el_sistema_actual_de_control_de_asi",  text: "Se_identific_el_sistema_actual_de_control_de_asi1" },
  { key: "pain_dolores",            group: "pain",     label: "Exploró claramente los dolores",             bool: "Se_exploraron_claramente_los_dolores_problemas1",   text: "Se_exploraron_claramente_los_dolores_problemas" },
  { key: "pain_suenos",             group: "pain",     label: "Discutió sueños / deseos del prospecto",     bool: "Se_discutieron_los_sue_os_o_deseos_del_prospecto1", text: "Se_discutieron_los_sue_os_o_deseos_del_prospecto" },
  { key: "budget_presupuesto",      group: "budget",   label: "Exploró el presupuesto",                     bool: "Se_explor_si_existe_un_presupuesto_asignado_o_un1", text: "Se_explor_si_existe_un_presupuesto_asignado_o_un" },
  { key: "decision_proceso",        group: "decision", label: "Identificó los pasos del proceso de compra", bool: "Se_identificaron_los_pasos_del_proceso_de_compra1", text: "Se_identificaron_los_pasos_del_proceso_de_compra" },
  { key: "decision_plazos",         group: "decision", label: "Discutió los plazos de decisión",            bool: "Se_discutieron_los_plazos_del_prospecto_para_toma1", text: "Se_discutieron_los_plazos_del_prospecto_para_toma" },
  { key: "decision_siguiente_paso", group: "decision", label: "Definió un siguiente paso claro",            bool: "Se_defini_un_siguiente_paso_claro_y_concreto_co",   text: "Se_defini_un_siguiente_paso_claro_y_concreto_co1" },
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
// para que la UI de resultados muestre las 5 etapas como antes.
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

// Construye el APIData para insertRecord en Rolplay_Academia.
// scenario: { recordName, industria, rol, pais, cargo, empleados,
//             nombreEmpresa, dificultad }
// evaluation: salida JSON del coach (criterios + feedback)
// user: usuario actual de Zoho ({ id, ... }) → queda como Owner
export function buildRoleplayApiData({ scenario, evaluation, user }) {
  const data = {
    Name: clip(scenario.recordName, 120),
    Estado: "Evaluado",
    Agente_Dapta: AGENTE_DAPTA,
    Iniciar_Rolplay: false,
    Fecha_Evaluaci_n: new Date().toISOString().slice(0, 10),
  };

  // Dueño = usuario logueado en Zoho.
  if (user && user.id) data.Owner = { id: String(user.id) };

  // ── Escenario ──
  if (scenario.industria) data.Industria = scenario.industria;
  if (scenario.rol) data.Rol_dentro_de_la_empresa = scenario.rol;
  if (scenario.pais) data.Pa_s = clip(scenario.pais, 100);
  if (scenario.cargo) data.Cargo = clip(scenario.cargo, 255);
  if (scenario.nombreEmpresa) data.Nombre_Empresa = clip(scenario.nombreEmpresa, 255);
  if (Number.isFinite(scenario.empleados)) data.N_mero_Empleados = scenario.empleados;
  data.Nivel_de_dificultad = scenario.dificultad || DEFAULT_DIFICULTAD;

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
  if (pf) data.Puntos_fuertes_detectados = pf;
  const op = clip(evaluation && evaluation.oportunidades, 2000);
  if (op) data.Oportunidades_de_mejora = op;
  const rec = clip(
    (evaluation && (evaluation.recomendacion || evaluation.general)) || "",
    2000
  );
  if (rec) data.Recomendaci_n_pr_ctica_para_tu_pr_ximo_roleplay = rec;

  return data;
}
