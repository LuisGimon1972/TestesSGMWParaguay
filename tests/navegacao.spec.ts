import { test } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../utils/loginCompleto';
import { capturarRequisicoesApi } from '../utils/capturaApi';

test('Navegação de menus', async ({ page }) => {   
    test.setTimeout(90000);

    await loginCompleto(page);        
    await page.context().clearCookies();
    await page.waitForTimeout(2000);       

    await capturarRequisicoesApi(page);        
    
    async function clicarElementoMenu(nomeItem: string) {
      let elementoAlvo = page.getByText(nomeItem, { exact: true }).first();
      
      if (!(await elementoAlvo.isVisible())) {
        elementoAlvo = page.locator('.q-item, a, button').filter({ hasText: new RegExp(`^${nomeItem}$`, 'i') }).first();
      }

      await elementoAlvo.waitFor({ state: 'visible', timeout: 5000 });
      await elementoAlvo.scrollIntoViewIfNeeded().catch(() => {});
      
      try {
        await elementoAlvo.click({ timeout: 3000 });
      } catch {
        await elementoAlvo.click({ force: true });
      }
    }
    
    async function navegarPara(principal: string, sub?: string) {
      
      if (sub) {     
        let submenuAlvo = page.getByText(sub, { exact: true }).first();
        if (!(await submenuAlvo.isVisible())) {
          submenuAlvo = page.locator('.q-item, a, button').filter({ hasText: new RegExp(`^${sub}$`, 'i') }).first();
        }
        
        if (!(await submenuAlvo.isVisible())) {
          await clicarElementoMenu(principal);
          await page.waitForTimeout(800); 
        }
        
        await clicarElementoMenu(sub);
        console.log(`✅ Navegou para: ${principal} > ${sub}`);
      } else {        
        await clicarElementoMenu(principal);
        console.log(`✅ Navegou para: ${principal}`);
      }      
      
      await page.waitForTimeout(1000);      
    }  
    
    const fluxoNavegacao = [      
      { principal: 'Pessoas' },
      { principal: 'Produtos' },      
      { principal: 'Financeiro', sub: 'Pagar' },
      { principal: 'Financeiro', sub: 'Receber' },
      { principal: 'Financeiro', sub: 'Caixa' },
      { principal: 'Financeiro', sub: 'Bancos' },
      { principal: 'Financeiro', sub: 'Conciliação de cartão' },      
      { principal: 'Vendas', sub: 'Faturamento' },
      { principal: 'Vendas', sub: 'DAV' },
      { principal: 'Vendas', sub: 'Devolução' },
      { principal: 'SIFEN' },
      { principal: 'Compras' },
      { principal: 'Relatórios' , sub: 'Modelos' },
      { principal: 'Relatórios' , sub: 'Histórico de geração' },
      { principal: 'Cadastros', sub: 'Espécies' },
      { principal: 'Cadastros', sub: 'Cotação de moedas' },
      { principal: 'Cadastros', sub: 'Grupos' },
      { principal: 'Cadastros', sub: 'Subgrupos' },
      { principal: 'Cadastros', sub: 'Marcas' },
      { principal: 'Cadastros', sub: 'Centro de custo' },
      { principal: 'Cadastros', sub: 'Plano de contas' },
      { principal: 'Cadastros', sub: 'Credenciadoras/taxas' },
      { principal: 'Funcionários' },
      { principal: 'Usuários' , sub: 'Listagem usuários' },
      { principal: 'Usuários' , sub: 'Perfil de acesso' }
    ];

    for (const item of fluxoNavegacao) {
      await navegarPara(item.principal, item.sub);
    }    
    console.log('✅ Navegação mobile concluída com sucesso!');
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
  });
