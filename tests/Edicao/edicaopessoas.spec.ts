import { test } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';
import { capturarRequisicaoApiCadastro } from '../../utils/capturaApipayload';

test('Edição de datos Pessoas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    

    await page.waitForTimeout(1000);
    await page.getByText(/pessoas/i).click({ force: true }); 
    console.log('CLICOU PESSOAS');  
    
    await page.waitForTimeout(2000);
        
    await page.waitForSelector('table');
    await page.locator('.q-skeleton').first().waitFor({ state: 'detached', timeout: 15000 });    
    const editIcons = await page.locator('table img[src*="edit"], table svg').count();
    console.log('Quantidade de ícones de edição:', editIcons);

    if (editIcons > 0) {        
      await page.locator('table img[src="/icons/edit.svg"]').first().click();
      console.log('CLICOU NO ÍCONE DE EDITAR');    
     
      console.log('***DADOS ENVIADOS PRA API**'); 
      await page.waitForTimeout(1000);
      await page.locator('[aria-label="Tipo de operação"]').click({ force: true });
      const menuDoc1 = page.locator('.q-menu').last();
      await menuDoc1.waitFor();
      await menuDoc1
      .locator('.q-item')
      .filter({ hasText: /B2F/i })
      .click({ force: true }); 
      const tipoop = await page.locator('input[aria-label="Tipo de operação"]').inputValue();      
      console.log('TIPO DE OPERAÇÃO OK:', tipoop );

      await page.waitForTimeout(1000);
      const nome = `TEST CLIENTE ALTERADO ${Date.now()}`;
      await page.getByLabel(/nome completo/i).fill(nome);
      console.log('NOMBRE DO CLIENTE ALTERADO OK:', nome);

      await page.waitForTimeout(1000);
      const direccion = `TEST DIRECCION ALTERADA ${Date.now()}`;
      await page.getByLabel(/direção/i).fill(direccion);
      console.log('ENDEREÇO ALTERADO OK:', direccion);

      await page.waitForTimeout(1000);
      const numero = Math.floor(Math.random() * 4000) + 1;
      const campoNumero = page.locator('.q-field')
      .filter({ hasText: /número/i })
      .last();
      await campoNumero.locator('input').fill(numero.toString());
      console.log('NÚMERO ALTERADO OK:', numero.toFixed(0));

      await page.waitForTimeout(1000);
      const telefone = Array.from({ length: 9 }, () =>
        Math.floor(Math.random() * 10)
      ).join('');      
      const inputTelefone = page.locator('input[type="tel"]').first();
      await inputTelefone.scrollIntoViewIfNeeded();
      await inputTelefone.click({ force: true });
      await inputTelefone.press('Control+A');
      await inputTelefone.press('Backspace');
      await inputTelefone.type(telefone, { delay: 30 });
      console.log('TELEFONE ALTERADO OK:', telefone);    
      console.log('***FIM DE DADOS ENVIADOS**'); 

      await page.locator('.q-btn')
      .filter({ hasText: /salvar|guardar/i })
      .click({ force: true });
      console.log('CLICOU EM SALVAR');           

      await capturarRequisicaoApiCadastro(page, '/api/py/pessoa'); 
      
      await capturarRequisicoesApi(page); 
      await page.waitForTimeout(4000);    
  }
  else  {
      console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EDITAR.');  
  }

});