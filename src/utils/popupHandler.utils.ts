import { Page, expect } from "@playwright/test";

/**
 * Gère automatiquement les popups qui bloquent la navigation (ex: cookie consent).
 * Ajoute dynamiquement un handler basé sur le role et le nom du composant.
 *
 * @param page Instance Playwright
 * @param role Le role ARIA du composant (ex: 'button')
 * @param name Le nom visible du composant (ex: 'Consent')
 */
export async function autoDismissPopup(page: Page, role: string, name: string) {
  await page.addLocatorHandler(
    page.getByRole(role as any, { name }),
    async () => {
      try {
        console.log(`👉 Popup "${name}" détectée. Tentative de fermeture...`);
        await page.getByRole(role as any, { name }).click();
        await expect(page.getByRole(role as any, { name })).not.toBeVisible({ timeout: 3000 });
        console.log(`✅ Popup "${name}" fermée avec succès.`);
      } catch (e) {
        console.warn(`⚠️ Impossible de fermer la popup "${name}" :`, e);
      }
    }
  );
}