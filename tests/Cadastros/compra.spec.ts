import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Teste de Cadastro de Faturas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);       
    
/*    await page.waitForTimeout(2000);           
    const salvarFaturaPromise = page.waitForResponse((response) =>
    response.url().includes('/api/py/venda') &&
    ['POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300);*/
    
  const comprasBtn = page.getByText(/compras/i).first();
    await expect(comprasBtn).toBeVisible({ timeout: 5000 });
    await comprasBtn.click();
    console.log('CLICOU EM COMPRAS');

    await page.waitForTimeout(1000);
    page.locator('a[href*="compras/listagem"]').click()
    console.log('CLICOU EM LISTAGEM DE COMPRAS');  

    await page.waitForTimeout(1000);
    const btnCadastrar = page.getByText(/cadastrar compra/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('CLICOU EM CADASTRAR COMPRA');

    await page.emulateMedia({ media: 'screen' });
      await page.evaluate(() => {
      document.body.style.zoom = '0.8'; });
      console.log('🔍 Zoom ajustado para 80% via CSS');
   
    console.log('***DADOS ENVIADOS PRA API***');  

    await page.waitForTimeout(2000);
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataISO = `${dia}-${mes}-${ano}`;
    await page.getByLabel(/data emissão/i).fill(dataISO);
    console.log('DATA DE EMISSÃO OK:', dataISO);

    await page.waitForTimeout(2000);
    const hojer = new Date();
    const diar = String(hojer.getDate()).padStart(2, '0');
    const mesr = String(hojer.getMonth() + 1).padStart(2, '0');
    const anor = hoje.getFullYear();
    const dataISOr = `${diar}-${mesr}-${anor}`;
    await page.getByLabel(/data de recebimento/i).fill(dataISOr);
    console.log('DATA DE RECEBIMENTO OK:', dataISOr);

    const numero = Math.floor(Math.random() * 1000) + 1;
    const campoNumero = page.locator('.q-field')
    .filter({ hasText: /n° nota/i })
    .last();
    await campoNumero.locator('input').fill(numero.toString());
    console.log('NUMERO DE NOTA OK:', numero);

    await page.waitForTimeout(2000);
    await page.locator('.q-select').nth(0).click();
    await page.locator('(//div[contains(@class,"q-menu")]//*[contains(@class,"q-item")])[1]').click();
    console.log('SELECIONOU UM FORNECEDOR OK');  

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
    console.log('SELECIONOU VÁRIOS ITENS DA COMPRA OK');  

    await page.waitForTimeout(3000);

    await page.locator('.q-btn')
    .filter({ hasText: /adicionar/i })
    .click({ force: true });
    console.log('CLICOU EM ADICIONAR');  

    await page.waitForTimeout(2000);
    const salvar = page
    .locator('button.q-btn')
    .filter({ hasText: 'SALVAR' });
    await salvar.first().waitFor({ state: 'visible' });
    await salvar.first().click({ force: true });     
    console.log('CLICOU EM SALVAR');  
    
    const salvar2 = page
    .locator('button.q-btn')
    .filter({ hasText: 'SALVAR' });
    await salvar2.first().waitFor({ state: 'visible' });
    await salvar2.first().click({ force: true });     
    console.log('CLICOU EM SALVAR');   

const confirmar = page.getByRole('button', { name: /^confirmar$/i });

// Primeiro diálogo
await expect(confirmar).toBeVisible();
await confirmar.click();

console.log('✔ Primeiro confirmar');

// Aguarda o botão antigo ser removido
await expect(confirmar).toBeHidden();

// Aguarda o novo botão do segundo diálogo
await expect(confirmar).toBeVisible({ timeout: 20000 });

await confirmar.click({ force: true });

console.log('✔ Segundo confirmar');
});