import { test } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Edição de datos marcas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    
 
    await page.waitForTimeout(2000);
    await page.getByText(/Cadastros/i).click({ force: true });

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/marcas"]').click()
    console.log('CLICOU EM MARCAS'); 

    await page.locator('table img[src="/icons/edit.svg"]').first().click();
    console.log('CLICOU NO ÍCONE DE EDITAR');    

    const marca = `TEST MARCA ALTERADA ${Date.now()}`;
    await page.getByLabel(/editar marca/i).fill(marca);
    console.log('NOME DE MARCA ALTERADA OK:', marca);           

    await page.locator('.q-btn')
    .filter({ hasText: /confirmar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR MARCA');  

    console.log(`***REQUISIÇÕES DA API ⬅️***`);
    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);      
});