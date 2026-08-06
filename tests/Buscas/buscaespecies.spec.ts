import { test } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';

test('Teste de busca crítico em Perfil de Espécies', async ({ page }) => {    
    await loginCompleto(page);
  
    await page.waitForTimeout(1000);
    await page.getByText(/cadastros/i).click({ force: true }); 
    console.log('✅ Clicou em Cadastros');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/metodos-pagos"]').click()
    console.log('✅ Clicou em Espécies'); 

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
    const nomeesp = totalColunas > 0 ? (await colunas.nth(2).innerText().catch(() => '')).trim() : '';

     const primeiroNome = nomeesp.toString();
     await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
     await page.waitForTimeout(1000);  
     await page.keyboard.press('Enter');
     await page.waitForTimeout(1500);

     const registrosEncontrados = await page.locator('table img[src*="edit"], table svg').count();
     if (registrosEncontrados === 0) {
        console.log(`⚠️ Nenhum registro encontrado na grade com o valor: ${primeiroNome}`);
     } else {
        console.log('✅ BUSCA ESPÉCIE EXISTENTE:', primeiroNome);
     }        
     

    await page.waitForTimeout(1000);

    const prodInexistente = `ESPÉCIE INEXISTENTE`;
    await page.getByLabel(/pesquisar registro/i).fill(prodInexistente);
    await page.waitForTimeout(1000);  
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    console.log('✅ BUSCA ESPÉCIE INEXISTENTE:', prodInexistente);
    
    await page.waitForTimeout(4000);  
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);        
});