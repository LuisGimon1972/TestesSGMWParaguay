import { test, expect } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';
import { capturarRequisicoesApi } from '../utils/capturaApi';

test('Navegação de menus', async ({ page }) => {
    await loginCompleto(page);    
    
    const clicarMenu = async (textoOuSeletor: RegExp | string) => {
        const item = typeof textoOuSeletor === 'string' ? page.locator(textoOuSeletor) : page.getByText(textoOuSeletor);
        await expect(item.first()).toBeVisible();
        await item.first().click({ force: true });
    };
    
    await clicarMenu(/dashboard/i);
    console.log('✅ Clicou em Dashboard');              
    
    await clicarMenu(/pessoas/i);
    console.log('✅ Clicou em Pessoas');
    
    await clicarMenu(/financeiro/i);
    console.log('✅ Clicou em Financeiro');
    
    await page.locator('a[href*="producto"]').first().click();
    await page.waitForURL(/producto/, { waitUntil: 'commit', timeout: 10000 });
    console.log('✅ Clicou em Produtos');    
    
    await clicarMenu(/vendas/i);
    console.log('✅ Clicou em Vendas');
    
    await page.locator('a[href*="facturacion"]').first().click();
    await page.waitForURL(/facturacion/, { waitUntil: 'commit', timeout: 10000 });
    console.log('✅ Clicou em Faturamento');
    
    await page.locator('a[href*="dav"]').first().click();
    await page.waitForURL(/dav/, { waitUntil: 'commit', timeout: 10000 });
    console.log('✅ Clicou em DAV');
    
    await clicarMenu(/sifen/i); 
    console.log('✅ Clicou em SIFEN');
    
    await clicarMenu(/usu[aá]rios/i);
    console.log('✅ Clicou em Usuários');

    await clicarMenu('a[href*="usuario/listado"]');
    console.log('✅ Clicou em Listagem de Usuários');

    await clicarMenu('a[href*="usuario/perfil"]');
    console.log('✅ Clicou em Perfil de Acesso');
    
    await clicarMenu(/compras/i);
    console.log('✅ Clicou em Compras');    
    
    await clicarMenu(/cadastros/i); 
    console.log('✅ Clicou em Cadastros');

    await clicarMenu('a[href*="registros/metodos-pagos"]');
    console.log('✅ Clicou em Cadastro de Espécies'); 

    await clicarMenu('a[href*="registros/cotizacion-monedas"]');
    console.log('✅ Clicou em Cadastro de Cotação');

    await clicarMenu('a[href*="registros/grupos"]');
    console.log('✅ Clicou em Cadastro de Grupos');

    await clicarMenu('a[href*="registros/subgrupos"]');
    console.log('✅ Clicou em Cadastro de Subgrupos');

    await clicarMenu('a[href*="registros/marcas"]');
    console.log('✅ Clicou em Cadastro de Marcas'); 
    
    await clicarMenu(/funcionários/i);
    console.log('✅ Clicou em Funcionários'); 
    
    await capturarRequisicoesApi(page);            
});