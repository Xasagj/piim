import { getStore } from "@netlify/blobs";

const QUESTIONS = 15;
const MAX_ROWS = 100;
const KEY = "board";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const cmp = (a, b) => b.score - a.score || a.time - b.time;

function cleanName(raw) {
  if (typeof raw !== "string") return null;
  const n = raw.replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 16);
  return n.length >= 2 ? n : null;
}

export default async (req) => {
  const store = getStore("leaderboard");

  if (req.method === "GET") {
    const board = (await store.get(KEY, { type: "json" })) || [];
    return json(board.sort(cmp).slice(0, 20));
  }

  if (req.method === "POST") {
    let body;
    try {
      const text = await req.text();
      if (text.length > 2000) return json({ error: "too large" }, 413);
      body = JSON.parse(text);
    } catch {
      return json({ error: "bad json" }, 400);
    }

    const name = cleanName(body.name);
    const score = Number.isInteger(body.score) ? body.score : NaN;
    const time = Number.isFinite(body.time) ? Math.round(body.time) : NaN;

    if (!name) return json({ error: "bad name" }, 400);
    if (!(score >= 0 && score <= QUESTIONS)) return json({ error: "bad score" }, 400);
    if (!(time >= 3000 && time <= 3 * 3600 * 1000)) return json({ error: "bad time" }, 400);

    const board = (await store.get(KEY, { type: "json" })) || [];
    const entry = { name, score, time };
    const existing = board.find((r) => r.name.toLowerCase() === name.toLowerCase());
    if (!existing) board.push(entry);
    else if (cmp(entry, existing) < 0) Object.assign(existing, entry);

    board.sort(cmp);
    await store.setJSON(KEY, board.slice(0, MAX_ROWS));
    return json({ ok: true });
  }

  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/api/leaderboard" };
