import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Exclusão de datos espécies', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });    
    await loginCompleto(page);    
 
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('CLICOU EM CADASTRO');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/especies"]').click()
    console.log('CLICOU EM ESPÉCIES'); 

    await page.waitForTimeout(2000);
    const trashIcons = await page.locator('table img[src*="trash"]').count();
    if (trashIcons > 0) {
        await page.locator('table img[src*="trash"]').first().click();
        await capturarRequisicoesApi(page);
        await page.waitForTimeout(4000);
    } else {
        console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR.');
    }
});