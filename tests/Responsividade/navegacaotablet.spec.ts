import { test, expect } from '@playwright/test';
import { loginCompletomobile } from '../../utils/logincompletomobile';
import { formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Teste de Responsividade Navegação Tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    console.log(`🕒 Inicio do teste: ${formatarDataHora(new Date())}`);   
    await loginCompletomobile(page);      
    
    const dashboardBtn = page.getByText(/dashboard/i).first();
    await expect(dashboardBtn).toBeVisible({ timeout: 5000 });
    await dashboardBtn.click();
    console.log('CLICOU EM DASKBOARD');          

    await capturarRequisicoesApi(page);                
        
    await page.waitForTimeout(1000);
    await page.getByText(/pessoas/i).click({ force: true }); 
    console.log('CLICOU EM PESSOAS');    

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/producto/, { timeout: 15000 }),
      page.locator('a[href*="producto"]').first().click()
    ]);
    console.log('CLICOU EM PRODUTOS');        

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    await page.getByText(/vendas/i).click({ force: true });
    console.log('CLICOU EM VENDAS');

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/facturacion/, { timeout: 15000 }),
      page.locator('a[href*="facturacion"]').first().click()
    ]);
    console.log('CLICOU EM FATURAMENTO');

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/dav/, { timeout: 15000 }),
      page.locator('a[href*="dav"]').first().click()
    ]);
    console.log('CLICOU EM DAV');

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForURL(/lotes/, { timeout: 15000 }),
      page.locator('a[href*="lotes"]').first().click()
    ]);
    console.log('CLICOU EM LOTES'); 

    await capturarRequisicoesApi(page);                

    const usuariosBtn = page.getByText(/usu[aá]rios/i).first();
    await expect(usuariosBtn).toBeVisible({ timeout: 5000 });
    await usuariosBtn.click();
    console.log('CLICOU EM USUÁRIOS');

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    page.locator('a[href*="usuario/listado"]').click()
    console.log('CLICOU EM LISTAGEM DE USUARIOS');

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    page.locator('a[href*="usuario/perfil"]').click()
    console.log('CLICOU EM PERFIL DE ACESSO');

    await capturarRequisicoesApi(page);                

    const comprasBtn = page.getByText(/compras/i).first();
    await expect(comprasBtn).toBeVisible({ timeout: 5000 });
    await comprasBtn.click();
    console.log('CLICOU EM COMPRAS');

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    page.locator('a[href*="compras/listagem"]').click()
    console.log('CLICOU EM LISTAGEM DE COMPRAS'); 

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    await page.getByText(/cadastros/i).click({ force: true });
    console.log('CLICOU EM CADASTROS');

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/metodos-pagos"]').click()
    console.log('CLICOU EM ESPÉCIES');  

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/cotizacion-monedas"]').click()
    console.log('CLICOU EM COTAÇÃO');

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/grupos"]').click()
    console.log('CLICOU EM GRUPOS');

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/subgrupos"]').click()
    console.log('CLICOU EM SUBGRUPOS');    

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/marcas"]').click()
    console.log('CLICOU EM MARCAS');     

    await capturarRequisicoesApi(page);                

    await page.waitForTimeout(1000);
    await page.getByText(/funcionários/i).click({ force: true });
    console.log('CLICOU EM FUNCIONÁRIOS');         

    
    
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});