export async function POST(req) {
  try {
    const { transcript, discKey, industryName } = await req.json();
    const system = `Eres un coach experto en ventas Sandler. Analiza esta simulacion de venta de GeoVictoria.
PERFIL DISC: ${discKey}
INDUSTRIA: ${industryName}

TRANSCRIPCION:
${transcript}

Responde SOLO en JSON:
{
  "ufc": {"score": 0-10, "comment": "1 linea"},
  "modelo": {"score": 0-10, "comment": "1 linea"},
  "pain": {"score": 0-10, "comment": "1 linea"},
  "budget": {"score": 0-10, "comment": "1 linea"},
  "decision": {"score": 0-10, "comment": "1 linea"},
  "disc_adaptation": {"score": 0-10, "comment": "1 linea"},
  "general": "conclusion de 2 lineas"
}`;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        system,
        messages: [{ role: "user", content: "Evalua." }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Anthropic evaluate error:", res.status, err);
      return Response.json({ error: `Anthropic ${res.status}` }, { status: 500 });
    }
    const data = await res.json();
    const raw = data.content?.map(b => b.text || "").join("") || "{}";
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      return Response.json(JSON.parse(clean));
    } catch {
      return Response.json({ error: raw });
    }
  } catch (e) {
    console.error("evaluate route error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
