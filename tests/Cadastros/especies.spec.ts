import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';
import { capturarRequisicaoApiCadastro } from '../../utils/capturaApipayload';

test('Cadastro de espécies', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });    
    await loginCompleto(page);    

    await page.waitForTimeout(2000);       
    
    const salvarEspeciePromise = page.waitForResponse((response) =>
    response.url().includes('/api/especie') &&
    ['POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300);
 
    await page.waitForTimeout(1000);
    await page.getByText(/cadastros/i).click({ force: true }); 
    console.log('CLICOU EM CADASTROS');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/metodos-pagos"]').click()
    console.log('CLICOU EM ESPÉCIES'); 

    const btnCadastrar = page.getByText(/cadastrar espécie/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU CADASTRAR');

    console.log('***DADOS ENVIADOS PRA API***');
    const descricao = `TEST ESPÉCIE ${Date.now()}`;
    await page.getByLabel(/descrição/i).fill(descricao);
    console.log('DESCRIÇÃO DE ESPÉCIE OK:', descricao);

    await page.locator('[aria-label="Tipo do cartão"]').click({ force: true });
    const cartao = page.locator('.q-menu:visible');
    await cartao.waitFor();
    await cartao
    .locator('.q-item')
    .filter({ hasText: /não é cartão|débito|crédito/i })
    .first()
    .click({ force: true });
    const tipocar = await page.locator('input[aria-label="Tipo do cartão"]').inputValue();      
    console.log('TIPO DO CARTÃO OK:',tipocar);

    await page.waitForTimeout(1000);
    const moedaField = page.locator('[aria-label="Moeda de cotação (diferente da sua empresa)"]').first();
    await moedaField.scrollIntoViewIfNeeded();
    await expect(moedaField).toBeVisible();    
    await moedaField.evaluate(el => (el as HTMLElement).click());    
    const menu1= page.locator('.q-menu');
    await expect(menu1).toBeVisible();    
    const moedas = ['usd', 'brl', 'pyg', 'cad', 'eur', 'gbp'];    
    const moedaEscolhida = moedas[Math.floor(Math.random() * moedas.length)];
    const opcao = menu1.locator('.q-item', {
    hasText: new RegExp(moedaEscolhida, 'i')
    }).first();
    await opcao.click();
    const tipomoe = await page.locator('input[aria-label="Moeda de cotação (diferente da sua empresa)"]').inputValue();      
    console.log('MOEDA DE COTAÇÃO OK:', tipomoe);

    await page.waitForTimeout(1000);
    await page.locator('[aria-label="Tipo da espécie"]').click({ force: true });
    const menu = page.locator('.q-menu:visible');
    await menu.waitFor();
    await menu
    .locator('.q-item')
    .filter({ hasText: /dinheiro/i })
    .first()
    .click({ force: true });
    const tipoesp = await page.locator('input[aria-label="Tipo da espécie"]').inputValue();      
    console.log('TIPO DA ESPÉCIE OK:',tipoesp);
    console.log('***FIM DE DADOS ENVIADOS***');    

    await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR');  

    const salvarPessoaResponse = await salvarEspeciePromise;
    const dadosSalvos = await salvarPessoaResponse.json();
    console.log('***DADOS RETORNADOS NA CRIAÇÃO***');
    console.log(JSON.stringify(dadosSalvos, null, 2));
    
    const idEspecie = dadosSalvos.controle.toString().trim();
    console.log('CONTROLE:', idEspecie);    
    const urlRegistroCriado = `https://testepyeduardo.global-hom.sgmw.com.br/api/especie/${idEspecie}`;    
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
    
    
    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);    
});