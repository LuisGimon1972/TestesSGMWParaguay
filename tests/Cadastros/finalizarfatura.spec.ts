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

    await page.waitForTimeout(1000);
    const btnCadastrar = page.getByText(/cadastrar fatura/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU EM CADASTRAR FATURA');

    await page.emulateMedia({ media: 'screen' });
      await page.evaluate(() => {
      document.body.style.zoom = '0.8'; });
      console.log('🔍 Zoom ajustado para 80% via CSS');
   
    console.log('***DADOS ENVIADOS PRA API***');  
    await page.waitForTimeout(2000);
    await page.locator('.q-select').nth(5).click();
    await page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]').click();
    console.log('SELECIONOU UM DESTINATÁRIO/REMITENTE OK');  

    await page.waitForTimeout(4000);

    const botaoItens = page.locator(
    'xpath=//button[.//i[normalize-space(.)="format_list_bulleted"]]'
    ).first();
    await botaoItens.waitFor({ state: 'visible' });
    await botaoItens.click({ force: true });
    console.log('CLICOU EM ITEM DA FATURA OK');  
    
    await page.getByText('Seleção de produto(s)').waitFor({ state: 'visible' });
    const ativos = page.getByText('Ativo', { exact: true });
    await ativos.nth(0).click({ force: true });
    await ativos.nth(1).click({ force: true });
    await ativos.nth(2).click({ force: true });
    await ativos.nth(3).click({ force: true });
    console.log('SELECIONOU VÁRIOS ITENS DA FATURA OK');  

    await page.waitForTimeout(3000);

    await page.locator('.q-btn')
    .filter({ hasText: /adicionar/i })
    .click({ force: true });
    console.log('CLICOU EM ADICIONAR');  

    await page.waitForTimeout(1000);

     const finalizar = page
    .locator('button.q-btn')
    .filter({ hasText: 'FINALIZAR' });
    await finalizar.first().waitFor({ state: 'visible' });
    await finalizar.first().click({ force: true });   

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
    );
    console.log(saldo); // 3686       

    const valorMaior = Math.ceil(saldo + 10);
    const efectivoTexto = page.getByText('EFECTIVO', { exact: true });
    await efectivoTexto.waitFor({ state: 'visible' });
    const pos = await efectivoTexto.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
      };
    });
    await page.mouse.click(pos.x, pos.y);
    await page.locator('input:visible').last().fill(String(valorMaior));   

    const confirmar = page
    .locator('button.q-btn')
    .filter({ hasText: 'CONFIRMAR' });
    await confirmar.first().waitFor({ state: 'visible' });
    await confirmar.first().click({ force: true });    
       
});