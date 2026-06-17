import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Edição de datos produtos/serviços', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await loginCompleto(page);    

      await page.waitForTimeout(1000);
      await Promise.all([
      page.waitForURL(/producto/, { timeout: 15000 }),
      page.locator('a[href*="producto"]').first().click()
      ]);
      console.log('CLICOU PRODUTOS');

      await page.locator('table img[src="/icons/edit.svg"]').first().click();
      console.log('CLICOU NO ÍCONE DE EDITAR');

      const nomeproduto = `TEST PRODUTO ALTERADO ${Date.now()}`;
      await page.getByLabel(/nome/i).fill(nomeproduto);
      console.log('NOME DE PRODUTO ALTERADO OK', nomeproduto);      

      await page.waitForTimeout(1000);
      const localestoque = `TEST LOCAL ESTOQUE ALTERADO ${Date.now()}`;
      await page.getByLabel(/localização/i).fill(localestoque);
      console.log('LOCALIZAÇÃO ALTERADA DE ESTOQUE OK', localestoque);

      await page.waitForTimeout(1000);
      const refestoque = `TEST REFERÊNCIA ESTOQUE ALTERADA ${Date.now()}`;
      await page.getByLabel(/referência/i).fill(refestoque);
      console.log('REFERÊNCIA ALTERADA ESTOQUE ESTOQUE OK', refestoque);

      await page.waitForTimeout(1000);
      await page.locator('[aria-label="Fornecedor"]').click({ force: true });
      const menu = page.locator('.q-menu:visible');
      await menu.waitFor();
      await menu
      .locator('.q-item')
      .filter({ hasText: /registro estándar/i })
      .first()
      .click({ force: true });
      console.log('FORNECEDOR OK');

      await page.waitForTimeout(1000);
      const precusto = Math.floor(Math.random() * 1000) + 1;
      const campoPrecusto = page.locator('.q-field')
      .filter({ hasText: /preço de custo/i })
      .last();
      await campoPrecusto.locator('input').fill(precusto.toString());
      console.log('PREÇO DE CUSTO ALTERADO OK:', precusto);

      await page.waitForTimeout(1000);
      const cantidad = Math.floor(Math.random() * 1000) + 1;
      const campocantidad = page.locator('.q-field')
      .filter({ hasText: /quantidade/i })
      .first();
      await campocantidad.locator('input').fill(cantidad.toString());
      console.log('QUANTIDADE ALTERADA OK:', cantidad);

      await page.waitForTimeout(1000);
      const cantidadmin = Math.floor(Math.random() * 100) + 1;
      const campoCantidadMin = page
      .locator('.q-field')
      .filter({ hasText: /quantidade mínima/i })
      .last();
      const input = campoCantidadMin.locator('input');
      await expect(input).toBeVisible();
      await input.fill(String(cantidadmin));
      console.log('QUANTIDADE MÍNIMA ALTERADA OK:', cantidadmin);

      await page.waitForTimeout(1000);
      const cantidadmax = Math.floor(Math.random() * 1000) + 1;
      const campoCantidadmax = page
      .locator('.q-field')
      .filter({ hasText: /quantidade máxima/i })
      .last();
      const input2 = campoCantidadmax.locator('input');
      await expect(input).toBeVisible();
      await input2.fill(String(cantidadmax));
      console.log('QUANTIDADE MÁXIMA ALTERADA OK:', cantidadmax);

      await page.waitForTimeout(1000);
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
      console.log('IVA OK');

      await page.locator('.q-btn')
      .filter({ hasText: /salvar|guardar/i })
      .click({ force: true });
      console.log('CLICOU EM SALVAR');  

      console.log(`***REQUISIÇÕES DA API ⬅️***`);
      await capturarRequisicoesApi(page); 
      await page.waitForTimeout(4000);
});