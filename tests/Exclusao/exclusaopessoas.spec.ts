import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Exclusão de datos Pessoas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    

    await Promise.all([
      page.waitForURL(/pessoa/, { timeout: 15000 }),
      page.locator('a[href*="pessoa"]').first().click()
    ]);
    console.log('CLICOU PESSOAS');    

    await page.waitForTimeout(1000);        

    await page.waitForSelector('table', { state: 'visible' });
    const menuTresPontos = page.locator('table tr:first-child >> text=more_vert').first();
    console.log('LOCALIZOU OS TRÊS PONTOS');
    await menuTresPontos.click();
    console.log('CLICOU NOS TRÊS PONTOS');

    await page.waitForTimeout(1000);    
    const trashIcons = await page.locator('table img[src*="trash"]').count();
    if (trashIcons > 0) {
        await page.locator('table img[src*="trash"]').first().click();
        await capturarRequisicoesApi(page);
        await page.waitForTimeout(4000);
    } else {
        console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR.');
    }
});