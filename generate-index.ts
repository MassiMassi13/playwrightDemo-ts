const fs = require('fs');
const path = require('path');

// Infos statiques
const allureLatestPath = './allure-reports/latest/index.html';
const allureReportPath = './allure-reports/report/index.html';
const outputPath = './public/index.html';

// Données dynamiques depuis GitHub Actions
const repoOwner = process.env.GITHUB_REPOSITORY_OWNER || 'utilisateur';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'nom-du-repo';
const badgeUrl = `https://github.com/${repoOwner}/${repoName}/actions/workflows/ci.yml/badge.svg`;
const reportUrl = `https://${repoOwner}.github.io/${repoName}/allure-reports/report/index.html`;
const homeUrl = `https://${repoOwner}.github.io/${repoName}/allure-reports/latest/index.html`;

// Lecture du résumé Allure si dispo
let testStats = '';
const summaryPath = './allure-results/summary.json';

if (fs.existsSync(summaryPath)) {
  try {
    const summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
    const { total, passed, failed, broken, skipped } = summaryData.statistic;
    testStats = `
      <ul>
        <li>✅ Tests Passés : <strong>${passed}</strong></li>
        <li>❌ Tests Échoués : <strong>${failed}</strong></li>
        <li>⚠️ Tests Cassés : <strong>${broken}</strong></li>
        <li>⏭️ Tests Ignorés : <strong>${skipped}</strong></li>
        <li>📊 Total : <strong>${total}</strong></li>
      </ul>
    `;
  } catch (err) {
    testStats = '<p>❌ Impossible de lire summary.json</p>';
  }
} else {
  testStats = '<p>ℹ️ Aucune donnée de test disponible</p>';
}

// HTML final
const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Dashboard de Tests - Playwright</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #f9f9f9; color: #333; }
    h1 { color: #444; }
    .badge img { height: 30px; }
    .stats ul { list-style: none; padding-left: 0; }
    .stats li { margin: 0.3em 0; }
    .links a { display: inline-block; margin: 1em 1em 0 0; padding: 0.7em 1.2em; background: #007acc; color: white; text-decoration: none; border-radius: 6px; }
    .links a:hover { background: #005f99; }
  </style>
</head>
<body>
  <div class="badge">
    <img src="${badgeUrl}" alt="Statut GitHub Actions" />
  </div>
  <h1>📋 Tableau de bord des tests Playwright</h1>
  <section class="stats">
    <h2>📊 Statistiques des tests</h2>
    ${testStats}
  </section>
  <section class="links">
    <h2>🔗 Liens utiles</h2>
    <a href="${reportUrl}" target="_blank">Voir le rapport Allure</a>
    <a href="${homeUrl}" target="_blank">Voir la dernière version</a>
  </section>
</body>
</html>
`;

// Génération du dossier public + fichier index.html
const publicDir = path.dirname(outputPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(outputPath, htmlContent, 'utf-8');
console.log(`✅ Page index.html générée dans ${outputPath}`);
