// 📦 Importe les modules nécessaires
const fs = require("fs");
const path = require("path");

// 📋 Variables d’environnement GitHub Actions
const repo = process.env.GITHUB_REPOSITORY || "demo/demo";
const [owner, name] = repo.split("/");
const branch = process.env.GITHUB_REF_NAME || "main";
const sha = (process.env.GITHUB_SHA || "abc1234").slice(0, 7);
const workflow = process.env.GITHUB_WORKFLOW || "CI";
const runId = process.env.GITHUB_RUN_ID;
const runDate = new Date().toLocaleString("fr-FR", {
  timeZone: "Europe/Paris",
  dateStyle: "long",
  timeStyle: "short",
});
const ciLink = runId
  ? `https://github.com/${owner}/${name}/actions/runs/${runId}`
  : "#";

// 📊 Lecture du fichier Allure summary.json
const summaryFile = path.join(
  __dirname,
  "public",
  "allure-reports",
  "report",
  "widgets",
  "summary.json"
);
let summary = {};
if (fs.existsSync(summaryFile)) {
  try {
    summary = JSON.parse(fs.readFileSync(summaryFile, "utf-8"));
  } catch (err) {
    console.warn("⚠️ Erreur lors de la lecture du summary.json:", err.message);
  }
}

// 📈 Statistiques de test
const passed = summary?.statistic?.passed ?? 0;
const failed = summary?.statistic?.failed ?? 0;
const skipped = summary?.statistic?.skipped ?? 0;
const total = passed + failed + skipped;
const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : null;
const passRateDisplay = passRate !== null ? `${passRate} %` : "–";
const duration = summary?.time?.duration
  ? (() => {
      const s = Math.round(summary.time.duration / 1000);
      const m = Math.floor(s / 60);
      return m > 0 ? `${m} min ${s % 60} s` : `${s} s`;
    })()
  : "–";

// 📝 Génération HTML avec un design moderne inspiré du fichier React fourni
const html = `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rapport CI – ${name}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>html { scroll-behavior: smooth; }</style>
</head>
<body class="bg-gray-100 text-gray-900 min-h-screen px-6 py-10 font-sans">
  <div class="max-w-7xl mx-auto space-y-10">

    <!-- 🧾 En-tête -->
    <header class="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row justify-between items-center">
      <div class="flex items-center gap-4">
        <img src="https://playwright.dev/img/playwright-logo.svg" alt="Logo" class="w-10 h-10" />
        <h1 class="text-2xl font-bold text-indigo-600">Rapport Playwright - ${name}</h1>
      </div>
      <div class="mt-4 md:mt-0 text-sm text-gray-500">Généré le : <strong>${runDate}</strong></div>
    </header>

    <!-- 📋 Résumé des tests -->
    <section class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-indigo-700 mb-6">Résumé des Tests</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <div class="p-4 rounded bg-green-100 text-center">
          <h3 class="text-sm font-medium text-green-800">✅ Réussis</h3>
          <p class="text-2xl font-bold">${passed}</p>
        </div>
        <div class="p-4 rounded bg-red-100 text-center">
          <h3 class="text-sm font-medium text-red-800">❌ Échecs</h3>
          <p class="text-2xl font-bold">${failed}</p>
        </div>
        <div class="p-4 rounded bg-yellow-100 text-center">
          <h3 class="text-sm font-medium text-yellow-800">⏭️ Ignorés</h3>
          <p class="text-2xl font-bold">${skipped}</p>
        </div>
        <div class="p-4 rounded bg-indigo-100 text-center">
          <h3 class="text-sm font-medium text-indigo-800">📊 Taux</h3>
          <p class="text-2xl font-bold">${passRateDisplay}</p>
        </div>
        <div class="p-4 rounded bg-blue-100 text-center">
          <h3 class="text-sm font-medium text-blue-800">⏱️ Durée</h3>
          <p class="text-2xl font-bold">${duration}</p>
        </div>
      </div>
      <div class="mt-6 mx-auto max-w-xs">
        <canvas id="chart"></canvas>
      </div>
    </section>

    <!-- 🔧 Détails CI/CD -->
    <section class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-indigo-700 mb-6">Détails CI/CD</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <strong>🌿 Branche</strong><br>
          <a href="https://github.com/${owner}/${name}/tree/${branch}" class="text-blue-600 underline">${branch}</a>
        </div>
        <div>
          <strong>🔐 SHA</strong><br>
          <a href="https://github.com/${owner}/${name}/commit/${sha}" class="text-blue-600 underline">${sha}</a>
        </div>
        <div>
          <strong>⚙️ Workflow</strong><br>
          ${workflow}
        </div>
        <div>
          <strong>📄 Logs</strong><br>
          <a href="${ciLink}" class="text-blue-600 underline">Voir les logs</a>
        </div>
      </div>
    </section>

    <!-- 📊 Lien Allure -->
    <div class="text-center pt-6">
      <a href="allure-reports/report/index.html" class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700">
        Consulter le rapport Allure
      </a>
    </div>

    <!-- 🦶 Pied de page -->
    <footer class="text-center text-xs text-gray-400 mt-10">
      &copy; ${new Date().getFullYear()} – Rapport CI/CD moderne généré automatiquement
    </footer>
  </div>

  <!-- 📈 Script Chart.js -->
  <script>
    new Chart(document.getElementById("chart"), {
      type: 'doughnut',
      data: {
        labels: ["Succès", "Échecs", "Ignorés"],
        datasets: [{
          data: [${passed}, ${failed}, ${skipped}],
          backgroundColor: ["#16a34a", "#dc2626", "#eab308"]
        }]
      },
      options: {
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  </script>
</body>
</html>`;

// 💾 Écriture du fichier HTML dans ./public/index.html
const outputPath = path.join(__dirname, "public", "index.html");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, "utf-8");
console.log("✅ Rapport HTML moderne généré avec succès !");
