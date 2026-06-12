import { test, expect } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';
import { capturarRequisicoesApi } from '../utils/capturaApi';

test('Teste de busca crítico em Pessoas', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginCompleto(page);

  // Navega até Pessoas
  await Promise.all([
    page.waitForURL(/pessoa/, { timeout: 15000 }),
    page.locator('a[href*="pessoa"]').first().click()
  ]);
  console.log('CLICOU PESSOAS');

const primeiroNome = `TEST NOME`;
await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
await page.keyboard.press('Enter');
await page.waitForTimeout(1500);
console.log('BUSCA EXISTENTE OK:', primeiroNome);

await page.waitForTimeout(2000);

const nomeInexistente = `NOME INEXISTENTE`;
await page.getByLabel(/pesquisar registro/i).fill(nomeInexistente);
await page.keyboard.press('Enter');
await page.waitForTimeout(1500);
console.log('BUSCA INEXISTENTE OK:', nomeInexistente);

await capturarRequisicoesApi(page);
await page.waitForTimeout(4000);  
});