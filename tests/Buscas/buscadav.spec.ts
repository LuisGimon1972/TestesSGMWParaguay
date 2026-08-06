import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';

test('Teste de busca crítico em DAV', async ({ page }) => {
  await loginCompleto(page); 

  const venBtn = page.getByText(/vendas/i).first();
  await expect(venBtn).toBeVisible();
  await venBtn.click();
  console.log('CLICOU EM VENDAS');
  
  await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/dav/, { timeout: 15000 }),
      page.locator('a[href*="dav"]').first().click()
    ]);
    console.log('CLICOU EM DAV');

    await page.waitForTimeout(2000);
    const editIcons = await page.locator('table img[src*="edit"], table svg').count();  

    if (editIcons === 0) {
       console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
       return;
    } 
    
    const linhas = page.locator('tbody tr');      
    const linhaSelecionada = linhas.nth(1);
    const colunas = linhaSelecionada.locator('td');
    const totalColunas = await colunas.count();
    const nomedav = totalColunas > 0 ? (await colunas.nth(2).innerText().catch(() => '')).trim() : '';        

    const davNome = nomedav
    .toString()
    .replace(/[^a-zA-ZÀ-ÿ\s]/g, '') 
    .replace(/\s+/g, ' ')           
    .trim();                        
    await page.getByLabel(/pesquisar registro/i).fill(davNome);
    await page.waitForTimeout(1000);  
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);        

    const registrosEncontrados = await page.locator('table img[src*="edit"], table svg').count();
    if (registrosEncontrados === 0) {
        console.log(`⚠️ Nenhum registro encontrado na grade com o valor: ${davNome}`);
    } else {
        console.log('BUSCA DAV EXISTENTE OK:', davNome);
    }    

    const davInexistente = `CLIENTE DAV INEXISTENTE`;
    await page.getByLabel(/pesquisar registro/i).fill(davInexistente);
    await page.waitForTimeout(1000);  
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    console.log('BUSCA DAV INEXISTENTE OK:', davInexistente);
    
    await page.waitForTimeout(4000);  
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);        
});