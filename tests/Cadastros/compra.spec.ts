import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Teste de Cadastro de Faturas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);       
    
/*    await page.waitForTimeout(2000);           
    const salvarFaturaPromise = page.waitForResponse((response) =>
    response.url().includes('/api/py/venda') &&
    ['POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300);*/
    
  const comprasBtn = page.getByText(/compras/i).first();
    await expect(comprasBtn).toBeVisible({ timeout: 5000 });
    await comprasBtn.click();
    console.log('CLICOU EM COMPRAS');

    await page.waitForTimeout(1000);
    page.locator('a[href*="compras/listagem"]').click()
    console.log('CLICOU EM LISTAGEM DE COMPRAS');  

    await page.waitForTimeout(1000);
    const btnCadastrar = page.getByText(/cadastrar compra/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU EM CADASTRAR COMPRA');

    await page.emulateMedia({ media: 'screen' });
      await page.evaluate(() => {
      document.body.style.zoom = '0.8'; });
      console.log('🔍 Zoom ajustado para 80% via CSS');
   
    console.log('***DADOS ENVIADOS PRA API***');  

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

    const numero = Math.floor(Math.random() * 1000) + 1;
    const campoNumero = page.locator('.q-field')
    .filter({ hasText: /n° nota/i })
    .last();
    await campoNumero.locator('input').fill(numero.toString());
    console.log('NUMERO DE NOTA OK:', numero);

    await page.waitForTimeout(2000);
    await page.locator('.q-select').nth(0).click();
    await page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]').click();
    console.log('SELECIONOU UM FORNECEDOR OK');  

    await page.waitForTimeout(4000);

    const botaoItens = page.locator(
    'xpath=//button[.//i[normalize-space(.)="format_list_bulleted"]]'
    ).first();
    await botaoItens.waitFor({ state: 'visible' });
    await botaoItens.click({ force: true });
    console.log('CLICOU EM ITEM DA FATURA OK');  
    
    await page.getByText('Seleção de produto(s)').waitFor({ state: 'visible' });
    const ativos = page.getByText('Ativo', { exact: true });
    await ativos.nth(0).click({ force: true });
    await ativos.nth(1).click({ force: true });
    await ativos.nth(2).click({ force: true });    
    console.log('SELECIONOU VÁRIOS ITENS DA COMPRA OK');  

    await page.waitForTimeout(3000);

    await page.locator('.q-btn')
    .filter({ hasText: /adicionar/i })
    .click({ force: true });
    console.log('CLICOU EM ADICIONAR');  

    await page.waitForTimeout(2000);
    const salvar = page
    .locator('button.q-btn')
    .filter({ hasText: 'SALVAR' });
    await salvar.first().waitFor({ state: 'visible' });
    await salvar.first().click({ force: true });     
    console.log('CLICOU EM SALVAR');  

    await page.waitForTimeout(2000);
    const salvar2 = page
    .locator('button.q-btn')
    .filter({ hasText: 'SALVAR' });
    await salvar2.last().waitFor({ state: 'visible' });
    await salvar2.last().click({ force: true });     
    console.log('CLICOU EM SALVAR');  

    await page.waitForTimeout(2000);
    const confirmar = page
    .locator('button.q-btn')
    .filter({ hasText: 'CONFIRMAR' });
    await confirmar.first().waitFor({ state: 'visible' });
    await confirmar.first().click({ force: true });     
    console.log('CLICOU EM CONFIRMAR');  

    await page.waitForTimeout(2000);
    const confirmar1 = page
    .locator('button.q-btn')
    .filter({ hasText: 'CONFIRMAR' });
    await confirmar1.first().waitFor({ state: 'visible' });
    await confirmar1.first().click({ force: true });     
    console.log('CLICOU EM CONFIRMAR');  

    

    
   
  /*  const salvarPessoaResponse = await salvarFaturaPromise;
    const dadosSalvos = await salvarPessoaResponse.json();
    console.log('***DADOS RETORNADOS NA CRIAÇÃO***');
    console.log(JSON.stringify(dadosSalvos, null, 2));
    
    const idPessoa = dadosSalvos.venda.controle.toString().trim();
    console.log('CONTROLE:', idPessoa);    
    const urlRegistroCriado = `https://testepyeduardo.global-hom.sgmw.com.br/api/py/venda/${idPessoa}`;    
    const headersOriginais = salvarPessoaResponse.request().headers();
    const headersGetRegistro: Record<string, string> = {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      authorization: headersOriginais['authorization'],
      'x-xsrf-token': headersOriginais['x-xsrf-token'],
      'x-tenant': headersOriginais['x-tenant'],
      'x-empresa': headersOriginais['x-empresa'],
    };
    
    const getCriadoResponse = await page.request.get(urlRegistroCriado, {
      headers: headersGetRegistro,
    });

    console.log('***RESPOSTA DA API AO CONSULTAR O NOVO REGISTRO***');
    console.log(`Status: ${getCriadoResponse.status()}`);

    try {
      const dadosCriado = await getCriadoResponse.json();
      console.log(JSON.stringify(dadosCriado, null, 2));
    } catch (error) {
      console.error('Erro ao converter resposta para JSON:', error);
      const corpoBruto = await getCriadoResponse.text();
      console.log('Corpo bruto da resposta:', corpoBruto);
    }

    expect([404, 200]).toContain(getCriadoResponse.status());   */ 


    //await page.waitForTimeout(14000);

    //await capturarRequisicaoApiCadastro(page, '/api/py/venda'); 
     
   // await capturarRequisicoesApi(page); 
   // await page.waitForTimeout(4000);         
});