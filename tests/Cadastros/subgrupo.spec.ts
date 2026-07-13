import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Cadastro de subgrupos', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    

    await page.waitForTimeout(2000);           
    const salvarSubgrupoPromise = page.waitForResponse((response) =>
    response.url().includes('/api/produto/subgrupo') &&
    ['POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300);
 
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('CLICOU EM CADASTRO');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/subgrupos"]').click()
    console.log('CLICOU EM SUBGRUPOS');

    const btnCadastrar = page.getByText(/cadastrar subgrupo/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU EM CADASTRAR SUBGRUPO');    

    console.log('***DADOS ENVIADOS PRA API***');
    const nomesubgrupo = `TEST SUBGRUPO ${Date.now()}`;
    await page.getByLabel(/cadastrar novo subgrupo/i).fill(nomesubgrupo);
    console.log('NOME DE SUBGRUPO OK:', nomesubgrupo);   

    await page.waitForTimeout(1000);
    
    await page.locator('[aria-label="Grupo"]').click({ force: true });
    const grupo = page.locator('.q-menu:visible');
    await grupo.waitFor();
    await grupo
    .locator('.q-item')
    .filter({ hasText: /test/i })
    .first()
    .click({ force: true });
    const grupoc = await page.locator('input[aria-label="Grupo"]').inputValue();
    console.log('GRUPO SELECIONADO OK:',grupoc);    
    console.log('***FIM DADOS ENVIADOS***');

    await page.waitForTimeout(1000);

    await page.locator('.q-btn')
    .filter({ hasText: /confirmar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR SUBGRUPO');  

    const salvarPessoaResponse = await salvarSubgrupoPromise;
    const dadosSalvos = await salvarPessoaResponse.json();
    console.log('***DADOS RETORNADOS NA CRIAÇÃO***');
    console.log(JSON.stringify(dadosSalvos, null, 2));
    
    const idSubgrupo = dadosSalvos.controle.toString().trim();
    console.log('CONTROLE:', idSubgrupo);    
    const urlRegistroCriado = `https://testepyeduardo.global-hom.sgmw.com.br/api/produto/subgrupo/${idSubgrupo}`;    
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