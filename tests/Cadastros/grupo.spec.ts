import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';
import { capturarRequisicaoApiCadastro } from '../../utils/capturaApipayload';

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

    console.log('***DADOS ENVIADOS PRA API***');
    const nomegrupo = `TEST GRUPO ${Date.now()}`;
    await page.getByLabel(/cadastrar novo grupo/i).fill(nomegrupo);
    console.log('NOME DE GRUPO OK:', nomegrupo); 
    console.log('***FIM DE DADOS ENVIADOS***');    
    
    await page.locator('.q-btn')
    .filter({ hasText: /confirmar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR GRUPO');  

    await capturarRequisicaoApiCadastro(page, '/api/produto/grupo');  
     
    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);   
});