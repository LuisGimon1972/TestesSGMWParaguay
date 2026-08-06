import { test } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';

test('Teste de Desempenho de Buscas em Produtos', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  const inicioLogin = Date.now();
  await loginCompleto(page);
  const fimLogin = Date.now();

  await page.waitForTimeout(1000);
  await Promise.all([
    page.waitForURL(/producto/, { timeout: 15000 }),
    page.locator('a[href*="producto"]').first().click()
  ]);
  console.log('✅ Clicou em Produtos');

  const primeiroNome = 'TEST PRODUTO';

  const inicioBuscaExistente = Date.now();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
  await page.keyboard.press('Enter');
  const fimBuscaExistente = Date.now();

  const tempoBuscaExistente = fimBuscaExistente - inicioBuscaExistente;
  console.log(`✅ Busca de Produto Existente: ${primeiroNome}`);

  await page.waitForTimeout(1000);

  const produtoInexistente = 'PRODUTO INEXISTENTE';

  const inicioBuscaInexistente = Date.now();
  await page.getByLabel(/pesquisar registro/i).fill(produtoInexistente);
  await page.keyboard.press('Enter');
  const fimBuscaInexistente = Date.now();

  const tempoBuscaInexistente = fimBuscaInexistente - inicioBuscaInexistente;
  console.log(`✅ Busca de Produto Inexistente: ${produtoInexistente}`);

  const tempoLogin = fimLogin - inicioLogin;
  console.log(`⏱️ Tempo Total do Login: ${tempoLogin} ms`);

  const tempoTotal = tempoBuscaExistente + tempoBuscaInexistente;
  console.log(`⏱️ Tempo Total das Buscas: ${tempoTotal} ms`);

  if (tempoTotal > 1000) {
    console.log('⚠️ Tempo Acima do Limite Esperado [1000 ms]');
  } else {
    console.log(`✅ Tempo da Busca Dentro do Limite [1000 ms]: ${tempoTotal} ms`);
  }

  const totalGeral = tempoLogin + tempoTotal;
  console.log(`⏱️ Tempo Total do Módulo: ${totalGeral} ms`);

  console.log(`🕒 Finalização do Teste: ${formatarDataHora(new Date())}`);
});