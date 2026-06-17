import { test } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Exclusão de datos cotação de moedas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });    
    await loginCompleto(page);    
 
    await page.waitForTimeout(2000);
    await page.getByText(/Cadastros/i).click({ force: true });

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/cotizacion-monedas"]').click()
    console.log('CLICOU EM COTAÇÃO'); 

    await page.waitForTimeout(2000);
    await page.waitForSelector('table img[src*="trash"]', { state: 'visible' });
    await page.locator('table img[src*="trash"]').first().click();    

    await capturarRequisicoesApi(page); 
    if(capturarRequisicoesApi.length > 0){
        console.log('CLICOU EM CONFIRMAR EXCLUIR');
        console.log(`***REQUISIÇÕES DA API ⬅️***`);
      }        

    await page.waitForTimeout(4000);    
});