import { test, expect } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';

test('Teste de busca crítico em Cotação de Moedas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

  await loginCompleto(page);
  
    await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/lotes/, { timeout: 15000 }),
      page.locator('a[href*="lotes"]').first().click()
    ]);
    console.log('CLICOU EM LOTES'); 

    await page.waitForTimeout(1000);    
    const codigos = await page.locator('table td span[class*="tw-text-ellipsis"][class*="tw-text-nowrap"]').allTextContents();

    if (codigos.length > 0) {  
        const codigoEscolhido = codigos[1].trim();
        await page.getByLabel(/pesquisar registro/i).fill(codigoEscolhido);
        await page.waitForTimeout(4000);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(4000);
        console.log('BUSCA COTAÇÃO EXISTENTE OK:', codigoEscolhido);
        await page.waitForTimeout(1000);   
    } else {
        console.warn('Nenhum código encontrado na grade.');
    }
    
    await page.waitForTimeout(3000);   
    const moedainex = '003';
    await page.getByLabel(/pesquisar registro/i).fill(moedainex);
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    console.log('BUSCA COTAÇÃO INEXISTENTE OK:', moedainex);

    await page.waitForTimeout(4000);  
});