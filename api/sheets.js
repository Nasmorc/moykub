// === Мой Куб — API-мост к Google Sheets ===

export default async function handler(req, res) {
  const url = process.env.APPSCRIPT_URL;
  const secret = process.env.SHEETS_SECRET;

  try {
    // --- Чтение данных ---
    if (req.method === 'GET') {
      const action = req.query.action || 'getRent';
      const r = await fetch(`${url}?action=${encodeURIComponent(action)}&secret=${encodeURIComponent(secret)}`);
      const data = await r.json();
      return res.status(200).json(data);
    }

    // --- Запись или обновление ---
    const payload = { ...(typeof req.body === 'string' ? JSON.parse(req.body) : req.body), secret };
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    return res.status(200).json(data);
  } catch (e) {
    console.error('Ошибка прокси:', e);
    return res.status(500).json({ ok: false, error: 'proxy_error' });
  }
}

