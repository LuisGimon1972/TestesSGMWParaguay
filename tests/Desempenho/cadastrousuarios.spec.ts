import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Desempenho de Cadastro de Usuários', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  const inicioLogin = Date.now();
  await loginCompleto(page);
  const fimLogin = Date.now();

  const inicio = Date.now();

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

  const ruc = gerarRUC();

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

  const nome = `TEST USUARIO DESEMPENHO ${Date.now()}`;
  const campoNome = page
    .locator('.q-field')
    .filter({ hasText: /nome/i })
    .first()
    .locator('input');

  await expect(campoNome).toBeVisible();
  await campoNome.fill(nome);
  console.log(`✅ Nome do Usuário: ${nome}`);

  const sobrenome = `TEST USUARIO SOBRENOME ${Date.now()}`;
  const campoSobrenome = page
    .locator('.q-field')
    .filter({ hasText: /sobrenome/i })
    .last()
    .locator('input');

  await expect(campoSobrenome).toBeVisible();
  await campoSobrenome.fill(sobrenome);
  console.log(`✅ Sobrenome do Usuário: ${sobrenome}`);

  const email = `autotest${Date.now()}@test.com`;
  const campoEmail = page
    .locator('.q-field')
    .filter({ hasText: /e-mail/i })
    .first()
    .locator('input');

  await campoEmail.scrollIntoViewIfNeeded();
  await expect(campoEmail).toBeVisible();
  await campoEmail.fill(email);
  console.log(`✅ E-mail: ${email}`);

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

  const confirmarSenha = senha;

  const campoConfirmarSenha = page
    .locator('.q-field')
    .filter({ hasText: /confirmar nova senha/i })
    .first()
    .locator('input');

  await campoConfirmarSenha.scrollIntoViewIfNeeded();
  await expect(campoConfirmarSenha).toBeVisible();
  await campoConfirmarSenha.fill(confirmarSenha);
  console.log(`✅ Confirmação de Senha: ${confirmarSenha}`);

  await page.locator('[aria-label="Perfil de acesso"]').click({ force: true });

  const cartao = page.locator('.q-menu:visible');
  await cartao.waitFor();

  await cartao
    .locator('.q-item')
    .filter({ hasText: /vendedor/i })
    .first()
    .click({ force: true });

  console.log('✅ Selecionou Perfil de Acesso');

  await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });

  console.log('✅ Clicou em Salvar Usuário');

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

function gerarRUC() {
  const base = Math.floor(1000000 + Math.random() * 9000000).toString();
  const pesos = [2, 3, 4, 5, 6, 7, 2];

  let soma = 0;

  for (let i = 0; i < base.length; i++) {
    soma += parseInt(base[i]) * pesos[i];
  }

  const resto = soma % 11;
  const dv = resto > 1 ? 11 - resto : 0;

  return `${base}-${dv}`;
}