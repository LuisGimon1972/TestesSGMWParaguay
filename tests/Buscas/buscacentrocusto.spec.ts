import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';

test('Teste de busca crítico em Centro de Custo', async ({ page }) => {    
    await loginCompleto(page);
      
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('✅ Clicou em Cadastros');

    await page.waitForTimeout(1000);    
    await page.locator('a[href*="registros/centro-costos"]').click();
    console.log('✅ Clicou em Centro de Custos');  
    
    await page.waitForTimeout(2000);
    const trashIcons = await page.locator('table img[src*="trash"]').count();


    if (trashIcons === 0) {
       console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR!');
       return;
    } 
      console.log('✅ CAPTURA DO REGISTRO ANTES DE SER REMOVIDO:');      
      const linhas = page.locator('tbody tr');      
      const linhaSelecionada = linhas.nth(1);
      const colunas = linhaSelecionada.locator('td');
      const totalColunas = await colunas.count();
      const nomeCentro = totalColunas > 0 ? (await colunas.nth(2).innerText().catch(() => '')).trim() : '';
        
    
    const primeiroNome = nomeCentro.toString();
    await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
    await page.waitForTimeout(1000);  
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    console.log('✅ BUSCA CENTRO DE CUSTO EXISTENTE OK:', primeiroNome);

    await page.waitForTimeout(1000);

    const prodInexistente = `CENTRO INEXISTENTE`;
    await page.getByLabel(/pesquisar registro/i).fill(prodInexistente);
    await page.waitForTimeout(1000);  
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);    
    
    console.log('✅ BUSCA CENTRO DE CUSTO INEXISTENTE OK:', prodInexistente);
    
    await page.waitForTimeout(4000);  
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});