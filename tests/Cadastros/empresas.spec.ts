import { test, expect } from '@playwright/test';
import { empresasParaguai} from '../../utils/rucs-paraguai';

test('Teste de Cadastro de Empresas', async ({ page }) => {    
  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.emulateMedia({ media: 'screen' });
  await page.evaluate(() => {
  document.body.style.zoom = '0.6';  });
  console.log('🔍 Zoom ajustado para 60% via CSS');
  
  let razaoSocial: string;
  let urlempresa: string;

  await page.emulateMedia({ media: 'screen' });
  await page.evaluate(() => {
  document.body.style.zoom = '0.5'; });
  console.log('🔍 Zoom ajustado para 50% via CSS');

  console.log('INICIO');
  await page.goto(process.env.BASE_URL!);
  console.log('ABRIU SITE');
  await page.getByText(/entrar/i).click();
  console.log('CLICOU EM ENTRAR');
  
  await page.waitForSelector('input[type="email"], input[type="text"]', {
    timeout: 15000
  });
  await page.waitForTimeout(1000);
  console.log('FORM LOGIN APARECEU');  
  await page.locator('input[type="email"], input[type="text"]').first().fill(process.env.USER!);
  await page.locator('input[type="password"]').first().fill(process.env.PASS!);
  await page.waitForTimeout(1000);
  console.log('PREENCHIDO');  
  await page.getByRole('button', { name: /sign in|entrar/i }).click();
  console.log('CLICOU EM SIGN LN');
  
  await page.waitForURL(/empresas/, { timeout: 20000 });
  console.log('CHEGOU EM EMPRESAS');    

  await page.waitForSelector('text=Adicionar empresa', { state: 'visible', timeout: 10000 });  
  await page.getByText('Adicionar empresa', { exact: true }).click();
  console.log('CLICOU EM ADICIONAR EMPRESA');
    
  await page.waitForTimeout(700);
  const ruc = gerarRUC();
  await page.getByLabel(/ruc/i).fill(ruc);
  console.log('NÚMERO DO RUC:', ruc);  
    
  await page.waitForTimeout(4000);
  razaoSocial = await page.getByLabel('Razão social').inputValue();
  console.log('Razão social:', razaoSocial);

  const codigoEstabelecimento = Math.floor(Math.random() * 1000) + 100;
  await page.getByLabel(/código do estabelecimento/i).fill(codigoEstabelecimento.toString());
  console.log('CÓDIGO DO ESTABELECIMENTO:', codigoEstabelecimento); 

  const telefone = Array.from({ length: 9 }, () =>
  Math.floor(Math.random() * 10)
  ).join('');    
  const inputTelefone = page.locator('input[type="tel"]').first();
  await inputTelefone.scrollIntoViewIfNeeded();
  await inputTelefone.click({ force: true });
  await inputTelefone.press('Control+A');
  await inputTelefone.press('Backspace');
  await inputTelefone.type(telefone, { delay: 30 });
  console.log('TELEFONE OK:', telefone);  

  const email = `empresa${Date.now()}@gmail.com`;
  const campoEmail = page
  .locator('.q-field')
  .filter({ hasText: /e-mail/i })
  .first()
  .locator('input');
  await campoEmail.scrollIntoViewIfNeeded();
  await expect(campoEmail).toBeVisible();
  await campoEmail.fill(email);
  console.log('EMAIL OK:', email);  

  await page.waitForSelector('#submit-company', { state: 'visible', timeout: 10000 });
  await page.locator('#submit-company').click();
  console.log('CLICOU NO BOTÃO AVANÇAR!');

  await page.waitForSelector('text=Declaro estar ciente', { state: 'visible', timeout: 10000 });
  await page.getByText('Declaro estar ciente', { exact: true }).click();

  await page.waitForSelector('button:has-text("CONFIRMAR")', { state: 'visible', timeout: 10000 });
  await page.getByRole('button', { name: /confirmar/i }).click();
  console.log('Checkbox marcado pelo label e botão CONFIRMAR clicado com sucesso!');

  const numeroAleatorio = Math.floor(Math.random() * (1000 - 21 + 1)) + 21;
  const dominio = `empresa${numeroAleatorio}`;
  urlempresa = dominio.trim()
  console.log('Domínio preparado:', dominio);
  try {  
    const input = page.locator('input[type="text"]').last();  
    console.log('Aguardando o input ficar visível...');
    await input.waitFor({ state: 'visible', timeout: 5000 });  
    await input.click();  
    await input.fill('');
    await input.fill(dominio);  
    console.log('Domínio preenchido com sucesso!');
  } catch (error) {
      console.error('Erro ao preencher o domínio:');
  }
  console.log('Domínio escolhido:', dominio);

  await page.waitForSelector('#submit-domain', { state: 'visible', timeout: 10000 });
  await page.locator('#submit-domain').click();
  console.log('CLICOU NO BOTÃO AVANÇAR!');  
  
  await page.waitForURL(/\/py\/empresas/, { timeout: 20000 });
  const campoPesquisa = page.getByPlaceholder(/pesquisar empresas/i);
  await expect(campoPesquisa).toBeVisible({ timeout: 20000 });
  await campoPesquisa.fill(razaoSocial.trim());
  await page.keyboard.press('Enter');
  console.log('PESQUISOU EMPRESA:', razaoSocial.trim());  
  await expect(page.getByText(razaoSocial)).toBeVisible({ timeout: 20000 });

    
  const botao = page.locator('button:has-text("ENTRAR")').nth(0);  
  await botao.highlight();
  await botao.evaluate((el: any) => {
    el.style.border = '5px solid red';
    el.click();
  });
  console.log('CLICOU EM ACESSAR EMPRESA');          
  
  const urlDatosEmpresa = `https://${urlempresa}.hom.sgmaster.com.br/py/datos-empresa`;
  await page.waitForURL(urlDatosEmpresa, { timeout: 30000 });

  await page.waitForLoadState('networkidle');

  const campoDataFundacao = page.locator('.q-field')
  .filter({ hasText: /fundação|fundacion|fund/i })
  .first()
  .locator('input');

  if (await campoDataFundacao.count() > 0) {
    await expect(campoDataFundacao).toBeVisible({ timeout: 20000 });
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataISO = `${dia}-${mes}-${ano}`;
    await campoDataFundacao.fill(dataISO);
    console.log('DATA DE FUNDAÇÃO OK:', dataISO);
  } else {
    const todosCampos = await page.locator('.q-field').allTextContents();
    console.log('Campo Data de Fundação não encontrado. Campos disponíveis:', todosCampos);
  }

  await page.emulateMedia({ media: 'screen' });
  await page.evaluate(() => {
  document.body.style.zoom = '0.6';});
  console.log('🔍 Zoom ajustado para 60% via CSS');
  
  const campoDepartamento = page.locator('.q-field').filter({ hasText: /departamento/i }).first();
  await campoDepartamento.scrollIntoViewIfNeeded();
  await campoDepartamento.click({ force: true });
  const menuDepartamento = page.locator('.q-menu').last();
  await expect(menuDepartamento).toBeVisible({ timeout: 20000 });    
  await menuDepartamento.locator('.q-item').first().click();
  
  const dep = await page.locator('input[aria-label="Departamento"]').inputValue();
  console.log('DEPARTAMENTO OK:', dep);  

  await page.waitForTimeout(2000);

  const campoDistrito = page.locator('.q-field').filter({ hasText: /distrito/i }).first();
  await campoDistrito.scrollIntoViewIfNeeded();
  await campoDistrito.click({ force: true });

  const menuDistrito = page.locator('.q-menu').last();
  await expect(menuDistrito).toBeVisible({ timeout: 20000 });

  // Lista os itens disponíveis
  const itensDistrito = await menuDistrito.locator('.q-item').allTextContents();
  console.log('Itens de Distrito disponíveis:', itensDistrito);

  await menuDistrito.locator('.q-item').first().click();

  // Confere o valor selecionado
  const distrito = await page.locator('input[aria-label="Distrito"]').inputValue();
  console.log('DISTRITO OK:', distrito);
    
    // --- Cidade ---
  const campoCidade = page.locator('.q-field').filter({ hasText: /cidade/i }).first();
  await expect(campoCidade).toBeVisible({ timeout: 20000 });
  await campoCidade.scrollIntoViewIfNeeded();
  await campoCidade.click({ force: true });

  await page.waitForTimeout(2000);

  const menuCidade = page.locator('.q-menu').last();
  await expect(menuCidade).toBeVisible({ timeout: 20000 });

  const itensCidade = await menuCidade.locator('.q-item').allTextContents();
  console.log('Itens de Cidade disponíveis:', itensCidade);

  // Seleciona o primeiro item (ou ajuste para o texto correto)
  await menuCidade.locator('.q-item').first().click();

  const city = await page.locator('input[aria-label="Cidade/Bairro"]').inputValue();
  console.log('CIDADE OK:', city);

  const direccion = `TEST DIRECCION ${Date.now()}`;
  await page.getByLabel(/direção/i).fill(direccion);
  console.log('DIRECCIÓN OK:', direccion);    

  const numero = Math.floor(Math.random() * 1000) + 1;
  const campoNumero = page.locator('.q-field')
  .filter({ hasText: /número/i })
  .last();
  await campoNumero.locator('input').fill(numero.toString());
  console.log('NUMERO OK:', numero.toString().trim());
    
  const campoWrapper = page.locator('.q-select:has([aria-label="Código de atividade econômica"])');
  await campoWrapper.scrollIntoViewIfNeeded();
  await campoWrapper.click({ force: true });

  const menuAtividade = page.locator('.q-menu').last();
  await expect(menuAtividade).toBeVisible({ timeout: 20000 });
  await menuAtividade.locator('.q-item').first().click();

  const valorSelecionado = await page.locator('input[aria-label="Código de atividade econômica"]').inputValue();
  console.log('Código selecionado:', valorSelecionado);


     await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });
  console.log('CLICOU EM SALVAR EMPRESA');

  console.log('URL:', await page.url()); 

  
  await page.evaluate(() => {
    document.querySelectorAll('.q-dialog, .q-dialog__backdrop, .q-overlay').forEach((el: any) => {
      el.remove();
    });
  });
  
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    document.querySelectorAll('.q-dialog, .q-dialog__backdrop, .q-overlay').forEach((el: any) => {
      el.remove();
    });
  });

  console.log('MODAL + OVERLAY REMOVIDOS');

  function gerarRUC(): string {
  const empresaAleatoria = empresasParaguai[Math.floor(Math.random() * empresasParaguai.length)];
  return empresaAleatoria.ruc;
}

});