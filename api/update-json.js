import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // Получаем актуальные данные с уже готового API
    const r = await fetch(`${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""}/api/sheets?action=getRent&secret=MYKUB_SECRET_2025`);
    const j = await r.json();

    // Путь к data.json
    const filePath = path.join(process.cwd(), "data.json");

    // Сохраняем новые данные
    fs.writeFileSync(filePath, JSON.stringify(j.data, null, 2));

    res.status(200).json({ ok: true, message: "✅ data.json обновлён" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}

