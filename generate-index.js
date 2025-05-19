const fs = require("fs");
const path = require("path");

const publicDir = path.resolve(__dirname, "public");
const summaryPath = path.resolve(__dirname, "allure-results", "summary.json");
const outputHtmlPath = path.join(publicDir, "index.html");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const repoInfo = process.env.GITHUB_REPOSITORY || "utilisateur/repo";
const [owner, repo] = repoInfo.split("/");
const badgeUrl = `https://github.com/${owner}/${repo}/actions/workflows/ci.yml/badge.svg`;

let statsHtml = "<p>Aucun résumé de test disponible.</p>";
try {
  const raw = fs.readFileSync(summaryPath, "utf-8");
  const summary = JSON.parse(raw);
  statsHtml = `
    <ul>
      <li>✅ Réussis : ${summary.passed}</li>
      <li>❌ Échoués : ${summary.failed}</li>
      <li>🟡 Ignorés : ${summary.skipped}</li>
      <li>⏱️ Durée : ${summary.time.duration} ms</li>
    </ul>`;
} catch (e) {
  console.log("⚠️ Fichier summary.json non trouvé ou invalide.");
}

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport Playwright</title>
  <style>
    body { font-family: sans-serif; background: #f5f5f5; padding: 2rem; }
    .card { background: white; padding: 2rem; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #333; }
    a { color: #0066cc; text-decoration: none; }
    img { margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="card">
    <img src="${badgeUrl}" alt="CI Badge">
    <h1>🧪 Rapport de Tests</h1>
    ${statsHtml}
    <p><a href="./allure-reports/report/index.html">📊 Voir le rapport Allure</a></p>
  </div>
</body>
</html>
`;

fs.writeFileSync(outputHtmlPath, html, "utf-8");
console.log("✅ index.html généré dans le dossier public/");
