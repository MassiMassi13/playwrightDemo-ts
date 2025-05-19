import fs from "fs";
import path from "path";

// Chemins
const publicDir = path.resolve(__dirname, "public");
const summaryPath = path.resolve(__dirname, "allure-results", "summary.json");
const outputHtmlPath = path.join(publicDir, "index.html");

// Créer le dossier public s'il n'existe pas
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Badge GitHub Actions
const owner = process.env.GITHUB_REPOSITORY?.split("/")[0] || "user";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "repo";
const badgeUrl = `https://github.com/${owner}/${repo}/actions/workflows/ci.yml/badge.svg`;

// Lire les données du résumé Allure si disponible
let statsHtml = "<p>Résumé indisponible.</p>";
try {
  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
  statsHtml = `
    <ul>
      <li>✅ Tests passés : ${summary.passed}</li>
      <li>❌ Tests échoués : ${summary.failed}</li>
      <li>⏱️ Durée : ${summary.time.duration} ms</li>
    </ul>
  `;
} catch {
  console.warn("⚠️ Fichier summary.json introuvable ou invalide.");
}

// HTML final
const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Rapport Playwright</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #f9f9f9; }
    h1 { color: #2c3e50; }
    a { text-decoration: none; color: #007acc; }
    .badge { margin-bottom: 1rem; }
    .card { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); max-width: 500px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <img src="${badgeUrl}" alt="Build Status">
    </div>
    <h1>Rapport de test Playwright</h1>
    ${statsHtml}
    <p><a href="./allure-reports/report/index.html">📊 Voir le rapport Allure complet</a></p>
  </div>
</body>
</html>
`;

// Écrire dans le fichier
fs.writeFileSync(outputHtmlPath, html, "utf8");
console.log("✅ Fichier index.html généré avec succès dans public/");
