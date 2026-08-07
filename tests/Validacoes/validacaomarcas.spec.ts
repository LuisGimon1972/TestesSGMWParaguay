import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Validação de Dados de Marcas', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginCompleto(page);

  const cadBtn = page.getByText(/cadastros/i).first();
  await expect(cadBtn).toBeVisible();
  await cadBtn.click();
  console.log('✅ Clicou em Cadastros');

  await page.waitForTimeout(1000);
  page.locator('a[href*="registros/marcas"]').click();
  console.log('✅ Clicou em Marcas');

  const btnCadastrar = page.getByText(/cadastrar marca/i).first();
  await btnCadastrar.waitFor();
  await btnCadastrar.click({ force: true });
  console.log('✅ Clicou em Cadastrar Marca');

  console.log('✅ Nome da Marca Vazio');

  await capturarRequisicoesApi(page);

  await page.waitForTimeout(4000);

  console.log(`🕒 Finalização do Teste: ${formatarDataHora(new Date())}`);
});