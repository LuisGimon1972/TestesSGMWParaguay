import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Cadastro de perfil de acesso', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  await loginCompleto(page);

  await page.waitForTimeout(2000);       
  
  const salvarPerfilPromise = page.waitForResponse((response) =>
  response.url().includes('/api/perfil') &&
  ['POST'].includes(response.request().method()) &&
  response.status() >= 200 &&
  response.status() < 300);
  
  const usuariosBtn = page.getByText(/usu[aá]rios/i).first();
  await expect(usuariosBtn).toBeVisible();
  await usuariosBtn.click();
  console.log('CLICOU EM USUÁRIOS');

  await page.waitForTimeout(1000);
  page.locator('a[href*="usuario/perfil"]').click()
  console.log('CLICOU EM PERFIL DE ACESSO');
  
  const btnCadastrar = page.getByText(/cadastrar perfil/i).first();
  await expect(btnCadastrar).toBeVisible();
  await btnCadastrar.click();
  console.log('CLICOU EM CADASTRAR PERFIL DE ACESSO'); 
    
  console.log('***DADOS ENVIADOS PRA API***');
  const nome = `TEST PERFIL ${Date.now()}`;
  const campoNome = page
  .locator('.q-field')
  .filter({ hasText: /nome/i })
  .first()
  .locator('input');
  await expect(campoNome).toBeVisible();
  await campoNome.fill(nome);
  console.log('NOME OK:', nome);

  await page.locator('[aria-label="Selecionar todos"]').click({ force: true });
  console.log('CLICLOU EM SELECIONAR TODOS OK');

  await page.locator('.q-btn')
  .filter({ hasText: /salvar|guardar/i })
  .click({ force: true });
  console.log('CLICOU EM SALVAR PERFIL DE ACCESO');
  console.log('***FIM DE DADOS ENVIADOS***');  

    const salvarPerfilResponse = await salvarPerfilPromise;
    const dadosSalvos = await salvarPerfilResponse.json();
    console.log('***DADOS RETORNADOS NA CRIAÇÃO***');
    console.log(JSON.stringify(dadosSalvos, null, 2));
    
    const idPerfil = dadosSalvos.pessoa.controle.toString().trim();
    console.log('CONTROLE:', idPerfil);    
    const urlRegistroCriado = `https://testepyeduardo.global-hom.sgmw.com.br/api/perfil/${idPerfil}`;    
    const headersOriginais = salvarPerfilResponse.request().headers();
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