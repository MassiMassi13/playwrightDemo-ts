// generate-index.ts

const fs = require("fs");
const path = require("path");

const reportPaths = {
  latest: "allure-reports/latest/index.html",
  report: "allure-reports/report/index.html"
};

const outputDir = "public";
const outputFile = path.join(outputDir, "index.html");

const repo = process.env.GITHUB_REPOSITORY || "mon-utilisateur/mon-repo";
const [owner, repoName] = repo.split("/");

const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Playwright + Allure Dashboard</title>
  <style>
    body {
      font-family: sans-serif;
      margin: 2rem;
      background: #f9f9f9;
    }
    h1 {
      color: #333;
    }
    .badge {
      margin: 1rem 0;
    }
    a {
      color: #1a73e8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <h1>📊 Dashboard Playwright & Allure</h1>
  <div class="badge">
    <img src="https://github.com/${owner}/${repoName}/actions/workflows/ci.yml/badge.svg" alt="Statut CI">
  </div>
  <p><a href="${reportPaths.latest}">🏠 Page d’accueil (last)</a></p>
  <p><a href="${reportPaths.report}">📈 Rapport Allure (report)</a></p>
</body>
</html>
`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, htmlContent);

console.log(`✅ Fichier index.html généré à : ${outputFile}`);
