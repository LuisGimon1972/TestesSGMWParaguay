import { test } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';

test('Cadastro de espécies', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    
 
    await page.waitForTimeout(2000);
    await page.getByText(/Cadastros/i).click({ force: true });

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/especies"]').click()
    console.log('CLICOU EM ESPÉCIES'); 

    const btnCadastrar = page.getByText(/cadastrar espécie/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU CADASTRAR');

    const descricao = `TEST ESPÉCIE ${Date.now()}`;
    await page.getByLabel(/descrição/i).fill(descricao);
    console.log('DESCRIÇÃO DE ESPÉCIE OK', descricao);

    await page.locator('[aria-label="Tipo do cartão"]').click({ force: true });
    const cartao = page.locator('.q-menu:visible');
    await cartao.waitFor();
    await cartao
    .locator('.q-item')
    .filter({ hasText: /não é cartão|débito|crédito/i })
    .first()
    .click({ force: true });
    console.log('TIPO DO CARTÃO OK');

    await page.waitForTimeout(1000);
    await page.locator('[aria-label="Tipo da espécie"]').click({ force: true });
    const menu = page.locator('.q-menu:visible');
    await menu.waitFor();
    await menu
    .locator('.q-item')
    .filter({ hasText: /dinheiro/i })
    .first()
    .click({ force: true });
    console.log('TIPO DA ESPÉCIE OK');    

    await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR');  

    await page.waitForTimeout(7000);
});