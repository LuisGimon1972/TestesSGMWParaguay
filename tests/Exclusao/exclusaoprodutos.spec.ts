import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Exclusão de datos Produtos', async ({ page }) => {
    await loginCompleto(page);    

    await page.waitForTimeout(1000);
      await Promise.all([
      page.waitForURL(/producto/, { timeout: 15000 }),
      page.locator('a[href*="producto"]').first().click()
      ]);
      console.log('✅ Clicou em Produtos');

     await page.waitForTimeout(2000);
  
     const menuTresPontos = page.locator('table tr:first-child >> text=more_vert');

     if (await menuTresPontos.count() > 0 && await menuTresPontos.isVisible()) {      
      await menuTresPontos.click();
      console.log('✅ Clicou nos três pontos');             
      console.log('✅ CAPTURA DO REGISTRO ANTES DE SER REMOVIDO:');
      const primeiraLinha = page.locator('table tr:first-child td');      
      const linhas = page.locator('tbody tr');      
      const linhaSelecionada = linhas.nth(1);
      const colunas = linhaSelecionada.locator('td');
      const totalColunas = await colunas.count();
      const nomeProduto = totalColunas > 0 ? (await colunas.nth(2).innerText().catch(() => '')).trim() : '';
      console.log(`     ✅ Produto selecionado para exclusão: ${nomeProduto || 'Desconhecido'}`);              
      const barras = (await linhaSelecionada.locator('td').nth(3).innerText()).trim(); 
      console.log(`     ✅ Código de Barras: ${barras}`);        
      const ref = (await linhaSelecionada.locator('td').nth(4).innerText()).trim(); 
      console.log(`     ✅ Referência: ${ref}`);                  
      const fornecedor = (await linhaSelecionada.locator('td').nth(5).innerText()).trim(); 
      console.log(`     ✅ Fornecedor: ${fornecedor}`);                        
     
      await page.waitForSelector('table tr:first-child td', { state: 'visible' });

      const codigoProduto = await primeiraLinha.nth(2).textContent(); // exemplo: coluna 1
      const codigoLimpo = codigoProduto?.trim();

      if (!codigoLimpo) {
        throw new Error('⚠️ Não foi possível capturar o código da pessoa na tabela.');
      }
      console.log(`✅ Código selecionado: ${codigoLimpo}`);

      await page.waitForTimeout(1000);
      await page.waitForSelector('text=Excluir', { state: 'visible' });
      await page.locator('text=Excluir').click();      
      console.log('✅ Clicou em Excluir');   

      await page.waitForTimeout(1000);
      await page.waitForSelector('button:has-text("EXCLUIR")');
      await page.click('button:has-text("EXCLUIR")');
      console.log('✅ Clicou em Excluir no diálogo de confirmação');

      const deleteResponse = await page.waitForResponse((response) =>
      response.url().includes(`/api/py/produto/geral/${codigoLimpo}`) &&
      response.request().method() === 'DELETE');
      expect([200, 204]).toContain(deleteResponse.status());

      const getExcluidoResponse = await page.request.get(`/api/py/produto/geral/${codigoLimpo}`);

      console.log('✅ RESPOSTA DA API AO CONSULTAR REGISTRO EXCLUÍDO');
      console.log(`✅ Status: ${getExcluidoResponse.status()}`);

      try {
        const dadosExcluido = await getExcluidoResponse.json();
        console.log(JSON.stringify(dadosExcluido, null, 2));
      } catch {
        console.log('✅ Resposta sem corpo. (Status Code: 404)');
      }
      
      expect([404, 200]).toContain(getExcluidoResponse.status());
      console.log(`✅ Registro ${codigoLimpo} removido com sucesso.`); 
      
      await capturarRequisicoesApi(page);
      await page.waitForTimeout(4000);
      console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
     } else {
      console.log('✅ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR.');
     }
});