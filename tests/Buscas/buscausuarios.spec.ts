import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora   } from '../../utils/loginCompleto';

test('Teste de busca crítico em Usuários', async ({ page }) => {
    await loginCompleto(page);
    
    const usuariosBtn = page.getByText(/usu[aá]rios/i).first();
    await expect(usuariosBtn).toBeVisible();
    await usuariosBtn.click();
    console.log('CLICOU EM USUÁRIOS');

    const listado = page.locator('a[href*="usuario/listado"]');
    await expect(listado).toBeVisible();
    await listado.click();
    console.log('CLICOU EM LISTAGEM DE USUARIOS');

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
    const nomeusuario = totalColunas > 0 ? (await colunas.nth(3).innerText().catch(() => '')).trim() : '';

    const primeiroNome = nomeusuario.toString().trim();     
    await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
    await page.waitForTimeout(1000);  
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    console.log('BUSCA  USUÁRIO EXISTENTE OK:', primeiroNome);

    await page.waitForTimeout(1000);

    const prodInexistente = `USUÁRIO INEXISTENTE`;
    await page.getByLabel(/pesquisar registro/i).fill(prodInexistente);
    await page.waitForTimeout(1000);  
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    console.log('BUSCA USUÁRIO INEXISTENTE OK:', prodInexistente);
    
    await page.waitForTimeout(4000);  
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});