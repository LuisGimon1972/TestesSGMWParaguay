import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Teste de Cadastro de Recebimento', async ({ page }) => {    
    test.setTimeout(60000); 
    await loginCompleto(page);       
    
    const salvarPagarPromise = page.waitForResponse((response) =>
    response.url().includes('/api/financeiro') &&
    ['POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300
  );    
    
    const finBtn = page.getByText(/financeiro/i).first();
    await expect(finBtn).toBeVisible();
    await finBtn.click();
    console.log('✅ Clicou em Financeiro');    

    await page.waitForTimeout(1000);
    page.locator('a[href*="financeiro/receber"]').click()
    console.log('✅ Clicou em Finaceiro Pagar');            
    
    const btnCadastrar = page.getByText(/cadastrar recebimento/i).first();
    await btnCadastrar.waitFor({ state: 'visible' });
    await btnCadastrar.click({ force: true });
    console.log('✅ Clicou em Cadastrar Pagamento');   

    console.log('📝 DADOS ENVIADOS PRA API');   
    
    await page.waitForTimeout(2000);
    await page.locator('.q-select').nth(1).click();
    await page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]').click();       
    const primeiraOpcaoMenu = page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]');
    await primeiraOpcaoMenu.waitFor({ state: 'visible' });
    await primeiraOpcaoMenu.click();
    const tipoper = await page.locator('input[aria-label="Tipo de pessoa"]').inputValue();      
    console.log('✅ Selecionou um Tipo de Pessoa:',tipoper.toUpperCase());

    await page.waitForTimeout(2000);
    
    await page.locator('.q-select').nth(2).click();
    await page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[4]').click();       
    const segundoOpcaoMenu = page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]');
    await segundoOpcaoMenu.waitFor({ state: 'visible' });
    await segundoOpcaoMenu.click();
    const cliente = await page.locator('input[aria-label="Cliente"]').inputValue();      
    console.log('✅ Selecionou um Cliente:',cliente.toUpperCase());

    await page.waitForTimeout(2000);
    
    await page.locator('.q-select').nth(3).click();
    await page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]').click();       
    const tercerOpcaoMenu = page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]');
    await tercerOpcaoMenu.waitFor({ state: 'visible' });
    await tercerOpcaoMenu.click();
    const plano = await page.locator('input[aria-label="Cliente"]').inputValue();      
    console.log('✅ Selecionou um Plano de Contas:',plano.toUpperCase());

    const descricao = `ESPÉCIE EFECTIVO ${Date.now()}`;
    await page.getByLabel(/descrição/i).fill(descricao);
    console.log('✅ Descrição da Espécie:', descricao.toUpperCase());

    await page.locator('.q-select').nth(4).click();
    await page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]').click();       
    const quaOpcaoMenu = page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]');
    await quaOpcaoMenu.waitFor({ state: 'visible' });
    await quaOpcaoMenu.click();
    const especie = await page.locator('input[aria-label="Cliente"]').inputValue();      
    console.log('✅ Selecionou uma Espécie:',plano.toUpperCase());

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataISO = `${dia}-${mes}-${ano}`;    
    const inputValidade = page.getByLabel(/data vencimento/i);
    await inputValidade.waitFor({ state: 'visible' });
    await inputValidade.fill(dataISO);  
    console.log('✅ Data de Vencimento:', dataISO); 

    const valorOrig = Math.floor(Math.random() * 1000) + 1;
    const campoOrig = page.locator('.q-field')
    .filter({ hasText: /valor original/i })
    .last();
    await campoOrig.locator('input').fill(valorOrig.toString());
    console.log('✅ Valor Original:', valorOrig.toFixed(0));        
    
    const btnSalvar = page.locator('.q-btn').filter({ hasText: /salvar/i });
    await btnSalvar.waitFor({ state: 'visible' });
    await btnSalvar.click({ force: true });
    console.log('✅ Clicou em Salvar');  
    console.log('📝 FIM DE DADOS ENVIADOS PRA API');   
    

    console.log('✅ ENVIANDO DADOS E AGUARDANDO RETORNO DA API');
    
    const [respostaSalvar] = await Promise.all([
        page.waitForResponse((response) => {
            const url = response.url();
            const metodo = response.request().method();
            
            return url.includes('/api/financeiro') && 
                   ['POST', 'GET'].includes(metodo) && 
                   response.status() >= 200 && 
                   response.status() < 300;
        }, { timeout: 30000 }),
        btnSalvar.click() 
    ]);   
    
    const urlCompletaPost = respostaSalvar.url();
    console.log("🌐 A URL capturada do POST é:", urlCompletaPost);

    const salvarPagarResponse = await salvarPagarPromise;
    const dadosSalvos = await salvarPagarResponse.json();
    console.log('✅ DADOS RETORNADOS NA CRIAÇÃO');
    console.log(JSON.stringify(dadosSalvos, null, 2));
   
    const dadosTratados = await respostaSalvar.json();
    console.log('✅ REQUISIÇÃO CAPTURADA COM SUCESSO!');    
    
    let idPagar = '';
    if (dadosTratados.venda && dadosTratados.controle) {
        idPagar = dadosTratados.controle.toString().trim();
    } else if (dadosTratados.data && dadosTratados.data[0] && dadosTratados.data[0].controle) {
        idPagar = dadosTratados.controle.toString().trim();
    } else if (dadosTratados[0] && dadosTratados[0].controle) {
        idPagar = dadosTratados[0].controle.toString().trim();
    }

    if (!idPagar) {
        throw new Error('Não foi possível extrair o ID de "controle" da resposta da API.');
    }        
    
    const urlRegistroCriado = `${urlCompletaPost}/${idPagar}`;                
    const headersOriginais = respostaSalvar.request().headers();
    const headersGetRegistro: Record<string, string> = {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      authorization: headersOriginais['authorization'] || '',
      'x-xsrf-token': headersOriginais['x-xsrf-token'] || '',
      'x-tenant': headersOriginais['x-tenant'] || '',
      'x-empresa': headersOriginais['x-empresa'] || '',
    };
    
    const getCriadoResponse = await page.request.get(urlRegistroCriado, {
      headers: headersGetRegistro,
    });
    console.log('🌐 A URL do registro criado é:', urlRegistroCriado);
    console.log('✅ RESPOSTA DA API AO CONSULTAR O NOVO REGISTRO');
    console.log('✅ Novo Controle:', idPagar);        
    console.log(`✅ Status: ${getCriadoResponse.status()}`);

    try {
      const dadosCriado = await getCriadoResponse.json();
      console.log(JSON.stringify(dadosCriado, null, 2));
      expect(getCriadoResponse.status()).toBe(200);
    } catch (error) {
      console.error('Erro ao converter resposta para JSON:', error);
      const corpoBruto = await getCriadoResponse.text();
      console.log('Corpo bruto da resposta:', corpoBruto);
    }
    await capturarRequisicoesApi(page);     
});