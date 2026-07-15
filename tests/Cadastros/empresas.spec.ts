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