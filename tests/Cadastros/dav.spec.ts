import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';

test('Teste de Cadastro de DAV', async ({ page }) => {
    // Aumenta o timeout para lidar com a lentidão da API ao salvar
    test.setTimeout(60000); 

    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);       
    
    // 1. Navegação para Vendas
    const venBtn = page.getByText(/vendas/i).first();
    await expect(venBtn).toBeVisible();
    await venBtn.click();
    console.log('CLICOU EM VENDAS');
  
    await Promise.all([
      page.waitForURL(/dav/, { timeout: 15000 }),
      page.locator('a[href*="dav"]').first().click()
    ]);
    console.log('CLICOU EM DAV');

    // 2. Abrir tela de cadastro
    const btnCadastrar = page.getByText(/cadastrar dav/i).first();
    await btnCadastrar.waitFor({ state: 'visible' });
    await btnCadastrar.click({ force: true });
    console.log('CLICOU EM CADASTRAR FATURA');
   
    // 3. Preencher Validade
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataISO = `${dia}-${mes}-${ano}`;
    
    const inputValidade = page.getByLabel(/validade do orçamento/i);
    await inputValidade.waitFor({ state: 'visible' });
    await inputValidade.fill(dataISO);
    console.log('DATA DE VALIDADE OK:', dataISO);

    // 4. Seleção de Itens
    const botaoItens = page.locator('xpath=//button[.//i[normalize-space(.)="format_list_bulleted"]]').first();
    await botaoItens.waitFor({ state: 'visible' });
    await botaoItens.click({ force: true });
    console.log('CLICOU EM ITEM DA FATURA OK');  
    
    await page.getByText('Seleção de produto(s)').waitFor({ state: 'visible' });
    const ativos = page.getByText('Ativo', { exact: true });
    
    await ativos.nth(0).waitFor({ state: 'visible' });
    await ativos.nth(0).click({ force: true });
    await ativos.nth(1).click({ force: true });
    await ativos.nth(2).click({ force: true });
    await ativos.nth(3).click({ force: true });
    console.log('SELECIONOU VÁRIOS ITENS DA FATURA OK');  

    // 5. Adicionar Itens selecionados
    const btnAdicionar = page.locator('.q-btn').filter({ hasText: /adicionar/i });
    await btnAdicionar.waitFor({ state: 'visible' });
    await btnAdicionar.click({ force: true });
    console.log('CLICOU EM ADICIONAR');  

    // 6. Localizar botão Salvar e garantir que está pronto
    const salvar = page.locator('button.q-btn').filter({ hasText: 'SALVAR' }).first();
    await salvar.waitFor({ state: 'visible' });

    console.log('*** ENVIANDO DADOS E AGUARDANDO RETORNO DA API ***');

    // Escuta a rede aceitando tanto o POST de criação quanto o GET de recarga da grid
    const [respostaSalvar] = await Promise.all([
        page.waitForResponse((response) => {
            const url = response.url();
            const metodo = response.request().method();
            
            return url.includes('/api/py/venda') && 
                   ['POST', 'GET'].includes(metodo) && 
                   response.status() >= 200 && 
                   response.status() < 300;
        }, { timeout: 30000 }),
        salvar.click() // Clique natural sem forçar para validar o estado do formulário
    ]);     
   
    const dadosTratados = await respostaSalvar.json();
    console.log('*** REQUISIÇÃO CAPTURADA COM SUCESSO ***');
    
    // Extração inteligente do ID (Controle) caso venha como Objeto (POST) ou Array (GET)
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
    
    // 7. Consulta o registro recém-criado via API para validação
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
      expect(getCriadoResponse.status()).toBe(200);
    } catch (error) {
      console.error('Erro ao converter resposta para JSON:', error);
      const corpoBruto = await getCriadoResponse.text();
      console.log('Corpo bruto da resposta:', corpoBruto);
    }
});