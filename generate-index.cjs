import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repo info (utile pour le badge)
const repo = process.env.GITHUB_REPOSITORY || "demo/demo";
const [owner, name] = repo.split("/");
const branch = "main";

// 📍 Corrigé : chemin vers le bon fichier summary.json généré par Allure
const summaryFile = path.join(__dirname, "docs", "allure-reports", "report", "widgets", "summary.json");
let summary = null;

try {
  if (fs.existsSync(summaryFile)) {
    const raw = fs.readFileSync(summaryFile, "utf-8");
    summary = JSON.parse(raw);
  }
} catch (error) {
  console.warn("⚠️ Impossible de lire summary.json :", error.message);
}

// Données de test
const passed = summary?.statistic?.passed ?? 0;
const failed = summary?.statistic?.failed ?? 0;
const skipped = summary?.statistic?.skipped ?? 0;
const total = passed + failed + skipped;

// HTML
const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rapport de Tests Playwright</title>
  <style>
    body {
      font-family: sans-serif;
      background: #f4f4f4;
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      max-width: 600px;
      width: 100%;
      text-align: center;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .badge {
      display: inline-block;
      margin-bottom: 1rem;
    }
    .stats {
      font-size: 1.2rem;
      margin: 1rem 0;
    }
    .passed { color: green; }
    .failed { color: red; }
    .skipped { color: orange; }
    a {
      display: inline-block;
      margin-top: 1rem;
      text-decoration: none;
      font-weight: bold;
      color: #007acc;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">
      <img src="https://img.shields.io/github/actions/workflow/status/${owner}/${name}/tests.yml?branch=${branch}&label=CI%20Status" alt="CI Status" />
    </div>
    <h1>🧪 Rapport de Tests</h1>
    ${
      total > 0
        ? `<div class="stats">
            ✅ <span class="passed">${passed}</span> |
            ❌ <span class="failed">${failed}</span> |
            ⏭️ <span class="skipped">${skipped}</span><br/>
            📊 Total: ${total}
          </div>`
        : `<p>Aucun résumé de test disponible.</p>`
    }
    <a href="allure-reports/report/index.html">📊 Voir le rapport Allure</a>
  </div>
</body>
</html>`;

// Génération de l'index dans ./docs/index.html (pour GitHub Pages)
const outputPath = path.join(__dirname, "docs", "index.html");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, "utf-8");

console.log("✅ index.html généré avec succès !");
