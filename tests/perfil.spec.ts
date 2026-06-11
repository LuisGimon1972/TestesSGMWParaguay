import { test, expect } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';

test('Cadastro de perlfil de acesso', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  await loginCompleto(page);
  
  const usuariosBtn = page.getByText(/usu[aá]rios/i).first();
  await expect(usuariosBtn).toBeVisible();
  await usuariosBtn.click();
  console.log('CLICOU EM USUÁRIOS');

  await page.waitForTimeout(1000);
  page.locator('a[href*="usuario/perfil"]').click()
  console.log('CLICOU EM PERFIL DE ACESSO');
  
  const btnCadastrar = page.getByText(/cadastrar perfil/i).first();
  await expect(btnCadastrar).toBeVisible();
  await btnCadastrar.click();
  console.log('CLICOU CADASTRAR PERFIL DE ACESSO'); 
    
  const nome = `TEST PERFIL  ${Date.now()}`;
  const campoNome = page
  .locator('.q-field')
  .filter({ hasText: /nome/i })
  .first()
  .locator('input');
  await expect(campoNome).toBeVisible();
  await campoNome.fill(nome);
  console.log('NOME OK', nome);

  await page.locator('[aria-label="Selecionar todos"]').click({ force: true });
  console.log('CLICLOU EM SELECIONAR TODOS OK');

  await page.locator('.q-btn')
  .filter({ hasText: /salvar|guardar/i })
  .click({ force: true });
  console.log('CLICOU EM SALVAR PERFIL DE ACCESO');

  await page.waitForTimeout(4000);
});