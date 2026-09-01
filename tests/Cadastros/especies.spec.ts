import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Cadastro de espécies', async ({ page }) => {
    // ⏳ Aumenta o tempo limite do teste para 60 segundos
    test.setTimeout(60000);

    await loginCompleto(page);    

    await page.waitForTimeout(2000);       
 
    await page.getByText(/cadastros/i).click({ force: true }); 
    console.log('✅ Clicou em Cadastro');

    await page.waitForTimeout(1000);
    await page.locator('a[href*="registros/metodos-pagos"]').click();
    console.log('✅ Clicou em Espécies'); 

    const btnCadastrar = page.getByText(/cadastrar espécie/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('✅ Clicou em Cadastrar Espécie');

    console.log('➡️ DADOS ENVIADOS PRA API');
    const descricao = `ESPÉCIE EFECTIVO ${Date.now()}`;
    await page.getByLabel(/descrição/i).fill(descricao);
    console.log('✅ Descrição da Espécie:', descricao.toUpperCase());

    await page.locator('[aria-label="Tipo do cartão"]').click({ force: true });
    const cartao = page.locator('.q-menu:visible');
    await cartao.waitFor();
    await cartao
      .locator('.q-item')
      .filter({ hasText: /não é cartão|débito|crédito/i })
      .first()
      .click({ force: true });
    const tipocar = await page.locator('input[aria-label="Tipo do cartão"]').inputValue();      
    console.log('✅ Tipo do Cartão:', tipocar.toUpperCase());

    //const moedaField = page.locator('[aria-label="Moeda de cotação (diferente da sua empresa)"]').first();

    await page.waitForTimeout(1000);
    await page.locator('.q-select').nth(1).click();
    const opcao = Math.floor(Math.random() * 6) + 1;
    const x = opcao;
    const menuItems = page.locator('.q-menu .q-item, .q-portal .q-item, .q-virtual-scroll__content .q-item, [role="option"]');
    await expect(menuItems.nth(x)).toBeVisible({ timeout: 8000 });
    const primeiraOpcao = menuItems.nth(x);
    await primeiraOpcao.scrollIntoViewIfNeeded().catch(() => {});
    const textoPrimeira = (await primeiraOpcao.innerText()).replace(/\s+/g, ' ').trim();
    await primeiraOpcao.click({ force: true });
    console.log('✅ Moeda de cotação:', textoPrimeira.toUpperCase());  

    await page.waitForTimeout(2000);
    await page.locator('.q-select').nth(2).click({ force: true });    
    const primeiraOpcaoMenu = page.locator('.q-menu').last().locator('.q-item').first();
    await primeiraOpcaoMenu.waitFor({ state: 'visible', timeout: 5000 });
    await primeiraOpcaoMenu.click({ force: true });    
    const tipoesp = await page.locator('input[aria-label="Tipo de espécie"]').inputValue();      
    console.log('✅ Selecionou um Tipo de Espécie:', tipoesp.toUpperCase());

    console.log('➡️ FIM DE DADOS ENVIADOS***');    

    // 🎯 Define a promessa IMEDIATAMENTE ANTES do clique que dispara a requisição
    const salvarEspeciePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/especie') &&
        response.request().method() === 'POST' &&
        response.status() >= 200 &&
        response.status() < 300,
      { timeout: 15000 }
    );

    await page.locator('.q-btn')
      .filter({ hasText: /salvar|guardar/i })
      .click({ force: true });
    console.log('✅ Clicou em Salvar');  

    // Aguarda e armazena a resposta
    const salvarEspecieResponse = await salvarEspeciePromise;     
    const urlCompletaPost = salvarEspecieResponse.url();
    console.log('🌐 A URL capturada do POST é:', urlCompletaPost);

    const dadosSalvos = await salvarEspecieResponse.json();
    console.log('✅ DADOS RETORNADOS NA CRIAÇÃO');
    console.log(JSON.stringify(dadosSalvos, null, 2));
    
    const idEspecie = dadosSalvos.controle.toString().trim();
    console.log('CONTROLE:', idEspecie);      
    
    const urlRegistroCriado = `${urlCompletaPost}/${idEspecie}`;     
    const headersOriginais = salvarEspecieResponse.request().headers();
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
    console.log('✅ Novo Controle:', idEspecie);      
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