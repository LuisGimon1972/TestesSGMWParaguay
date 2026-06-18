import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Edição de datos marcas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    
 
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('CLICOU EM CADASTRO');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/marcas"]').click()
    console.log('CLICOU EM MARCAS'); 

    await page.waitForSelector('table');    
    await page.waitForTimeout(1000);
    await page.locator('.q-skeleton').first().waitFor({ state: 'detached', timeout: 10000 });    
    await page.waitForTimeout(1000);
    const trashIcons = await page.locator('table img[src*="trash"]').count();
    console.log('Quantidade de ícones de lixo:', trashIcons);

    if (trashIcons > 0) {     
        await page.locator('table img[src="/icons/edit.svg"]').first().click();
        console.log('CLICOU NO ÍCONE DE EDITAR');    

        const marca = `TEST MARCA ALTERADA ${Date.now()}`;
        await page.getByLabel(/editar marca/i).fill(marca);
        console.log('NOME DE MARCA ALTERADA OK:', marca);           

        await page.locator('.q-btn')
        .filter({ hasText: /confirmar|guardar/i })
        .click({ force: true });
        console.log('CLICOU EM SALVAR MARCA');  
    }
    else{
        console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EDITAR.');  
    }  

    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);      
});