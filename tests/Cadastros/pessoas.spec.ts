import { test } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';
import { capturarRequisicaoApiCadastro } from '../../utils/capturaApipayload';

test('Cadastro de Clientes', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    

    await page.waitForTimeout(2000);        

    await page.waitForTimeout(1000);
    await page.getByText(/pessoas/i).click({ force: true }); 
    console.log('CLICOU PESSOAS');
      
    const btnCadastrar = page.getByText(/cadastrar pessoas/i).first();
      await btnCadastrar.waitFor();
      await btnCadastrar.click({ force: true });
      console.log('CLICOU CADASTRAR');

    console.log('***DADOS ENVIADOS PRA API***');
    await page.locator('[aria-label="Natureza"]').click({ force: true });
    const menu = page.locator('.q-menu:visible');
    await menu.waitFor();
    await menu
    .locator('.q-item')
    .filter({ hasText: /não contribuinte/i })
    .first()
    .click({ force: true });    
    const natureza = await page.locator('input[aria-label="Natureza"]').inputValue();      
    console.log('NATURALEZA OK:',natureza);

    await page.locator('[aria-label="Tipo do documento de identificação"]').click({ force: true });
    const menuDoc = page.locator('.q-menu').last();
    await menuDoc.waitFor();
    await menuDoc
    .locator('.q-item')
    .filter({ hasText: /carteira de identidade paraguaia/i })
    .click({ force: true });
    const tipodoc = await page.locator('input[aria-label="Tipo do documento de identificação"]').inputValue();      
    console.log('TIPO DE DOCUMENTO OK:',tipodoc);
    
    await page.waitForTimeout(700);
    const ruc = gerarRUC();
    await page.getByLabel(/número de documento de identificação/i).fill(ruc);
    console.log('RUC:', ruc);
    
    await page.waitForTimeout(700);
    await page.locator('[aria-label="Tipo de operação"]').click({ force: true });
    const menuDoc1 = page.locator('.q-menu').last();
    await menuDoc1.waitFor();
    await menuDoc1
    .locator('.q-item')
    .filter({ hasText: /B2C/i })
    .click({ force: true }); 
    const tipoop = await page.locator('input[aria-label="Tipo de operação"]').inputValue();      
    console.log('TIPO DE OPERAÇÃO OK:', tipoop );

    const nome = `TEST CLIENTE ${Date.now()}`;
    await page.getByLabel(/nome completo/i).fill(nome);
    console.log('NOMBRE DO CLIENTE OK:', nome);

    await page.locator('[aria-label="Tipo de cadastro"]').click({ force: true });
    const menuDoc2 = page.locator('.q-menu').last();
    await menuDoc2.waitFor();
    await menuDoc2
    .locator('.q-item')
    .filter({ hasText: /cliente/i })
    .click({ force: true });
    const tipocad = await page.locator('input[aria-label="Tipo de cadastro"]').inputValue();      
    console.log('TIPO DE CADASTRO OK:',tipocad);

    await page.locator('.q-field')
    .filter({ hasText: /departamento/i })
    .first()
    .click({ force: true });
    const menuDepartamento = page.locator('.q-menu').last();
    await menuDepartamento.waitFor();
    await menuDepartamento
    .locator('.q-item')
    .filter({ hasText: /alto paraná|alto parana/i })
    .click({ force: true });
    const dep = await page.locator('input[aria-label="Departamento"]').inputValue();      
    console.log('DEPARTAMENTO OK:',dep);

    await page.locator('.q-field')
    .filter({ hasText: /distrito/i })
    .first()
    .click({ force: true });
    const menuDistrito = page.locator('.q-menu').last();
    await menuDistrito.waitFor();
    await menuDistrito
    .locator('.q-item')
    .filter({ hasText: /ciudad/i })
    .click({ force: true });
    const distrito = await page.locator('input[aria-label="Distrito"]').inputValue();      
    console.log('DISTRITO OK:',distrito);

    await page.locator('.q-field')
    .filter({ hasText: /cidade/i })
    .first()
    .click({ force: true });
    const menuCiudad = page.locator('.q-menu').last();
    await menuCiudad.waitFor();
    await menuCiudad
    .locator('.q-item')
    .filter({ hasText: /2A/i })
    .click({ force: true });
    const city = await page.locator('input[aria-label="Cidade/Bairro"]').inputValue();      
    console.log('CIUDAD OK:',city);

    const direccion = `TEST DIRECCION ${Date.now()}`;
    await page.getByLabel(/direção/i).fill(direccion);
    console.log('DIRECCIÓN OK:', direccion);

    await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() => {
      document.body.style.zoom = '0.9';
    });
    console.log('🔍 Zoom ajustado para 90% via CSS');

    const numero = Math.floor(Math.random() * 1000) + 1;
    const campoNumero = page.locator('.q-field')
    .filter({ hasText: /número/i })
    .last();
    await campoNumero.locator('input').fill(numero.toString());
    console.log('NUMERO OK:', numero);

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
    console.log('TELEFONE OK:', telefone);    
    console.log('***FIM DE DADOS ENVIADOS***');    

    await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR');          
    
    await capturarRequisicaoApiCadastro(page, '/api/py/pessoa'); 
   
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