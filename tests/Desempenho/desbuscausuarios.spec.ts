import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';

test('Teste de Desempenho de Busca em Usuários', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  const inicioLogin = Date.now();
  await loginCompleto(page);
  const fimLogin = Date.now();

  const usuariosBtn = page.getByText(/usu[aá]rios/i).first();
  await expect(usuariosBtn).toBeVisible();
  await usuariosBtn.click();
  console.log('✅ Clicou em Usuários');

  const listado = page.locator('a[href*="usuario/listado"]');
  await expect(listado).toBeVisible();
  await listado.click();
  console.log('✅ Clicou em Listagem de Usuários');

  const primeiroNome = 'TEST USUARIO';

  const inicioBuscaExistente = Date.now();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
  await page.keyboard.press('Enter');
  const fimBuscaExistente = Date.now();

  const tempoBuscaExistente = fimBuscaExistente - inicioBuscaExistente;
  console.log(`✅ Busca de Usuário Existente: ${primeiroNome}`);

  await page.waitForTimeout(1000);

  const usuarioInexistente = 'USUÁRIO INEXISTENTE';

  const inicioBuscaInexistente = Date.now();
  await page.getByLabel(/pesquisar registro/i).fill(usuarioInexistente);
  await page.keyboard.press('Enter');
  const fimBuscaInexistente = Date.now();

  const tempoBuscaInexistente = fimBuscaInexistente - inicioBuscaInexistente;
  console.log(`✅ Busca de Usuário Inexistente: ${usuarioInexistente}`);

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