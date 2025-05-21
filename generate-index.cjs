// 📁 Dépendances de Node.js
const fs = require("fs");
const path = require("path");

// ℹ️ Informations GitHub (ou valeurs par défaut pour usage local)
const repo = process.env.GITHUB_REPOSITORY || "demo/demo";
const [owner, name] = repo.split("/");
const branch = process.env.GITHUB_REF_NAME || "main";
const sha = (process.env.GITHUB_SHA || "abc1234").slice(0, 7);
const workflow = process.env.GITHUB_WORKFLOW || "CI";
const runId = process.env.GITHUB_RUN_ID;
const runDate = new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
const ciLink = runId ? `https://github.com/${owner}/${name}/actions/runs/${runId}` : "#";

// 📄 Lecture du fichier résumé Allure
const summaryFile = path.join(__dirname, "public", "allure-reports", "report", "widgets", "summary.json");
let summary = {};
if (fs.existsSync(summaryFile)) {
  try {
    summary = JSON.parse(fs.readFileSync(summaryFile, "utf-8"));
  } catch (err) {
    console.warn("⚠️ Impossible de lire le fichier summary.json :", err.message);
  }
}

// 📊 Statistiques de tests
const passed = summary?.statistic?.passed ?? 0;
const failed = summary?.statistic?.failed ?? 0;
const skipped = summary?.statistic?.skipped ?? 0;
const total = passed + failed + skipped;

// ⏱️ Temps d'exécution formaté
const duration = summary?.time?.duration
  ? (() => {
      const s = Math.round(summary.time.duration / 1000);
      const m = Math.floor(s / 60);
      return m > 0 ? `${m}min ${s % 60}s` : `${s}s`;
    })()
  : "–";

// ✅ État global de la suite de tests
const status = failed > 0 ? "❌ Échec" : passed > 0 ? "✅ Succès" : "⏳ Aucun test";
const statusColor = failed > 0 ? "bg-red-600" : passed > 0 ? "bg-green-600" : "bg-yellow-500";

// 🧾 Génération HTML de la page de rapport
const html = `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rapport Playwright – ${name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link rel="icon" href="https://playwright.dev/img/playwright-logo.svg" />
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'] } } }
    };
  </script>
</head>
<body class="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans min-h-screen relative">

  <!-- 🌙 Toggle Thème -->
  <button id="themeToggle" class="absolute top-4 right-4 p-2 rounded bg-gray-300 dark:bg-gray-700 transition hover:scale-110">🌓</button>
  <script>document.getElementById("themeToggle").onclick = () => document.documentElement.classList.toggle("dark");</script>

  <header class="bg-white dark:bg-gray-800 shadow py-6 px-10 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" class="w-12 h-12" />
      <h1 class="text-4xl font-extrabold text-purple-200 dark:text-purple-400">Rapport de Tests – Massinissa D</h1>
    </div>
    <div class="text-sm text-gray-500 dark:text-gray-400">Généré le : <strong>${runDate}</strong></div>
  </header>

  <div class="${statusColor} text-white font-bold text-center py-2 transition-all duration-500">${status}</div>

  <main class="px-10 py-12">
    <!-- 📋 Tableau Résumé -->
    <table class="min-w-full table-auto border rounded-xl text-left text-sm mb-10 shadow-lg">
      <thead>
        <tr class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          <th class="p-3">🗂️ Clé</th><th class="p-3">📌 Valeur</th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <tr><td class="p-3">⏱️ Durée</td><td class="p-3">${duration}</td></tr>
        <tr><td class="p-3">🧪 Tests exécutés</td><td class="p-3">${total}</td></tr>
        <tr><td class="p-3">📊 Résultats</td><td class="p-3">✅ ${passed} / ❌ ${failed} / ⏭️ ${skipped}</td></tr>
        <tr><td class="p-3">🌿 Branche</td><td class="p-3"><a href="https://github.com/${owner}/${name}/tree/${branch}" class="text-blue-500 hover:underline">${branch}</a></td></tr>
        <tr><td class="p-3">🔐 SHA</td><td class="p-3"><a href="https://github.com/${owner}/${name}/commit/${sha}" class="text-blue-500 hover:underline">${sha}</a></td></tr>
        <tr><td class="p-3">⚙️ Workflow</td><td class="p-3">${workflow}</td></tr>
        <tr><td class="p-3">📄 Logs CI</td><td class="p-3"><a href="${ciLink}" class="text-blue-500 hover:underline">Voir les logs</a></td></tr>
      </tbody>
    </table>

    <!-- 📈 Mini Graphique Doughnut -->
    <div class="max-w-sm mx-auto">
      <canvas id="chart"></canvas>
    </div>
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

    <!-- 🔍 Lien rapport Allure -->
    <div class="text-center mt-10">
      <a href="allure-reports/report/index.html" class="inline-flex items-center justify-center gap-3 px-8 py-4 text-white text-lg font-semibold bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow">
        <i data-lucide="bar-chart-3" class="w-6 h-6"></i>
        📊 Consulter le rapport Allure
      </a>
    </div>
  </main>

  <footer class="mt-16 border-t text-center py-6 text-sm text-gray-400">
    &copy; ${new Date().getFullYear()} – Rapport CI/CD Playwright – Massinissa D
  </footer>
  <script>lucide.createIcons();</script>
</body>
</html>`;

// 🧾 Écriture du fichier HTML final
const outputPath = path.join(__dirname, "public", "index.html");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, "utf-8");

console.log("✅ Rapport HTML premium généré avec succès !");
