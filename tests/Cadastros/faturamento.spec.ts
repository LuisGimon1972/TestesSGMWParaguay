import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Teste de Integração Cliente e Faturamento', async ({ page }) => {
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

 /*   await page.emulateMedia({ media: 'screen' });
      await page.evaluate(() => {
      document.body.style.zoom = '0.7'; });
      console.log('🔍 Zoom ajustado para 70% via CSS');*/

    await page.waitForTimeout(1000);
    const btnCadastrar = page.getByText(/cadastrar fatura/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU EM CADASTRAR FATURA');

    await page.emulateMedia({ media: 'screen' });
      await page.evaluate(() => {
      document.body.style.zoom = '0.8'; });
      console.log('🔍 Zoom ajustado para 80% via CSS');

    await page.waitForTimeout(2000);
    await page.locator('.q-select').nth(5).click();
    await page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]').click();

    await page.waitForTimeout(4000);

    const botaoItens = page.locator(
    'xpath=//button[.//i[normalize-space(.)="format_list_bulleted"]]'
    ).first();
    await botaoItens.waitFor({ state: 'visible' });
    await botaoItens.click({ force: true });

    await page.getByText('Seleção de produto(s)').waitFor({ state: 'visible' });
    const ativos = page.getByText('Ativo', { exact: true });
    await ativos.nth(0).click({ force: true });
    await ativos.nth(1).click({ force: true });
    await ativos.nth(2).click({ force: true });
    await ativos.nth(3).click({ force: true });

    await page.waitForTimeout(3000);

    await page.locator('.q-btn')
      .filter({ hasText: /adicionar/i })
      .click({ force: true });
      console.log('CLICOU EM ADICIONAR');  

    await page.waitForTimeout(1000);

        await page.locator('.q-btn')
      .filter({ hasText: /salvar/i })
      .click({ force: true });
      console.log('CLICOU EM SALVAR');  

    await page.waitForTimeout(5000);
    
    

function gerarRUC() {
  const base = Math.floor(1000000 + Math.random() * 9000000).toString(); // 7 dígitos
  const pesos = [2,3,4,5,6,7,2];
  let soma = 0;
  for (let i = 0; i < base.length; i++) {
    soma += parseInt(base[i]) * pesos[i];
  }
  const resto = soma % 11;
  const dv = resto > 1 ? 11 - resto : 0;
  return `${base}-${dv}`;
}
});