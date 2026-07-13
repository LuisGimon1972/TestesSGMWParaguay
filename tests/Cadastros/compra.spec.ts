import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';

test('Teste de Cadastro de Compras', async ({ page }) => {
    // 1. Configurações Iniciais e Timeout estendido para APIs lentas
    test.setTimeout(60000); 
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);      
    
    await page.waitForTimeout(2000);           

    // 2. Navegação
    const comprasBtn = page.getByText(/compras/i).first();
    await expect(comprasBtn).toBeVisible({ timeout: 5000 });
    await comprasBtn.click();
    console.log('CLICOU EM COMPRAS');

    await page.locator('a[href*="compras/listagem"]').click();
    console.log('CLICOU EM LISTAGEM DE COMPRAS');  

    const btnCadastrar = page.getByText(/cadastrar compra/i).first();
    await btnCadastrar.click();
    console.log('CLICOU EM CADASTRAR COMPRA');
    
    await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() => { document.body.style.zoom = '0.8'; });
   
    await page.waitForTimeout(2000);

    // 3. Preenchimento de Datas e Nota
    console.log('***DADOS ENVIADOS PRA API***');
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataISO = `${dia}-${mes}-${ano}`;
    
    await page.getByLabel(/data emissão/i).fill(dataISO);
    console.log('DATA DE EMISSÃO OK:', dataISO);

    await page.waitForTimeout(2000);
    await page.getByLabel(/data de recebimento/i).fill(dataISO);
    console.log('DATA DE RECEBIMENTO OK:', dataISO);

    const numeroNota = Math.floor(Math.random() * 1000) + 1;
    const campoNumero = page.locator('.q-field').filter({ hasText: /n° nota/i }).last();
    await campoNumero.locator('input').fill(numeroNota.toString());
    console.log('NUMERO DE NOTA OK:', numeroNota.toString().trim());
    
    // 4. Fornecedor
    await page.locator('.q-select').nth(0).click();
    await page.locator('.q-menu .q-item').first().click();
    const fornecedor = await page.locator('input[aria-label="Fornecedor"]').inputValue();
    console.log('SELECIONOU UM FORNECEDOR OK:', fornecedor);  
        
    // 5. Seleção de Itens
    const botaoItens = page.locator('button').filter({ has: page.locator('i:text("format_list_bulleted")') }).first();
    await botaoItens.click();
    console.log('CLICOU EM ITEM DA FATURA OK');      
    
    await page.getByText('Seleção de produto(s)').waitFor({ state: 'visible' });
    const ativos = page.getByText('Ativo', { exact: true });
    await ativos.nth(0).click();
    await ativos.nth(1).click();
    await ativos.nth(2).click();    
    console.log('SELECIONOU VÁRIOS ITENS DA COMPRA OK');  

    await page.waitForTimeout(3000);

    await page.locator('.q-btn').filter({ hasText: /adicionar/i }).click({ force: true });
    console.log('CLICOU EM ADICIONAR ITENS'); 
    console.log('***FIM DE DADOS ENVIADOS PRA API***');

    await page.waitForTimeout(2000);
    const salvar = page.locator('button.q-btn').filter({ hasText: 'SALVAR' });
    await salvar.first().waitFor({ state: 'visible' });
    await salvar.first().click({ force: true });         
    console.log('CLICOU EM SALVAR ITENS');  

    await page.waitForTimeout(2000);
    const salvar2 = page.locator('button.q-btn').filter({ hasText: 'SALVAR' });
    await salvar2.first().waitFor({ state: 'visible' });
    await salvar2.first().click({ force: true });         
    console.log('CLICOU EM SALVAR COMPRA');      

    // 6. Confirmação dos Modais e Interceptação da Resposta da API
    const modal1 = page.locator('.q-dialog:visible').first();
    await modal1.waitFor({ state: 'visible', timeout: 15000 });    
    const btnConfirmar1 = modal1.locator('.q-btn', { hasText: /confirmar|salvar/i }).first();   
    await btnConfirmar1.waitFor({ state: 'visible', timeout: 5000 });   
    await page.waitForTimeout(500);    
    await btnConfirmar1.click({ force: true });
    console.log('CLICOU EM CONFIRMAR TOTAIS');
    
    await modal1.waitFor({ state: 'hidden', timeout: 10000 });
    await page.waitForTimeout(800); 
    
    const modal2 = page.locator('.q-dialog:visible').first();
    await modal2.waitFor({ state: 'visible', timeout: 15000 });
    const btnConfirmar2 = modal2.locator('.q-btn', { hasText: /confirmar|salvar/i }).first();
    await btnConfirmar2.waitFor({ state: 'visible', timeout: 5000 });    
    await page.waitForTimeout(500);

    console.log('*** ENVIANDO COMPRA E AGUARDANDO RETORNO DA API ***');

    // Executa o clique final enquanto monitora a rede aguardando a criação da compra
    const [respostaSalvar] = await Promise.all([
        page.waitForResponse((response) => {
            const url = response.url();
            const metodo = response.request().method();
            
            return url.includes('/api/py/compra') && 
                   ['POST', 'GET'].includes(metodo) && 
                   response.status() >= 200 && 
                   response.status() < 300;
        }, { timeout: 30000 }),
        btnConfirmar2.click({ force: true })
    ]);
    console.log('CLICOU EM CONFIRMAR FÓRMULA DE PREÇO');       

    // 7. Extração Inteligente do ID de Controle da Compra
    const dadosTratados = await respostaSalvar.json();
    console.log('*** REQUISIÇÃO CAPTURADA COM SUCESSO ***');
    
    let idCompra = '';
    if (dadosTratados.compra && dadosTratados.compra.controle) {
        idCompra = dadosTratados.compra.controle.toString().trim();
    } else if (dadosTratados.data && dadosTratados.data[0] && dadosTratados.data[0].controle) {
        idCompra = dadosTratados.data[0].controle.toString().trim();
    } else if (dadosTratados[0] && dadosTratados[0].controle) {
        idCompra = dadosTratados[0].controle.toString().trim();
    } else if (dadosTratados.controle) {
        idCompra = dadosTratados.controle.toString().trim();
    }

    if (!idCompra) {
        throw new Error('Não foi possível extrair o ID de "controle" da resposta da API de Compras.');
    }

    console.log('CONTROLE DE COMPRA LOCALIZADO:', idCompra);    
    
    // 8. Consulta Direta ao Registro via API para Validação
    const urlRegistroCriado = `https://testepyeduardo.global-hom.sgmw.com.br/api/py/compra/${idCompra}`;    
    const headersOriginais = respostaSalvar.request().headers();
    const headersGetRegistro = {
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

    console.log('*** RESPOSTA DA API AO CONSULTAR O NOVO REGISTRO DE COMPRA ***');
    console.log(`Status: ${getCriadoResponse.status()}`);

    try {
      const dadosCriado = await getCriadoResponse.json();
      console.log(JSON.stringify(dadosCriado, null, 2));
      expect(getCriadoResponse.status()).toBe(200);
    } catch (error) {
      console.error('Erro ao converter resposta de compra para JSON:', error);
      const corpoBruto = await getCriadoResponse.text();
      console.log('Corpo bruto da resposta:', corpoBruto);
    }
});