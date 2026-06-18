import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Exclusão de datos Produtos', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    

    await page.waitForTimeout(1000);
      await Promise.all([
      page.waitForURL(/producto/, { timeout: 15000 }),
      page.locator('a[href*="producto"]').first().click()
      ]);
      console.log('CLICOU PRODUTOS');

    await page.waitForTimeout(1000);        

    await page.waitForSelector('table', { state: 'visible' });
    const menuTresPontos = page.locator('table tr:first-child >> text=more_vert').first();    
    await menuTresPontos.click();    

    await page.waitForTimeout(1000);    
    await page.waitForSelector('text=Excluir', { state: 'visible' });
    await page.locator('text=Excluir').click();
    console.log('CLICOU EM EXCLUIR');    
    await page.waitForTimeout(2000);        
        
    await capturarRequisicoesApi(page);   
    
    await page.waitForTimeout(5000);    
});