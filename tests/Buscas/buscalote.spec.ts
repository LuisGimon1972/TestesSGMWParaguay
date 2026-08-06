import { test } from '@playwright/test';
import { loginCompleto, formatarDataHora   } from '../../utils/loginCompleto';

test('Teste de busca crítico em Lotes', async ({ page }) => {
  await loginCompleto(page);
  
    await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/lotes/, { timeout: 15000 }),
      page.locator('a[href*="lotes"]').first().click()
    ]);
    console.log('✅ Clicou em SIFEN');     

    await page.waitForTimeout(1000);        

   const lotes = await page.locator('table td span[class*="tw-text-ellipsis"][class*="tw-text-nowrap"]').allTextContents();

   const lotesValidos = lotes.map(l => l.trim()).filter(l => l.length > 0);

    if (lotesValidos.length > 0) {
    
        const loteEscolhido = lotesValidos[1];
        await page.getByLabel(/pesquisar registro/i).fill(loteEscolhido);
        await page.waitForTimeout(1500);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        console.log('✅ Clicou emBUSCA LOTE EXISTENTE OK:', loteEscolhido);
    } 
    else {
        console.log('⚠️ NENHUM LOTE VÁLIDO ENCONTRADO NA GRADE.');
    }  
    
    await page.waitForTimeout(4000);  
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});