import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';
import { capturarRequisicaoApiCadastro } from '../../utils/capturaApipayload';

test('Edição de datos produtos/serviços', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await loginCompleto(page);          

      await page.waitForTimeout(1000);
      await Promise.all([
      page.waitForURL(/producto/, { timeout: 15000 }),
      page.locator('a[href*="producto"]').first().click()
      ]);
      console.log('CLICOU PRODUTOS');      

      await page.waitForSelector('table');
      await page.locator('.q-skeleton').first().waitFor({ state: 'detached', timeout: 15000 });           
      const editIcons = await page.locator('table img[src*="edit"], table svg').count();
      console.log('Quantidade de ícones de edição:', editIcons);

      await page.emulateMedia({ media: 'screen' });
      await page.evaluate(() => {
      document.body.style.zoom = '0.7'; });
      console.log('🔍 Zoom ajustado para 70% via CSS');

      if (editIcons > 0) {      
            await page.locator('table img[src="/icons/edit.svg"]').first().click();
            console.log('CLICOU NO ÍCONE DE EDITAR');

            console.log('***DADOS ENVIADOS PRA API***');            

            const nomeproduto = `TEST PRODUTO ALTERADO ${Date.now()}`;
            await page.getByLabel(/nome/i).fill(nomeproduto);
            console.log('NOME DE PRODUTO ALTERADO OK:', nomeproduto);      

            await page.waitForTimeout(1000);
            const localestoque = `TEST LOCAL ESTOQUE ALTERADO ${Date.now()}`;
            await page.getByLabel(/localização/i).fill(localestoque);
            console.log('LOCALIZAÇÃO ALTERADA DE ESTOQUE OK:', localestoque);

            await page.waitForTimeout(1000);
            const refestoque = `TEST REFERÊNCIA ESTOQUE ALTERADA ${Date.now()}`;
            await page.getByLabel(/referência/i).fill(refestoque);
            console.log('REFERÊNCIA ALTERADA ESTOQUE ESTOQUE OK:', refestoque);

            await page.locator('input[aria-label="Fornecedor"]').focus();      
            await page.keyboard.press('ArrowDown');      
            await page.waitForSelector('.q-menu:visible');      
            await page.locator('.q-menu:visible .q-item')
            .filter({ hasText: /REGISTRO\s+ESTÁNDAR/i })
            .click();      
            const fornecedor = await page.locator('input[aria-label="Fornecedor"]').inputValue();
            console.log('FORNECEDOR OK:', fornecedor); 

            const uso = await page.locator('input[aria-label="Tipo de uso"]').inputValue();      
            console.log('TIPO DE USO OK:', uso);
      
            const unid = await page.locator('input[aria-label="Unidade de medida"]').inputValue();      
            console.log('UNIDADE OK:', unid);

            await page.waitForTimeout(1000);
            const precusto = Math.floor(Math.random() * 1000) + 1;
            const campoPrecusto = page.locator('.q-field')
            .filter({ hasText: /preço de custo/i })
            .last();
            await campoPrecusto.locator('input').fill(precusto.toString());
            console.log('PREÇO DE CUSTO ALTERADO OK:', precusto.toFixed(0));

            const campoLucro = page.locator('.q-field')
            .filter({ hasText: /% lucro/i })
            .last();
            const perLucro = await campoLucro.locator('input').inputValue();
            console.log('% DE LUCRO OK:', perLucro);
            
            const campoPrevenda = page.locator('.q-field')
            .filter({ hasText: /preço de venda/i })
            .last();
            const valorPrevenda = await campoPrevenda.locator('input').inputValue();
            console.log('PREÇO DE VENDA ALTERADO OK:', valorPrevenda);

            const cantidad = Math.floor(Math.random() * 1000) + 1;
            const campocantidad = page.locator('.q-field')
            .filter({ hasText: /quantidade/i })
            .first();
            await campocantidad.locator('input').fill(cantidad.toString());
            console.log('QUANTIDADE ALTERADA OK:', cantidad.toString());

            const cantidadmin = Math.floor(Math.random() * 100) + 1;
            const campoCantidadMin = page
            .locator('.q-field')
            .filter({ hasText: /quantidade mínima/i })
            .last();
            const input = campoCantidadMin.locator('input');
            await expect(input).toBeVisible();
            await input.fill(String(cantidadmin));
            console.log('QUANTIDADE MÍNIMA ALTERADA OK:', cantidadmin.toString());

            const cantidadmax = Math.floor(Math.random() * 1000) + 1;
            const campoCantidadmax = page
            .locator('.q-field')
            .filter({ hasText: /quantidade máxima/i })
            .last();
            const input2 = campoCantidadmax.locator('input');
            await expect(input).toBeVisible();
            await input2.fill(String(cantidadmax));
            console.log('QUANTIDADE MÁXIMA ALTERARA OK:', cantidadmax.toString());

            await page.waitForTimeout(1000);
            const ivaField = page.locator('[aria-label="IVA"]').first();
            await ivaField.scrollIntoViewIfNeeded();
            await expect(ivaField).toBeVisible();
            await ivaField.evaluate(el => (el as HTMLElement).click());
            const menuIva = page.locator('.q-menu');
            await expect(menuIva).toBeVisible();
            await menuIva
            .locator('.q-item')
            .filter({ hasText: /5%|isento/i })
            .first()
            .click();
            const iva = await page.locator('input[aria-label="IVA"]').inputValue();      
            console.log('IVA ALTERADO OK:',iva);    

            await page.waitForTimeout(1000); 
            const obsproduto = `TEST ALTERAÇÃO DE OBSERVAÇÕES DE PRODUTOS PRODUTO REVISADO E APROVADO DE MUITA BOA QUALIDADE ${Date.now()}`;
            await page.locator('textarea.q-field__native').fill(obsproduto);
            console.log('OBSERVAÇÕES OK:', obsproduto);
            await expect(page.locator('textarea.q-field__native')).toHaveValue(obsproduto);            
            
            console.log('***FIM DE DADOS ENVIADOS***');            

            await page.locator('.q-btn')
            .filter({ hasText: /salvar|guardar/i })
            .click({ force: true });
            console.log('CLICOU EM SALVAR');            

            await capturarRequisicaoApiCadastro(page, '/api/py/produto');                                
   
       }
      else  {
            console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EDITAR.');  
      }     
      
      await capturarRequisicoesApi(page); 
      await page.waitForTimeout(4000);          
      
});