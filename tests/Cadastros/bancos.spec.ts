import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora} from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';
import { obterNomePessoaAleatorio } from '../../utils/nomescompletos';

test('Teste de Cadastro de Bancos', async ({ page }) => {    
    test.setTimeout(60000); 
    await loginCompleto(page);       

    const salvarBancoPromise = page.waitForResponse((response) =>
    response.url().includes('/api/conta-bancaria') &&
    ['POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300);    
    
    const finBtn = page.getByText(/financeiro/i).first();
    await expect(finBtn).toBeVisible();
    await finBtn.click();
    console.log('✅ Clicou em Financeiro');    

    await page.waitForTimeout(1000);
    // Adicionado await faltante aqui
    await page.locator('a[href*="financeiro/contas"]').click();
    console.log('✅ Clicou em Finaceiro Banco');            
    
    const btnCadastrar = page.getByText(/cadastrar nova conta/i).first();
    await btnCadastrar.waitFor({ state: 'visible' });
    await btnCadastrar.click({ force: true });
    console.log('✅ Clicou em Cadastrar nova conta');  
    await capturarRequisicoesApi(page);      

    console.log('📝 DADOS ENVIADOS PRA API');           
    
    await page.locator('.q-select').nth(0).click();
    const menuItems = page.locator('.q-menu .q-item, .q-portal .q-item, .q-virtual-scroll__content .q-item, [role="option"]');
    await expect(menuItems.first()).toBeVisible({ timeout: 8000 });
    const primeiraOpcao = menuItems.first();
    await primeiraOpcao.scrollIntoViewIfNeeded().catch(() => {});
    const textoPrimeira = (await primeiraOpcao.innerText()).replace(/\s+/g, ' ').trim();
    await primeiraOpcao.click({ force: true });
    console.log('✅ Selecionou um Banco:', textoPrimeira.toUpperCase());  
    
    await page.waitForTimeout(2000);  
    await page.locator('.q-select').nth(1).click();
    const opcaoCliente = page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]');
    await opcaoCliente.waitFor({ state: 'visible' });    
    const textoCliente = (await opcaoCliente.innerText()).replace(/\s+/g, ' ').trim();
    await opcaoCliente.click();      
    console.log('✅ Selecionou o tipo de conta:', textoCliente.toUpperCase());

    const agencia = `315`;
    await page.getByLabel(/agência/i).fill(agencia);
    console.log('✅ Agência:', agencia);

    const conta = `1488777-5`;
    await page.getByLabel(/número da conta/i).fill(agencia);
    console.log('✅ Número da Conta:', conta);
    
    const descricao = `CONTA CORRENTE ${Date.now()}`;
    await page.getByLabel(/descrição/i).fill(descricao);
    console.log('✅ Descrição da Conta:', descricao.toUpperCase());

    const gerente = obterNomePessoaAleatorio();
    await page.getByLabel(/gerente/i).fill(gerente);
    console.log('✅ Gerente do Banco:', gerente.toUpperCase());   
        
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
            
            return url.includes('/api/conta-bancaria') && 
                   ['POST', 'GET'].includes(metodo) && 
                   response.status() >= 200 && 
                   response.status() < 300;
        }, { timeout: 30000 }),
        btnSalvar.click() 
    ]);   
     await capturarRequisicoesApi(page);        
    
    const urlCompletaPost = respostaSalvar.url();
    console.log("🌐 A URL capturada do POST é:", urlCompletaPost);

    const salvarBancoResponse = await salvarBancoPromise;
    const dadosSalvos = await salvarBancoResponse.json();
    console.log('✅ DADOS RETORNADOS NA CRIAÇÃO');
    console.log(JSON.stringify(dadosSalvos, null, 2));
   
    const dadosTratados = await respostaSalvar.json();
    console.log('✅ REQUISIÇÃO CAPTURADA COM SUCESSO!');    
    
    let idBanco = '';
    if (dadosTratados && dadosTratados.controle) {
        idBanco = dadosTratados.controle.toString().trim();
    } else if (dadosTratados.data && dadosTratados.data[0] && dadosTratados.data[0].controle) {
        idBanco = dadosTratados.controle.toString().trim();
    } else if (dadosTratados[0] && dadosTratados[0].controle) {
        idBanco = dadosTratados[0].controle.toString().trim();
    }

    if (!idBanco) {
        throw new Error('Não foi possível extrair o ID de "controle" da resposta da API.');
    }        
    
    const urlRegistroCriado = `${urlCompletaPost}/${idBanco}`;                
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
    console.log('✅ Novo Controle:', idBanco);        
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
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});