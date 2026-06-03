export async function POST(req) {
  try {
    const { password } = await req.json();
    const expected = (process.env.APP_PASSWORD || "").trim();
    if (expected && password === expected) {
      return Response.json({ ok: true });
    }
    return Response.json({ ok: false }, { status: 401 });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
