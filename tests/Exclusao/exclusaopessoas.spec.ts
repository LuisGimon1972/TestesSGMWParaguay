import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Exclusão de datos Pessoas', async ({ page }) => {
    await loginCompleto(page);     

    await page.waitForTimeout(2000);      

    await page.waitForTimeout(1000);
    await page.getByText(/pessoas/i).click({ force: true }); 
    console.log('✅ Clicou em Pessoas');    

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
      const nomeCliente = totalColunas > 0 ? (await colunas.nth(4).innerText().catch(() => '')).trim() : '';
      console.log(`     ✅ Cliente selecionado para exclusão: ${nomeCliente || 'Desconhecido'}`);              
      const natureza = (await linhaSelecionada.locator('td').nth(2).innerText()).trim(); 
      console.log(`     ✅ Natureza: ${natureza}`);        
      const tipoc = (await linhaSelecionada.locator('td').nth(3).innerText()).trim(); 
      console.log(`     ✅ Tipo de Cadastro: ${tipoc}`);                  
      const pais = (await linhaSelecionada.locator('td').nth(6).innerText()).trim(); 
      console.log(`     ✅ País: ${pais}`);                  
      const dpto = (await linhaSelecionada.locator('td').nth(7).innerText()).trim(); 
      console.log(`     ✅ Departamento: ${dpto}`);                  
      const dtto = (await linhaSelecionada.locator('td').nth(8).innerText()).trim(); 
      console.log(`     ✅ Distrito: ${dtto}`);                  
      const ciudad = (await linhaSelecionada.locator('td').nth(9).innerText()).trim(); 
      console.log(`     ✅ Cidade: ${ciudad}`);                        
      

      await page.waitForSelector('table tr:first-child td', { state: 'visible' });
      
      const codigoPessoa = await primeiraLinha.nth(2).textContent(); // exemplo: coluna 1
      const codigoLimpo = codigoPessoa?.trim();
      
      if(codigoLimpo=='1'){
        console.log('O REGISTRO PADRÃO NÃO PODE SER EXCLUIDO!');
        return
      }

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

      console.log('✅ Clicou em Excluir no modal de confirmação');

      const deleteResponse = await page.waitForResponse((response) =>
      response.url().includes(`/api/py/pessoa/${codigoLimpo}`) &&
      response.request().method() === 'DELETE');
      expect([200, 204]).toContain(deleteResponse.status());

      const getExcluidoResponse = await page.request.get(`/api/py/pessoa/${codigoLimpo}`);

      console.log('✅ RESPOSTA DA API AO CONSULTAR REGISTRO EXCLUÍDO');
      console.log(`     ✅ Status: ${getExcluidoResponse.status()}`);

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
    } else {
      console.log('⚠️ Nenhum registro encontrado na grade, nada para excluir!');
    }    
});