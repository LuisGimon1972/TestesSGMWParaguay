import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora} from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Teste de Cadastro de Recebimento', async ({ page }) => {    
    test.setTimeout(60000); 
    await loginCompleto(page);       

    const salvarCaixaPromise = page.waitForResponse((response) =>
    response.url().includes('/api/financeiro/movimento') &&
    ['POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300);    
    
    const finBtn = page.getByText(/financeiro/i).first();
    await expect(finBtn).toBeVisible();
    await finBtn.click();
    console.log('✅ Clicou em Financeiro');    

    await page.waitForTimeout(1000);
    // Adicionado await faltante aqui
    await page.locator('a[href*="financeiro/caixa"]').click();
    console.log('✅ Clicou em Finaceiro Caixa');            
    
    const btnCadastrar = page.getByText(/cadastrar movimento no caixa/i).first();
    await btnCadastrar.waitFor({ state: 'visible' });
    await btnCadastrar.click({ force: true });
    console.log('✅ Clicou em Cadastrar movimento no caixa');   

    console.log('📝 DADOS ENVIADOS PRA API');           
    
    await page.locator('.q-select').nth(1).click();
    const menuItems = page.locator('.q-menu .q-item, .q-portal .q-item, .q-virtual-scroll__content .q-item, [role="option"]');
    await expect(menuItems.first()).toBeVisible({ timeout: 8000 });
    const primeiraOpcao = menuItems.first();
    await primeiraOpcao.scrollIntoViewIfNeeded().catch(() => {});
    const textoPrimeira = (await primeiraOpcao.innerText()).replace(/\s+/g, ' ').trim();
    await primeiraOpcao.click({ force: true });
    console.log('✅ Selecionou a primeira opção do menu:', textoPrimeira.toUpperCase());  
    
    await page.waitForTimeout(2000);  
    await page.locator('.q-select').nth(2).click();
    const opcaoCliente = page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]');
    await opcaoCliente.waitFor({ state: 'visible' });
    // Captura o texto do item ANTES de clicar
    const textoCliente = (await opcaoCliente.innerText()).replace(/\s+/g, ' ').trim();
    await opcaoCliente.click();      
    console.log('✅ Selecionou um Cliente:', textoCliente.toUpperCase());
    
    const descricao = `ESPÉCIE EFECTIVO ${Date.now()}`;
    await page.getByLabel(/descrição/i).fill(descricao);
    console.log('✅ Descrição da Espécie:', descricao.toUpperCase());
    
    await page.locator('.q-select').nth(3).click();
    const opcaoEspecie = page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]');
    await opcaoEspecie.waitFor({ state: 'visible' });
    const textoEspecie = (await opcaoEspecie.innerText()).replace(/\s+/g, ' ').trim();
    await opcaoEspecie.click();      
    console.log('✅ Selecionou uma Espécie:', textoEspecie.toUpperCase());    
    
    await page.locator('.q-select').nth(4).click();
    const opcaoPlano = page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]');
    await opcaoPlano.waitFor({ state: 'visible' });
    const textoPlano = (await opcaoPlano.innerText()).replace(/\s+/g, ' ').trim();
    await opcaoPlano.click();     
    console.log('✅ Selecionou um Plano de Contas:', textoPlano.toUpperCase());            
    
    const valorOrig = Math.floor(Math.random() * 1000) + 1;
    const campoOrig = page.locator('.q-field').filter({ hasText: /valor de saída/i }).last();
    await campoOrig.locator('input').fill(valorOrig.toString());
    console.log('✅ Valor de Saída:', valorOrig.toFixed(0));            
    
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
            
            return url.includes('/api/financeiro/movimento') && 
                   ['POST', 'GET'].includes(metodo) && 
                   response.status() >= 200 && 
                   response.status() < 300;
        }, { timeout: 30000 }),
        btnSalvar.click() 
    ]);   
    
    const urlCompletaPost = respostaSalvar.url();
    console.log("🌐 A URL capturada do POST é:", urlCompletaPost);

    const salvarPagarResponse = await salvarCaixaPromise;
    const dadosSalvos = await salvarPagarResponse.json();
    console.log('✅ DADOS RETORNADOS NA CRIAÇÃO');
    console.log(JSON.stringify(dadosSalvos, null, 2));
   
    const dadosTratados = await respostaSalvar.json();
    console.log('✅ REQUISIÇÃO CAPTURADA COM SUCESSO!');    
    
    let idCaixa = '';
    if (dadosTratados && dadosTratados.controle) {
        idCaixa = dadosTratados.controle.toString().trim();
    } else if (dadosTratados.data && dadosTratados.data[0] && dadosTratados.data[0].controle) {
        idCaixa = dadosTratados.controle.toString().trim();
    } else if (dadosTratados[0] && dadosTratados[0].controle) {
        idCaixa = dadosTratados[0].controle.toString().trim();
    }

    if (!idCaixa) {
        throw new Error('Não foi possível extrair o ID de "controle" da resposta da API.');
    }        
    
    const urlRegistroCriado = `${urlCompletaPost}/${idCaixa}`;                
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
    console.log('✅ Novo Controle:', idCaixa);        
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
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});