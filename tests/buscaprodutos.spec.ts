import { test } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';
import { capturarRequisicoesApi } from '../utils/capturaApi';

test('Teste de busca crítico em Produtos', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
      await loginCompleto(page);    

      await page.waitForTimeout(1000);
      await Promise.all([
      page.waitForURL(/producto/, { timeout: 15000 }),
      page.locator('a[href*="producto"]').first().click()
      ]);
      console.log('CLICOU PRODUTOS');

     const primeiroNome = `TEST PRODUTO`;
     await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
     await page.keyboard.press('Enter');
     await page.waitForTimeout(1500);
     console.log('BUSCA EXISTENTE OK:', primeiroNome);

    await page.waitForTimeout(2000);

    const prodInexistente = `PRODUTO INEXISTENTE`;
    await page.getByLabel(/pesquisar registro/i).fill(prodInexistente);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    console.log('BUSCA INEXISTENTE OK:', prodInexistente);

    await capturarRequisicoesApi(page);
    await page.waitForTimeout(4000);  
});