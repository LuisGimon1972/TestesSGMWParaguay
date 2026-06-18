import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Edição de datos funcionários', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  await loginCompleto(page);
  
  await page.getByText(/funcionários/i).click({ force: true });
  console.log('CLICOU EM FUNCIONÁRIOS');  

  await page.waitForSelector('table');
  await page.locator('.q-skeleton').first().waitFor({ state: 'detached', timeout: 15000 });
  await page.waitForSelector('table img[src*="edit"], table svg', { timeout: 15000 });
  const editIcons = await page.locator('table img[src*="edit"], table svg').count();
  console.log('Quantidade de ícones de edição:', editIcons);

  if (editIcons > 0) {          
      await page.locator('table img[src="/icons/edit.svg"]').first().click();
      console.log('CLICOU NO ÍCONE DE EDITAR');    

      const nomefuncionario = `TEST FUNCIONARIO ALTERADO ${Date.now()}`;
      const camponomefuncionario = page
      .locator('.q-field')
      .filter({ hasText: /funcionário/i })
      .first()
      .locator('input');
      await expect(camponomefuncionario).toBeVisible();
      await camponomefuncionario.fill(nomefuncionario);
      console.log('NOME FUNCIONÁRIO ALTERADO OK:', nomefuncionario);

      const cargofuncionario = `TEST CARGO ${Date.now()}`;
      const campocargofuncionario = page
      .locator('.q-field')
      .filter({ hasText: /cargo/i })
      .last()
      .locator('input');
      await expect(campocargofuncionario).toBeVisible();
      await campocargofuncionario.fill(cargofuncionario);
      console.log('CARGO FUNCIONÁRIO ALTERADO OK:', cargofuncionario);   
      
      await page.locator('.q-btn')
      .filter({ hasText: /salvar|guardar/i })
      .click({ force: true });
      console.log('CLICOU EM SALVAR USUARIO');
  }
  else  {
      console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EDITAR.');  
  }
  
  await capturarRequisicoesApi(page); 
  await page.waitForTimeout(4000);  
});