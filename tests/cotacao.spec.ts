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

    const hoje = new Date();
    const datahoje = hoje.toLocaleDateString('pt-BR');
    const inputData = page
    .locator('.q-field')
    .filter({ hasText: /vig[eê]ncia/i })
    .first()
    .locator('input');
    await expect(inputData).toBeVisible();
    await inputData.fill(datahoje);
    console.log('INICIO DE VIGÊNCIA OK', datahoje);
    
    const fin = new Date();
    const fimMes = new Date(fin.getFullYear(), hoje.getMonth() + 1, 0);
    const dia = String(fimMes.getDate()).padStart(2, '0');
    const mes = String(fimMes.getMonth() + 1).padStart(2, '0');
    const ano = fimMes.getFullYear();
    const datafin = `${dia}/${mes}/${ano}`;
    const inputDatafin = page
    .locator('.q-field')
    .filter({ hasText: /fim|vig[eê]ncia/i })
    .last()
    .locator('input');
    await inputDatafin.scrollIntoViewIfNeeded();
    await expect(inputDatafin).toBeVisible();
    await inputDatafin.fill('');
    await inputDatafin.type(datafin, { delay: 50 });
    console.log('FIM DE VIGÊNCIA OK', datafin);

    await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR');  

    await page.waitForTimeout(4000);
});