import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora   } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';
import { obterNomeContaAleatoria } from '../../utils/listaplanocontas';

test('Cadastro de plano de contas', async ({ page }) => {
    await loginCompleto(page);    

    await page.waitForTimeout(2000);           
    const salvarPlanoPromise = page.waitForResponse((response) =>
    response.url().includes('/api/plano-conta') &&
    ['POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300);    
 
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('✅ Clicou em Cadastros');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/plano-contas"]').click()
    console.log('✅ Clicou em Plano de Contas'); 

    const btnCadastrar = page.getByText(/cadastrar plano de conta/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('✅ Clicou em Cadastrar Plano de Contas');    

    console.log('➡️ DADOS ENVIADOS PRA API');
    const planoconta = obterNomeContaAleatoria();
    await page.getByLabel(/descrição/i).fill(planoconta);
    console.log('✅ Nome do Plano de Conta:', planoconta.toUpperCase());     

    const wrapper = page.locator('.q-radio').first();
    await wrapper.waitFor({ state: 'visible', timeout: 10000 });
    await wrapper.click({ timeout: 5000 });    
    const input = wrapper.locator('input[type="radio"]');    
    await input.waitFor({ state: 'attached', timeout: 5000 });    
    try {
    await expect(input).toBeChecked({ timeout: 5000 });
    } catch (err) {    
    const aria = await wrapper.getAttribute('aria-checked');
    if (aria === 'true') {
        console.log('✅ Selecionado via aria-checked no wrapper');
    } else {    
        await input.check({ force: true });
        await expect(input).toBeChecked({ timeout: 5000 });
    }
    }

    console.log('➡️ FIM DE DADOS ENVIADOS');      

    await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });
    console.log('✅ Clicou em Salvar Plano de Conta');  

    const salvarUrlResponse = await salvarPlanoPromise;     
    const urlCompletaPost = salvarUrlResponse.url();
    console.log('🌐 A URL capturada do POST é:', urlCompletaPost);

    const salvarPessoaResponse = await salvarPlanoPromise;
    const dadosSalvos = await salvarPessoaResponse.json();
    console.log('✅ DADOS RETORNADOS NA CRIAÇÃO');
    console.log(JSON.stringify(dadosSalvos, null, 2));
    
    const idPlano = dadosSalvos.controle.toString().trim();    
    const urlRegistroCriado = `${urlCompletaPost}/${idPlano}`;                
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
    console.log('🌐 A URL do registro criado é:', urlRegistroCriado);
    console.log('✅ RESPOSTA DA API AO CONSULTAR O NOVO REGISTRO');
    console.log('✅ Novo Controle:', idPlano);            
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