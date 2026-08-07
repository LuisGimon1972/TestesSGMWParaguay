import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Validação de Dados de Subgrupos', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginCompleto(page);

  const cadBtn = page.getByText(/cadastros/i).first();
  await expect(cadBtn).toBeVisible();
  await cadBtn.click();
  console.log('✅ Clicou em Cadastros');

  await page.waitForTimeout(1000);
  page.locator('a[href*="registros/subgrupos"]').click();
  console.log('✅ Clicou em Subgrupos');

  const btnCadastrar = page.getByText(/cadastrar subgrupo/i).first();
  await btnCadastrar.waitFor();
  await btnCadastrar.click({ force: true });
  console.log('✅ Clicou em Cadastrar Subgrupo');

  const nomeSubgrupo = `TEST SUBGRUPO ${Date.now()}`;
  await page.getByLabel(/cadastrar novo subgrupo/i).fill(nomeSubgrupo);
  console.log(`✅ Nome do Subgrupo: ${nomeSubgrupo}`);

  await page.waitForTimeout(1000);

  console.log('✅ Grupo Vazio');

  await page.waitForTimeout(1000);

  await page.locator('.q-btn')
    .filter({ hasText: /confirmar|guardar/i })
    .click({ force: true });
  console.log('✅ Clicou em Salvar Subgrupo');

  await capturarRequisicoesApi(page);

  await page.waitForTimeout(4000);

  console.log(`🕒 Finalização do Teste: ${formatarDataHora(new Date())}`);
});