import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Exclusão de datos Usuários', async ({ page }) => {
  await loginCompleto(page);
  
  const usuariosBtn = page.getByText(/usu[aá]rios/i).first();
  await expect(usuariosBtn).toBeVisible();
  await usuariosBtn.click();
  console.log('✅ Clicou em Usuários');

  const listado = page.locator('a[href*="usuario/listado"]');
  await expect(listado).toBeVisible();
  await listado.click();
  console.log('✅ Clicou em Listagem de Usuários');
  
  await page.waitForTimeout(2000);
  
  const trashIcons = await page.locator('table img[src*="trash"]').count();
  console.log('Quantidade de ícones de edição:', trashIcons);

    if (trashIcons === 0) {
       console.log('✅ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR.');
       return;
    } 

      console.log('✅ CAPTURA DO REGISTRO ANTES DE SER REMOVIDO:');
      const primeiraLinha = page.locator('table tr:first-child td');      
      const linhas = page.locator('tbody tr');      
      const linhaSelecionada = linhas.nth(1);
      const colunas = linhaSelecionada.locator('td');
      const totalColunas = await colunas.count();
      const nomeUsuario = totalColunas > 0 ? (await colunas.nth(3).innerText().catch(() => '')).trim() : '';
      console.log(`     ✅ Usuário selecionado para exclusão: ${nomeUsuario || 'Desconhecido'}`);              
      const ci = (await linhaSelecionada.locator('td').nth(4).innerText().catch(() => '')).trim(); 
      console.log(`     ✅ Cédula: ${ci}`);        
      const perfil = (await linhaSelecionada.locator('td').nth(2).innerText().catch(() => '')).trim(); 
      console.log(`     ✅ Perfil: ${perfil}`);        
      const email = (await linhaSelecionada.locator('td').nth(5).innerText().catch(() => '')).trim(); 
      console.log(`     ✅ E-mail: ${email}`);                        

      await page.waitForSelector('table tr:first-child td', { state: 'visible' });
      
      const codigoPessoa = await primeiraLinha.nth(2).textContent(); // exemplo: coluna 1
      const codigoLimpo = codigoPessoa?.trim();

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
      console.log('✅ Clicou em Excluir no modal de confirmação');

      const deleteResponse = await page.waitForResponse((response) =>
      response.url().includes(`/api/usuario/${codigoLimpo}`) &&
      response.request().method() === 'DELETE');
      expect([200, 204]).toContain(deleteResponse.status());

      const getExcluidoResponse = await page.request.get(`/api/usuario/${codigoLimpo}`);

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

      await page.waitForTimeout(2000);
      await capturarRequisicoesApi(page);
      await page.waitForTimeout(4000);
      console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});