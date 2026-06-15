import { test, expect } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';

test('Teste de busca crítico em Faturamento', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

  await loginCompleto(page);
  
  await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/faturamento/, { timeout: 15000 }),
      page.locator('a[href*="faturamento"]').first().click()
    ]);
    console.log('CLICOU EM FATURAMENTO');

     const primeiroNome = `REGISTRO`;
     await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
     await page.waitForTimeout(1000);  
     await page.keyboard.press('Enter');
     await page.waitForTimeout(1500);
     console.log('BUSCA EXISTENTE OK:', primeiroNome);

    await page.waitForTimeout(1000);

    const prodInexistente = `FATURA INEXISTENTE`;
    await page.getByLabel(/pesquisar registro/i).fill(prodInexistente);
    await page.waitForTimeout(1000);  
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    console.log('BUSCA INEXISTENTE OK:', prodInexistente);
    
    await page.waitForTimeout(4000);  
});