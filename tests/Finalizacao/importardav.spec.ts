import { test, expect, Page } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';


function calcularEfectivo(total: number): number {
  return Math.ceil(total / 10) * 10;
}

test('Teste de Importação de DAV', async ({ page }) => {
  await loginCompleto(page);

  await page.waitForTimeout(2000);
  const venBtn = page.getByText(/vendas/i).first();
  await expect(venBtn).toBeVisible();
  await venBtn.click();
  console.log('✅ Clicou em Vendas');

  await page.waitForTimeout(1000);
  await Promise.all([
    page.waitForURL(/facturacion/, { timeout: 15000 }),
    page.locator('a[href*="facturacion"]').first().click()
  ]);
  console.log('✅ Clicou em Faturamento');

  const btnCadastrar = page.getByText(/importar dav/i).first();
  await btnCadastrar.waitFor({ state: 'visible' });
  await btnCadastrar.click({ force: true });
  console.log('✅ Clicou em Importar Dav');

  const btnPedido = page.locator('button:has-text("Pedido de venda"), button.q-btn:has(p:has-text("Pedido de venda"))').first();
  const btnOrcamento = page.locator('button:has-text("Orçamento"), button.q-btn:has(p:has-text("Orçamento"))').first();

  const candidatos: { locator: ReturnType<Page['locator']>; label: string }[] = [];
  if (await btnPedido.isVisible().catch(() => false)) candidatos.push({ locator: btnPedido, label: 'Pedido de venda' });
  if (await btnOrcamento.isVisible().catch(() => false)) candidatos.push({ locator: btnOrcamento, label: 'Orçamento' });

  if (candidatos.length === 0) {
    console.log('❌ Nenhum botão Pedido de venda ou Orçamento encontrado');
    throw new Error('Nenhum candidato visível');
  }

  const idx = Math.floor(Math.random() * candidatos.length);
  const escolhido = candidatos[idx];

  await escolhido.locator.scrollIntoViewIfNeeded();
  await escolhido.locator.click({ force: true });
  console.log(`✅ Clicou em ${escolhido.label}`);

  await page.waitForTimeout(600);

  const linhasFinalizado = page.locator('table tr', { hasText: /finalizado/i });
  const quantidadeFinalizado = await linhasFinalizado.count();

  console.log('QUANTIDADE DE REGISTROS COM STATUS "FINALIZADO":', quantidadeFinalizado.toString().trim());

  if (quantidadeFinalizado === 0) {
    console.log('❌ Nenhum registro com status Finalizado foi encontrado na grade.');
    return;
  }

  await linhasFinalizado.first().click({ force: true });
  console.log('✅ Clicou no registro Finalizado com sucesso.');
  
  const getRegistroEditadoPromise = page.waitForResponse((response) =>
    response.url().includes('/api/py/venda') &&
    response.request().method() === 'GET' &&
    response.status() === 200 &&
    /\/api\/py\/venda\/[^/?]+/.test(response.url())
  );

  const getVendaPromise = page.waitForResponse((response) =>
    response.url().includes('/api/py/venda') &&
    response.request().method() === 'GET' &&
    response.status() === 200
  );
  
  await page.locator('p').filter({ hasText: 'Importar DAV' }).click({ force: true });
  console.log('✅ Clicou em Importar DAV');
  
  const [getVendaResponseOriginal, getRegistroEditadoResponse] = await Promise.all([
    getVendaPromise,
    getRegistroEditadoPromise
  ]);

  const dadosAntes = await getVendaResponseOriginal.json();
  console.log('*** DADOS DO REGISTRO NO BANCO (ANTES DA ALTERAÇÃO) ***');
  console.log(JSON.stringify(dadosAntes, null, 2));

  const urlRegistroEditado = getRegistroEditadoResponse.url();
  const headersOriginais = getRegistroEditadoResponse.request().headers();
  console.log('URL DO REGISTRO EDITADO:', urlRegistroEditado);
  
  const salvarVendaPromise = page.waitForResponse((response) =>
    response.url().includes('/api/py/venda') &&
    ['PUT', 'PATCH', 'POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300
  );

  const finalizar = page.locator('button.q-btn').filter({ hasText: 'FINALIZAR' });
  await finalizar.first().waitFor({ state: 'visible' });
  await finalizar.first().click({ force: true });

  await page.waitForTimeout(1000);

  const saldoTexto = await page
    .locator('text=Saldo venda')
    .locator('xpath=following::*[contains(text(),"Gs")][1]')
    .innerText();

  const saldo = Number(
    saldoTexto
      .replace('Gs', '')
      .trim()
      .replace(/\./g, '')
      .replace(',', '.')
  );
  
  console.log('TOTAL DE VENDAS:', saldo.toFixed(2));

  const valor = saldo;
  const valorEfectivo = calcularEfectivo(valor);
  const troco = valorEfectivo - valor;

  const efectivoRow = page.locator('.payment-specie-row', { hasText: 'EFECTIVO' });
  const efectivoInput = efectivoRow.locator('input:not([disabled])').first();

  await efectivoInput.fill(valorEfectivo.toString());
  console.log('DIGITOU VALOR EM EFECTIVO:', valorEfectivo.toFixed(2).replace('.', ','));
  console.log('CALCULOU TROCO:', troco.toFixed(2).replace('.', ','));

  const confirmar = page.locator('button.q-btn').filter({ hasText: 'CONFIRMAR' });
  await confirmar.first().waitFor({ state: 'visible' });
  await confirmar.first().click({ force: true });
  console.log('✅ CLICOU EM CONFIRMAR VENDA');

  await salvarVendaPromise;
  
  const headersGetRegistro: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  
  if (headersOriginais.authorization) headersGetRegistro.authorization = headersOriginais.authorization;
  if (headersOriginais['x-xsrf-token']) headersGetRegistro['x-xsrf-token'] = headersOriginais['x-xsrf-token'];
  if (headersOriginais['x-tenant']) headersGetRegistro['x-tenant'] = headersOriginais['x-tenant'];
  if (headersOriginais['x-empresa']) headersGetRegistro['x-empresa'] = headersOriginais['x-empresa'];

  const getVendaEditadaResponse = await page.request.get(urlRegistroEditado, {
    headers: headersGetRegistro,
  });
  
  console.log(`STATUS GET REGISTRO EDITADO: ${String(getVendaEditadaResponse.status())}`);
  const textoResposta = await getVendaEditadaResponse.text();
  
  if (!getVendaEditadaResponse.ok()) {
    throw new Error(`GET registro editado falhou: ${getVendaEditadaResponse.status()} - ${textoResposta}`);
  }
  
  const dadosDepois = JSON.parse(textoResposta);
  console.log('***DADOS APÓS DA ALTERAÇÃO (GET DO REGISTRO EDITADO)***');
  console.log(JSON.stringify(dadosDepois, null, 2));

  console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);
});