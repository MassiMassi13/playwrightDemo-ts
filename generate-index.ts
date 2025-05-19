import fs from "fs";
import path from "path";

// 🔍 Chemin vers le fichier summary.json du rapport Allure
const summaryPath = path.join("allure-reports", "report", "widgets", "summary.json");

if (!fs.existsSync(summaryPath)) {
  console.error("❌ summary.json non trouvé :", summaryPath);
  process.exit(1);
}

// 📦 Lecture et parsing du résumé Allure
const summaryRaw = fs.readFileSync(summaryPath, "utf-8");
const summary = JSON.parse(summaryRaw);

const {
  time: { duration },
  statistic: { total, passed, failed }
} = summary;

const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
};

// 🔧 HTML généré
const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport Tests Playwright</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-800 p-10">
  <h1 class="text-3xl font-bold text-purple-700 mb-6">✅ Résumé des Tests</h1>
  <ul class="space-y-2 text-lg">
    <li><strong>🧪 Total :</strong> ${total}</li>
    <li><strong>✔ Succès :</strong> ${passed}</li>
    <li><strong>❌ Échecs :</strong> ${failed}</li>
    <li><strong>⏱ Durée :</strong> ${formatDuration(duration)}</li>
    <li><strong>🏃‍♂️ GitHub Runner :</strong> ubuntu-latest</li>
    <li><strong>📄 Workflow :</strong> <code>.github/workflows/ci.yml</code></li>
  </ul>

  <div class="mt-8">
    <a href="./allure-reports/report/index.html" class="text-white bg-purple-600 px-6 py-3 rounded shadow hover:bg-purple-700">
      📊 Voir le rapport Allure
    </a>
  </div>
</body>
</html>
`;

// 📁 Création du dossier public si nécessaire
fs.mkdirSync("public", { recursive: true });
fs.writeFileSync("public/index.html", html);

console.log("✅ Page index.html générée dans ./public");
