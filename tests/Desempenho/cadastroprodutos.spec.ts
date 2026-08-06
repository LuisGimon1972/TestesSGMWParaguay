import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Cadastro de Produtos/Serviços', async ({ page }) => {
  const inicioLogin = Date.now();
  await loginCompleto(page);
  const fimLogin = Date.now();

  const inicio = Date.now();

  await page.waitForTimeout(1000);
  await Promise.all([
    page.waitForURL(/producto/, { timeout: 15000 }),
    page.locator('a[href*="producto"]').first().click()
  ]);
  console.log('✅ Clicou em Produtos');

  const btnCadastrar = page.getByText(/cadastrar produto|serviço/i).first();
  await btnCadastrar.waitFor();
  await btnCadastrar.click({ force: true });
  console.log('✅ Clicou em Cadastrar');

  await page.emulateMedia({ media: 'screen' });
  await page.evaluate(() => {
    document.body.style.zoom = '0.7';
  });
  console.log('🔍 Zoom Ajustado para 70% via CSS');

  console.log('📡 Dados Enviados para a API');

  const nomeProduto = `TEST PRODUTO DESEMPENHO ${Date.now()}`;
  await page.getByLabel(/nome/i).fill(nomeProduto);
  console.log(`✅ Nome do Produto: ${nomeProduto}`);

  const btnGerar = page.getByText(/gerar/i).first();
  await btnGerar.waitFor();
  await btnGerar.click({ force: true });
  console.log('✅ Clicou em Gerar Código de Barras');

  const localEstoque = `TEST LOCAL ESTOQUE ${Date.now()}`;
  await page.getByLabel(/localização/i).fill(localEstoque);
  console.log(`✅ Localização de Estoque: ${localEstoque}`);

  const refEstoque = `TEST REFERÊNCIA ESTOQUE ${Date.now()}`;
  await page.getByLabel(/referência/i).fill(refEstoque);
  console.log(`✅ Referência de Estoque: ${refEstoque}`);

  await page.locator('input[aria-label="Fornecedor"]').focus();
  await page.keyboard.press('ArrowDown');
  await page.waitForSelector('.q-menu:visible');
  await page.locator('.q-menu:visible .q-item')
    .filter({ hasText: /REGISTRO\s+ESTÁNDAR/i })
    .click();

  const fornecedor = await page.locator('input[aria-label="Fornecedor"]').inputValue();
  console.log(`✅ Fornecedor: ${fornecedor}`);

  const preCusto = Math.floor(Math.random() * 1000) + 1;
  const campoPreCusto = page.locator('.q-field')
    .filter({ hasText: /preço de custo/i })
    .last();

  await campoPreCusto.locator('input').fill(preCusto.toString());
  console.log(`✅ Preço de Custo: ${preCusto.toFixed(0)}`);

  const campoLucro = page.locator('.q-field')
    .filter({ hasText: /% lucro/i })
    .last();

  const perLucro = await campoLucro.locator('input').inputValue();
  console.log(`✅ Percentual de Lucro: ${perLucro}`);

  const campoPreVenda = page.locator('.q-field')
    .filter({ hasText: /preço de venda/i })
    .last();

  const valorPreVenda = await campoPreVenda.locator('input').inputValue();
  console.log(`✅ Preço de Venda: ${valorPreVenda}`);

  const quantidade = Math.floor(Math.random() * 1000) + 1;
  const campoQuantidade = page.locator('.q-field')
    .filter({ hasText: /quantidade/i })
    .first();

  await campoQuantidade.locator('input').fill(quantidade.toString());
  console.log(`✅ Quantidade: ${quantidade}`);

  const quantidadeMin = Math.floor(Math.random() * 100) + 1;
  const campoQuantidadeMin = page.locator('.q-field')
    .filter({ hasText: /quantidade mínima/i })
    .last();

  const input = campoQuantidadeMin.locator('input');
  await expect(input).toBeVisible();
  await input.fill(String(quantidadeMin));
  console.log(`✅ Quantidade Mínima: ${quantidadeMin}`);

  const quantidadeMax = Math.floor(Math.random() * 1000) + 1;
  const campoQuantidadeMax = page.locator('.q-field')
    .filter({ hasText: /quantidade máxima/i })
    .last();

  const input2 = campoQuantidadeMax.locator('input');
  await expect(input).toBeVisible();
  await input2.fill(String(quantidadeMax));
  console.log(`✅ Quantidade Máxima: ${quantidadeMax}`);

  const ivaField = page.locator('[aria-label="IVA"]').first();
  await ivaField.scrollIntoViewIfNeeded();
  await expect(ivaField).toBeVisible();
  await ivaField.evaluate(el => (el as HTMLElement).click());

  const menuIva = page.locator('.q-menu');
  await expect(menuIva).toBeVisible();

  await menuIva
    .locator('.q-item')
    .filter({ hasText: /10%|isento/i })
    .first()
    .click();

  console.log('✅ IVA');

  const textAreas = page.locator('textarea.q-field__native');

  await page.waitForTimeout(2000);
  const infProduto = `TEST INFORMAÇÕES ADICIONAIS DE PRODUTOS, DE MUITA BOA QUALIDADE ${Date.now()}`;
  await textAreas.nth(0).fill(infProduto);
  console.log(`✅ Informações Adicionais: ${infProduto}`);
  await expect(textAreas.nth(0)).toHaveValue(infProduto);

  await page.waitForTimeout(2000);
  const obsProduto = `TEST OBSERVAÇÕES DE PRODUTOS PRODUTO REVISADO E APROVADO DE MUITA BOA QUALIDADE ${Date.now()}`;
  await textAreas.nth(1).fill(obsProduto);
  console.log(`✅ Observações: ${obsProduto}`);
  await expect(textAreas.nth(1)).toHaveValue(obsProduto);

  await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });
  console.log('✅ Clicou em Salvar');

  await capturarRequisicoesApi(page);

  const tempoLogin = fimLogin - inicioLogin;
  console.log(`⏱️ Tempo Total do Login: ${tempoLogin} ms`);

  const fim = Date.now();
  const tempoTotal = fim - inicio;
  console.log(`⏱️ Tempo Total do Cadastro: ${tempoTotal} ms`);

  if (tempoTotal > 8000) {
    console.log('⚠️ Tempo Acima do Limite Esperado [8000 ms]');
  } else {
    console.log(`✅ Tempo do Cadastro Dentro do Limite [8000 ms]: ${tempoTotal} ms`);
  }

  const totalGeral = tempoLogin + tempoTotal;
  console.log(`⏱️ Tempo Total do Módulo: ${totalGeral} ms`);

  console.log(`🕒 Finalização do Teste: ${formatarDataHora(new Date())}`);
});