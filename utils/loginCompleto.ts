import { Page } from '@playwright/test';
import { talVez } from '../utils/talvez';

export async function loginCompleto(page: Page) {

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
  
  //const botao = page.locator('button:has-text("ENTRAR")').nth(1);
  const botao = page.locator('button:has-text("ENTRAR")').first();
  await botao.highlight();
  await botao.evaluate((el: any) => {
    el.style.border = '5px solid red';
    el.click();
  });
  console.log('CLICOU EM ACESSAR EMPRESA');

  await page.waitForTimeout(3000);
  console.log('URL:', await page.url()); 

  
  await page.evaluate(() => {
    document.querySelectorAll('.q-dialog, .q-dialog__backdrop, .q-overlay').forEach((el: any) => {
      el.remove();
    });
  });

  console.log('MODAL + OVERLAY REMOVIDOS');

  const botaoFecharPopup = page.locator('button:has-text("×"), svg[aria-label="Close"], .modal-close');

  if (await botaoFecharPopup.isVisible()) {
    console.log('Popup de atualização detectado, fechando...');
    await botaoFecharPopup.click().catch(() => {});
    console.log('Popup fechado com sucesso.');
  }
  

 // await talVez(page);   
}