import { test } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';

test('Teste de Desempenho de Busca em Perfil de Espécies', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  const inicioLogin = Date.now();
  await loginCompleto(page);
  const fimLogin = Date.now();

  await page.waitForTimeout(1000);
  await page.getByText(/cadastros/i).click({ force: true });
  console.log('✅ Clicou em Cadastros');

  await page.waitForTimeout(1000);
  page.locator('a[href*="registros/metodos-pagos"]').click();
  console.log('✅ Clicou em Espécies');

  const primeiroNome = 'TEST ESPÉCIE';

  const inicioBuscaExistente = Date.now();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
  await page.keyboard.press('Enter');
  const fimBuscaExistente = Date.now();

  const tempoBuscaExistente = fimBuscaExistente - inicioBuscaExistente;
  console.log(`✅ Busca de Espécie Existente: ${primeiroNome}`);

  await page.waitForTimeout(1000);

  const especieInexistente = 'ESPÉCIE INEXISTENTE';

  const inicioBuscaInexistente = Date.now();
  await page.getByLabel(/pesquisar registro/i).fill(especieInexistente);
  await page.keyboard.press('Enter');
  const fimBuscaInexistente = Date.now();

  const tempoBuscaInexistente = fimBuscaInexistente - inicioBuscaInexistente;
  console.log(`✅ Busca de Espécie Inexistente: ${especieInexistente}`);

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