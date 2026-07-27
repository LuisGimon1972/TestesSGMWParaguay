import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';
import { obterProdutoAleatorio } from '../../utils/listaprodutos';

test('Edição de datos produtos/serviços', async ({ page }) => {
      await loginCompleto(page);          

      await page.waitForTimeout(1000);
      await Promise.all([
      page.waitForURL(/producto/, { timeout: 15000 }),
      page.locator('a[href*="producto"]').first().click()
      ]);
      console.log('✅ Clicou em Produtos');      

      await page.waitForSelector('table');
      await page.locator('.q-skeleton').first().waitFor({ state: 'detached', timeout: 15000 });           
      const editIcons = await page.locator('table img[src*="edit"], table svg').count();
      console.log('✅ Quantidade de icones de editar na grade:', editIcons.toString().trim());

      await page.emulateMedia({ media: 'screen' });
      await page.evaluate(() => {
      document.body.style.zoom = '0.7'; });

      if (editIcons > 0) {               
            const getRegistroEditadoPromise = page.waitForResponse((response) =>
            response.url().includes('/api/py/produto') &&
            response.request().method() === 'GET' &&
            response.status() === 200 &&
            /\/api\/py\/produto\/[^/?]+/.test(response.url())
            );
            
            const getProdutoPromise = page.waitForResponse((response) =>
            response.url().includes('/api/py/produto') &&
            response.request().method() === 'GET' &&
            response.status() === 200
            );            

            await page.locator('table img[src="/icons/edit.svg"]').first().click();
            console.log('✅ Clicou no ícone Editar');
             
            const getProdutoResponsee = await getProdutoPromise;
            const dadosAntes = await getProdutoResponsee.json();
            console.log('✅ REGISTRO NO BANCO (ANTES DA ALTERAÇÃO)');
            console.log('📦 JSON do Registro Editado:'+JSON.stringify(dadosAntes, null, 2));            

            const getRegistroEditadoResponse = await getRegistroEditadoPromise;
            const urlRegistroEditado = getRegistroEditadoResponse.url();
            const headersOriginais = getRegistroEditadoResponse.request().headers();

            console.log('🌐 URL do Registro Editado:', urlRegistroEditado);

            console.log('📝 DADOS ENVIADOS PRA API');            

            const nomeproduto = obterProdutoAleatorio();
            await page.getByLabel(/nome/i).fill(nomeproduto.nome);
            console.log('✅ Nome de Produto:', nomeproduto.nome.toUpperCase());

            await page.waitForTimeout(1000);
            const localestoque = obterProdutoAleatorio();
            await page.getByLabel(/localização/i).fill(localestoque.categoria);
            console.log('✅ Localização de Estoque:', localestoque.categoria.toUpperCase());

            await page.waitForTimeout(1000);
            const refestoque = obterProdutoAleatorio()
            await page.getByLabel(/referência/i).fill(refestoque.id);
            console.log('✅ Referência de Estoque:', refestoque.id);      

            await page.locator('input[aria-label="Fornecedor"]').focus();      
            await page.keyboard.press('ArrowDown');      
            await page.waitForSelector('.q-menu:visible');      
            await page.locator('.q-menu:visible .q-item')
            .filter({ hasText: /REGISTRO\s+ESTÁNDAR/i })
            .click();      
            const fornecedor = await page.locator('input[aria-label="Fornecedor"]').inputValue();
            console.log('✅ Fornecedor:', fornecedor); 

            const uso = await page.locator('input[aria-label="Tipo de uso"]').inputValue();      
            console.log('✅ Tipo de Uso:', uso);
      
            const unid = await page.locator('input[aria-label="Unidade de medida"]').inputValue();      
            console.log('✅ Unidade:', unid);
            await page.waitForTimeout(1000);

            const precusto = Math.floor(Math.random() * 1000) + 1;
            const campoPrecusto = page.locator('.q-field')
            .filter({ hasText: /preço de custo/i })
            .last();
            const inputPrecusto = campoPrecusto.locator('input');
            await inputPrecusto.press('Control+A');
            await inputPrecusto.press('Delete');
            await inputPrecusto.type(precusto.toString());
            console.log('✅ Preço de custo Alterado:', precusto.toFixed(0));
            
            const campoLucro = page.locator('.q-field')
            .filter({ hasText: /% lucro/i })
            .last();
            const perLucro = await campoLucro.locator('input').inputValue();
            console.log('✅ % de Lucro:', perLucro);
            
            const campoPrevenda = page.locator('.q-field')
            .filter({ hasText: /preço de venda/i })
            .last();
            const valorPrevenda = await campoPrevenda.locator('input').inputValue();
            console.log('✅ Preço de Venda Alterado:', valorPrevenda);            
            expect(Number(perLucro)).toBeGreaterThanOrEqual(0);

            const cantidad = Math.floor(Math.random() * 1000) + 1;
            const campocantidad = page.locator('.q-field')
            .filter({ hasText: /quantidade/i })
            .first();
            await campocantidad.locator('input').fill(cantidad.toString());
            console.log('✅ Quantidade Alterada:', cantidad.toString());

            const cantidadmin = Math.floor(Math.random() * 100) + 1;
            const campoCantidadMin = page
            .locator('.q-field')
            .filter({ hasText: /quantidade mínima/i })
            .last();
            const input = campoCantidadMin.locator('input');
            await expect(input).toBeVisible();
            await input.fill(String(cantidadmin));
            console.log('✅ Quantidade mínina Alterada:', cantidadmin.toString());

            const cantidadmax = Math.floor(Math.random() * 1000) + 1;
            const campoCantidadmax = page
            .locator('.q-field')
            .filter({ hasText: /quantidade máxima/i })
            .last();
            const input2 = campoCantidadmax.locator('input');
            await expect(input).toBeVisible();
            await input2.fill(String(cantidadmax));
            console.log('✅ Quantidade máxima Alterada:', cantidadmax.toString());

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
            console.log('✅ IVA:',iva);    

            await page.waitForTimeout(1000); 
            const obsproduto = `ALTERAÇÃO DE OBSERVAÇÕES DE PRODUTOS PRODUTO REVISADO E APROVADO DE MUITA BOA QUALIDADE ${Date.now()}`;
            await page.locator('textarea.q-field__native').fill(obsproduto);
            console.log('✅ Observações Alteradas:', obsproduto);
            await expect(page.locator('textarea.q-field__native')).toHaveValue(obsproduto);            
            
            console.log('📝 FIM DE DADOS ENVIADOS***');  
            
            const salvarProdutoPromise = page.waitForResponse((response) =>
            response.url().includes('/api/py/produto') &&
            ['PUT', 'PATCH', 'POST'].includes(response.request().method()) &&
            response.status() >= 200 &&
            response.status() < 300
            );

            await page.locator('.q-btn')
            .filter({ hasText: /salvar|guardar/i })
            .click({ force: true });
            console.log('✅ Clicou em Salvar');            

            await salvarProdutoPromise;

            const headersGetRegistro: Record<string, string> = {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            };
            if (headersOriginais.authorization) {
            headersGetRegistro.authorization = headersOriginais.authorization;
            }
            if (headersOriginais['x-xsrf-token']) {
            headersGetRegistro['x-xsrf-token'] = headersOriginais['x-xsrf-token'];
            }
            if (headersOriginais['x-tenant']) {
            headersGetRegistro['x-tenant'] = headersOriginais['x-tenant'];
            }
            if (headersOriginais['x-empresa']) {
            headersGetRegistro['x-empresa'] = headersOriginais['x-empresa'];
            }
            const getProdutoResponse = await page.request.get(urlRegistroEditado, {
            headers: headersGetRegistro,
            });
            console.log(`STATUS GET REGISTRO EDITADO: ${String(getProdutoResponse.status())}`);
            const textoResposta = await getProdutoResponse.text();
            if (!getProdutoResponse.ok()) {
            throw new Error(`GET registro editado falhou: ${getProdutoResponse.status()} - ${textoResposta}`);
            }
            const dadosDepois = JSON.parse(textoResposta);
            console.log('✅ DADOS APÓS DA ALTERAÇÃO (GET DO REGISTRO EDITADO)');
            console.log(`✅ Status do Registro Editado: ${String(getProdutoResponse.status())}`);
            console.log('📦 JSON do Registro Consultado:'+JSON.stringify(dadosDepois, null, 2));             
       }
      else  {
            console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EDITAR.');  
      }           
      await capturarRequisicoesApi(page); 
      await page.waitForTimeout(4000);                
      console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});