import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Edição de datos espécies', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });    
    await loginCompleto(page);    
 
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('CLICOU EM CADASTRO');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/especies"]').click()
    console.log('CLICOU EM ESPÉCIES');     
    
    await page.waitForSelector('table');    
    await page.locator('.q-skeleton').first().waitFor({ state: 'detached', timeout: 10000 });    
    const trashIcons = await page.locator('table img[src*="trash"]').count();
    console.log('Quantidade de ícones de lixo:', trashIcons);

    if (trashIcons > 0) {       
        await page.locator('table img[src="/icons/edit.svg"]').first().click();
        console.log('CLICOU NO ÍCONE DE EDITAR');    

        await page.waitForTimeout(1000);
        const descricao = `TEST ESPÉCIE ALTERADA ${Date.now()}`;
        await page.getByLabel(/descrição/i).fill(descricao);
        console.log('DESCRIÇÃO DE ESPÉCIE ALTERADA OK:', descricao);

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
        const moedaField = page.locator('[aria-label="Moeda de cotação (diferente da sua empresa)"]').first();
        await moedaField.scrollIntoViewIfNeeded();
        await expect(moedaField).toBeVisible();    
        await moedaField.evaluate(el => (el as HTMLElement).click());    
        const menu1= page.locator('.q-menu');
        await expect(menu1).toBeVisible();    
        const moedas = ['usd', 'brl', 'pyg', 'cad', 'eur', 'gbp'];    
        const moedaEscolhida = moedas[Math.floor(Math.random() * moedas.length)];
        const opcao = menu1.locator('.q-item', {
        hasText: new RegExp(moedaEscolhida, 'i')
        }).first();
        await opcao.click();
        console.log('MOEDA DE COTAÇÃO ALTERADA OK:', moedaEscolhida);

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
    }
    else{
        console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EDITAR.');  
    }

    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);    
});