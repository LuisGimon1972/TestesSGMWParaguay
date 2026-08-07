import { test } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Validação de Dados de Espécies', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginCompleto(page);

  await page.waitForTimeout(1000);
  await page.getByText(/cadastros/i).click({ force: true });
  console.log('✅ Clicou em Cadastros');

  await page.waitForTimeout(1000);
  page.locator('a[href*="registros/metodos-pagos"]').click();
  console.log('✅ Clicou em Espécies');

  const btnCadastrar = page.getByText(/cadastrar espécie/i).first();
  await btnCadastrar.waitFor();
  await btnCadastrar.click({ force: true });
  console.log('✅ Clicou em Cadastrar');

  const descricao = `TEST ESPÉCIE ${Date.now()}`;
  await page.getByLabel(/descrição/i).fill(descricao);
  console.log(`✅ Descrição da Espécie: ${descricao}`);

  console.log('✅ Tipo do Cartão Vazio');

  console.log('✅ Tipo da Espécie Vazio');

  await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });

  console.log('✅ Clicou em Salvar');

  await capturarRequisicoesApi(page);

  await page.waitForTimeout(4000);

  console.log(`🕒 Finalização do Teste: ${formatarDataHora(new Date())}`);
});