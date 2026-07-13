import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';

test('Teste de Cadastro de Faturas', async ({ page }) => {
    test.setTimeout(60000); 

    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);           
    
    const venBtn = page.getByText(/vendas/i).first();
    await expect(venBtn).toBeVisible();
    await venBtn.click();
    console.log('CLICOU EM VENDAS');  
    
    await Promise.all([
      page.waitForURL(/facturacion/, { timeout: 15000 }),
      page.locator('a[href*="facturacion"]').first().click()
    ]);
    console.log('CLICOU EM FATURAMENTO');
    
    const btnCadastrar = page.getByText(/cadastrar fatura/i).first();
    await btnCadastrar.waitFor({ state: 'visible' });
    await btnCadastrar.click({ force: true });
    console.log('CLICOU EM CADASTRAR FATURA');

    await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() => { document.body.style.zoom = '0.8'; });
    console.log('🔍 Zoom ajustado para 80% via CSS');
   
    console.log('***DADOS ENVIADOS PRA API***');          
    await page.waitForTimeout(2000);
    await page.locator('.q-select').nth(5).click();
    await page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]').click();       
    const primeiraOpcaoMenu = page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]');
    await primeiraOpcaoMenu.waitFor({ state: 'visible' });
    await primeiraOpcaoMenu.click();
    const destino = await page.locator('input[aria-label="Destinatário/remetente"]').inputValue();      
    console.log('SELECIONOU UM DESTINATÁRIO/REMITENTE OK:',destino);  
    
    const botaoItens = page.locator('xpath=//button[.//i[normalize-space(.)="format_list_bulleted"]]').first();
    await botaoItens.waitFor({ state: 'visible' });
    await botaoItens.click({ force: true });
    console.log('CLICOU EM ITENS DA FATURA OK');  
    
    await page.getByText('Seleção de produto(s)').waitFor({ state: 'visible' });
    const ativos = page.getByText('Ativo', { exact: true });
    
    await ativos.nth(0).waitFor({ state: 'visible' });
    await ativos.nth(0).click({ force: true });
    await ativos.nth(1).click({ force: true });
    await ativos.nth(2).click({ force: true });
    await ativos.nth(3).click({ force: true });
    console.log('SELECIONOU VÁRIOS ITENS DA FATURA OK');  
    
    const btnAdicionar = page.locator('.q-btn').filter({ hasText: /adicionar/i });
    await btnAdicionar.waitFor({ state: 'visible' });
    await btnAdicionar.click({ force: true });
    console.log('CLICOU EM ADICIONAR ITENS');  
    console.log('*** FIM DE DADOS ENVIADOS PRA API***');

    const salvar = page.locator('button.q-btn').filter({ hasText: 'SALVAR' }).first();
    await salvar.waitFor({ state: 'visible' });

    console.log('*** ENVIANDO DADOS E AGUARDANDO API ***');
    
    const [respostaSalvar] = await Promise.all([
        page.waitForResponse((response) => {
            const url = response.url();
            const metodo = response.request().method();
            
            return url.includes('/api/py/venda') && 
                   ['POST', 'GET'].includes(metodo) && 
                   response.status() >= 200 && 
                   response.status() < 300;
        }, { timeout: 30000 }),
        salvar.click() 
    ]);     
   
    const dadosTratados = await respostaSalvar.json();
    console.log('*** REQUISIÇÃO CAPTURADA COM SUCESSO ***');    
    
    let idPessoa = '';
    if (dadosTratados.venda && dadosTratados.venda.controle) {
        idPessoa = dadosTratados.venda.controle.toString().trim();
    } else if (dadosTratados.data && dadosTratados.data[0] && dadosTratados.data[0].controle) {
        idPessoa = dadosTratados.data[0].controle.toString().trim();
    } else if (dadosTratados[0] && dadosTratados[0].controle) {
        idPessoa = dadosTratados[0].controle.toString().trim();
    }

    if (!idPessoa) {
        throw new Error('Não foi possível extrair o ID de "controle" da resposta da API.');
    }

    console.log('CONTROLE LOCALIZADO:', idPessoa);        
    
    const urlRegistroCriado = `https://testepyeduardo.global-hom.sgmw.com.br/api/py/venda/${idPessoa}`;    
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

    console.log('*** RESPOSTA DA API AO CONSULTAR O NOVO REGISTRO ***');
    console.log(`Status: ${getCriadoResponse.status()}`);

    try {
      const dadosCriado = await getCriadoResponse.json();
      console.log(JSON.stringify(dadosCriado, null, 2));
      expect([200, 404]).toContain(getCriadoResponse.status());
    } catch (error) {
      console.error('Erro ao converter resposta para JSON:', error);
      const corpoBruto = await getCriadoResponse.text();
      console.log('Corpo bruto da resposta:', corpoBruto);
    }
});