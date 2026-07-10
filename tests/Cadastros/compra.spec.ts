import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Teste de Cadastro de Compras', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);      
    
    await page.waitForTimeout(2000);           
    const salvarCompraPromise = page.waitForResponse((response) =>
    response.url().includes('/api/py/compra') &&
    ['POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300);
    

    const comprasBtn = page.getByText(/compras/i).first();
    await expect(comprasBtn).toBeVisible({ timeout: 5000 });
    await comprasBtn.click();
    console.log('CLICOU EM COMPRAS');

    await page.locator('a[href*="compras/listagem"]').click();
    console.log('CLICOU EM LISTAGEM DE COMPRAS');  

    const btnCadastrar = page.getByText(/cadastrar compra/i).first();
    await btnCadastrar.click();
    console.log('CLICOU EM CADASTRAR COMPRA');
    
    await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() => { document.body.style.zoom = '0.8'; });
   
    await page.waitForTimeout(2000);
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataISO = `${dia}-${mes}-${ano}`;
    await page.getByLabel(/data emissão/i).fill(dataISO);
    console.log('DATA DE EMISSÃO OK:', dataISO);

    await page.waitForTimeout(2000);
    const hojer = new Date();
    const diar = String(hojer.getDate()).padStart(2, '0');
    const mesr = String(hojer.getMonth() + 1).padStart(2, '0');
    const anor = hoje.getFullYear();
    const dataISOr = `${diar}-${mesr}-${anor}`;
    await page.getByLabel(/data de recebimento/i).fill(dataISOr);
    console.log('DATA DE RECEBIMENTO OK:', dataISOr);

    const numeroNota = Math.floor(Math.random() * 1000) + 1;
    const campoNumero = page.locator('.q-field').filter({ hasText: /n° nota/i }).last();
    await campoNumero.locator('input').fill(numeroNota.toString());
    console.log('NUMERO DE NOTA OK:', numeroNota.toString().trim());
    
    await page.locator('.q-select').nth(0).click();
    await page.locator('.q-menu .q-item').first().click();
    const fornecedor = await page.locator('input[aria-label="Fornecedor"]').inputValue();
    console.log('SELECIONOU UM FORNECEDOR OK:', fornecedor);  
    
    const botaoItens = page.locator('button').filter({ has: page.locator('i:text("format_list_bulleted")') }).first();
    await botaoItens.click();
    console.log('CLICOU EM ITEM DA FATURA OK');      
    
    await page.getByText('Seleção de produto(s)').waitFor({ state: 'visible' });
    const ativos = page.getByText('Ativo', { exact: true });
    await ativos.nth(0).click();
    await ativos.nth(1).click();
    await ativos.nth(2).click();    
    console.log('SELECIONOU VÁRIOS ITENS DA COMPRA OK');  

    await page.waitForTimeout(3000);

    await page.locator('.q-btn')
    .filter({ hasText: /adicionar/i })
    .click({ force: true });
    console.log('CLICOU EM ADICIONAR ITENS'); 

   await page.waitForTimeout(2000);
    const salvar = page
    .locator('button.q-btn')
    .filter({ hasText: 'SALVAR' });
    await salvar.first().waitFor({ state: 'visible' });
    await salvar.first().click({ force: true });         
    console.log('CLICOU EM SALVAR ITENS');  

    await page.waitForTimeout(2000);
    const salvar2 = page
    .locator('button.q-btn')
    .filter({ hasText: 'SALVAR' });
    await salvar2.first().waitFor({ state: 'visible' });
    await salvar2.first().click({ force: true });         
    console.log('CLICOU EM SALVAR COMPRA');      

    const modal1 = page.locator('.q-dialog:visible').first();
    await modal1.waitFor({ state: 'visible', timeout: 15000 });    
    const btnConfirmar1 = modal1.locator('.q-btn', { hasText: /confirmar|salvar/i }).first();   
    await btnConfirmar1.waitFor({ state: 'visible', timeout: 5000 });   
    await page.waitForTimeout(500);    
    await btnConfirmar1.click({ force: true });
    console.log('CLICOU EM CONFIRMAR TOTAIS');
    
    //await modal1.waitFor({ state: 'hidden', timeout: 10000 });
    await page.waitForTimeout(800); 
    
    const modal2 = page.locator('.q-dialog:visible').first();
    await modal2.waitFor({ state: 'visible', timeout: 15000 });
    const btnConfirmar2 = modal2.locator('.q-btn', { hasText: /confirmar|salvar/i }).first();
    await btnConfirmar2.waitFor({ state: 'visible', timeout: 5000 });    
    await page.waitForTimeout(500);
    await btnConfirmar2.click({ force: true });
    console.log('CLICOU EM CONFIRMAR FÓRMULA DE PREÇO');       

    const salvarPessoaResponse = await salvarCompraPromise;
    const dadosSalvos = await salvarPessoaResponse.json();
    console.log('***DADOS RETORNADOS NA CRIAÇÃO***');
    console.log(JSON.stringify(dadosSalvos, null, 2));  

    await capturarRequisicoesApi(page); 
   // await page.waitForTimeout(4000);
   

   // await modal2.waitFor({ state: 'hidden', timeout: 10000 });  
});