// generate-index.cjs
const fs = require("fs");
const path = require("path");

const repo = process.env.GITHUB_REPOSITORY || "demo/demo";
const [owner, name] = repo.split("/");
const branch = process.env.GITHUB_REF_NAME || "main";
const sha = process.env.GITHUB_SHA?.slice(0, 7) || "abc1234";
const workflow = process.env.GITHUB_WORKFLOW || "CI";
const runDate = new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });

const summaryFile = path.join(__dirname, "public", "allure-reports", "report", "widgets", "summary.json");
let summary = null;

try {
  if (fs.existsSync(summaryFile)) {
    const raw = fs.readFileSync(summaryFile, "utf-8");
    summary = JSON.parse(raw);
  }
} catch (error) {
  console.warn("⚠️ Impossible de lire summary.json :", error.message);
}

const passed = summary?.statistic?.passed ?? 0;
const failed = summary?.statistic?.failed ?? 0;
const skipped = summary?.statistic?.skipped ?? 0;
const total = passed + failed + skipped;
const duration = summary?.time?.duration ? `${(summary.time.duration / 1000).toFixed(1)} sec` : "–";

const html = `<!DOCTYPE html>
<html lang="fr" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rapport Playwright – ${name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="icon" href="https://playwright.dev/img/playwright-logo.svg" />
    <script>
      tailwind.config = {
        darkMode: 'media',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif']
            }
          }
        }
      }
    </script>
  </head>
  <body class="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans min-h-screen">
    <header class="bg-white dark:bg-gray-800 shadow py-6 px-10 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" class="w-12 h-12" />
        <h1 class="text-3xl font-extrabold text-purple-700 dark:text-purple-400">Rapport de Tests Playwright</h1>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Généré le : <strong>${runDate}</strong>
      </div>
    </header>

    <main class="px-10 py-12">
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 animate-fadeIn">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4 hover:shadow-lg transition">
          <i data-lucide="clock" class="w-6 h-6 text-purple-600 dark:text-purple-300"></i>
          <div>
            <p class="text-sm text-gray-500">Durée d'exécution</p>
            <p class="text-lg font-semibold">${duration}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4 hover:shadow-lg transition">
          <i data-lucide="package-check" class="w-6 h-6 text-green-600"></i>
          <div>
            <p class="text-sm text-gray-500">Tests exécutés</p>
            <p class="text-lg font-semibold">${total}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4 hover:shadow-lg transition">
          <i data-lucide="circle-check" class="w-6 h-6 text-green-600"></i>
          <div>
            <p class="text-sm text-gray-500">Résultats</p>
            <p class="text-lg font-semibold text-green-700 dark:text-green-400">✔ ${passed} / ❌ ${failed} / ⏭️ ${skipped}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4 hover:shadow-lg transition">
          <i data-lucide="github" class="w-6 h-6"></i>
          <div>
            <p class="text-sm text-gray-500">Workflow GitHub</p>
            <p class="text-lg font-semibold">${workflow}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4 hover:shadow-lg transition">
          <i data-lucide="git-branch" class="w-6 h-6 text-blue-600"></i>
          <div>
            <p class="text-sm text-gray-500">Branche</p>
            <p class="text-lg font-semibold">${branch}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex items-center gap-4 hover:shadow-lg transition">
          <i data-lucide="hash" class="w-6 h-6"></i>
          <div>
            <p class="text-sm text-gray-500">SHA</p>
            <p class="text-lg font-semibold">
              <a href="https://github.com/${owner}/${name}/commit/${sha}" class="text-blue-500 hover:underline">${sha}</a>
            </p>
          </div>
        </div>
      </section>

      <div class="text-center">
        <a href="allure-reports/report/index.html" class="inline-flex items-center justify-center gap-3 px-8 py-4 text-white text-lg font-semibold bg-purple-600 hover:bg-purple-700 rounded-xl transition">
          <i data-lucide="bar-chart-3" class="w-6 h-6"></i>
          📊 Consulter le rapport Allure
        </a>
      </div>
    </main>

    <footer class="mt-16 border-t text-center py-6 text-sm text-gray-400">
      &copy; ${new Date().getFullYear()} – Rapport généré par CI/CD Playwright  Massinissa D
    </footer>

    <script>
      lucide.createIcons();
    </script>
  </body>
</html>`;

const outputPath = path.join(__dirname, "public", "index.html");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, "utf-8");

console.log("✅ Rapport HTML premium généré avec succès !");
