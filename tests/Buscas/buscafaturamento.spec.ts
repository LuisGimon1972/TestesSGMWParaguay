import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';

test('Teste de busca crítico em Faturamento', async ({ page }) => {  
  // Aumenta o tempo limite do teste para 60 segundos
  test.setTimeout(60000);

  await loginCompleto(page); 

  const venBtn = page.getByText(/vendas/i).first();
  await expect(venBtn).toBeVisible();
  await venBtn.click();
  console.log('✅ Clicou em Vendas');
  
  await Promise.all([
    page.waitForURL(/facturacion/, { timeout: 15000 }),
    page.locator('a[href*="facturacion"]').first().click()
  ]);
  console.log('✅ Clicou em Faturamento');
  
  // Aguarda a tabela carregar no DOM
  await page.locator('table').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  
  const editIcons = await page.locator('table img[src*="edit"], table svg').count();  

  if (editIcons === 0) {
     console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
     test.skip(true, 'Nenhum registro encontrado na grade para realizar o teste de busca');
     return;
  } 
  
  const linhaSelecionada = page.locator('tbody tr').first();
  const colunas = linhaSelecionada.locator('td');
  const totalColunas = await colunas.count();
  const nomecliente = totalColunas > 0 ? (await colunas.nth(4).innerText().catch(() => '')).trim() : '';
  
  const primeiroNome = nomecliente
    .toString()
    .replace(/[^a-zA-ZÀ-ÿ\s]/g, '') 
    .replace(/\s+/g, ' ')           
    .trim();                        

  // Seletor flexível para localizar o campo de busca
  const campoPesquisa = page.locator('input[type="search"], input[placeholder*="pesquisar"i], input[aria-label*="pesquisar"i]').first();
  await expect(campoPesquisa).toBeVisible({ timeout: 10000 });

  await campoPesquisa.fill(primeiroNome);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);

  const registrosEncontrados = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontrados === 0) {
     console.log(`⚠️ Nenhum registro encontrado na grade com o valor: ${primeiroNome}`);
  } else {
     console.log('✅ FATURA EXISTENTE:', primeiroNome);
  }            

  const prodInexistente = `CLIENTE INEXISTENTE`;
  await campoPesquisa.fill(prodInexistente);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  console.log('✅ BUSCA FATURA INEXISTENTE:', prodInexistente);
  
  console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);        
});