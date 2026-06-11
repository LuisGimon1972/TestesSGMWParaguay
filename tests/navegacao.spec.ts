import { test, expect } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';

test('Navegação de menus', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    
    
    await page.getByText(/dashboard/i).click({ force: true });
    console.log('CLICOU EM DASKBOARD'); 
    
    await page.waitForTimeout(1000);
    await page.getByText(/pessoas/i).click({ force: true }); 
    console.log('CLICOU PESSOAS');

    await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/producto/, { timeout: 15000 }),
      page.locator('a[href*="producto"]').first().click()
    ]);
    console.log('CLICOU PRODUTOS');

    await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/faturamento/, { timeout: 15000 }),
      page.locator('a[href*="faturamento"]').first().click()
    ]);
    console.log('CLICOU EM FATURAMENTO');

    await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/lotes/, { timeout: 15000 }),
      page.locator('a[href*="lotes"]').first().click()
    ]);
    console.log('CLICOU EM LOTES'); 

    const usuariosBtn = page.getByText(/usu[aá]rios/i).first();
    await expect(usuariosBtn).toBeVisible({ timeout: 5000 });
    await usuariosBtn.click();
    console.log('CLICOU EM USUÁRIOS');

    await page.waitForTimeout(1000);
    page.locator('a[href*="usuario/listado"]').click()
    console.log('CLICOU EM LISTAGEM DE USUARIOS');

    await page.waitForTimeout(1000);
    page.locator('a[href*="usuario/perfil"]').click()
    console.log('CLICOU EM PERFIL DE ACESSO');

    await page.waitForTimeout(1000);
    await page.getByText(/cadastros/i).click({ force: true });
    console.log('CLICOU EM CADASTROS');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/especies"]').click()
    console.log('CLICOU EM ESPÉCIES');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/cotizacion-monedas"]').click()
    console.log('CLICOU EM COTAÇÃO');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/grupos"]').click()
    console.log('CLICOU EM GRUPOS');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/subgrupos"]').click()
    console.log('CLICOU EM SUBGRUPOS');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/marcas"]').click()
    console.log('CLICOU EM MARCAS'); 

    await page.waitForTimeout(1000);
    await page.getByText(/funcionários/i).click({ force: true });
      
    await page.waitForTimeout(4000);
});