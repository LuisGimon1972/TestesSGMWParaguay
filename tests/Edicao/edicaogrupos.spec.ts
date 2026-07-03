import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Edição de datos grupos', async ({ page }) => {
  test.setTimeout(120000);

  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginCompleto(page);

  const cadBtn = page.getByText(/cadastros/i).first();
  await expect(cadBtn).toBeVisible();
  await cadBtn.click();
  console.log('CLICOU EM CADASTRO');

  await page.locator('a[href*="registros/grupos"]').click();
  console.log('CLICOU EM GRUPOS');

  const getGrupoPromise = page.waitForResponse((response) =>
    response.url().includes('/api/produto/grupo') &&
    response.request().method() === 'GET' &&
    response.status() === 200 &&
    response.url().includes('page=')
  );
 
  await page.waitForSelector('table');
  await page.locator('.q-skeleton').first().waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});

  const getGrupoResponsee = await getGrupoPromise;
  const dadosAntes = await getGrupoResponsee.json();
  const headersOriginais = getGrupoResponsee.request().headers();

  console.log('***DADOS ANTES DA ALTERAÇÃO***');
  console.log(JSON.stringify(dadosAntes, null, 2));

  const editIcons = await page.locator('table img[src="/icons/edit.svg"]').count();
  console.log('Quantidade de ícones de edição:', editIcons);

if (editIcons === 0) {
  console.log('NENHUM ÍCONE DE EDIÇÃO ENCONTRADO NA GRADE, NADA PARA EDITAR.');
  return;
}
  await page.waitForTimeout(4000);
  await page.locator('table img[src="/icons/edit.svg"]').first().click();
  console.log('CLICOU NO ÍCONE DE EDITAR');

  const primeiroRegistro =
    dadosAntes.data?.data?.[0] ??
    dadosAntes.data?.[0] ??
    dadosAntes.rows?.[0] ??
    dadosAntes.items?.[0] ??
    dadosAntes.result?.[0] ??
    dadosAntes[0];

  const grupoId =
    primeiroRegistro?.id ??
    primeiroRegistro?.codigo ??
    primeiroRegistro?.uuid ??
    primeiroRegistro?.controle;

  if (!grupoId) {
    console.log('PRIMEIRO REGISTRO ENCONTRADO:');
    console.log(JSON.stringify(primeiroRegistro, null, 2));
    throw new Error('Não foi possível obter o ID do grupo editado.');
  }

  const baseUrl = new URL(getGrupoResponsee.url()).origin;
  const urlRegistroEditado = `${baseUrl}/api/produto/grupo/${grupoId}`;

  console.log('ID DO REGISTRO EDITADO:', grupoId);
  console.log('URL DO REGISTRO EDITADO:', urlRegistroEditado);    

  await page.waitForTimeout(2000);

  console.log('***DADOS ENVIADOS PRA API**');
  const nomegrupo = `TEST GRUPO ALTERADO ${Date.now()}`;
  await page.getByLabel(/editar grupo/i).fill(nomegrupo);
  console.log('NOME DE GRUPO ALTERADO OK:', nomegrupo);
  console.log('***FIM DE DADOS ENVIADOS***');

  const salvarGrupoPromise = page.waitForResponse((response) =>
    response.url().includes('/api/produto/grupo') &&
    ['PUT', 'PATCH', 'POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300
  );

  await page.locator('.q-btn')
    .filter({ hasText: /confirmar|guardar/i })
    .click({ force: true });

  console.log('CLICOU EM SALVAR GRUPO');

  await salvarGrupoPromise;

  const headersGetRegistro: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  if (headersOriginais.authorization) {
    headersGetRegistro.authorization = headersOriginais.authorization;
  }

  if (headersOriginais['x-xsrf-token']) {
    headersGetRegistro['x-xsrf-token'] = headersOriginais['x-xsrf-token'];
  }

  if (headersOriginais['x-tenant']) {
    headersGetRegistro['x-tenant'] = headersOriginais['x-tenant'];
  }

  if (headersOriginais['x-empresa']) {
    headersGetRegistro['x-empresa'] = headersOriginais['x-empresa'];
  }

  const getGrupoResponse = await page.request.get(urlRegistroEditado, {
    headers: headersGetRegistro,
  });

  console.log(`STATUS GET REGISTRO EDITADO: ${String(getGrupoResponse.status())}`);

  const textoResposta = await getGrupoResponse.text();

  if (!getGrupoResponse.ok()) {
    throw new Error(`GET registro editado falhou: ${getGrupoResponse.status()} - ${textoResposta}`);
  }

  const dadosDepois = JSON.parse(textoResposta);

  console.log('***DADOS APÓS A ALTERAÇÃO (GET DO REGISTRO EDITADO)***');
  console.log(JSON.stringify(dadosDepois, null, 2));

  expect(JSON.stringify(dadosDepois)).toContain(nomegrupo);

  await capturarRequisicoesApi(page); 
  await page.waitForTimeout(4000);    
});