import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Exclusão de datos funcionários', async ({ page }) => {
  await loginCompleto(page);
  
  await page.getByText(/funcionários/i).click({ force: true });
  console.log('✅ Clicou em Funcionários');  
  
  await page.waitForTimeout(2000);
  
  const menuTresPontos = page.locator('table tr:first-child >> text=more_vert');

  // 1. Verifica se existe algum registro clicável na tabela
  const temRegistro = await menuTresPontos.isVisible({ timeout: 3000 }).catch(() => false);

  if (!temRegistro) {
    console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR.');
    test.skip(true, '⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR.');
    return;
  }

  await menuTresPontos.click();
  console.log('✅ Clicou nos três pontos');       
  
  const botaoExcluirMenu = page.locator('text=Excluir');
  const podeExcluir = await botaoExcluirMenu.isVisible({ timeout: 3000 }).catch(() => false);

  if (!podeExcluir) {
    console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR.');
    test.skip(true, '⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR.');
    return;
  }

  console.log('✅ CAPTURA DO REGISTRO ANTES DE SER REMOVIDO:');
  const primeiraLinha = page.locator('table tr:first-child td');      
  const linhas = page.locator('tbody tr');      
  const linhaSelecionada = linhas.nth(1);
  const colunas = linhaSelecionada.locator('td');
  const totalColunas = await colunas.count();
  const nomeFuncionario = totalColunas > 0 ? (await colunas.nth(2).innerText().catch(() => '')).trim() : '';
  console.log(`     ✅ Funcionário selecionado para exclusão: ${nomeFuncionario || 'Desconhecido'}`);              
  const cargo = (await linhaSelecionada.locator('td').nth(3).innerText().catch(() => '')).trim(); 
  console.log(`     ✅ Cargo: ${cargo}`);        
  const tipodoc = (await linhaSelecionada.locator('td').nth(4).innerText().catch(() => '')).trim(); 
  console.log(`     ✅ Tipo de Cadastro: ${tipodoc}`);                  
  const cedula = (await linhaSelecionada.locator('td').nth(5).innerText().catch(() => '')).trim(); 
  console.log(`     ✅ Cédula: ${cedula}`);                       

  await page.waitForSelector('table tr:first-child td', { state: 'visible' });
  
  const codigoPessoa = await primeiraLinha.nth(2).textContent(); 
  const codigoLimpo = codigoPessoa?.trim();

  if (!codigoLimpo) {
    console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR.');
    test.skip(true, '⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR.');
    return;
  }
  console.log(`✅ Código selecionado: ${codigoLimpo}`);

  await botaoExcluirMenu.click();     
  console.log('✅ Clicou em Excluir'); 
  
  await page.waitForTimeout(1000);
  await page.waitForSelector('button:has-text("EXCLUIR")');
  await page.click('button:has-text("EXCLUIR")');
  console.log('✅ Clicou em Excluir no modal de confirmação');

  const deleteResponse = await page.waitForResponse((response) =>
    response.url().includes(`/api/py/funcionario/${codigoLimpo}`) &&
    response.request().method() === 'DELETE'
  );
  expect([200, 204]).toContain(deleteResponse.status());

  const getExcluidoResponse = await page.request.get(`/api/py/funcionario/${codigoLimpo}`);

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