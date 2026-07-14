import { test, expect } from '@playwright/test';
import { fecharPopupAtualizacao } from '../../utils/novidade';
import { empresasParaguai} from '../../utils/rucs-paraguai';

test('Teste de Cadastro de DAV', async ({ page }) => {    
  await page.setViewportSize({ width: 1920, height: 1080 });

  
  await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() => {
      document.body.style.zoom = '0.5';
    });
    console.log('🔍 Zoom ajustado para 50% via CSS');
/*  console.log('INICIO');
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
  
    // Aguarda o botão "Adicionar empresa" ficar visível
  await page.waitForSelector('text=Adicionar empresa', { state: 'visible', timeout: 10000 });

  // Clica no botão
  await page.getByText('Adicionar empresa', { exact: true }).click();

  console.log('CLICOU EM ADICIONAR EMPRESA');
    
  await page.waitForTimeout(700);
  const ruc = gerarRUC();
  await page.getByLabel(/ruc/i).fill(ruc);
  console.log('NÚMERO DO RUC:', ruc);  
    
  await page.waitForTimeout(4000);

  const razaoSocial = await page.getByLabel('Razão social').inputValue();
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
  //await fecharPopupAtualizacao(page)   */


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
  
  const campoPesquisa = page.getByPlaceholder('PESQUISAR EMPRESAS');
  await campoPesquisa.fill('CASA');
  await page.keyboard.press('Enter');
  console.log('PESQUISOU EMPRESA');
  
  const botao = page.locator('button:has-text("ENTRAR")').nth(1);  
  await botao.highlight();
  await botao.evaluate((el: any) => {
    el.style.border = '5px solid red';
    el.click();
  });
  console.log('CLICOU EM ACESSAR EMPRESA');
   
   
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const ano = hoje.getFullYear();
  const dataISO = `${dia}-${mes}-${ano}`;  
  await page.getByLabel(/data de fundação/i).fill(dataISO);
  console.log('DATA DE FUNDAÇÃO OK:', dataISO);
  await page.waitForTimeout(3000);

  await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() => {
      document.body.style.zoom = '0.6';
    });
    console.log('🔍 Zoom ajustado para 60% via CSS');

  await page.locator('.q-field')
    .filter({ hasText: /departamento/i })
    .first()
    .click({ force: true });
    const menuDepartamento = page.locator('.q-menu').last();
    await menuDepartamento.waitFor();
    await menuDepartamento
    .locator('.q-item')
    .filter({ hasText: /alto paraná|alto parana/i })
    .click({ force: true });
    const dep = await page.locator('input[aria-label="Departamento"]').inputValue();      
    console.log('DEPARTAMENTO OK:',dep);

    await page.locator('.q-field')
    .filter({ hasText: /distrito/i })
    .first()
    .click({ force: true });
    const menuDistrito = page.locator('.q-menu').last();
    await menuDistrito.waitFor();
    await menuDistrito
    .locator('.q-item')
    .filter({ hasText: /ciudad/i })
    .click({ force: true });
    const distrito = await page.locator('input[aria-label="Distrito"]').inputValue();      
    console.log('DISTRITO OK:',distrito);

    await page.locator('.q-field')
    .filter({ hasText: /cidade/i })
    .first()
    .click({ force: true });
    const menuCiudad = page.locator('.q-menu').last();
    await menuCiudad.waitFor();
    await menuCiudad
    .locator('.q-item')
    .filter({ hasText: /2A/i })
    .click({ force: true });
    const city = await page.locator('input[aria-label="Cidade/Bairro"]').inputValue();      
    console.log('CIUDAD OK:',city);

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
    await campoWrapper.waitFor({ state: 'visible' });    
    await campoWrapper.scrollIntoViewIfNeeded();    
    await campoWrapper.click({ force: true });
    const menu = page.locator('.q-menu');
    await menu.waitFor({ state: 'visible' });    
    await menu.locator('.q-item').first().click();    
    const valorSelecionado = await page.locator('input[aria-label="Código de atividade econômica"]').inputValue();
    console.log('Código selecionado:', valorSelecionado);

     await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });
  console.log('CLICOU EM SALVAR USUARIO');

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