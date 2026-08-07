import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Validação de Usuários', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginCompleto(page);

  const usuariosBtn = page.getByText(/usu[aá]rios/i).first();
  await expect(usuariosBtn).toBeVisible();
  await usuariosBtn.click();
  console.log('✅ Clicou em Usuários');

  const listado = page.locator('a[href*="usuario/listado"]');
  await expect(listado).toBeVisible();
  await listado.click();
  console.log('✅ Clicou em Listagem de Usuários');

  const btnCadastrar = page.getByText(/cadastrar usuário/i).first();
  await expect(btnCadastrar).toBeVisible();
  await btnCadastrar.click();
  console.log('✅ Clicou em Cadastrar Usuário');

  const ruc = '989';

  const campoCI = page
    .locator('.q-field')
    .filter({ hasText: /\bci\b/i })
    .first()
    .locator('input');

  await campoCI.scrollIntoViewIfNeeded();
  await expect(campoCI).toBeVisible();
  await campoCI.fill('');
  await campoCI.type(ruc, { delay: 50 });
  console.log(`✅ RUC: ${ruc}`);

  const nome = `TEST USUARIO ${Date.now()}`;

  const campoNome = page
    .locator('.q-field')
    .filter({ hasText: /nome/i })
    .first()
    .locator('input');

  await expect(campoNome).toBeVisible();
  await campoNome.fill(nome);
  console.log(`✅ Nome: ${nome}`);

  console.log('✅ Sobrenome Vazio');

  const email = `autotest${Date.now()}test.com`;

  const campoEmail = page
    .locator('.q-field')
    .filter({ hasText: /e-mail/i })
    .first()
    .locator('input');

  await campoEmail.scrollIntoViewIfNeeded();
  await expect(campoEmail).toBeVisible();
  await campoEmail.fill(email);
  console.log(`✅ E-mail Inválido: ${email}`);

  const senha = `autosenhaX*${Date.now()}`;

  const campoSenha = page
    .locator('.q-field')
    .filter({ hasText: /senha/i })
    .first()
    .locator('input');

  await campoSenha.scrollIntoViewIfNeeded();
  await expect(campoSenha).toBeVisible();
  await campoSenha.fill(senha);
  console.log(`✅ Senha: ${senha}`);

  const confirmarSenha = senha + 'a';

  const campoConfirmarSenha = page
    .locator('.q-field')
    .filter({ hasText: /confirmar nova senha/i })
    .first()
    .locator('input');

  await campoConfirmarSenha.scrollIntoViewIfNeeded();
  await expect(campoConfirmarSenha).toBeVisible();
  await campoConfirmarSenha.fill(confirmarSenha);
  console.log(`✅ Confirmação de Senha Diferente: ${confirmarSenha}`);

  await page.locator('[aria-label="Perfil de acesso"]').click({ force: true });

  const cartao = page.locator('.q-menu:visible');
  await cartao.waitFor();

  await cartao
    .locator('.q-item')
    .filter({ hasText: /vendedor/i })
    .first()
    .click({ force: true });

  console.log('✅ Perfil de Acesso: Vendedor');

  await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });

  console.log('✅ Clicou em Salvar Usuário');

  await capturarRequisicoesApi(page);

  await page.waitForTimeout(4000);

  console.log(`🕒 Finalização do Teste: ${formatarDataHora(new Date())}`);
});