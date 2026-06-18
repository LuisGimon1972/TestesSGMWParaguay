import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Cadastro de grupos', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    
 
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('CLICOU EM CADASTRO');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/grupos"]').click()
    console.log('CLICOU EM GRUPOS');

    const btnCadastrar = page.getByText(/cadastrar grupo/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU CADASTRAR GRUPO');    

    const nomegrupo = `TEST GRUPO ${Date.now()}`;
    await page.getByLabel(/cadastrar novo grupo/i).fill(nomegrupo);
    console.log('NOME DE GRUPO OK', nomegrupo);     
    
    await page.locator('.q-btn')
    .filter({ hasText: /confirmar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR GRUPO');  
     
    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);   
});