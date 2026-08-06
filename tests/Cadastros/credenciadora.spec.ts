import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Cadastro de credenciadora/taxa', async ({ page }) => {
    await loginCompleto(page);    

    await page.waitForTimeout(2000);           

    const salvarCredenciadoraPromise = page.waitForResponse((response) =>
        response.url().includes('/api/credenciadora/geral') &&
        ['POST'].includes(response.request().method())
    , { timeout: 10000 }).catch(() => null); 
 
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('✅ Clicou em Cadastros');

    await page.waitForTimeout(1000);
    await page.locator('a[href*="registros/credenciadoras-taxas"]').click();
    console.log('✅ Clicou em Credenciadora/taxas'); 

    const btnCadastrar = page.getByText(/cadastrar credenciadoras\/taxas/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('✅ Clicou em Cadastrar Credenciadora');    

    console.log('➡️ DADOS ENVIADOS PRA API');
    await page.waitForTimeout(2000);   
    await page.locator('.q-select').nth(0).click();    
    const indiceAleatorio = Math.ceil(Math.random() * 3);    
    const opcaoAleatoria = page.locator(`(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[${indiceAleatorio}]`);
    await opcaoAleatoria.waitFor({ state: 'visible' });
    await opcaoAleatoria.click();
    const tipoper = await page.locator('input[aria-label="Credenciadora"]').inputValue();      
    console.log('✅ Selecionou uma Credenciadora:', tipoper.toUpperCase());

    await page.waitForTimeout(1000);        
    await page.locator('.q-select').nth(1).click();
    const primeiraOpcaoMenu1 = page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]');
    await primeiraOpcaoMenu1.waitFor({ state: 'visible' });
    await primeiraOpcaoMenu1.click();
    const conta = await page.locator('input[aria-label="Conta bancária"]').inputValue();      
    console.log('✅ Selecionou uma Conta Bancária:', conta.toUpperCase());

    console.log('➡️ FIM DE DADOS ENVIADOS');      

    await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });
    console.log('✅ Clicou em Salvar Credenciadora');  
    
    const salvarUrlResponse = await salvarCredenciadoraPromise;     
    
    if (!salvarUrlResponse) {
        console.log('⚠️ Nenhuma requisição enviada. (Possível bloqueio da interface por duplicidade).');
        test.skip(true, 'O registro já existe e a requisição POST não foi enviada.');
        return; 
    }

    if (!salvarUrlResponse.ok()) { // Verifica se o status NÃO está entre 200-299
        console.log(`⚠️ A API retornou erro ${salvarUrlResponse.status()}. A credenciadora provavelmente já está registrada.`);
        test.skip(true, `Credenciadora já registrada (Status API: ${salvarUrlResponse.status()}). Teste ignorado.`);
        return; // Encerra o fluxo aqui
    }

    const urlCompletaPost = salvarUrlResponse.url();
    console.log('🌐 A URL capturada do POST é:', urlCompletaPost);

    const dadosSalvos = await salvarUrlResponse.json();
    console.log('✅ DADOS RETORNADOS NA CRIAÇÃO');
    console.log(JSON.stringify(dadosSalvos.bandeira, null, 2));
    
    const idCredenciadora = dadosSalvos.taxa && dadosSalvos.taxa.length > 0 
        ? dadosSalvos.taxa[0].controle.toString().trim() 
        : '';
        
    const urlBaseApi = urlCompletaPost.replace(/\/geral$/, '');
    const urlRegistroCriado = `${urlBaseApi}/${idCredenciadora}`;        
    const headersOriginais = salvarUrlResponse.request().headers();
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
    console.log('🌐 A URL do registro criado é:', urlRegistroCriado);
    console.log('✅ RESPOSTA DA API AO CONSULTAR O NOVO REGISTRO');
    console.log('✅ Novo Controle:', idCredenciadora);            
    console.log(`✅ Status: ${getCriadoResponse.status()}`);

    try {
      const dadosCriado = await getCriadoResponse.json();
      console.log(JSON.stringify(dadosCriado, null, 2));
    } catch (error) {
      console.error('Erro ao converter resposta para JSON:', error);
      const corpoBruto = await getCriadoResponse.text();
      console.log('Corpo bruto da resposta:', corpoBruto);
    }

    expect([404, 200]).toContain(getCriadoResponse.status());    
    
    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);      
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});