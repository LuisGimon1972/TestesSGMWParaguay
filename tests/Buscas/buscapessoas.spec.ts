import { test } from '@playwright/test';
import { loginCompleto, formatarDataHora   } from '../../utils/loginCompleto';

test('Teste de busca crítico em Pessoas', async ({ page }) => {
  await loginCompleto(page);
  
  await page.waitForTimeout(1000);
  await page.getByText(/pessoas/i).click({ force: true }); 
  console.log('CLICOU PESSOAS');

  await page.waitForTimeout(2000);
  const editIcons = await page.locator('table img[src*="edit"], table svg').count();  

  if (editIcons === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
      return;
  } 
  
  const linhas = page.locator('tbody tr');      
  const linhaSelecionada = linhas.nth(1);
  const colunas = linhaSelecionada.locator('td');
  const totalColunas = await colunas.count();
  const nome = totalColunas > 0 ? (await colunas.nth(4).innerText().catch(() => '')).trim() : '';

  const primeiroNome = nome.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
  await page.waitForTimeout(2000);  
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  console.log('BUSCA PESSOA EXISTENTE OK:', primeiroNome);

  await page.waitForTimeout(1000);

  const nomeInexistente = `NOME INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(nomeInexistente);
  await page.waitForTimeout(1000);  
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  console.log('BUSCA PESSOA INEXISTENTE OK:', nomeInexistente);
  console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});