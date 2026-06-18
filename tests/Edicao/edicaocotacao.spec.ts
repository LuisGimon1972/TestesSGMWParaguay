import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Edição de datos cotação de moedas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    
 
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('CLICOU EM CADASTRO');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/cotizacion-monedas"]').click()
    console.log('CLICOU EM COTAÇÃO');         
    await page.waitForSelector('table');    
    await page.locator('.q-skeleton').first().waitFor({ state: 'detached', timeout: 10000 });    
    const trashIcons = await page.locator('table img[src*="trash"]').count();
    console.log('Quantidade de ícones de lixo:', trashIcons);

    if (trashIcons > 0) {    
        await page.locator('table img[src="/icons/edit.svg"]').first().click();
        console.log('CLICOU NO ÍCONE DE EDITAR');    
        
        const moedaField = page.locator('[aria-label="Moeda de cotação (diferente da sua empresa)"]').first();
        await moedaField.scrollIntoViewIfNeeded();
        await expect(moedaField).toBeVisible();    
        await moedaField.evaluate(el => (el as HTMLElement).click());    
        const menu = page.locator('.q-menu');
        await expect(menu).toBeVisible();    
        const moedas = ['usd', 'brl', 'pyg', 'cad', 'eur', 'gbp'];    
        const moedaEscolhida = moedas[Math.floor(Math.random() * moedas.length)];    
        const opcao = menu.locator('.q-item', {
        hasText: new RegExp(moedaEscolhida, 'i')
        }).first();
        await opcao.click();
        console.log('MOEDA DE COTAÇÃO ALTERADA OK:', moedaEscolhida);

        const venta = Math.floor(Math.random() * (6000 - 5000 + 1)) + 5000;
        const inputVenta = page.getByLabel(/valor de venda/i);
        await expect(inputVenta).toBeVisible();
        await inputVenta.fill(String(venta));
        console.log('VALOR DE VENTA ALTERADA OK:', venta);

        const compra = Math.floor(Math.random() * (5000 - 4500 + 1)) + 4500;
        const inputCompra = page.getByLabel(/valor de compra/i);
        await expect(inputCompra).toBeVisible();
        await inputCompra.fill(String(compra));
        console.log('VALOR DE COMPRA ALTERADA OK:', compra);

        const hoje = new Date();
        const datahoje = hoje.toLocaleDateString('pt-BR');
        const inputData = page
        .locator('.q-field')
        .filter({ hasText: /vig[eê]ncia/i })
        .first()
        .locator('input');
        await expect(inputData).toBeVisible();
        await inputData.fill(datahoje);
        console.log('INICIO DE VIGÊNCIA ALTERADA OK', datahoje);
        
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
        console.log('CLICOU EM SALVAR COTACAO');  
    }
    else{
        console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EDITAR.');  
    }
    
    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);    
});