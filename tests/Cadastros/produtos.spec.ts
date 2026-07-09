import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Cadastro de produtos/serviços', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await loginCompleto(page);      
      
      await page.waitForTimeout(2000);       
    
      const salvarProdutoPromise = page.waitForResponse((response) =>
      response.url().includes('/api/py/produto') &&
      ['POST'].includes(response.request().method()) &&
      response.status() >= 200 &&
      response.status() < 300);

      await page.waitForTimeout(1000);
      await Promise.all([
      page.waitForURL(/producto/, { timeout: 15000 }),
      page.locator('a[href*="producto"]').first().click()
      ]);
      console.log('CLICOU PRODUTOS');

      const btnCadastrar = page.getByText(/cadastrar produto|serviço/i).first();
      await btnCadastrar.waitFor();
      await btnCadastrar.click({ force: true });
      console.log('CLICOU CADASTRAR');

      await page.emulateMedia({ media: 'screen' });
      await page.evaluate(() => {
      document.body.style.zoom = '0.7'; });
      console.log('🔍 Zoom ajustado para 70% via CSS');

      console.log('***DADOS ENVIADOS PRA API***');
      
      const nomeproduto = `TEST PRODUTO ${Date.now()}`;
      await page.getByLabel(/nome/i).fill(nomeproduto);
      console.log('NOME DE PRODUTO OK:', nomeproduto);

      const btnGerar = page.getByText(/gerar/i).first();
      await btnGerar.waitFor();
      await btnGerar.click({ force: true });
      console.log('CLICOU GERAR CÓDIGO DE BARRAS');

      await page.waitForTimeout(2000);      
      const codigoBarras = await page.locator('input[aria-label="Código de barras interno"]').inputValue();      
      console.log(`✅ Código de barras interno gerado: ${codigoBarras}`);

      const localestoque = `TEST LOCAL ESTOQUE ${Date.now()}`;
      await page.getByLabel(/localização/i).fill(localestoque);
      console.log('LOCALIZAÇÃO DE ESTOQUE OK', localestoque);

      const refestoque = `TEST REFERÊNCIA ESTOQUE ${Date.now()}`;
      await page.getByLabel(/referência/i).fill(refestoque);
      console.log('REFERÊNCIA ESTOQUE ESTOQUE OK', refestoque);      

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

      await page.waitForTimeout(2000);

      const precusto = Math.floor(Math.random() * 1000) + 1;
      const campoPrecusto = page.locator('.q-field')
      .filter({ hasText: /preço de custo/i })
      .last();
      await campoPrecusto.locator('input').fill(precusto.toString());
      console.log('PREÇO DE CUSTO OK:', precusto.toFixed(0));

      const campoLucro = page.locator('.q-field')
      .filter({ hasText: /% lucro/i })
      .last();
      const perLucro = await campoLucro.locator('input').inputValue();
      console.log('% DE LUCRO OK:', perLucro);
      
      const campoPrevenda = page.locator('.q-field')
      .filter({ hasText: /preço de venda/i })
      .last();
      const valorPrevenda = await campoPrevenda.locator('input').inputValue();
      console.log('PREÇO DE VENDA OK:', valorPrevenda);

      const cantidad = Math.floor(Math.random() * 1000) + 1;
      const campocantidad = page.locator('.q-field')
      .filter({ hasText: /quantidade/i })
      .first();
      await campocantidad.locator('input').fill(cantidad.toString());
      console.log('QUANTIDADE OK:', cantidad.toString());

      const cantidadmin = Math.floor(Math.random() * 100) + 1;
      const campoCantidadMin = page
      .locator('.q-field')
      .filter({ hasText: /quantidade mínima/i })
      .last();
      const input = campoCantidadMin.locator('input');
      await expect(input).toBeVisible();
      await input.fill(String(cantidadmin));
      console.log('QUANTIDADE MÍNIMA OK:', cantidadmin.toString());

      const cantidadmax = Math.floor(Math.random() * 1000) + 1;
      const campoCantidadmax = page
      .locator('.q-field')
      .filter({ hasText: /quantidade máxima/i })
      .last();
      const input2 = campoCantidadmax.locator('input');
      await expect(input).toBeVisible();
      await input2.fill(String(cantidadmax));
      console.log('QUANTIDADE MÁXIMA OK:', cantidadmax.toString());      

     

      const ivaField = page.locator('[aria-label="IVA"]').first();
      await ivaField.scrollIntoViewIfNeeded();
      await expect(ivaField).toBeVisible();
      await ivaField.evaluate(el => (el as HTMLElement).click());
      const menuIva = page.locator('.q-menu');
      await expect(menuIva).toBeVisible();
      await menuIva
      .locator('.q-item')
      .filter({ hasText: /10%|isento/i })
      .first()
      .click();
      const iva = await page.locator('input[aria-label="IVA"]').inputValue();      
      console.log('IVA OK:',iva);   
      
      await page.waitForTimeout(2000);
      const obsproduto = `TEST OBSERVAÇÕES DE PRODUTOS PRODUTO REVISADO E APROVADO DE MUITA BOA QUALIDADE ${Date.now()}`;
      await page.locator('textarea.q-field__native').fill(obsproduto);
      console.log('OBSERVAÇÕES OK:', obsproduto);
      await expect(page.locator('textarea.q-field__native')).toHaveValue(obsproduto);
      console.log('***FIM DE DADOS ENVIADOS***');

      await page.locator('.q-btn')
      .filter({ hasText: /salvar|guardar/i })
      .click({ force: true });
      console.log('CLICOU EM SALVAR');  

      const salvarPessoaResponse = await salvarProdutoPromise;
      const dadosSalvos = await salvarPessoaResponse.json();
      console.log('***DADOS RETORNADOS NA CRIAÇÃO***');
      console.log(JSON.stringify(dadosSalvos, null, 2));
      
      const idProduto = dadosSalvos.produto.controle.toString().trim();
      console.log('CONTROLE:', idProduto);    
      const urlRegistroCriado = `https://testepyeduardo.global-hom.sgmw.com.br/api/py/produto/${idProduto}`;    
      const headersOriginais = salvarPessoaResponse.request().headers();
      const headersGetRegistro: Record<string, string> = {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            authorization: headersOriginais['authorization'],
            'x-xsrf-token': headersOriginais['x-xsrf-token'],
            'x-tenant': headersOriginais['x-tenant'],
            'x-empresa': headersOriginais['x-empresa'],
      };
      
      const getCriadoResponse = await page.request.get(urlRegistroCriado, {
            headers: headersGetRegistro,
      });

      console.log('***RESPOSTA DA API AO CONSULTAR O NOVO REGISTRO***');
      console.log(`Status: ${getCriadoResponse.status()}`);

      try {
            const dadosCriado = await getCriadoResponse.json();
            console.log(JSON.stringify(dadosCriado, null, 2));
      } catch (error) {
            console.error('Erro ao converter resposta para JSON:', error);
            const corpoBruto = await getCriadoResponse.text();
            console.log('Corpo bruto da resposta:', corpoBruto);
      }

      expect([404, 200]).toContain(getCriadoResponse.status());       
      
     // await capturarRequisicoesApi(page); 
     // await page.waitForTimeout(4000);
});