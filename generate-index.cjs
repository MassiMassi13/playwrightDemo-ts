const fs = require("fs");
const path = require("path");

const repo = process.env.GITHUB_REPOSITORY || "demo/demo";
const [owner, name] = repo.split("/");
const branch = process.env.GITHUB_REF_NAME || "main";
const sha = (process.env.GITHUB_SHA || "abc1234").slice(0, 7);
const workflow = process.env.GITHUB_WORKFLOW || "CI";
const runId = process.env.GITHUB_RUN_ID;
const runDate = new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
const ciLink = runId ? `https://github.com/${owner}/${name}/actions/runs/${runId}` : "#";

const summaryFile = path.join(__dirname, "public", "allure-reports", "report", "widgets", "summary.json");
let summary = {};
if (fs.existsSync(summaryFile)) {
  try {
    summary = JSON.parse(fs.readFileSync(summaryFile, "utf-8"));
  } catch (err) {
    console.warn("⚠️ Erreur lecture summary.json :", err.message);
  }
}

const passed = summary?.statistic?.passed ?? 0;
const failed = summary?.statistic?.failed ?? 0;
const skipped = summary?.statistic?.skipped ?? 0;
const total = passed + failed + skipped;

const duration = summary?.time?.duration
  ? (() => {
      const s = Math.round(summary.time.duration / 1000);
      const m = Math.floor(s / 60);
      return m > 0 ? `${m} min ${s % 60} s` : `${s} s`;
    })()
  : "–";

const status = failed > 0 ? "❌ Échec" : passed > 0 ? "✅ Succès" : "⏳ Aucun test";
const statusColor = failed > 0 ? "bg-red-600" : passed > 0 ? "bg-green-600" : "bg-yellow-500";

const html = `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rapport CI – ${name}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>html { scroll-behavior: smooth; }</style>
</head>
<body class="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-start px-6 py-10 font-sans">

  <div class="w-full max-w-6xl space-y-10">

    <!-- 🧾 Header -->
    <header class="bg-gray-800 p-6 rounded-xl shadow flex flex-col md:flex-row justify-between items-center">
      <div class="flex items-center gap-4">
        <img src="https://playwright.dev/img/playwright-logo.svg" alt="Logo" class="w-12 h-12" />
        <h1 class="text-3xl font-bold text-purple-400">Rapport de TestsPlaywright Massinissa D – ${name}</h1>
      </div>
      <div class="mt-4 md:mt-0 text-gray-300 text-sm">Généré le : <strong>${runDate}</strong></div>
    </header>

    <!-- ✅ Statut -->
    <div class="text-center py-2 rounded-xl ${statusColor} text-xl font-bold shadow-md">
      ${status}
    </div>

    <!-- 📋 Résumé des tests -->
    <section class="bg-gray-800 pt-6 px-6 pb-2 rounded-xl shadow space-y-4">
      <h2 class="text-2xl font-semibold text-purple-300">Résumé des Tests</h2>
      <div class="grid grid-cols- sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <div class="bg-green-400 p-4 rounded text-center shadow">
          <h3 class="font-medium">✅ Réussis</h3>
          <p class="text-2xl font-bold">${passed}</p>
        </div>
        <div class="bg-red-500 p-4 rounded text-center shadow">
          <h3 class="font-medium">❌ Échecs</h3>
          <p class="text-2xl font-bold">${failed}</p>
        </div>
        <div class="bg-yellow-400 p-4 rounded text-center shadow">
          <h3 class="font-medium">⏭️ Ignorés</h3>
          <p class="text-2xl font-bold">${skipped}</p>
        </div>
        <div class="bg-blue-400 p-4 rounded text-center shadow">
          <h3 class="font-medium">⏱️ Durée</h3>
          <p class="text-2xl font-bold">${duration}</p>
        </div>
      </div>
      <div class="w-full max-w-md mx-auto">
        <canvas id="chart"></canvas>
      </div>
    </section>

    <!-- ⚙️ Infos CI/CD -->
    <section class="bg-gray-800 p-6 rounded-xl shadow space-y-4">
      <h2 class="text-2xl font-semibold text-purple-300">Détails CI/CD</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-gray-700 p-4 rounded shadow">
          <strong>🌿 Branche :</strong><br>
          <a href="https://github.com/${owner}/${name}/tree/${branch}" class="text-blue-400 underline">${branch}</a>
        </div>
        <div class="bg-gray-700 p-4 rounded shadow">
          <strong>🔐 SHA :</strong><br>
          <a href="https://github.com/${owner}/${name}/commit/${sha}" class="text-blue-400 underline">${sha}</a>
        </div>
        <div class="bg-gray-700 p-4 rounded shadow">
          <strong>⚙️ Workflow :</strong><br>
          ${workflow}
        </div>
        <div class="bg-gray-700 p-4 rounded shadow">
          <strong>📄 Logs CI :</strong><br>
          <a href="${ciLink}" class="text-blue-400 underline">Voir les logs</a>
        </div>
      </div>
    </section>

    <!-- 📊 Bouton vers Allure -->
    <div class="text-center pt-6">
      <a href="allure-reports/report/index.html" class="inline-flex items-center gap-3 px-8 py-4 bg-purple-700 hover:bg-purple-800 text-white text-lg font-semibold rounded-xl shadow">
        <i data-lucide="bar-chart-3" class="w-5 h-5"></i> Consulter le rapport Allure
      </a>
    </div>

      <!-- Footer -->
    <footer class="text-center text-sm text-gray-500 mt-10">
      &copy; ${new Date().getFullYear()} – Rapport CI/CD sombre par Massinissa D
    </footer>

  </div>

  <script>
    new Chart(document.getElementById("chart"), {
      type: 'doughnut',
      data: {
        labels: ["Succès", "Échecs", "Ignorés"],
        datasets: [{
          data: [${passed}, ${failed}, ${skipped}],
          backgroundColor: ["#22c55e", "#ef4444", "#eab308"]
        }]
      },
      options: {
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
    lucide.createIcons();
  </script>
</body>
</html>`;

const outputPath = path.join(__dirname, "public", "index.html");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, "utf-8");

console.log("✅ Rapport HTML sombre généré avec succès !");
