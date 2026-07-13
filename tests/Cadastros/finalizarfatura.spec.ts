import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';

test('Teste de Cadastro de Faturas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);          

    
    await page.waitForTimeout(2000);        
    const venBtn = page.getByText(/vendas/i).first();
    await expect(venBtn).toBeVisible();
    await venBtn.click();
    console.log('CLICOU EM VENDAS');
  
    await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/facturacion/, { timeout: 15000 }),
      page.locator('a[href*="facturacion"]').first().click()
    ]);
    console.log('CLICOU EM FATURAMENTO');

    await page.waitForSelector('button:has-text("Aberta")', { state: 'visible', timeout: 10000 });
    await page.locator('button:has-text("Aberta")').click();
    console.log('FILTROU FATURAS ABERTAS');

    await page.waitForTimeout(1000);
    const editIcons = await page.locator('table img[src="/icons/edit.svg"]').count();
    console.log('QUANTIDADE DE REGISTROS NA GRADE:', editIcons.toString().trim());

    if (editIcons === 0) {
        console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EDITAR.');
        return;
    }
    await page.locator('table img[src="/icons/edit.svg"]').first().click();
    console.log('CLICOU NO ÍCONE DE EDITAR');    

    await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() => {
    document.body.style.zoom = '0.8'; });
    console.log('🔍 Zoom ajustado para 80% via CSS');
   
    console.log('***DADOS ENVIADOS PRA API***');  
    await page.waitForTimeout(2000);
    await page.locator('.q-select').nth(5).click();
    await page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]').click();
    console.log('SELECIONOU UM DESTINATÁRIO/REMITENTE OK');  

    await page.waitForTimeout(2000);     
    const finalizar = page
    .locator('button.q-btn')
    .filter({ hasText: 'FINALIZAR' });
    await finalizar.first().waitFor({ state: 'visible' });
    await finalizar.first().click({ force: true });   

    await page.waitForTimeout(1000);     

     const saldoTexto = await page
    .locator('text=Saldo venda')
    .locator('xpath=following::*[contains(text(),"Gs")][1]')
    .innerText();

    const saldo = Number(
      saldoTexto
        .replace('Gs', '')
        .trim()
        .replace(/\./g, '')
        .replace(',', '.')
    )/100;
    console.log('TOTAL DE VENDAS:',saldo); 

    const valor = saldo;
    const valorCorrigido = Math.floor(valor+2);
    const troco = Math.floor(valor+2) - Math.floor(valor)
    const efectivo = page.locator('.payment-specie-row', {
      hasText: 'EFECTIVO'
    });
    await efectivo.locator('input').fill(valorCorrigido.toString());
    console.log('DIGITOU VALOR EM EFECTIVO:',valorCorrigido.toString()); 
    console.log('CALCULOU TROCO:',troco.toString()); 

    const confirmar = page
    .locator('button.q-btn')
    .filter({ hasText: 'CONFIRMAR' });
    await confirmar.first().waitFor({ state: 'visible' });
    await confirmar.first().click({ force: true });           
    console.log('CLICLOU EM CONFIRMAR VENDA'); 
});