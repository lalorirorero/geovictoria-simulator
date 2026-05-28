"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// DISC → ElevenLabs voice IDs by gender (premade voices, free plan)
const DISC_VOICES = {
  D: { m: "pNInz6obpgDQGcFmaJgB", f: "Xb7hH8MSUJpSbSDYk0k2" }, // Adam / Alice
  I: { m: "TX3LPaxmHKxFdv7VOQHJ", f: "cgSgspJ2msm6clMCkdW9" }, // Liam / Jessica
  S: { m: "nPczCjzI2devNBz1zQrb",  f: "EXAVITQu4vr4xnSDxMaL" }, // Brian / Sarah
  C: { m: "onwK4e9ZLuTAKqWW03F9", f: "XrExE9yKIg1WjnnlVkGX" }, // Daniel / Matilda
};

const NOMBRES_F = new Set(["Ana Morales", "Patricia Jimenez", "Monica Torres"]);

const DISC_PROFILES = {
  D: { name: "Dominante", color: "#EF4444", bg: "#FEF2F2", emoji: "🔴",
    description: "Directo, impaciente, orientado a resultados.",
    traits: ["Va directo al punto", "Impaciente con detalles", "Cuestiona todo", "Toma decisiones rapido"],
    tone: `Eres un gerente dominante y directo. Hablas poco y al grano. Si el vendedor divaga lo interrumpes. Tus respuestas son cortas (max 2 oraciones). Valoras tiempo sobre relaciones. Tus objeciones son desafiantes y directas.` },
  I: { name: "Influyente", color: "#F59E0B", bg: "#FFFBEB", emoji: "🟡",
    description: "Entusiasta, sociable, se distrae facil.",
    traits: ["Muy conversador", "Entusiasta y positivo", "Se distrae", "Decide por emocion"],
    tone: `Eres un gerente entusiasta y sociable. Hablas mucho, te desvias a temas personales, haces bromas. Tus respuestas son 2-3 oraciones con energia. Tus objeciones son vagas y emocionales.` },
  S: { name: "Estable", color: "#10B981", bg: "#ECFDF5", emoji: "🟢",
    description: "Cauto, leal, preocupado por su equipo.",
    traits: ["Muy cauto al decidir", "Preocupado por el equipo", "Evita conflictos", "Necesita seguridad"],
    tone: `Eres un gerente cauto y empatico. Hablas suave, preguntas mucho por como afectara al equipo. Tus respuestas son 2-3 oraciones reflexivas. Tus objeciones son suaves pero persistentes.` },
  C: { name: "Concienzudo", color: "#6366F1", bg: "#EEF2FF", emoji: "🔵",
    description: "Analitico, perfeccionista, pide datos.",
    traits: ["Muy analitico", "Pide datos y evidencia", "Perfeccionista", "Proceso largo"],
    tone: `Eres un gerente analitico y detallista. Haces preguntas tecnicas especificas. Pides datos, casos de estudio, certificaciones. Tus respuestas son 2-4 oraciones con preguntas de vuelta.` },
};

const INDUSTRIES = [
  { name: "Construccion", size: "350 trabajadores", context: "4 faenas activas, turnos rotativos 7x7, marcacion en papel", pain: "Errores en planilla por marcaciones manuales" },
  { name: "Retail", size: "200 trabajadores", context: "12 sucursales, horario por turno, sistema antiguo instalado", pain: "Supervisores pierden tiempo consolidando asistencia" },
  { name: "Salud", size: "180 trabajadores", context: "Clinica privada, turnos de guardia 24hs, alta rotacion", pain: "Control de horas extra sin sistema automatico" },
  { name: "Logistica", size: "420 trabajadores", context: "Flota de repartidores, trabajo en terreno, multiples bodegas", pain: "Imposible controlar asistencia de personal disperso" },
  { name: "Mineria", size: "600 trabajadores", context: "Faena remota, turnos 14x14, conectividad limitada", pain: "Sistema offline que no sincroniza con ERP" },
  { name: "Manufactura", size: "280 trabajadores", context: "Planta productiva, 3 turnos diarios, sindicato activo", pain: "Conflictos por errores en liquidaciones de sueldo" },
];

const NOMBRES = ["Carlos Vega", "Ana Morales", "Roberto Silva", "Patricia Jimenez", "Diego Fuentes", "Monica Torres"];
const CARGOS = ["Gerente de RRHH", "Director de Operaciones", "Gerente Administrativo", "Subgerente de Personas", "Jefe de Administracion"];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function buildSystem(discKey, industry, nombre, cargo) {
  const disc = DISC_PROFILES[discKey];
  return `Eres ${nombre}, ${cargo} de una empresa de ${industry.name} con ${industry.size}.
Contexto: ${industry.context}.
Dolor probable: ${industry.pain}.

PERSONALIDAD: ${disc.tone}

REGLAS ABSOLUTAS:
- Habla SIEMPRE en primera persona como ${nombre}
- Responde en 2-3 oraciones MAXIMO. Nunca mas.
- Reacciona segun tu perfil DISC en cada respuesta
- Puedes plantear objeciones: precio alto, ya tienen sistema, necesitas aprobacion, no es el momento
- NO rompas el personaje nunca
- Responde solo como cliente, nunca como IA
- Primera respuesta: bienvenida breve segun tu personalidad`;
}

function ScoreBadge({ score }) {
  const color = score >= 7 ? "#10B981" : score >= 4 ? "#F59E0B" : "#EF4444";
  return (
    <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${color}22`, border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color, fontFamily: "'Syne', sans-serif", flexShrink: 0 }}>
      {score}
    </div>
  );
}

const ETAPAS = [
  { key: "ufc", label: "Rapport y UFC" },
  { key: "modelo", label: "Modelo Operacional" },
  { key: "pain", label: "Identificacion del Dolor" },
  { key: "budget", label: "Budget" },
  { key: "decision", label: "Proceso de Decision" },
];

export default function Home() {
  const [phase, setPhase] = useState("lobby");
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientSpeaking, setClientSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [statusText, setStatusText] = useState("");
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const isListeningRef = useRef(false);
  const micStreamRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // ── SPEECH RECOGNITION SETUP ──────────────────────────────────
  const setupRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.lang = "es-CL";
    rec.continuous = false;
    rec.interimResults = false;
    return rec;
  }, []);

  // ── TTS (ElevenLabs) ──────────────────────────────────────────
  const speak = useCallback(async (text, discKey, nombre) => {
    const gender = NOMBRES_F.has(nombre) ? "f" : "m";
    const voiceId = DISC_VOICES[discKey]?.[gender];
    setClientSpeaking(true);
    setStatusText("Cliente hablando...");
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId }),
      });
      if (!res.ok) throw new Error("tts failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      await new Promise(resolve => {
        audio.onended = resolve;
        audio.onerror = resolve;
        audio.play();
      });
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("TTS error:", e);
    }
    setClientSpeaking(false);
    setStatusText("");
  }, []);

  // ── CLAUDE CHAT ────────────────────────────────────────────────
  const sendToClient = useCallback(async (userText, currentMessages, prof) => {
    setLoading(true);
    const system = buildSystem(prof.discKey, prof.industry, prof.nombre, prof.cargo);
    const apiMessages = [...currentMessages, { role: "user", content: userText }].map(m => ({
      role: m.role, content: m.content,
    }));
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages, system }),
    });
    const data = await res.json();
    const reply = data.text || "";
    setLoading(false);
    return reply;
  }, []);

  // ── START RECOGNITION ─────────────────────────────────────────
  const startListening = useCallback((prof, currentMessages) => {
    if (isListeningRef.current) return;
    const rec = setupRecognition();
    if (!rec) { setStatusText("Navegador no soporta microfono"); return; }
    recognitionRef.current = rec;
    isListeningRef.current = true;
    setUserSpeaking(true);
    setStatusText("Escuchando... (habla ahora)");

    rec.onresult = async (e) => {
      const userText = e.results[0][0].transcript;
      isListeningRef.current = false;
      setUserSpeaking(false);
      setStatusText("Procesando...");

      const userMsg = { role: "user", content: userText };
      const newMessages = [...currentMessages, userMsg];
      setMessages(newMessages);
      setTranscript(t => [...t, `EJECUTIVO: ${userText}`]);

      const reply = await sendToClient(userText, currentMessages, prof);
      const assistantMsg = { role: "assistant", content: reply };
      setMessages([...newMessages, assistantMsg]);
      setTranscript(t => [...t, `${prof.nombre}: ${reply}`]);

      await speak(reply, prof.discKey, prof.nombre);
    };

    rec.onerror = () => {
      isListeningRef.current = false;
      setUserSpeaking(false);
      setStatusText("Error de microfono. Intenta de nuevo.");
    };

    rec.onend = () => {
      isListeningRef.current = false;
      if (userSpeaking) setUserSpeaking(false);
    };

    rec.start();
  }, [setupRecognition, sendToClient, speak, userSpeaking]);

  // ── BEGIN CALL ────────────────────────────────────────────────
  const beginCall = async (prof) => {
    setPhase("call");
    setLoading(true);
    setStatusText("Conectando...");
    try {
      micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setStatusText("Sin acceso al microfono");
    }
    const system = buildSystem(prof.discKey, prof.industry, prof.nombre, prof.cargo);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hola, buenos dias. Gracias por tomar la llamada." }],
        system,
      }),
    });
    const data = await res.json();
    const opening = data.text || "";
    const msg = { role: "assistant", content: opening };
    setMessages([msg]);
    setTranscript([`${prof.nombre}: ${opening}`]);
    setLoading(false);
    await speak(opening, prof.discKey, prof.nombre);
  };

  // ── EVALUATE ─────────────────────────────────────────────────
  const endCall = async () => {
    if (audioRef.current) audioRef.current.pause();
    if (recognitionRef.current) recognitionRef.current.abort();
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    setPhase("evaluating");
    const fullTranscript = transcript.join("\n\n");
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: fullTranscript, discKey: profile.discKey, industryName: profile.industry.name }),
    });
    const ev = await res.json();
    setEvaluation(ev);
    setPhase("results");
  };

  const startSim = () => {
    const p = {
      discKey: rand(["D","I","S","C"]),
      industry: rand(INDUSTRIES),
      nombre: rand(NOMBRES),
      cargo: rand(CARGOS),
    };
    setProfile(p);
    setMessages([]);
    setTranscript([]);
    setEvaluation(null);
    setPhase("briefing");
  };

  const disc = profile ? DISC_PROFILES[profile.discKey] : null;

  const styles = {
    page: { minHeight: "100vh", background: "#0A0A0F", fontFamily: "'DM Sans', sans-serif", color: "#E8E8F0", display: "flex", flexDirection: "column" },
    syne: { fontFamily: "'Syne', sans-serif" },
  };

  // ── LOBBY ─────────────────────────────────────────────────────
  if (phase === "lobby") return (
    <div style={{ ...styles.page, alignItems: "center", justifyContent: "center", padding: "24px 20px", gap: 28 }}>
      <style>{`
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(1.35);opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes blink { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
        .btn:hover{filter:brightness(1.1);transform:translateY(-1px)} .btn:active{transform:none}
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🎙️</div>
        <div style={{ ...styles.syne, fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Simulador de Ventas</div>
        <div style={{ fontSize: 12, color: "#555", maxWidth: 300, lineHeight: 1.7 }}>
          Habla con un cliente simulado por IA. Voz real, perfil DISC aleatorio, evaluacion Sandler al terminar.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 360 }}>
        {Object.entries(DISC_PROFILES).map(([k,v]) => (
          <div key={k} style={{ padding: "6px 14px", borderRadius: 20, background: `${v.color}18`, border: `1px solid ${v.color}44`, fontSize: 11, fontWeight: 700, color: v.color }}>
            {v.emoji} {k} · {v.name}
          </div>
        ))}
      </div>
      <div style={{ background: "#13131A", border: "1px solid #1E1E2E", borderRadius: 12, padding: "14px 16px", maxWidth: 340, width: "100%" }}>
        <div style={{ fontSize: 11, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>Como funciona</div>
        {["Perfil DISC y empresa asignados al azar", "El cliente responde con VOZ real (ElevenLabs)", "Tu hablas por microfono — el cliente escucha", "Al terminar: evaluacion Sandler con puntaje"].map(t => (
          <div key={t} style={{ fontSize: 12, color: "#666", display: "flex", gap: 8, marginBottom: 5 }}>
            <span style={{ color: "#00C0A0" }}>✓</span>{t}
          </div>
        ))}
      </div>
      <button className="btn" onClick={startSim} style={{ background: "linear-gradient(135deg,#00C0A0,#007A66)", border: "none", borderRadius: 12, padding: "16px 40px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all .2s", ...styles.syne }}>
        Comenzar →
      </button>
    </div>
  );

  // ── BRIEFING ─────────────────────────────────────────────────
  if (phase === "briefing" && disc) return (
    <div style={{ ...styles.page, padding: "20px 16px", gap: 14, maxWidth: 480, margin: "0 auto", width: "100%" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } .btn:hover{filter:brightness(1.1);transform:translateY(-1px)}`}</style>
      <div style={{ textAlign: "center", paddingTop: 8 }}>
        <div style={{ fontSize: 11, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 6 }}>Tu prospecto de hoy</div>
        <div style={{ ...styles.syne, fontSize: 22, fontWeight: 800 }}>{profile.nombre}</div>
        <div style={{ fontSize: 12, color: "#666" }}>{profile.cargo} · {profile.industry.name}</div>
      </div>
      <div style={{ background: `${disc.color}12`, border: `1px solid ${disc.color}33`, borderRadius: 14, padding: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${disc.color}22`, border: `1px solid ${disc.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{disc.emoji}</div>
          <div>
            <div style={{ ...styles.syne, fontSize: 13, fontWeight: 800, color: disc.color }}>Perfil DISC: {profile.discKey} — {disc.name}</div>
            <div style={{ fontSize: 11, color: "#666" }}>{disc.description}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {disc.traits.map(t => <span key={t} style={{ padding: "3px 10px", borderRadius: 20, background: `${disc.color}18`, border: `1px solid ${disc.color}33`, fontSize: 10, color: disc.color, fontWeight: 600 }}>{t}</span>)}
        </div>
      </div>
      <div style={{ background: "#13131A", border: "1px solid #1E1E2E", borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ fontSize: 11, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>Contexto operacional</div>
        {[["Empresa", profile.industry.name], ["Dotacion", profile.industry.size], ["Operacion", profile.industry.context], ["Dolor probable", profile.industry.pain]].map(([k,v]) => (
          <div key={k} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12 }}>
            <span style={{ color: "#444", minWidth: 80 }}>{k}:</span>
            <span style={{ color: "#AAA" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ background: "#0A1A14", border: "1px solid #0D2018", borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ fontSize: 10, color: "#00C0A0", fontWeight: 700, marginBottom: 3 }}>💡 RECUERDA</div>
        <div style={{ fontSize: 11, color: "#5A8A70", lineHeight: 1.6 }}>
          UFC → Modelo Operacional → Pain → Budget → Decision. Adapta tu ritmo al perfil {profile.discKey}.
        </div>
      </div>
      <button className="btn" onClick={() => beginCall(profile)} style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)", border: "none", borderRadius: 12, padding: "16px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all .2s", ...styles.syne, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} /> Iniciar Videollamada con Voz
      </button>
    </div>
  );

  // ── CALL ──────────────────────────────────────────────────────
  if (phase === "call" && disc) return (
    <div style={{ ...styles.page, height: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(1.35);opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes blink { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
        .dot{animation:blink 1.4s ease infinite} .dot:nth-child(2){animation-delay:.2s} .dot:nth-child(3){animation-delay:.4s}
        .msg{animation:fadeUp .25s ease}
        .mic-btn:hover{filter:brightness(1.1)} .mic-btn:active{transform:scale(.95)}
      `}</style>

      {/* VIDEO AREA */}
      <div style={{ position: "relative", background: "#050508", flex: "0 0 200px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#0D0D14 1px,transparent 1px),linear-gradient(90deg,#0D0D14 1px,transparent 1px)", backgroundSize: "40px 40px", opacity: .5 }} />

        {/* Client avatar */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative", width: 80, height: 80 }}>
            {clientSpeaking && <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `3px solid ${disc.color}`, animation: "pulse-ring 1.5s ease-out infinite" }} />}
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg,${disc.color}33,${disc.color}66)`, border: `3px solid ${disc.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: disc.color, boxShadow: clientSpeaking ? `0 0 20px ${disc.color}55` : "none", transition: "box-shadow .3s" }}>
              {profile.nombre.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>{profile.nombre}</div>
            <div style={{ fontSize: 10, color: "#555" }}>{profile.cargo}</div>
          </div>
          {(clientSpeaking || loading) && (
            <div style={{ display: "flex", gap: 4 }}>
              {[0,1,2].map(i => <div key={i} className="dot" style={{ width: 5, height: 5, borderRadius: "50%", background: disc.color }} />)}
            </div>
          )}
        </div>

        {/* Self cam */}
        <div style={{ position: "absolute", bottom: 10, right: 10, width: 58, height: 58, borderRadius: 10, background: userSpeaking ? "#0D2018" : "#13131A", border: `2px solid ${userSpeaking ? "#00C0A0" : "#1E1E2E"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "all .3s" }}>
          {userSpeaking ? "🎙️" : "👤"}
        </div>

        {/* DISC badge */}
        <div style={{ position: "absolute", top: 8, left: 8, background: `${disc.color}22`, border: `1px solid ${disc.color}44`, borderRadius: 8, padding: "3px 9px", fontSize: 10, fontWeight: 700, color: disc.color }}>
          {disc.emoji} DISC {profile.discKey}
        </div>

        {/* Status */}
        {statusText && (
          <div style={{ position: "absolute", bottom: 10, left: 10, background: "#13131A", border: "1px solid #1E1E2E", borderRadius: 8, padding: "3px 9px", fontSize: 10, color: "#888" }}>
            {statusText}
          </div>
        )}
      </div>

      {/* CHAT TRANSCRIPT */}
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} className="msg" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${disc.color}22`, border: `1px solid ${disc.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0, marginRight: 7, alignSelf: "flex-end", fontWeight: 700, color: disc.color }}>
                {profile.nombre[0]}
              </div>
            )}
            <div style={{ maxWidth: "78%", background: m.role === "user" ? "linear-gradient(135deg,#00C0A0,#007A66)" : "#13131A", color: m.role === "user" ? "#fff" : "#CCC", padding: "9px 13px", borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", fontSize: 12.5, lineHeight: 1.7, border: m.role === "assistant" ? `1px solid ${disc.color}22` : "none" }}>
              {m.content}
            </div>
          </div>
        ))}
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: "center", color: "#333", fontSize: 12, marginTop: 20 }}>
            Presiona el microfono para hablar
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div style={{ padding: "12px 16px 20px", borderTop: "1px solid #1A1A2E", background: "#0D0D14", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* MIC BUTTON */}
        <button className="mic-btn" onClick={() => !clientSpeaking && !loading && startListening(profile, messages)}
          disabled={clientSpeaking || loading || userSpeaking}
          style={{
            background: userSpeaking ? "linear-gradient(135deg,#EF4444,#DC2626)" : clientSpeaking || loading ? "#1A1A2E" : "linear-gradient(135deg,#00C0A0,#007A66)",
            border: "none", borderRadius: 14, padding: "18px",
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: clientSpeaking || loading ? "not-allowed" : "pointer",
            transition: "all .2s", fontFamily: "'Syne',sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            opacity: clientSpeaking || loading ? 0.5 : 1,
            boxShadow: userSpeaking ? "0 0 20px #EF444444" : clientSpeaking ? "none" : "0 0 20px #00C0A033",
          }}>
          <span style={{ fontSize: 22 }}>{userSpeaking ? "🔴" : clientSpeaking ? "🔇" : "🎙️"}</span>
          {userSpeaking ? "Escuchando... (habla ahora)" : clientSpeaking ? "Cliente hablando..." : loading ? "Procesando..." : "Presiona para hablar"}
        </button>

        {/* END CALL */}
        <button onClick={endCall} style={{ background: "transparent", border: "1px solid #EF444433", borderRadius: 10, padding: "10px", color: "#EF4444", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          ⏹ Terminar llamada y evaluar
        </button>
      </div>
    </div>
  );

  // ── EVALUATING ────────────────────────────────────────────────
  if (phase === "evaluating") return (
    <div style={{ ...styles.page, alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } @keyframes blink{0%,80%,100%{opacity:.2}40%{opacity:1}} .dot{animation:blink 1.4s ease infinite} .dot:nth-child(2){animation-delay:.2s} .dot:nth-child(3){animation-delay:.4s}`}</style>
      <div style={{ fontSize: 44 }}>🧠</div>
      <div style={{ ...styles.syne, fontSize: 18, fontWeight: 800 }}>Evaluando simulacion...</div>
      <div style={{ fontSize: 12, color: "#555" }}>El coach Sandler esta analizando tu conversacion</div>
      <div style={{ display: "flex", gap: 6 }}>{[0,1,2].map(i=><div key={i} className="dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#00C0A0" }}/>)}</div>
    </div>
  );

  // ── RESULTS ───────────────────────────────────────────────────
  if (phase === "results" && evaluation && disc) {
    const allScores = [...ETAPAS.map(e => evaluation[e.key]?.score || 0), evaluation.disc_adaptation?.score || 0];
    const avg = Math.round(allScores.reduce((a,b)=>a+b,0) / allScores.length);
    const avgColor = avg >= 7 ? "#10B981" : avg >= 4 ? "#F59E0B" : "#EF4444";
    return (
      <div style={{ ...styles.page, padding: "16px 14px", gap: 10 }}>
        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } .btn:hover{filter:brightness(1.1);transform:translateY(-1px)}`}</style>
        <div style={{ textAlign: "center", paddingTop: 8, marginBottom: 6 }}>
          <div style={{ ...styles.syne, fontSize: 20, fontWeight: 800, marginBottom: 3 }}>Evaluacion de la simulacion</div>
          <div style={{ fontSize: 11, color: "#555" }}>{profile.nombre} · DISC {profile.discKey} · {profile.industry.name}</div>
        </div>

        {/* Overall */}
        <div style={{ background: `${avgColor}12`, border: `1px solid ${avgColor}33`, borderRadius: 14, padding: "14px", textAlign: "center" }}>
          <div style={{ fontSize: 40, ...styles.syne, fontWeight: 800, color: avgColor }}>{avg}<span style={{ fontSize: 16, color: "#555" }}>/10</span></div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>Puntaje general</div>
        </div>

        {/* Etapas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ETAPAS.map(etapa => {
            const ev = evaluation[etapa.key];
            if (!ev) return null;
            return (
              <div key={etapa.key} style={{ background: "#13131A", border: "1px solid #1E1E2E", borderRadius: 12, padding: "11px 13px", display: "flex", alignItems: "center", gap: 12 }}>
                <ScoreBadge score={ev.score} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{etapa.label}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{ev.comment}</div>
                </div>
              </div>
            );
          })}
          {evaluation.disc_adaptation && (
            <div style={{ background: `${disc.color}10`, border: `1px solid ${disc.color}33`, borderRadius: 12, padding: "11px 13px", display: "flex", alignItems: "center", gap: 12 }}>
              <ScoreBadge score={evaluation.disc_adaptation.score} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, color: disc.color }}>Adaptacion DISC {profile.discKey}</div>
                <div style={{ fontSize: 11, color: "#666" }}>{evaluation.disc_adaptation.comment}</div>
              </div>
            </div>
          )}
        </div>

        {/* Coach feedback */}
        {evaluation.general && (
          <div style={{ background: "#0A1A14", border: "1px solid #0D2018", borderRadius: 12, padding: "13px 15px" }}>
            <div style={{ fontSize: 10, color: "#00C0A0", fontWeight: 700, marginBottom: 5 }}>💬 FEEDBACK DEL COACH</div>
            <div style={{ fontSize: 12, color: "#8AB89A", lineHeight: 1.7 }}>{evaluation.general}</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={startSim} style={{ flex: 1, background: "linear-gradient(135deg,#00C0A0,#007A66)", border: "none", borderRadius: 12, padding: "14px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .2s", ...styles.syne }}>
            Nueva simulacion →
          </button>
          <button className="btn" onClick={() => setPhase("lobby")} style={{ width: 48, background: "#13131A", border: "1px solid #1E1E2E", borderRadius: 12, cursor: "pointer", fontSize: 18, transition: "all .2s" }}>
            🏠
          </button>
        </div>
      </div>
    );
  }

  return null;
}
