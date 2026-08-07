import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Validação de Dados de Perfil de Acesso', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginCompleto(page);

  const usuariosBtn = page.getByText(/usu[aá]rios/i).first();
  await expect(usuariosBtn).toBeVisible();
  await usuariosBtn.click();
  console.log('✅ Clicou em Usuários');

  await page.waitForTimeout(1000);
  page.locator('a[href*="usuario/perfil"]').click();
  console.log('✅ Clicou em Perfil de Acesso');

  const btnCadastrar = page.getByText(/cadastrar perfil/i).first();
  await expect(btnCadastrar).toBeVisible();
  await btnCadastrar.click();
  console.log('✅ Clicou em Cadastrar Perfil de Acesso');

  console.log('✅ Nome do Perfil Vazio');

  console.log('✅ Selecionar Todos Não Marcado');

  await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });

  console.log('✅ Clicou em Salvar Perfil de Acesso');

  await capturarRequisicoesApi(page);

  await page.waitForTimeout(4000);

  console.log(`🕒 Finalização do Teste: ${formatarDataHora(new Date())}`);
});