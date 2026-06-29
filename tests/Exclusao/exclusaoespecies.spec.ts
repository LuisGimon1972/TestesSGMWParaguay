import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';
import { capturarRequisicaoApiDelete } from '../../utils/capturaApidelete';

test('Exclusão de datos espécies', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });    
    await loginCompleto(page);    
 
    await page.waitForTimeout(1000);
    await page.getByText(/cadastros/i).click({ force: true }); 
    console.log('CLICOU EM CADASTROS');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/metodos-pagos"]').click()
    console.log('CLICOU EM ESPÉCIES'); 

    await page.waitForTimeout(2000);
    const trashIcons = await page.locator('table img[src*="trash"]').count();
    if (trashIcons > 0) {
        await page.locator('table img[src*="trash"]').first().click();
        await capturarRequisicaoApiDelete(page, '/api/especie'); 

        await capturarRequisicoesApi(page);
        await page.waitForTimeout(4000);
    } else {
        console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR.');
    }
});