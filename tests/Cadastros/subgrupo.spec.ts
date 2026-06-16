import { test } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Cadastro de subgrupos', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    
 
    await page.waitForTimeout(2000);
    await page.getByText(/Cadastros/i).click({ force: true });

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/subgrupos"]').click()
    console.log('CLICOU EM SUBGRUPOS');

    const btnCadastrar = page.getByText(/cadastrar subgrupo/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU CADASTRAR SUBGRUPO');    

    const nomesubgrupo = `TEST SUBGRUPO ${Date.now()}`;
    await page.getByLabel(/cadastrar novo subgrupo/i).fill(nomesubgrupo);
    console.log('NOME DE SUBGRUPO OK', nomesubgrupo);   

    await page.waitForTimeout(1000);
    
    await page.locator('[aria-label="Grupo"]').click({ force: true });
    const grupo = page.locator('.q-menu:visible');
    await grupo.waitFor();
    await grupo
    .locator('.q-item')
    .filter({ hasText: /test/i })
    .first()
    .click({ force: true });
    console.log('GRUPO OK',grupo);    

    await page.waitForTimeout(1000);

    await page.locator('.q-btn')
    .filter({ hasText: /confirmar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR SUBGRUPO');  

    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);   
});