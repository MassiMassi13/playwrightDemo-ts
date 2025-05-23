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
const actor = process.env.GITHUB_ACTOR || "ci-user";
const jobStatus = process.env.JOB_STATUS || "unknown";

// 🕒 Format de la date d’exécution
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

// 📈 Récupération des Statistiques de test
const passed = summary?.statistic?.passed ?? 0;
const failed = summary?.statistic?.failed ?? 0;
const skipped = summary?.statistic?.skipped ?? 0;
const total = passed + failed + skipped;

// ✅ Calcul du taux de réussite si possible
const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : null;
// Pour affichage clair : "92.3 %" ou "–"
const passRateDisplay = passRate !== null ? `${passRate} %` : "–";
// ⏱️ Formate la durée en minutes/secondes si dispo
const duration = summary?.time?.duration
  ? Math.round(summary.time.duration / 1000)
  : 0;
const durationDisplay = duration
  ? duration < 60
    ? `${duration}s`
    : `${Math.floor(duration / 60)}min ${duration % 60}s`
  : "–";

// 📝 Génération du HTML final
const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rapport de Test Automatisé – ${name}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50 text-gray-900 font-sans">
  <div class="max-w-7xl mx-auto px-4 py-6">

    <!-- 🔷 En-tête -->
    <header class="bg-indigo-700 text-white rounded-lg shadow p-6 flex flex-col md:flex-row justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold">📊 Rapport de Test Automatisé</h1>
      </div>
      <div class="mt-4 md:mt-0 text-sm">Projet : <strong>${name}</strong></div>
    </header>

    <!-- 🧾 Informations générales -->
    <section class="bg-white shadow rounded-lg p-6 mb-6">
      <div class="flex flex-wrap justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold">📅 Campagne du ${runDate.split(' à')[0]}</h2>
          <p class="text-gray-600 mt-1">🕒 Exécuté à ${runDate.split(' à ')[1] || runDate.split(', ')[1]} • Durée : ${durationDisplay}</p>
          <p class="text-gray-500 text-sm">👤 Déclenché par : <strong>${actor}</strong> • Statut : <strong>${jobStatus}</strong></p>
        </div>
      </div>
    </section>

    <!-- 📊 Indicateurs Clés -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      <div class="bg-blue-100 text-blue-900 p-6 rounded shadow text-center">
        <p class="text-sm font-medium">📦 Total des Tests</p>
        <p class="text-4xl font-bold mt-2">${total}</p>
      </div>
      <div class="bg-green-100 text-green-900 p-6 rounded shadow text-center">
        <p class="text-sm font-medium">🎯 Taux de Réussite</p>
        <p class="text-4xl font-bold mt-2">${passRateDisplay}</p>
      </div>
      <div class="bg-red-100 text-red-900 p-6 rounded shadow text-center">
        <p class="text-sm font-medium">💥 Échecs</p>
        <p class="text-4xl font-bold mt-2">${failed}</p>
      </div>
      <div class="bg-gray-100 text-gray-800 p-6 rounded shadow text-center">
        <p class="text-sm font-medium">⏱ Temps d'Exécution</p>
        <p class="text-4xl font-bold mt-2">${durationDisplay}</p>
      </div>
      <div class="bg-yellow-100 text-yellow-900 p-6 rounded shadow text-center">
        <p class="text-sm font-medium">🚧 Tests Ignorés</p>
        <p class="text-4xl font-bold mt-2">${skipped}</p>
      </div>
    </section>

    <!-- 📈 Résumé Graphique -->
    <section class="bg-white p-3 rounded shadow mb-3">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">📊 Répartition des Résultats</h3>
      <canvas id="chart-pie" class="w-full h-48"></canvas>
    </section>

    <!-- 🔧 Détails CI/CD -->
    <section class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-indigo-700 mb-6">🔧 Détails CI/CD</h2>
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

    <!-- 🦶 Pied de page -->
    <footer class="text-center text-xs text-gray-500 pt-10">
      <p>🧪 Plateforme de Tests Automatisés</p>
      <p>© ${new Date().getFullYear()} Tous droits réservés</p>
      <p class="mt-1">Généré le ${runDate}</p>
      <p>Version 3.0.0</p>
    </footer>
  </div>

  <!-- 📉 Script pour le graphique circulaire -->
  <script>
    new Chart(document.getElementById("chart-pie"), {
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

// 💾 Sauvegarde du rapport HTML
const outputPath = path.join(__dirname, "public", "index.html");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, "utf-8");
console.log("✅ Rapport HTML professionnel généré avec succès !");
