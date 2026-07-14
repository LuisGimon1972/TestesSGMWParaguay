import { test, expect } from '@playwright/test';
import { fecharPopupAtualizacao } from '../../utils/novidade';
import { empresasParaguai,formatarRucParaguai,} from '../../utils/rucs-paraguai';


test('Teste de Cadastro de DAV', async ({ page }) => {    
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
  
  
  await fecharPopupAtualizacao(page)   


  function gerarRUC(): string {
  const empresaAleatoria = empresasParaguai[Math.floor(Math.random() * empresasParaguai.length)];
  return empresaAleatoria.ruc;
}

});