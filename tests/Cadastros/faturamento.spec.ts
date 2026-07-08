import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Teste de Cadastro de Faturas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);       
    
    await page.waitForTimeout(2000);           
    const salvarFaturaPromise = page.waitForResponse((response) =>
    response.url().includes('/api/py/venda') &&
    ['POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300);
    
    await page.waitForTimeout(2000);        
    const venBtn = page.getByText(/vendas/i).first();
    await expect(venBtn).toBeVisible();
    await venBtn.click();
    console.log('CLICOU EM VENDAS');
  
    await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/facturacion/, { timeout: 15000 }),
      page.locator('a[href*="facturacion"]').first().click()
    ]);
    console.log('CLICOU EM FATURAMENTO');

 /*   await page.emulateMedia({ media: 'screen' });
      await page.evaluate(() => {
      document.body.style.zoom = '0.7'; });
      console.log('🔍 Zoom ajustado para 70% via CSS');*/

    await page.waitForTimeout(1000);
    const btnCadastrar = page.getByText(/cadastrar fatura/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU EM CADASTRAR FATURA');

    await page.emulateMedia({ media: 'screen' });
      await page.evaluate(() => {
      document.body.style.zoom = '0.8'; });
      console.log('🔍 Zoom ajustado para 80% via CSS');
   
    console.log('***DADOS ENVIADOS PRA API***');  
    await page.waitForTimeout(2000);
    await page.locator('.q-select').nth(5).click();
    await page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]').click();
    console.log('SELECIONOU UM DESTINATÁRIO/REMITENTE OK');  

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
    await ativos.nth(3).click({ force: true });
    console.log('SELECIONOU VÁRIOS ITENS DA FATURA OK');  

    await page.waitForTimeout(3000);

    await page.locator('.q-btn')
    .filter({ hasText: /adicionar/i })
    .click({ force: true });
    console.log('CLICOU EM ADICIONAR');  

    await page.waitForTimeout(1000);

    const finalizar = page
    .locator('button.q-btn')
    .filter({ hasText: 'SALVAR' });
    await finalizar.first().waitFor({ state: 'visible' });
    await finalizar.first().click({ force: true }); 


    const salvarPessoaResponse = await salvarFaturaPromise;
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

    expect([404, 200]).toContain(getCriadoResponse.status());    


    //await page.waitForTimeout(14000);

    //await capturarRequisicaoApiCadastro(page, '/api/py/venda'); 
     
   // await capturarRequisicoesApi(page); 
   // await page.waitForTimeout(4000);         
});