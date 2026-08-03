import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Exclusão de datos Subgrupos', async ({ page }) => {
    await loginCompleto(page);    
 
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('✅ Clicou em Cadastros');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/subgrupos"]').click()
    console.log('✅ Clicou em Subgrupos');

    await page.waitForTimeout(2000);
    const trashIcons = await page.locator('table img[src*="trash"]').count();


    if (trashIcons === 0) {
       console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR!');
       return;
    } 
    console.log('✅ CAPTURA DO REGISTRO ANTES DE SER REMOVIDO:');
      const primeiraLinha = page.locator('table tr:first-child td');      
      const linhas = page.locator('tbody tr');      
      const linhaSelecionada = linhas.nth(1);
      const colunas = linhaSelecionada.locator('td');
      const totalColunas = await colunas.count();
      const nomeSGrupo = totalColunas > 0 ? (await colunas.nth(2).innerText().catch(() => '')).trim() : '';
      console.log(`     ✅ Subgrupo selecionado para exclusão: ${nomeSGrupo || 'Desconhecido'}`);              
      const cod = (await linhaSelecionada.locator('td').nth(1).innerText().catch(() => '')).trim(); 
      console.log(`     ✅ Código: ${cod}`);              
    
          await page.waitForSelector('table tr:first-child td', { state: 'visible' });
      
      const codigoSubgrupo = await primeiraLinha.nth(2).textContent(); // exemplo: coluna 1
      const codigoLimpo = codigoSubgrupo?.trim();

      if (!codigoLimpo) {
        throw new Error('⚠️ Não foi possível capturar o código da pessoa na tabela.');
      }
      console.log(`✅ Código selecionado: ${codigoLimpo}`);

      await page.waitForTimeout(1000);
      await page.locator('table img[src*="trash"]').first().click();
      console.log('✅ Clicou em Excluir');
      
      await page.waitForTimeout(1000);
      await page.waitForSelector('button:has-text("EXCLUIR")');
      await page.click('button:has-text("EXCLUIR")');
      console.log('✅ Clicou em Excluir no Cadastro de confirmação');

      const deleteResponse = await page.waitForResponse((response) =>
      response.url().includes(`/api/produto/subgrupo/${codigoLimpo}`) &&
      response.request().method() === 'DELETE');
      expect([200, 204]).toContain(deleteResponse.status());

      const getExcluidoResponse = await page.request.get(`/api/produto/subgrupo/${codigoLimpo}`);

      console.log('✅ RESPOSTA DA API AO CONSULTAR REGISTRO EXCLUÍDO');
      console.log(`     ✅Status: ${getExcluidoResponse.status()}`);

      try {
        const dadosExcluido = await getExcluidoResponse.json();
        console.log(JSON.stringify(dadosExcluido, null, 2));
      } catch {
        console.log('     ✅ Resposta sem corpo. (Status Code: 404)');
      }
      
      expect([404, 200]).toContain(getExcluidoResponse.status());

      console.log(`✅ Registro ${codigoLimpo} removido com sucesso.`);           

    await capturarRequisicoesApi(page);
    await page.waitForTimeout(4000);    
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});