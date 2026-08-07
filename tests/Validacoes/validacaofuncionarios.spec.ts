import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Validação de Cadastro de Funcionários', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginCompleto(page);

  await page.getByText(/funcionários/i).click({ force: true });
  console.log('✅ Clicou em Funcionários');

  const btnCadastrar = page.getByText(/cadastrar funcionário/i).first();
  await btnCadastrar.click();
  console.log('✅ Clicou em Cadastrar Funcionário');

  const nomeFuncionario = `TEST FUNCIONARIO ${Date.now()}`;

  const campoNomeFuncionario = page
    .locator('.q-field')
    .filter({ hasText: /funcionário/i })
    .first()
    .locator('input');

  await expect(campoNomeFuncionario).toBeVisible();
  await campoNomeFuncionario.fill(nomeFuncionario);
  console.log(`✅ Nome do Funcionário: ${nomeFuncionario}`);

  const campoCargo = page
    .locator('.q-field')
    .filter({ hasText: /cargo/i })
    .last()
    .locator('input');

  await campoCargo.fill('A');
  console.log('✅ Cargo com Valor Inválido');

  console.log('✅ Cédula de Identidade Vazia');

  console.log('✅ Usuário Atrelado Vazio');

  await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });

  console.log('✅ Clicou em Salvar');

  await capturarRequisicoesApi(page);

  await page.waitForTimeout(4000);

  console.log(`🕒 Finalização do Teste: ${formatarDataHora(new Date())}`);
});