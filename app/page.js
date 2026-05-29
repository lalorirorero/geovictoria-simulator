"use client";
import { useState, useEffect, useRef } from "react";

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
  "Retail":        { name: "Retail", size: "200 trabajadores", context: "12 sucursales, horario por turno, sistema antiguo instalado", pain: "Supervisores pierden tiempo consolidando asistencia de multiples tiendas" },
  "Outsourcing":   { name: "Outsourcing", size: "450 trabajadores", context: "Personal en faenas de terceros, multiples clientes, rotacion alta", pain: "Dificil controlar asistencia de personal disperso en distintas empresas cliente" },
  "Construccion":  { name: "Construccion", size: "350 trabajadores", context: "4 faenas activas, turnos rotativos 7x7, marcacion en papel", pain: "Errores en planilla por marcaciones manuales en faena" },
};

const ROLES = {
  "Recursos Humanos": {
    cargos: ["Gerente de RRHH", "Subgerente de Personas", "Jefe de Administracion de Personal"],
    foco: "Le preocupa el cumplimiento legal, la precision de la planilla y el bienestar del equipo.",
  },
  "Operaciones": {
    cargos: ["Director de Operaciones", "Gerente de Operaciones", "Jefe de Administracion"],
    foco: "Le preocupa la eficiencia operacional, los costos y que el sistema no interrumpa la operacion.",
  },
  "Tecnologia": {
    cargos: ["Gerente de TI", "Jefe de Sistemas", "CTO"],
    foco: "Le preocupa la integracion con sistemas existentes, la seguridad de datos y la facilidad de implementacion tecnica.",
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
function buildSystemPrompt(prof) {
  const disc = DISC_PROFILES[prof.discKey];
  return `Eres ${prof.nombre}, ${prof.cargo} de una empresa de ${prof.industry.name} con ${prof.industry.size}.
Contexto operacional: ${prof.industry.context}.
Dolor probable: ${prof.industry.pain}.
Tu area y foco: ${prof.rolKey}. ${prof.rol.foco}

PERSONALIDAD DISC: ${disc.name}. ${disc.tone}

REGLAS ABSOLUTAS:
- Habla SIEMPRE en primera persona como ${prof.nombre}
- Responde en 2-4 oraciones maximo. Se conciso.
- Reacciona segun tu perfil DISC en cada respuesta
- Tus objeciones deben reflejar tu rol: si eres TI preguntas por integraciones, si eres RRHH por cumplimiento legal, si eres Operaciones por costo y tiempo
- Si el vendedor no sigue el orden Sandler, reacciona con resistencia natural
- NO rompas el personaje nunca
- Responde solo como cliente, nunca como IA
- Comienza la llamada con una bienvenida breve segun tu personalidad DISC`;
}

// ─── EVALUATOR PROMPT ────────────────────────────────────────────
function buildEvaluatorPrompt(transcript, profile, industry) {
  return `Eres un coach experto en ventas Sandler. Analiza esta simulacion de venta de GeoVictoria.

PERFIL DEL CLIENTE: DISC ${profile} — ${DISC_PROFILES[profile].name}
INDUSTRIA: ${industry.name}

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

function generateProfile(discKey, industryKey, rolKey) {
  const industry = INDUSTRIES[industryKey];
  const rol = ROLES[rolKey];
  const nombre = randomFrom(NOMBRES);
  const cargo = randomFrom(rol.cargos);
  return { discKey, industry, industryKey, rol, rolKey, nombre, cargo };
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
const VOICES = {
  male:   { D: "pNInz6obpgDQGcFmaJgB", I: "TX3LPaxmHKxFdv7VOQHJ", S: "nPczCjzI2devNBz1zQrb", C: "onwK4e9ZLuTAKqWW03F9" },
  female: { D: "Xb7hH8MSUJpSbSDYk0k2", I: "cgSgspJ2msm6clMkppW",  S: "EXAVITQu4vr4xnSDxMaL", C: "XrExE9yKIg1WjnnlVkGG" },
};
const FEMALE_NAMES = ["Ana", "Patricia", "Monica"];
function getVoiceId(discKey, nombre) {
  const gender = FEMALE_NAMES.some(n => nombre.startsWith(n)) ? "female" : "male";
  return VOICES[gender][discKey];
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
  const [phase, setPhase] = useState("lobby"); // lobby | briefing | call | evaluating | results
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]); // {role, content}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientSpeaking, setClientSpeaking] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const [selectedDisc, setSelectedDisc] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedRol, setSelectedRol] = useState(null);

  const speak = async (text, discKey, nombre) => {
    try {
      const voiceId = getVoiceId(discKey, nombre);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) { audioRef.current.pause(); URL.revokeObjectURL(audioRef.current.src); }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
    } catch {}
  };

  const sendText = async (text, currentMessages) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    const newMessages = [...currentMessages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setClientSpeaking(true);

    const sys = buildSystemPrompt(profile);
    const apiMessages = newMessages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
    const reply = await callClaude(apiMessages, sys);
    setMessages([...newMessages, { role: "assistant", content: reply }]);
    setClientSpeaking(false);
    setLoading(false);
    setTurnCount(t => t + 1);
    speak(reply, profile.discKey, profile.nombre);
  };

  const sendMessage = () => sendText(input, messages);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || listening || loading) return;
    const snapshot = messages;
    const rec = new SR();
    rec.lang = "es-CL";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      sendText(text, snapshot);
    };
    rec.start();
  };

  const startSimulation = (discKey, industryKey, rolKey) => {
    const p = generateProfile(discKey, industryKey, rolKey);
    setProfile(p);
    setMessages([]);
    setTurnCount(0);
    setPhase("briefing");
  };

  const beginCall = async () => {
    setPhase("call");
    setLoading(true);
    setClientSpeaking(true);
    const sys = buildSystemPrompt(profile);
    const opening = await callClaude(
      [{ role: "user", content: "Hola, gracias por tomar la llamada." }],
      sys
    );
    const msg = { role: "assistant", content: opening };
    setMessages([msg]);
    setClientSpeaking(false);
    setLoading(false);
    speak(opening, profile.discKey, profile.nombre);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const endCall = async () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPhase("evaluating");
    const transcript = messages.map(m =>
      `${m.role === "user" ? "EJECUTIVO" : profile.nombre}: ${m.content}`
    ).join("\n\n");

    const evalSys = buildEvaluatorPrompt(transcript, profile.discKey, profile.industry.name);
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

          {/* CTA */}
          <button className="btn"
            onClick={() => selectedDisc && selectedIndustry && selectedRol && startSimulation(selectedDisc, selectedIndustry, selectedRol)}
            disabled={!selectedDisc || !selectedIndustry || !selectedRol}
            style={{
              background: selectedDisc && selectedIndustry && selectedRol
                ? "linear-gradient(135deg, #0066FF, #0044CC)"
                : "#1A2235",
              border: "none", borderRadius: 12, padding: "16px",
              color: selectedDisc && selectedIndustry && selectedRol ? "#fff" : "#1E2D45",
              fontSize: 14, fontWeight: 700, cursor: selectedDisc && selectedIndustry && selectedRol ? "pointer" : "not-allowed",
              transition: "all .2s", fontFamily: "'Syne', sans-serif",
            }}>
            {selectedDisc && selectedIndustry && selectedRol ? "Iniciar Simulacion →" : "Selecciona los 3 parametros para continuar"}
          </button>

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
            <div style={{ fontSize: 13, color: "#4A5A7A" }}>{profile.cargo} · {profile.industry.name}</div>
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

          <button className="btn" onClick={beginCall} style={{
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

      {/* ── CALL ── */}
      {phase === "call" && disc && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>

          {/* Video area */}
          <div style={{
            position: "relative", background: "#060A12",
            flex: "0 0 220px", display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            {/* Grid background */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(#0D0D14 1px, transparent 1px), linear-gradient(90deg, #0D0D14 1px, transparent 1px)",
              backgroundSize: "40px 40px", opacity: 0.6,
            }} />

            {/* Client avatar */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <Avatar nombre={profile.nombre} disc={profile.discKey} speaking={clientSpeaking} size={90} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{profile.nombre}</div>
                <div style={{ fontSize: 10, color: "#3A4A6A" }}>{profile.cargo} · {profile.industry.name}</div>
              </div>
              {clientSpeaking && (
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {[0,1,2].map(i => <div key={i} className="dot" style={{ width: 5, height: 5, borderRadius: "50%", background: disc.color }} />)}
                </div>
              )}
            </div>

            {/* Self view */}
            <div style={{
              position: "absolute", bottom: 12, right: 12,
              width: 64, height: 64, borderRadius: 10,
              background: "#1A2235", border: "2px solid #2E2E3E",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
            }}>👤</div>

            {/* DISC badge */}
            <div style={{
              position: "absolute", top: 10, left: 10,
              background: `${disc.color}22`, border: `1px solid ${disc.color}44`,
              borderRadius: 8, padding: "4px 10px",
              fontSize: 10, fontWeight: 700, color: disc.color,
            }}>
              {disc.emoji} DISC {profile.discKey}
            </div>

            {/* Turn counter */}
            <div style={{
              position: "absolute", top: 10, right: 10,
              background: "#111827", border: "1px solid #1E1E2E",
              borderRadius: 8, padding: "4px 10px",
              fontSize: 10, color: "#3A4A6A",
            }}>
              {turnCount} turnos
            </div>
          </div>

          {/* Chat */}
          <div ref={chatRef} style={{
            flex: 1, overflowY: "auto", padding: "12px 14px",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {messages.map((m, i) => (
              <div key={i} className="msg" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${disc.color}22`, border: `1px solid ${disc.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginRight: 8, alignSelf: "flex-end" }}>
                    {profile.nombre[0]}
                  </div>
                )}
                <div style={{
                  maxWidth: "78%",
                  background: m.role === "user" ? "linear-gradient(135deg, #0066FF, #0044CC)" : "#111827",
                  color: m.role === "user" ? "#fff" : "#C8D4E8",
                  padding: "10px 13px",
                  borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                  fontSize: 12.5, lineHeight: 1.7,
                  border: m.role === "assistant" ? `1px solid ${disc.color}22` : "none",
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${disc.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{profile.nombre[0]}</div>
                <div style={{ background: "#111827", border: `1px solid ${disc.color}33`, padding: "10px 14px", borderRadius: "4px 14px 14px 14px", display: "flex", gap: 4 }}>
                  {[0,1,2].map(i => <div key={i} className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: disc.color }} />)}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: "10px 14px 16px", borderTop: "1px solid #1A1A2E", background: "#0F1420" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Escribe tu mensaje..."
                rows={2}
                style={{
                  flex: 1, background: "#111827", border: "1px solid #1E1E2E",
                  borderRadius: 10, padding: "9px 12px", color: "#DDD",
                  fontSize: 12.5, resize: "none", lineHeight: 1.5,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button className="btn" onClick={sendMessage} disabled={loading || !input.trim()}
                  style={{
                    background: "#0066FF", border: "none", borderRadius: 9,
                    width: 38, height: 38, cursor: "pointer", fontSize: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: loading || !input.trim() ? 0.35 : 1, transition: "all .2s",
                  }}>↑</button>
                <button className="btn" onClick={startListening} title="Hablar"
                  style={{
                    background: listening ? "#10B981" : "#1E2D45", border: `2px solid ${listening ? "#10B981" : "#2E3D5A"}`,
                    borderRadius: 9, width: 38, height: 38, cursor: "pointer", fontSize: 16,
                    display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
                  }}>🎙️</button>
                <button className="btn" onClick={endCall} title="Terminar llamada y evaluar"
                  style={{
                    background: "#EF4444", border: "none", borderRadius: 9,
                    width: 38, height: 38, cursor: "pointer", fontSize: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .2s",
                  }}>⏹</button>
              </div>
            </div>
            <div style={{ fontSize: 9, color: "#162035", marginTop: 5, textAlign: "center" }}>
              Enter para enviar · ⏹ para terminar y evaluar
            </div>
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
            <button className="btn" onClick={() => { setPhase("lobby"); setSelectedDisc(null); setSelectedIndustry(null); setSelectedRol(null); }} style={{
              flex: 1, background: "linear-gradient(135deg, #0066FF, #0044CC)",
              border: "none", borderRadius: 12, padding: "14px",
              color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", transition: "all .2s",
              fontFamily: "'Syne', sans-serif",
            }}>Nueva simulacion →</button>
            <button className="btn" onClick={() => { setPhase("lobby"); setSelectedDisc(null); setSelectedIndustry(null); setSelectedRol(null); setProfile(null); setMessages([]); setEvaluation(null); setTurnCount(0); }} style={{
              width: 48, background: "#111827", border: "1px solid #1E1E2E",
              borderRadius: 12, cursor: "pointer", fontSize: 18, transition: "all .2s",
            }}>🏠</button>
          </div>
        </div>
      )}
    </div>
  );
}
