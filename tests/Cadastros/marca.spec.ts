import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';
import { capturarRequisicaoApiCadastro } from '../../utils/capturaApipayload';

test('Cadastro de marcas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    
 
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('CLICOU EM CADASTRO');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/marcas"]').click()
    console.log('CLICOU EM MARCAS'); 

    const btnCadastrar = page.getByText(/cadastrar marca/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU CADASTRAR MARCA');    

    console.log('***DADOS ENVIADOS PRA API***');
    const marca = `TEST MARCA ${Date.now()}`;
    await page.getByLabel(/cadastrar nova marca/i).fill(marca);
    console.log('NOME DE MARCA OK:', marca);     
    console.log('***DADOS ENVIADOS PRA API***');      

    await page.locator('.q-btn')
    .filter({ hasText: /confirmar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR MARCA');  

    await capturarRequisicaoApiCadastro(page, '/api/marca');  

    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);      
});