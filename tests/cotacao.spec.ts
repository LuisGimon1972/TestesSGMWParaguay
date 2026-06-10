import { test, expect } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';

test('Cadastro de especies', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    
 
    await page.waitForTimeout(2000);
    await page.getByText(/Cadastros/i).click({ force: true });

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/cotizacion-monedas"]').click()
    console.log('CLICOU EM COTAÇÃO'); 

    const btnCadastrar = page.getByText(/cadastrar cotação/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU CADASTRAR COTAÇÃO');    

    await page.locator('[aria-label="Moeda de cotação (diferente da sua empresa)"]').click({ force: true });
    const moeda = page.locator('.q-menu:visible');
    await moeda.waitFor();
    await moeda
    .locator('.q-item')
    .filter({ hasText: /usd/i })
    .first()
    .click({ force: true });
    console.log('MOEDA DE COTAÇÃO OK');

    const venta = 6070;
    const inputVenta = page.getByLabel(/valor de venda/i);
    await expect(inputVenta).toBeVisible();
    await inputVenta.fill(String(venta));
    console.log('VALOR DE VENTA OK', venta);

    const compra = 5975;
    const inputCompra = page.getByLabel(/valor de compra/i);
    await expect(inputCompra).toBeVisible();
    await inputCompra.fill(String(compra));
    console.log('VALOR DE COMPRA OK', compra);

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

    await page.waitForTimeout(4000);
});