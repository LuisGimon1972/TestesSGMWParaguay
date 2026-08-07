import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Validação de Cotação', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginCompleto(page);

  const cadBtn = page.getByText(/cadastros/i).first();
  await expect(cadBtn).toBeVisible();
  await cadBtn.click();
  console.log('✅ Clicou em Cadastros');

  await page.waitForTimeout(1000);
  page.locator('a[href*="registros/cotizacion-monedas"]').click();
  console.log('✅ Clicou em Cotação');

  const btnCadastrar = page.getByText(/cadastrar cotação/i).first();
  await btnCadastrar.waitFor();
  await btnCadastrar.click({ force: true });
  console.log('✅ Clicou em Cadastrar Cotação');

  const moedaField = page
    .locator('[aria-label="Moeda de cotação (diferente da sua empresa)"]')
    .first();

  await moedaField.scrollIntoViewIfNeeded();
  await expect(moedaField).toBeVisible();
  await moedaField.evaluate(el => (el as HTMLElement).click());

  const menu = page.locator('.q-menu');
  await expect(menu).toBeVisible();

  const moedas = ['usd', 'brl', 'pyg', 'cad', 'eur', 'gbp'];
  const moedaEscolhida = moedas[Math.floor(Math.random() * moedas.length)];

  const opcao = menu.locator('.q-item', {
    hasText: new RegExp(moedaEscolhida, 'i')
  }).first();

  await opcao.click();
  console.log(`✅ Moeda de Cotação: ${moedaEscolhida}`);

  const venda = '0';
  const inputVenda = page.getByLabel(/valor de venda/i);

  await expect(inputVenda).toBeVisible();
  await inputVenda.fill(venda);
  console.log(`✅ Valor de Venda: ${venda}`);

  console.log('✅ Valor de Compra Vazio');

  const hoje = new Date();
  const dataHoje = hoje.toLocaleDateString('pt-BR');

  const inputData = page
    .locator('.q-field')
    .filter({ hasText: /vig[eê]ncia/i })
    .first()
    .locator('input');

  await expect(inputData).toBeVisible();
  await inputData.fill(dataHoje);
  console.log(`✅ Início de Vigência: ${dataHoje}`);

  console.log('✅ Fim de Vigência Vazio');

  await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });

  console.log('✅ Clicou em Salvar Cotação');

  await capturarRequisicoesApi(page);

  await page.waitForTimeout(4000);

  console.log(`🕒 Finalização do Teste: ${formatarDataHora(new Date())}`);
});