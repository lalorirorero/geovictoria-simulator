"use client";
import { useState, useEffect, useRef } from "react";
import { selectChunks, formatChunks } from "./data/kb";

// ─── DISC + INDUSTRIA DATA ───────────────────────────────────────
const DISC_PROFILES = {
  D: {
    name: "Dominante",
    color: "#EF4444",
    bg: "#FEF2F2",
    emoji: "🔴",
    description: "Directo, impaciente, orientado a resultados. Va al grano. No le gustan los rodeos.",
    traits: ["Va directo al punto", "Impaciente con detalles", "Toma decisiones rapido", "Cuestiona todo"],
    tone: "Eres un gerente dominante, directo y algo impaciente. Hablas poco, preguntas directo al grano. Si el vendedor no va al punto rapido, lo interrumpes. Valoras tiempo y resultados sobre relaciones. Tus objeciones son cortas y desafiantes.",
  },
  I: {
    name: "Influyente",
    color: "#F59E0B",
    bg: "#FFFBEB",
    emoji: "🟡",
    description: "Entusiasta, sociable, optimista. Le gusta hablar. Se distrae facil con temas off-topic.",
    traits: ["Muy conversador", "Entusiasta y positivo", "Se distrae facilmente", "Decide por emocion"],
    tone: "Eres un gerente entusiasta y sociable. Hablas mucho, te desvias a temas personales, haces bromas. Te emocionas rapido pero tambien cambias de opinion. Tus objeciones son vagas. Necesitas que el vendedor te traiga de vuelta al tema.",
  },
  S: {
    name: "Estable",
    color: "#10B981",
    bg: "#ECFDF5",
    emoji: "🟢",
    description: "Cauto, leal, evita conflictos. Necesita tiempo para decidir. Le preocupa el impacto en su equipo.",
    traits: ["Muy cauto al decidir", "Preocupado por el equipo", "Evita confrontaciones", "Necesita seguridad"],
    tone: "Eres un gerente cauto y empatico. Hablas suave, haces muchas preguntas sobre como afectara al equipo. Te preocupa el cambio. Necesitas mucha seguridad antes de decidir. Tus objeciones son suaves pero persistentes.",
  },
  C: {
    name: "Concienzudo",
    color: "#6366F1",
    bg: "#EEF2FF",
    emoji: "🔵",
    description: "Analitico, perfeccionista, necesita datos. Hace muchas preguntas tecnicas. Desconfia sin evidencia.",
    traits: ["Muy analitico", "Pide datos y evidencia", "Perfeccionista", "Proceso de decision largo"],
    tone: "Eres un gerente analitico y detallista. Haces muchas preguntas tecnicas especificas. Pides datos, casos de estudio, certificaciones. Desconfias de afirmaciones sin evidencia. Tus objeciones son largas y llenas de preguntas.",
  },
};

const INDUSTRIES = {
  "Retail":        { name: "Retail", kbKey: "retail", size: "200 trabajadores", context: "12 sucursales, horario por turno, sistema antiguo instalado", pain: "Supervisores pierden tiempo consolidando asistencia de multiples tiendas" },
  "Outsourcing":   { name: "Outsourcing", kbKey: "outsourcing", size: "450 trabajadores", context: "Personal en faenas de terceros, multiples clientes, rotacion alta", pain: "Dificil controlar asistencia de personal disperso en distintas empresas cliente" },
  "Construccion":  { name: "Construccion", kbKey: "construccion", size: "350 trabajadores", context: "4 faenas activas, turnos rotativos 7x7, marcacion en papel", pain: "Errores en planilla por marcaciones manuales en faena" },
  "Plantas Productivas": { name: "Plantas Productivas", kbKey: "plantas_productivas", size: "600 trabajadores", context: "Operacion 24/7 por turnos, convenio colectivo, calculo de haberes manual", pain: "Calculo manual de turnos, recargos y bonos del convenio genera errores y reprocesos en remuneraciones" },
};

// Marco legal por país (conocimiento general) para localizar al cliente.
const PAISES = {
  "Chile":     { name: "Chile", flag: "🇨🇱", lang: "es-CL", context: "Te rige el Codigo del Trabajo chileno y fiscaliza la Direccion del Trabajo (DT). Te importa el libro de asistencia electronico y evitar multas de la DT. Usas modismos chilenos." },
  "Perú":      { name: "Perú", flag: "🇵🇪", lang: "es-PE", context: "Te rige la normativa del MTPE y fiscaliza SUNAFIL. Te importa el registro de control de asistencia y evitar multas de SUNAFIL. Usas modismos peruanos." },
  "Colombia":  { name: "Colombia", flag: "🇨🇴", lang: "es-CO", context: "Te rige el Codigo Sustantivo del Trabajo y el Ministerio de Trabajo; aportes via PILA/UGPP. Te importa la trazabilidad de horas extra, recargos nocturnos y dominicales. Usas modismos colombianos." },
  "México":    { name: "México", flag: "🇲🇽", lang: "es-MX", context: "Te rige la LFT y la STPS (NOM-035); el SAT para temas fiscales. Te importa el control de jornada y el cumplimiento ante la STPS. Usas modismos mexicanos." },
  "Argentina": { name: "Argentina", flag: "🇦🇷", lang: "es-AR", context: "Te rige la Ley de Contrato de Trabajo y fiscaliza el Ministerio de Trabajo; aportes a la AFIP. Te importa el registro horario y evitar multas. Usas modismos argentinos (voseo)." },
  "Panamá":    { name: "Panamá", flag: "🇵🇦", lang: "es-PA", context: "Te rige el Codigo de Trabajo y fiscaliza el MITRADEL. Te importa el control de planillas y el cumplimiento ante el MITRADEL. Usas modismos panameños." },
  "Brasil":    { name: "Brasil", flag: "🇧🇷", lang: "pt-BR", idioma: "pt", context: "Você é do Brasil. Você se rege pela CLT (Consolidação das Leis do Trabalho) e pela fiscalização do Ministério do Trabalho; usa eSocial e ponto eletrônico (Portaria 671). Você se preocupa com o registro de ponto e em evitar multas. Use gírias e expressões brasileiras." },
};

const ROLES = {
  "Recursos Humanos": {
    cargos: ["Gerente de RRHH", "Subgerente de Personas", "Jefe de Administracion de Personal"],
    foco: "Le preocupa el cumplimiento legal, la precision de la planilla y el bienestar del equipo.",
    personaSub: "rrhh",
  },
  "Operaciones": {
    cargos: ["Director de Operaciones", "Gerente de Operaciones", "Jefe de Administracion"],
    foco: "Le preocupa la eficiencia operacional, los costos y que el sistema no interrumpa la operacion.",
    personaSub: "coo",
  },
  "Tecnologia": {
    cargos: ["Gerente de TI", "Jefe de Sistemas", "CTO"],
    foco: "Le preocupa la integracion con sistemas existentes, la seguridad de datos y la facilidad de implementacion tecnica.",
    personaSub: null,
  },
};

const NOMBRES = ["Carlos Vega", "Ana Morales", "Roberto Silva", "Patricia Jimenez", "Diego Fuentes", "Monica Torres"];

// ─── SANDLER EVALUATION ─────────────────────────────────────────
const ETAPAS = [
  { key: "ufc", label: "Rapport y UFC", desc: "Establecio tiempo, proposito y posible 'no'" },
  { key: "modelo", label: "Modelo Operacional", desc: "Pregunto por dotacion, ubicaciones, turnos, proceso actual" },
  { key: "pain", label: "Identificacion del Dolor", desc: "Llego al Nivel 2 o 3 del dolor real" },
  { key: "budget", label: "Calificacion de Budget", desc: "Abordo el presupuesto antes de presentar" },
  { key: "decision", label: "Proceso de Decision", desc: "Identifico al decisor y mapeo el proceso de compra" },
];

// ─── SYSTEM PROMPT BUILDER ───────────────────────────────────────
// Arma el "expediente" de realismo del cliente desde la base de conocimiento,
// filtrado por industria y país. NO incluye soluciones ni cifras de ROI:
// eso lo debe descubrir el vendedor.
function buildClientKnowledge(prof) {
  const kb = prof.industry.kbKey;
  const pais = prof.paisKey;
  const sec = [];

  const dolores = selectChunks(kb, ["dolor"], { includeAll: false, limitPerCategory: 6, pais });
  if (dolores.length)
    sec.push(`DOLORES REALES DE TU OPERACION (vívelos, el vendedor debe excavarlos):\n${formatChunks(dolores)}`);

  const persona = prof.rol.personaSub
    ? selectChunks(kb, ["buyer_persona"], { includeAll: false, limitPerCategory: 1, subcategory: prof.rol.personaSub })
    : [];
  if (persona.length)
    sec.push(`TU PERFIL COMO COMPRADOR (KPIs y dolores que te quitan el sueño):\n${formatChunks(persona)}`);

  const part = selectChunks(kb, ["particularidad"], { includeAll: false, limitPerCategory: 2 });
  if (part.length)
    sec.push(`PARTICULARIDADES DE TU INDUSTRIA (quién decide y qué te importa):\n${formatChunks(part)}`);

  const obj = selectChunks(kb, ["objecion"], { includeAll: false, limitPerCategory: 4, pais });
  if (obj.length)
    sec.push(`OBJECIONES TIPICAS QUE PODRIAS LEVANTAR (usa la objeción, NUNCA la respuesta recomendada del texto):\n${formatChunks(obj)}`);

  const citas = selectChunks(kb, ["cita"], { includeAll: false, limitPerCategory: 2, pais });
  if (citas.length)
    sec.push(`FRASES REALES DE CLIENTES COMO TU (inspírate en su forma de hablar):\n${formatChunks(citas)}`);

  return sec.join("\n\n");
}

function buildSystemPrompt(prof) {
  const disc = DISC_PROFILES[prof.discKey];
  const pais = PAISES[prof.paisKey];
  const knowledge = buildClientKnowledge(prof);
  const isPt = pais.lang === "pt-BR";
  const idiomaRule = isPt
    ? "- IDIOMA: Responde SIEMPRE en portugués de Brasil (pt-BR), nunca en español, aunque el contexto de abajo esté en español. Eres brasileño y hablas como tal."
    : `- Cuando hables de lo legal, usa el marco de ${pais.name}`;
  return `Eres ${prof.nombre}, ${prof.cargo} de una empresa de ${prof.industry.name} con ${prof.industry.size} en ${pais.name}.${isPt ? " IMPORTANTE: hablas y respondes SIEMPRE en portugués de Brasil." : ""}
Contexto operacional: ${prof.industry.context}.
Dolor probable: ${prof.industry.pain}.
Tu area y foco: ${prof.rolKey}. ${prof.rol.foco}

PAIS: ${pais.name}. ${pais.context}

PERSONALIDAD DISC: ${disc.name}. ${disc.tone}
${knowledge ? `\n─── CONTEXTO REAL DE TU INDUSTRIA (base de conocimiento GeoVictoria) ───\n${knowledge}\n` : ""}
REGLAS ABSOLUTAS:
- Habla SIEMPRE en primera persona como ${prof.nombre}
- Responde en 2-4 oraciones maximo. Se conciso.
- Reacciona segun tu perfil DISC en cada respuesta
- Apóyate en los DOLORES y OBJECIONES reales de arriba, pero exprésalos como propios y de a poco: NO sueltes toda la información, el vendedor debe ganársela con buenas preguntas
- NUNCA propongas tú la solución ni menciones cifras de ROI o ahorros: eso es trabajo del vendedor
- Tus objeciones deben reflejar tu rol: si eres TI preguntas por integraciones, si eres RRHH por cumplimiento legal, si eres Operaciones por costo y tiempo
${idiomaRule}
- Si el vendedor no sigue el orden Sandler, reacciona con resistencia natural
- NO rompas el personaje nunca
- Responde solo como cliente, nunca como IA
- Comienza la llamada con una bienvenida breve segun tu personalidad DISC`;
}

// ─── EVALUATOR PROMPT ────────────────────────────────────────────
// El coach SÍ recibe el material completo (metodología, objeciones con su
// respuesta ideal, soluciones y casos de ROI) para juzgar contra el ideal.
function buildCoachReference(industry) {
  const kb = industry.kbKey;
  const sec = [];
  const met = selectChunks(kb, ["metodologia"], { limitPerCategory: 2 });
  if (met.length) sec.push(`MARCO SANDLER / BANT:\n${formatChunks(met)}`);
  const trig = selectChunks(kb, ["trigger"], { limitPerCategory: 1 });
  if (trig.length) sec.push(`PREGUNTAS DE EXCAVACION ESPERADAS:\n${formatChunks(trig)}`);
  const obj = selectChunks(kb, ["objecion"], { includeAll: false, limitPerCategory: 6 });
  if (obj.length) sec.push(`OBJECIONES Y SU MANEJO IDEAL:\n${formatChunks(obj)}`);
  const sol = selectChunks(kb, ["solucion"], { includeAll: false, limitPerCategory: 5 });
  if (sol.length) sec.push(`SOLUCIONES GEOVICTORIA QUE DEBIO ANCLAR AL DOLOR:\n${formatChunks(sol)}`);
  const roi = selectChunks(kb, ["roi"], { limitPerCategory: 4 });
  if (roi.length) sec.push(`CASOS DE ROI QUE PUDO CITAR COMO EVIDENCIA:\n${formatChunks(roi)}`);
  return sec.join("\n\n");
}

function buildEvaluatorPrompt(transcript, discKey, industry, paisKey) {
  const reference = buildCoachReference(industry);
  const pais = PAISES[paisKey];
  const idiomaNota = pais && pais.lang === "pt-BR"
    ? "\nIMPORTANTE: escribe TODOS los comentarios (campos 'comment' y 'general') en portugués de Brasil.\n"
    : "";
  return `Eres un coach experto en ventas Sandler. Analiza esta simulacion de venta de GeoVictoria.

PERFIL DEL CLIENTE: DISC ${discKey} — ${DISC_PROFILES[discKey].name}
INDUSTRIA: ${industry.name}${pais ? ` · PAIS: ${pais.name}` : ""}
${reference ? `\n─── MATERIAL DE REFERENCIA (base de conocimiento GeoVictoria) ───\n${reference}\n\nUsa este material como vara: premia cuando el ejecutivo identifica los dolores reales, hace las preguntas de excavación esperadas, maneja objeciones según el ideal y ancla valor con soluciones/ROI concretos. Penaliza cuando los omite.\n` : ""}${idiomaNota}
TRANSCRIPCION:
${transcript}

Evalua al ejecutivo en cada etapa Sandler. Responde SOLO en JSON con este formato exacto:
{
  "ufc": {"score": 0-10, "comment": "comentario breve de 1 linea"},
  "modelo": {"score": 0-10, "comment": "comentario breve de 1 linea"},
  "pain": {"score": 0-10, "comment": "comentario breve de 1 linea"},
  "budget": {"score": 0-10, "comment": "comentario breve de 1 linea"},
  "decision": {"score": 0-10, "comment": "comentario breve de 1 linea"},
  "disc_adaptation": {"score": 0-10, "comment": "se adapto al perfil DISC del cliente"},
  "general": "conclusion de 2 lineas con lo mejor y lo que debe mejorar"
}`;
}

// ─── UTILS ───────────────────────────────────────────────────────
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateProfile(discKey, industryKey, rolKey, paisKey) {
  const industry = INDUSTRIES[industryKey];
  const rol = ROLES[rolKey];
  const nombre = randomFrom(NOMBRES);
  const cargo = randomFrom(rol.cargos);
  return { discKey, industry, industryKey, rol, rolKey, paisKey, nombre, cargo };
}

async function callClaude(messages, system, maxTokens = 300) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system, maxTokens }),
  });
  const data = await res.json();
  return data.text || "";
}

// ─── VOICE ───────────────────────────────────────────────────────
// Voces ElevenLabs por idioma: español (latino) y portugués (Brasil).
const VOICES = {
  es: { male: "uPc5TJmLHicJAPs7qpif", female: "nTkjq09AuYgsNR8E4sDe" },
  pt: { male: "aU2vcrnwi348Gnc2Y1si", female: "mPDAoQyGzxBSkE0OAOKw" },
};
const FEMALE_NAMES = ["Ana", "Patricia", "Monica"];
function getVoiceId(nombre, paisKey) {
  const gender = FEMALE_NAMES.some(n => nombre.startsWith(n)) ? "female" : "male";
  const idioma = PAISES[paisKey]?.lang === "pt-BR" ? "pt" : "es";
  return VOICES[idioma][gender];
}

// ─── AVATAR ──────────────────────────────────────────────────────
function Avatar({ nombre, disc, speaking, size = 120 }) {
  const initials = nombre.split(" ").map(n => n[0]).join("").slice(0, 2);
  const color = DISC_PROFILES[disc]?.color || "#6B7280";
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {speaking && (
        <div style={{
          position: "absolute", inset: -6,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          animation: "pulse-ring 1.5s ease-out infinite",
        }} />
      )}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}33, ${color}66)`,
        border: `3px solid ${color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.33, fontFamily: "'Syne', sans-serif",
        fontWeight: 800, color: color, letterSpacing: "-1px",
        boxShadow: speaking ? `0 0 20px ${color}44` : "none",
        transition: "box-shadow 0.3s",
      }}>
        {initials}
      </div>
    </div>
  );
}

// ─── SCORE BADGE ─────────────────────────────────────────────────
function ScoreBadge({ score }) {
  const color = score >= 7 ? "#10B981" : score >= 4 ? "#F59E0B" : "#EF4444";
  return (
    <div style={{
      width: 44, height: 44, borderRadius: "50%",
      background: `${color}22`, border: `2px solid ${color}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 15, fontWeight: 800, color, fontFamily: "'Syne', sans-serif",
      flexShrink: 0,
    }}>{score}</div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("lobby");
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientSpeaking, setClientSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [lastUserLine, setLastUserLine] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const audioRef = useRef(null);
  const recRef = useRef(null);
  const messagesRef = useRef([]);
  const phaseRef = useRef("lobby");
  const loadingRef = useRef(false);

  const [selectedDisc, setSelectedDisc] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedRol, setSelectedRol] = useState(null);
  const [selectedPais, setSelectedPais] = useState(null);

  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => {
    try { if (sessionStorage.getItem("gv_auth") === "1") setAuthed(true); } catch {}
  }, []);

  const tryLogin = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwInput }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        try { sessionStorage.setItem("gv_auth", "1"); } catch {}
        setAuthed(true);
        setPwInput("");
      } else {
        setAuthError("Contraseña incorrecta.");
      }
    } catch {
      setAuthError("Error de conexión. Intenta de nuevo.");
    }
    setAuthLoading(false);
  };

  const stopListening = () => {
    if (recRef.current) { try { recRef.current.abort(); } catch {} recRef.current = null; }
    setListening(false);
  };

  const autoListen = (profileSnap) => {
    if (phaseRef.current !== "call") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    stopListening();
    const rec = new SR();
    rec.lang = (profileSnap && PAISES[profileSnap.paisKey] && PAISES[profileSnap.paisKey].lang) || "es-CL";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      if (text.trim()) sendVoice(text, profileSnap);
    };
    recRef.current = rec;
    try { rec.start(); } catch {}
  };

  const speak = async (text, profileSnap) => {
    setClientSpeaking(true);
    try {
      const voiceId = getVoiceId(profileSnap.nombre, profileSnap.paisKey);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId }),
      });
      if (audioRef.current) { audioRef.current.pause(); }
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => { setClientSpeaking(false); autoListen(profileSnap); };
        audio.play();
        return;
      }
    } catch {}
    setClientSpeaking(false);
    autoListen(profileSnap);
  };

  const sendVoice = async (text, profileSnap) => {
    if (loadingRef.current) return;
    stopListening();
    setLastUserLine(text);
    const current = messagesRef.current;
    const userMsg = { role: "user", content: text };
    const newMessages = [...current, userMsg];
    setMessages(newMessages);
    setLoading(true);
    loadingRef.current = true;

    const sys = buildSystemPrompt(profileSnap);
    const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
    const reply = await callClaude(apiMessages, sys);
    const final = [...newMessages, { role: "assistant", content: reply }];
    setMessages(final);
    messagesRef.current = final;
    setLoading(false);
    loadingRef.current = false;
    setTurnCount(t => t + 1);
    speak(reply, profileSnap);
  };

  const startSimulation = (discKey, industryKey, rolKey, paisKey) => {
    const p = generateProfile(discKey, industryKey, rolKey, paisKey);
    setProfile(p);
    setMessages([]);
    setTurnCount(0);
    setPhase("briefing");
  };

  const beginCall = async (profileSnap) => {
    setPhase("call");
    phaseRef.current = "call";
    setLoading(true);
    loadingRef.current = true;
    const sys = buildSystemPrompt(profileSnap);
    const seed = PAISES[profileSnap.paisKey]?.lang === "pt-BR"
      ? "Olá, obrigado por atender a ligação."
      : "Hola, gracias por tomar la llamada.";
    const opening = await callClaude([{ role: "user", content: seed }], sys);
    const initial = [{ role: "assistant", content: opening }];
    setMessages(initial);
    messagesRef.current = initial;
    setLoading(false);
    loadingRef.current = false;
    speak(opening, profileSnap);
  };

  const endCall = async () => {
    stopListening();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPhase("evaluating");
    const transcript = messagesRef.current.map(m =>
      `${m.role === "user" ? "EJECUTIVO" : profile.nombre}: ${m.content}`
    ).join("\n\n");

    const evalSys = buildEvaluatorPrompt(transcript, profile.discKey, profile.industry, profile.paisKey);
    const raw = await callClaude(
      [{ role: "user", content: "Evalua esta simulacion." }],
      evalSys,
      800
    );

    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      setEvaluation(JSON.parse(clean));
    } catch {
      setEvaluation({ error: raw });
    }
    setPhase("results");
  };

  const reset = () => {
    setPhase("lobby");
    setProfile(null);
    setMessages([]);
    setEvaluation(null);
    setTurnCount(0);
  };

  const disc = profile ? DISC_PROFILES[profile.discKey] : null;

  // ── Pantalla de seguridad (login) ──
  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0B0F1A", color: "#F0F4FF",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "24px 20px", gap: 18,
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} input:focus{outline:none;}`}</style>
        <div style={{ fontSize: 40 }}>🔒</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800 }}>Simulador de Ventas</div>
          <div style={{ fontSize: 12, color: "#3A4A6A", marginTop: 4 }}>Ingresa la contraseña para continuar</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 320 }}>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && pwInput && !authLoading) tryLogin(); }}
            placeholder="Contraseña"
            autoFocus
            style={{
              background: "#111827", border: `2px solid ${authError ? "#EF4444" : "#1E2D45"}`,
              borderRadius: 12, padding: "14px 16px", color: "#F0F4FF", fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          {authError && <div style={{ fontSize: 12, color: "#EF4444" }}>{authError}</div>}
          <button
            onClick={() => pwInput && !authLoading && tryLogin()}
            disabled={!pwInput || authLoading}
            style={{
              background: pwInput && !authLoading ? "linear-gradient(135deg, #0066FF, #0044CC)" : "#1A2235",
              border: "none", borderRadius: 12, padding: "14px",
              color: pwInput && !authLoading ? "#fff" : "#1E2D45",
              fontSize: 14, fontWeight: 700, cursor: pwInput && !authLoading ? "pointer" : "not-allowed",
              fontFamily: "'Syne', sans-serif",
            }}>
            {authLoading ? "Verificando..." : "Ingresar"}
          </button>
        </div>
        <div style={{ fontSize: 10, color: "#162035", textAlign: "center" }}>
          GeoVictoria · Entrenamiento Comercial
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0B0F1A",
      fontFamily: "'DM Sans', sans-serif", color: "#F0F4FF",
      display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink { 0%,80%,100%{opacity:.2}40%{opacity:1} }
        .dot { animation: blink 1.4s ease infinite; }
        .dot:nth-child(2) { animation-delay:.2s; }
        .dot:nth-child(3) { animation-delay:.4s; }
        .msg { animation: fadeUp 0.25s ease; }
        .btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }
        textarea:focus { outline: none; }
        input:focus { outline: none; }
      `}</style>

      {/* ── LOBBY ── */}
      {phase === "lobby" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 16px", gap: 20, overflowY: "auto" }}>
          <div style={{ textAlign: "center", paddingTop: 8 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎙️</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Simulador de Ventas</div>
            <div style={{ fontSize: 12, color: "#3A4A6A", lineHeight: 1.6 }}>Elige el escenario y practica con un cliente real con voz</div>
          </div>

          {/* DISC */}
          <div>
            <div style={{ fontSize: 11, color: "#4D9FFF", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 10 }}>
              1 · Perfil DISC del cliente
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(DISC_PROFILES).map(([k, v]) => (
                <button key={k} onClick={() => setSelectedDisc(k)} style={{
                  background: selectedDisc === k ? `${v.color}22` : "#111827",
                  border: `2px solid ${selectedDisc === k ? v.color : "#1E2D45"}`,
                  borderRadius: 12, padding: "12px 14px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12, transition: "all .2s",
                  textAlign: "left",
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${v.color}22`, border: `1px solid ${v.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{v.emoji}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: selectedDisc === k ? v.color : "#C8D4E8", fontFamily: "'Syne', sans-serif" }}>{k} — {v.name}</div>
                    <div style={{ fontSize: 11, color: "#3A4A6A" }}>{v.description}</div>
                  </div>
                  {selectedDisc === k && <div style={{ marginLeft: "auto", color: v.color, fontSize: 18 }}>✓</div>}
                </button>
              ))}
            </div>
          </div>

          {/* INDUSTRIA */}
          <div>
            <div style={{ fontSize: 11, color: "#4D9FFF", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 10 }}>
              2 · Industria del cliente
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(INDUSTRIES).map(([k, v]) => (
                <button key={k} onClick={() => setSelectedIndustry(k)} style={{
                  background: selectedIndustry === k ? "#0066FF22" : "#111827",
                  border: `2px solid ${selectedIndustry === k ? "#0066FF" : "#1E2D45"}`,
                  borderRadius: 12, padding: "12px 14px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12, transition: "all .2s",
                  textAlign: "left",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: selectedIndustry === k ? "#0066FF" : "#C8D4E8", fontFamily: "'Syne', sans-serif" }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: "#3A4A6A" }}>{v.size} · {v.context}</div>
                  </div>
                  {selectedIndustry === k && <div style={{ color: "#0066FF", fontSize: 18, flexShrink: 0 }}>✓</div>}
                </button>
              ))}
            </div>
          </div>

          {/* ROL */}
          <div>
            <div style={{ fontSize: 11, color: "#4D9FFF", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 10 }}>
              3 · Rol del prospecto
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(ROLES).map(([k, v]) => (
                <button key={k} onClick={() => setSelectedRol(k)} style={{
                  background: selectedRol === k ? "#0044AA22" : "#111827",
                  border: `2px solid ${selectedRol === k ? "#0066FF" : "#1E2D45"}`,
                  borderRadius: 12, padding: "12px 14px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12, transition: "all .2s",
                  textAlign: "left",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: selectedRol === k ? "#4D9FFF" : "#C8D4E8", fontFamily: "'Syne', sans-serif" }}>{k}</div>
                    <div style={{ fontSize: 11, color: "#3A4A6A" }}>{v.foco}</div>
                  </div>
                  {selectedRol === k && <div style={{ color: "#4D9FFF", fontSize: 18, flexShrink: 0 }}>✓</div>}
                </button>
              ))}
            </div>
          </div>

          {/* PAIS */}
          <div>
            <div style={{ fontSize: 11, color: "#4D9FFF", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 10 }}>
              4 · País del cliente
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {Object.entries(PAISES).map(([k, v]) => (
                <button key={k} onClick={() => setSelectedPais(k)} style={{
                  background: selectedPais === k ? "#0066FF22" : "#111827",
                  border: `2px solid ${selectedPais === k ? "#0066FF" : "#1E2D45"}`,
                  borderRadius: 12, padding: "12px 14px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 10, transition: "all .2s",
                  textAlign: "left",
                }}>
                  <div style={{ fontSize: 22 }}>{v.flag}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: selectedPais === k ? "#0066FF" : "#C8D4E8", fontFamily: "'Syne', sans-serif" }}>{v.name}</div>
                  {selectedPais === k && <div style={{ marginLeft: "auto", color: "#0066FF", fontSize: 16 }}>✓</div>}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          {(() => {
            const ready = selectedDisc && selectedIndustry && selectedRol && selectedPais;
            return (
              <button className="btn"
                onClick={() => ready && startSimulation(selectedDisc, selectedIndustry, selectedRol, selectedPais)}
                disabled={!ready}
                style={{
                  background: ready ? "linear-gradient(135deg, #0066FF, #0044CC)" : "#1A2235",
                  border: "none", borderRadius: 12, padding: "16px",
                  color: ready ? "#fff" : "#1E2D45",
                  fontSize: 14, fontWeight: 700, cursor: ready ? "pointer" : "not-allowed",
                  transition: "all .2s", fontFamily: "'Syne', sans-serif",
                }}>
                {ready ? "Iniciar Simulacion →" : "Selecciona los 4 parametros para continuar"}
              </button>
            );
          })()}

          <div style={{ fontSize: 10, color: "#162035", textAlign: "center", paddingBottom: 8 }}>
            GeoVictoria · Entrenamiento Comercial · Sandler + DISC
          </div>
        </div>
      )}

      {/* ── BRIEFING ── */}
      {phase === "briefing" && disc && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 16px", gap: 16, maxWidth: 480, margin: "0 auto", width: "100%" }}>
          <div style={{ textAlign: "center", paddingTop: 12 }}>
            <div style={{ fontSize: 11, color: "#4D9FFF", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 6 }}>Tu prospecto de hoy</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800 }}>{profile.nombre}</div>
            <div style={{ fontSize: 13, color: "#4A5A7A" }}>{profile.cargo} · {profile.industry.name} · {PAISES[profile.paisKey].flag} {PAISES[profile.paisKey].name}</div>
          </div>

          {/* DISC Badge */}
          <div style={{
            background: `${disc.color}12`, border: `1px solid ${disc.color}33`,
            borderRadius: 14, padding: "16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${disc.color}22`, border: `1px solid ${disc.color}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>{disc.emoji}</div>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: disc.color }}>
                  Perfil DISC: {profile.discKey} — {disc.name}
                </div>
                <div style={{ fontSize: 11, color: "#4A5A7A" }}>{disc.description}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {disc.traits.map(t => (
                <span key={t} style={{
                  padding: "3px 10px", borderRadius: 20,
                  background: `${disc.color}18`, border: `1px solid ${disc.color}33`,
                  fontSize: 10, color: disc.color, fontWeight: 600,
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Context */}
          <div style={{ background: "#111827", border: "1px solid #1E1E2E", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#4D9FFF", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>Contexto de la empresa</div>
            {[
              ["Industria", profile.industry.name],
              ["Dotacion", profile.industry.size],
              ["Operacion", profile.industry.context],
              ["Dolor probable", profile.industry.pain],
              ["Rol y foco", profile.rol.foco],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 12 }}>
                <span style={{ color: "#2E3D5A", minWidth: 80 }}>{k}:</span>
                <span style={{ color: "#8899BB" }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div style={{ background: "#0A1628", border: "1px solid #0D2018", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "#0066FF", fontWeight: 700, marginBottom: 4 }}>💡 TIP SANDLER</div>
            <div style={{ fontSize: 11, color: "#4A6A99", lineHeight: 1.6 }}>
              Recuerda el orden: UFC → Modelo Operacional → Pain → Budget → Decision. El cliente tiene perfil {profile.discKey} — adapta tu ritmo y lenguaje.
            </div>
          </div>

          <button className="btn" onClick={() => beginCall(profile)} style={{
            background: "linear-gradient(135deg, #EF4444, #DC2626)",
            border: "none", borderRadius: 12, padding: "16px",
            color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", transition: "all .2s",
            fontFamily: "'Syne', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", animation: "blink 1.5s ease infinite" }} />
            Iniciar Videollamada
          </button>
        </div>
      )}

      {/* ── CALL (voice-only) ── */}
      {phase === "call" && disc && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", background: "#060A12", position: "relative" }}>

          {/* Grid background */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#0D0D14 1px, transparent 1px), linear-gradient(90deg, #0D0D14 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4, pointerEvents: "none" }} />

          {/* Top badges */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", padding: "14px 16px" }}>
            <div style={{ background: `${disc.color}22`, border: `1px solid ${disc.color}55`, borderRadius: 8, padding: "5px 12px", fontSize: 10, fontWeight: 700, color: disc.color }}>
              {disc.emoji} DISC {profile.discKey}
            </div>
            <div style={{ background: "#0D1420", border: "1px solid #1E2D45", borderRadius: 8, padding: "5px 12px", fontSize: 10, color: "#3A4A6A" }}>
              {turnCount} turnos
            </div>
          </div>

          {/* Main — avatar + status */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, position: "relative", zIndex: 1 }}>
            <Avatar nombre={profile.nombre} disc={profile.discKey} speaking={clientSpeaking} size={130} />

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#F0F4FF" }}>{profile.nombre}</div>
              <div style={{ fontSize: 11, color: "#3A4A6A", marginTop: 2 }}>{profile.cargo} · {profile.industry.name} · {PAISES[profile.paisKey].flag}</div>
            </div>

            {/* Status pill */}
            <div style={{ minWidth: 160, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "#0D1420", border: "1px solid #1E2D45", borderRadius: 20, padding: "0 16px", gap: 8 }}>
              {loading ? (
                <>
                  {[0,1,2].map(i => <div key={i} className="dot" style={{ width: 7, height: 7, borderRadius: "50%", background: disc.color }} />)}
                  <span style={{ fontSize: 11, color: "#3A4A6A" }}>Procesando...</span>
                </>
              ) : listening ? (
                <>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981", animation: "blink 1s ease infinite" }} />
                  <span style={{ fontSize: 11, color: "#10B981", fontWeight: 600 }}>Escuchando...</span>
                </>
              ) : clientSpeaking ? (
                <>
                  {[0,1,2].map(i => <div key={i} className="dot" style={{ width: 7, height: 7, borderRadius: "50%", background: disc.color }} />)}
                  <span style={{ fontSize: 11, color: disc.color }}>Hablando...</span>
                </>
              ) : (
                <span style={{ fontSize: 11, color: "#2E3D5A" }}>En llamada</span>
              )}
            </div>

            {/* Last user line (subtle confirmation of what was heard) */}
            {lastUserLine && !loading && (
              <div style={{ maxWidth: 280, textAlign: "center", fontSize: 11, color: "#1E2D45", fontStyle: "italic", lineHeight: 1.5, padding: "0 20px" }}>
                "{lastUserLine}"
              </div>
            )}
          </div>

          {/* Last client message */}
          {messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
            <div style={{ position: "relative", zIndex: 1, margin: "0 16px 16px", background: "#0D1420", border: `1px solid ${disc.color}22`, borderRadius: 14, padding: "12px 16px" }}>
              <div style={{ fontSize: 10, color: disc.color, fontWeight: 700, marginBottom: 4 }}>{profile.nombre}</div>
              <div style={{ fontSize: 12, color: "#8899BB", lineHeight: 1.6 }}>
                {messages[messages.length - 1].content.length > 160
                  ? messages[messages.length - 1].content.slice(0, 160) + "..."
                  : messages[messages.length - 1].content}
              </div>
            </div>
          )}

          {/* Hang-up button */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center", paddingBottom: 36 }}>
            <button className="btn" onClick={endCall} title="Colgar y evaluar" style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #EF4444, #DC2626)",
              border: "none", cursor: "pointer", fontSize: 24,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 24px #EF444466", transition: "all .2s",
            }}>📵</button>
          </div>
        </div>
      )}

      {/* ── EVALUATING ── */}
      {phase === "evaluating" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
          <div style={{ fontSize: 40 }}>🧠</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800 }}>Evaluando simulacion...</div>
          <div style={{ fontSize: 12, color: "#3A4A6A", textAlign: "center" }}>El coach Sandler esta analizando tu conversacion</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[0,1,2].map(i => <div key={i} className="dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#0066FF" }} />)}
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === "results" && evaluation && disc && (
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Evaluacion de la simulacion</div>
            <div style={{ fontSize: 12, color: "#3A4A6A" }}>{profile.nombre} · DISC {profile.discKey} · {profile.industry.name}</div>
          </div>

          {evaluation.error ? (
            <div style={{ background: "#1A2235", borderRadius: 12, padding: 16, fontSize: 12, color: "#6B7A99" }}>{evaluation.error}</div>
          ) : (
            <>
              {/* Scores */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {ETAPAS.map(etapa => {
                  const ev = evaluation[etapa.key];
                  if (!ev) return null;
                  return (
                    <div key={etapa.key} style={{
                      background: "#111827", border: "1px solid #1E1E2E",
                      borderRadius: 12, padding: "12px 14px",
                      display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <ScoreBadge score={ev.score} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{etapa.label}</div>
                        <div style={{ fontSize: 11, color: "#4A5A7A" }}>{ev.comment}</div>
                      </div>
                    </div>
                  );
                })}

                {/* DISC adaptation */}
                {evaluation.disc_adaptation && (
                  <div style={{
                    background: `${disc.color}10`, border: `1px solid ${disc.color}33`,
                    borderRadius: 12, padding: "12px 14px",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <ScoreBadge score={evaluation.disc_adaptation.score} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, color: disc.color }}>Adaptacion DISC {profile.discKey}</div>
                      <div style={{ fontSize: 11, color: "#4A5A7A" }}>{evaluation.disc_adaptation.comment}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Overall score */}
              {(() => {
                const scores = [...ETAPAS.map(e => evaluation[e.key]?.score || 0), evaluation.disc_adaptation?.score || 0];
                const avg = Math.round(scores.reduce((a,b) => a+b, 0) / scores.length);
                const color = avg >= 7 ? "#10B981" : avg >= 4 ? "#F59E0B" : "#EF4444";
                return (
                  <div style={{
                    background: `${color}12`, border: `1px solid ${color}33`,
                    borderRadius: 14, padding: "16px", textAlign: "center", marginBottom: 14,
                  }}>
                    <div style={{ fontSize: 36, fontFamily: "'Syne', sans-serif", fontWeight: 800, color }}>{avg}<span style={{ fontSize: 16, color: "#3A4A6A" }}>/10</span></div>
                    <div style={{ fontSize: 11, color: "#4A5A7A", marginTop: 4 }}>Puntaje general</div>
                  </div>
                );
              })()}

              {/* General comment */}
              {evaluation.general && (
                <div style={{ background: "#0A1628", border: "1px solid #0D2018", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#0066FF", fontWeight: 700, marginBottom: 6 }}>💬 FEEDBACK DEL COACH</div>
                  <div style={{ fontSize: 12, color: "#8AB89A", lineHeight: 1.7 }}>{evaluation.general}</div>
                </div>
              )}
            </>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={() => { setPhase("lobby"); setSelectedDisc(null); setSelectedIndustry(null); setSelectedRol(null); setSelectedPais(null); }} style={{
              flex: 1, background: "linear-gradient(135deg, #0066FF, #0044CC)",
              border: "none", borderRadius: 12, padding: "14px",
              color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", transition: "all .2s",
              fontFamily: "'Syne', sans-serif",
            }}>Nueva simulacion →</button>
            <button className="btn" onClick={() => { setPhase("lobby"); setSelectedDisc(null); setSelectedIndustry(null); setSelectedRol(null); setSelectedPais(null); setProfile(null); setMessages([]); setEvaluation(null); setTurnCount(0); }} style={{
              width: 48, background: "#111827", border: "1px solid #1E1E2E",
              borderRadius: 12, cursor: "pointer", fontSize: 18, transition: "all .2s",
            }}>🏠</button>
          </div>
        </div>
      )}
    </div>
  );
}
