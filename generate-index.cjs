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
      return s;
    })()
  : 0;
const durationDisplay = duration ? (duration < 60 ? `${duration}s` : `${Math.floor(duration / 60)}min ${duration % 60}s`) : "–";

// 📝 Génération HTML fortement inspirée de ton composant React (design avancé)
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
    <!-- En-tête -->
    <header class="bg-indigo-700 text-white rounded-lg shadow p-6 flex flex-col md:flex-row justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <i class="fas fa-vial text-2xl"></i>
        <h1 class="text-2xl font-bold">Rapport de Test Automatisé</h1>
      </div>
      <div class="mt-4 md:mt-0 flex items-center space-x-4">
        <span class="text-sm">Projet: ${name}</span>
        <a href="${ciLink}" class="bg-white text-indigo-700 px-4 py-2 rounded hover:bg-indigo-50 text-sm">Exporter</a>
      </div>
    </header>

    <!-- Informations générales -->
    <section class="bg-white shadow rounded-lg p-6 mb-6">
      <div class="flex flex-wrap justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold">Campagne de Test – ${runDate.split(' à')[0]}</h2>
          <p class="text-gray-600 mt-1">Exécuté à ${runDate.split(' à ')[1] || runDate.split(', ')[1]} • Durée totale: ${durationDisplay}</p>
          <p class="text-gray-500 text-sm">Déclenché par : <strong>${actor}</strong> • Statut : <strong>${jobStatus}</strong></p>
        </div>
        <div class="flex items-center space-x-3 mt-4 sm:mt-0">
          <button class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm">Relancer les tests échoués</button>
          <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm">Partager</button>
        </div>
      </div>
    </section>

    <!-- KPIs -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white p-6 rounded shadow text-center">
        <p class="text-sm text-gray-500">Tests Totaux</p>
        <p class="text-3xl font-bold">${total}</p>
      </div>
      <div class="bg-white p-6 rounded shadow text-center">
        <p class="text-sm text-gray-500">Taux de Réussite</p>
        <p class="text-3xl font-bold">${passRateDisplay}</p>
      </div>
      <div class="bg-white p-6 rounded shadow text-center">
        <p class="text-sm text-gray-500">Temps d'Exécution</p>
        <p class="text-3xl font-bold">${durationDisplay}</p>
      </div>
      <div class="bg-white p-6 rounded shadow text-center">
        <p class="text-sm text-gray-500">Tests Échoués</p>
        <p class="text-3xl font-bold">${failed}</p>
      </div>
    </section>

    <!-- Résumé Graphique -->
    <section class="bg-white p-6 rounded shadow mb-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">Résumé Graphique</h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 class="text-sm font-medium text-gray-600 mb-2">Répartition des Résultats</h4>
          <canvas id="chart-pie" class="w-full h-64"></canvas>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-600 mb-2">Placeholder Durée par Suite</h4>
          <div class="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">À venir</div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="text-center text-xs text-gray-500 pt-10">
      <p>Test Automation Platform</p>
      <p>© ${new Date().getFullYear()} Tous droits réservés</p>
      <p class="mt-1">Généré le ${runDate}</p>
      <p>Version 2.5.0</p>
    </footer>
  </div>

  <!-- Script Chart.js -->
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
console.log("✅ Rapport HTML enrichi inspiré de la maquette React généré avec succès !");
