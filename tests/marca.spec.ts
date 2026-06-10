import { test, expect } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';

test('Cadastro de marcas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    
 
    await page.waitForTimeout(2000);
    await page.getByText(/Cadastros/i).click({ force: true });

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/marcas"]').click()
    console.log('CLICOU EM MARCAS'); 

    const btnCadastrar = page.getByText(/cadastrar marca/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU CADASTRAR MARCA');    

    const marca = `TEST MARCA ${Date.now()}`;
    await page.getByLabel(/cadastrar nova marca/i).fill(marca);
    console.log('NOME DE MARCA OK', marca);           

    await page.locator('.q-btn')
    .filter({ hasText: /confirmar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR MARCA');  

    await page.waitForTimeout(4000);
});