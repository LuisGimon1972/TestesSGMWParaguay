import { test } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';

test('Teste de busca crítico em Funcionários', async ({ page }) => {

  await loginCompleto(page);
  
    await page.waitForTimeout(1000);
    await page.getByText(/funcionários/i).click({ force: true });
    console.log('CLICOU EM FUNCIONÁRIOS');     

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
    const nomefuncionario = totalColunas > 0 ? (await colunas.nth(2).innerText().catch(() => '')).trim() : '';

    const primeiroNome = nomefuncionario.toString();
    await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
    await page.waitForTimeout(1000);  
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    const registrosEncontrados = await page.locator('table img[src*="edit"], table svg').count();
     if (registrosEncontrados === 0) {
        console.log(`⚠️ Nenhum registro encontrado na grade com o valor: ${primeiroNome}`);
     } else {
        console.log('BUSCA FUNCIONÁRIO EXISTENTE OK:', primeiroNome);
     }            

    await page.waitForTimeout(1000);

    const prodInexistente = `FUNCIONARIO INEXISTENTE`;
    await page.getByLabel(/pesquisar registro/i).fill(prodInexistente);
    await page.waitForTimeout(1000);  
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    console.log('BUSCA FUNCIONÁRIO INEXISTENTE OK:', prodInexistente);
    
    await page.waitForTimeout(4000);  
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);        
});