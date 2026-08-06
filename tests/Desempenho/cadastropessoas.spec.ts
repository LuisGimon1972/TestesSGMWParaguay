import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Desempenho Cadastro de Funcionários', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  const inicioLogin = Date.now();
  await loginCompleto(page);
  const fimLogin = Date.now();

  const inicio = Date.now();

  await page.getByText(/funcionários/i).click({ force: true });
  console.log('✅ Clicou em Funcionários');

  const btnCadastrar = page.getByText(/cadastrar funcionário/i).first();
  await expect(btnCadastrar).toBeVisible();
  await btnCadastrar.click();
  console.log('✅ Clicou em Cadastrar Funcionário');

  const nomeFuncionario = `TEST FUNCIONARIO DESEMPENHO ${Date.now()}`;
  const campoNomeFuncionario = page
    .locator('.q-field')
    .filter({ hasText: /funcionário/i })
    .first()
    .locator('input');

  await expect(campoNomeFuncionario).toBeVisible();
  await campoNomeFuncionario.fill(nomeFuncionario);
  console.log(`✅ Nome do Funcionário: ${nomeFuncionario}`);

  const cargoFuncionario = `TEST CARGO ${Date.now()}`;
  const campoCargoFuncionario = page
    .locator('.q-field')
    .filter({ hasText: /cargo/i })
    .last()
    .locator('input');

  await expect(campoCargoFuncionario).toBeVisible();
  await campoCargoFuncionario.fill(cargoFuncionario);
  console.log(`✅ Cargo do Funcionário: ${cargoFuncionario}`);

  const ruc = gerarRUC();

  const campoCI = page
    .locator('.q-field')
    .filter({ hasText: /\bcédula de identidade\b/i })
    .first()
    .locator('input');

  await campoCI.scrollIntoViewIfNeeded();
  await expect(campoCI).toBeVisible();
  await campoCI.fill('');
  await campoCI.type(ruc, { delay: 50 });
  console.log(`✅ RUC: ${ruc}`);

  await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });
  console.log('✅ Clicou em Salvar Funcionário');

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