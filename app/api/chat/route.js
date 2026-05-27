export async function POST(req) {
  try {
    const { messages, system } = await req.json();
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": (process.env.ANTHROPIC_API_KEY || "").trim(),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system,
        messages,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Anthropic API error:", res.status, err);
      return Response.json({ text: "", error: `Anthropic ${res.status}` }, { status: 500 });
    }
    const data = await res.json();
    const text = data.content?.map(b => b.text || "").join("") || "";
    return Response.json({ text });
  } catch (e) {
    console.error("chat route error:", e);
    return Response.json({ text: "", error: String(e) }, { status: 500 });
  }
}
