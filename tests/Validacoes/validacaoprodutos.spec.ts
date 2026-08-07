import { test } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Validação de Cadastro de Produtos/Serviços', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1085 });
  await loginCompleto(page);

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

  const nomeProduto = `AUTO TEST ${Date.now()}`;
  await page.getByLabel(/nome/i).fill(nomeProduto);
  console.log(`✅ Nome do Produto: ${nomeProduto}`);

  await page.evaluate(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  });

  await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });

  console.log('✅ Clicou em Salvar');
  console.log('✅ Validação Executada');

  await capturarRequisicoesApi(page);

  await page.waitForTimeout(4000);

  console.log(`🕒 Finalização do Teste: ${formatarDataHora(new Date())}`);
});