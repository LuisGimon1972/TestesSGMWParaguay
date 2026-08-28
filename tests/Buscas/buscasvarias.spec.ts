import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora   } from '../../utils/loginCompleto';

test('Teste de busca crítico em Pessoas', async ({ page }) => {
  await loginCompleto(page);
  
  await page.waitForTimeout(1000);
  await page.getByText(/pessoas/i).click({ force: true }); 
  console.log('✅ Clicou em Pessoas');

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
  const nome = totalColunas > 0 ? (await colunas.nth(4).innerText().catch(() => '')).trim() : '';

  const primeiroNome = nome.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
  await page.waitForTimeout(2000);  
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  
  const registrosEncontrados = await page.locator('table img[src*="edit"], table svg').count();
     if (registrosEncontrados === 0) {
        console.log(`⚠️ Nenhum registro encontrado na grade com o valor: ${primeiroNome}`);
     } else {
        console.log('✅ BUSCA PESSOA EXISTENTE:', primeiroNome);
     }        

  await page.waitForTimeout(1000);

  const nomeInexistente = `NOME INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(nomeInexistente);
  await page.waitForTimeout(1000);  
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  console.log('✅ BUSCA PESSOA INEXISTENTE:', nomeInexistente);
  console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   


  await page.waitForTimeout(1000);
      await Promise.all([
      page.waitForURL(/producto/, { timeout: 15000 }),
      page.locator('a[href*="producto"]').first().click()
      ]);
      console.log('✅ Clicou em Produtos');

      await page.waitForTimeout(2000);
      const editIconsP = await page.locator('table img[src*="edit"], table svg').count();  
 
      if (editIcons === 0) {
          console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
          return;
      } 
  
      const linhasP = page.locator('tbody tr');      
      const linhaSelecionadaP = linhasP.nth(1);
      const colunasP = linhaSelecionadaP.locator('td');
      const totalColunasP = await colunas.count();
      const nomeP = totalColunasP > 0 ? (await colunasP.nth(2).innerText().catch(() => '')).trim() : '';

      const primeiroNomeP = nomeP.toString();
      await page.getByLabel(/pesquisar registro/i).fill(primeiroNomeP);
      await page.waitForTimeout(1000);  
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1500);

      const registrosEncontradosP = await page.locator('table img[src*="edit"], table svg').count();
     if (registrosEncontradosP === 0) {
        console.log(`⚠️ Nenhum registro encontrado na grade com o valor: ${primeiroNomeP}`);
     } else {
        console.log('✅ BUSCA PRODUTO EXISTENTE:', primeiroNome);
     }        
      

      await page.waitForTimeout(1000);

      const prodInexistente = `PRODUTO INEXISTENTE`;
      await page.getByLabel(/pesquisar registro/i).fill(prodInexistente);
      await page.waitForTimeout(1000);  
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1500);
      console.log('✅ BUSCA PRODUTO INEXISTENTE:', prodInexistente);
    
        await page.waitForTimeout(4000);  
        console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   

        const venBtnF = page.getByText(/vendas/i).first();
        await expect(venBtnF).toBeVisible();
        await venBtnF.click();
        console.log('✅ Clicou em Vendas');        
        await page.waitForTimeout(1000);
        await Promise.all([
        page.waitForURL(/facturacion/, { timeout: 15000 }),
        page.locator('a[href*="facturacion"]').first().click()
        ]);
        console.log('✅ Clicou em Faturamento');
        
        await page.waitForTimeout(2000);
        const editIconsF = await page.locator('table img[src*="edit"], table svg').count();  

        if (editIconsF=== 0) {
        console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
        return;
        } 
        
        const linhasF = page.locator('tbody tr');      
        const linhaSelecionadaF = linhasF.nth(1);
        const colunasF = linhaSelecionadaF.locator('td');
        const totalColunasF = await colunas.count();
        const nomeclienteF = totalColunasF > 0 ? (await colunasF.nth(4).innerText().catch(() => '')).trim() : '';
        const primeiroNomeF = nomeclienteF
        .toString()
        .replace(/[^a-zA-ZÀ-ÿ\s]/g, '') 
        .replace(/\s+/g, ' ')           
        .trim();                        
        
        await page.getByLabel(/pesquisar registro/i).fill(primeiroNomeF);
        await page.waitForTimeout(1000);  
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);

        const registrosEncontradosF = await page.locator('table img[src*="edit"], table svg').count();
        if (registrosEncontradosF === 0) {
            console.log(`⚠️ Nenhum registro encontrado na grade com o valor: ${primeiroNomeF}`);
        } else {
            console.log('✅ FATURA EXISTENTE:', primeiroNomeF);
        }            

        await page.waitForTimeout(1000);

        const prodInexistenteF = `CLIENTE INEXISTENTE`;
        await page.getByLabel(/pesquisar registro/i).fill(prodInexistenteF);
        await page.waitForTimeout(1000);  
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        console.log('✅ BUSCA FATURA INEXISTENTE:', prodInexistenteF);
        
        await page.waitForTimeout(4000);  
        console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);        

});