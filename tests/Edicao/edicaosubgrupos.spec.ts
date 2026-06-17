import { test } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Edição de datos subgrupos', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    
 
    await page.waitForTimeout(2000);
    await page.getByText(/Cadastros/i).click({ force: true });

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/subgrupos"]').click()
    console.log('CLICOU EM SUBGRUPOS');

    await page.locator('table img[src="/icons/edit.svg"]').first().click();
    console.log('CLICOU NO ÍCONE DE EDITAR');    

    const nomesubgrupo = `TEST SUBGRUPO ALTERADO ${Date.now()}`;
    await page.getByLabel(/editar subgrupo/i).fill(nomesubgrupo);
    console.log('NOME DE SUBGRUPO ALTERADO OK:', nomesubgrupo);       

    await page.waitForTimeout(1000);

    await page.locator('.q-btn')
    .filter({ hasText: /confirmar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR SUBGRUPO');  

    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);   
});