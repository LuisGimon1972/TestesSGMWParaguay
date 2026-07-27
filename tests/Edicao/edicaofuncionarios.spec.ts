import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Edição de datos funcionários', async ({ page }) => {
  await loginCompleto(page);
  
  await page.getByText(/funcionários/i).click({ force: true });
  console.log('✅ Clicou em  Funcionários');  

  await page.waitForSelector('table');
  await page.locator('.q-skeleton').first().waitFor({ state: 'detached', timeout: 15000 });
  await page.waitForSelector('table img[src*="edit"], table svg', { timeout: 15000 });
  const editIcons = await page.locator('table img[src*="edit"], table svg').count();  
  console.log('✅ Quantidade de Regisnos na grade:', editIcons.toString().trim());

  if (editIcons > 0) {          
       
      const getRegistroEditadoPromise = page.waitForResponse((response) =>
      response.url().includes('/api/py/funcionario') &&
      response.request().method() === 'GET' &&
      response.status() === 200 &&
      /\/api\/py\/funcionario\/[^/?]+/.test(response.url())
      );

      const getFuncionarioPromise = page.waitForResponse((response) =>
      response.url().includes('/api/py/funcionario') &&
      response.request().method() === 'GET' &&
      response.status() === 200
      );

      await page.locator('table img[src="/icons/edit.svg"]').first().click();
      console.log('✅ Clicou no ícone Editar');    

      const getFuncionarioResponsee = await getFuncionarioPromise;
      const dadosAntes = await getFuncionarioResponsee.json();
      console.log('✅ REGISTRO NO BANCO (ANTES DA ALTERAÇÃO) ***');
      console.log('📦 JSON do Registro Editado:'+JSON.stringify(dadosAntes, null, 2));      

      const getRegistroEditadoResponse = await getRegistroEditadoPromise;
      const urlRegistroEditado = getRegistroEditadoResponse.url();
      const headersOriginais = getRegistroEditadoResponse.request().headers();

      console.log('📝 DADOS ENVIADOS PRA API');

      console.log('🌐URL DO REGISTRO EDITADO:', urlRegistroEditado);      

      const nomefuncionario = `TEST FUNCIONARIO ALTERADO ${Date.now()}`;
      const camponomefuncionario = page
      .locator('.q-field')
      .filter({ hasText: /funcionário/i })
      .first()
      .locator('input');
      await expect(camponomefuncionario).toBeVisible();
      await camponomefuncionario.fill(nomefuncionario);
      console.log('✅ Nome do Funcionário Alterado:', nomefuncionario);

      const cargofuncionario = `TEST CARGO ${Date.now()}`;
      const campocargofuncionario = page
      .locator('.q-field')
      .filter({ hasText: /cargo/i })
      .last()
      .locator('input');
      await expect(campocargofuncionario).toBeVisible();
      await campocargofuncionario.fill(cargofuncionario);
      console.log('✅ Cargo do Funcionário Alterado:', cargofuncionario);   

      const tipdoc = await page.locator('input[aria-label="Tipo de documento"]').inputValue();      
      console.log('✅ Tipo de Documento:', tipdoc); 
      console.log('📝 FIM DE DADOS ENVIADOS');

      const salvarFuncionarioPromise = page.waitForResponse((response) =>
      response.url().includes('/api/py/funcionario') &&
      ['PUT', 'PATCH', 'POST'].includes(response.request().method()) &&
      response.status() >= 200 &&
      response.status() < 300
      );
      
      await page.locator('.q-btn')
      .filter({ hasText: /salvar|guardar/i })
      .click({ force: true });
      console.log('✅ Clicou em Salvar Usuário');

      await salvarFuncionarioPromise;

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
      const getFuncionarioResponse = await page.request.get(urlRegistroEditado, {
        headers: headersGetRegistro,
      });
      console.log(`✅ Status GET Registro Editado: ${String(getFuncionarioResponse.status())}`);
      const textoResposta = await getFuncionarioResponse.text();
      if (!getFuncionarioResponse.ok()) {
        throw new Error(`GET registro editado falhou: ${getFuncionarioResponse.status()} - ${textoResposta}`);
      }
      const dadosDepois = JSON.parse(textoResposta);
      console.log('✅ DADOS APÓS DA ALTERAÇÃO (GET DO REGISTRO EDITADO)***');
      console.log('📦 JSON do Registro Consultado:'+JSON.stringify(dadosDepois, null, 2));      
  }
  else  {
      console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EDITAR.');  
  }
  
  await capturarRequisicoesApi(page); 
  await page.waitForTimeout(4000);  
  console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});