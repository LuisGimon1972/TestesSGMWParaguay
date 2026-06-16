import { test } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Edição de datos Pessoas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    

    await Promise.all([
      page.waitForURL(/pessoa/, { timeout: 15000 }),
      page.locator('a[href*="pessoa"]').first().click()
    ]);
    console.log('CLICOU PESSOAS');    

    await page.locator('table img[src="/icons/edit.svg"]').first().click();
    console.log('CLICOU NO ÍCONE DE EDITAR');
    

    await page.waitForTimeout(1000);
    await page.locator('[aria-label="Tipo de operação"]').click({ force: true });
    const menuDoc1 = page.locator('.q-menu').last();
    await menuDoc1.waitFor();
    await menuDoc1
    .locator('.q-item')
    .filter({ hasText: /B2F/i })
    .click({ force: true }); 
    console.log('TIPO DE OPERAÇÃO OK');

    await page.waitForTimeout(1000);
    const nome = `TEST CLIENTE ALTERADO ${Date.now()}`;
    await page.getByLabel(/nome completo/i).fill(nome);
    console.log('NOMBRE DO CLIENTE ALTERADO OK', nome);

    await page.waitForTimeout(1000);
    const direccion = `TEST DIRECCION ALTERADA ${Date.now()}`;
    await page.getByLabel(/direção/i).fill(direccion);
    console.log('EDEREÇO ALTERADO OK', nome);

    await page.waitForTimeout(1000);
    const numero = Math.floor(Math.random() * 4000) + 1;
    const campoNumero = page.locator('.q-field')
    .filter({ hasText: /número/i })
    .last();
    await campoNumero.locator('input').fill(numero.toString());
    console.log('NUMERO ALTERADO OK:', numero);

    await page.waitForTimeout(1000);
    const telefone = Array.from({ length: 9 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    console.log('TELEFONE:', telefone);
    const inputTelefone = page.locator('input[type="tel"]').first();
    await inputTelefone.scrollIntoViewIfNeeded();
    await inputTelefone.click({ force: true });
    await inputTelefone.press('Control+A');
    await inputTelefone.press('Backspace');
    await inputTelefone.type(telefone, { delay: 30 });
    console.log('TELEFONE ALTERADO OK');

     await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR');  


         
    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);    

function gerarRUC() {
  const base = Math.floor(1000000 + Math.random() * 9000000).toString(); // 7 dígitos
  const pesos = [2,3,4,5,6,7,2];
  let soma = 0;
  for (let i = 0; i < base.length; i++) {
    soma += parseInt(base[i]) * pesos[i];
  }
  const resto = soma % 11;
  const dv = resto > 1 ? 11 - resto : 0;
  return `${base}-${dv}`;
}

});