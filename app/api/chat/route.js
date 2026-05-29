export async function POST(req) {
  try {
    const { messages, system, maxTokens = 300, model = "claude-haiku-4-5-20251001" } = await req.json();
    const key = (process.env.ANTHROPIC_API_KEY || "").trim();
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
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
