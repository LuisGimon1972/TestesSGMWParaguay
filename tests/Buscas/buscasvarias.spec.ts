import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';

test('Teste de Busca Crítico Unificado: Pessoas, Produtos, Faturamento, Usuários e DAV', async ({ page }) => {
  // ⏱️ Aumenta o timeout para 3 minutos, pois são 5 módulos pesados em sequência
  test.setTimeout(180000);

  await loginCompleto(page);
  console.log(`🕒 Início das buscas: ${formatarDataHora(new Date())}`);

  // ==============================================================
  // 1. MÓDULO PESSOAS
  // ==============================================================
  await page.getByText(/pessoas/i).click({ force: true }); 
  console.log('✅ Clicou em Pessoas');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIcons = await page.locator('table img[src*="edit"], table svg').count();  
  expect(editIcons, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM PESSOAS!').toBeGreaterThan(0);
  
  const linhas = page.locator('tbody tr');      
  const linhaSelecionada = linhas.nth(1);
  const colunas = linhaSelecionada.locator('td');
  const totalColunas = await colunas.count();
  const nome = totalColunas > 0 ? (await colunas.nth(4).innerText().catch(() => '')).trim() : '';

  const primeiroNome = nome.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNome);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  const registrosEncontrados = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontrados === 0) {
      console.log(`⚠️ Nenhum registro encontrado com o valor: ${primeiroNome}`);
  } else {
      console.log('✅ BUSCA PESSOA EXISTENTE:', primeiroNome);
  }        

  const nomeInexistente = `NOME INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(nomeInexistente);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA PESSOA INEXISTENTE:', nomeInexistente);


  // ==============================================================
  // 2. MÓDULO PRODUTOS
  // ==============================================================
  await Promise.all([
      page.waitForURL(/producto/, { timeout: 15000 }),
      page.locator('a[href*="producto"]').first().click()
  ]);
  console.log('✅ Clicou em Produtos');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIconsP = await page.locator('table img[src*="edit"], table svg').count();  
  expect(editIconsP, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM PRODUTOS!').toBeGreaterThan(0);
  
  const linhasP = page.locator('tbody tr');      
  const linhaSelecionadaP = linhasP.nth(1);
  const colunasP = linhaSelecionadaP.locator('td');
  const totalColunasP = await colunasP.count();
  const nomeP = totalColunasP > 0 ? (await colunasP.nth(2).innerText().catch(() => '')).trim() : '';

  const primeiroNomeP = nomeP.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNomeP);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosP = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosP === 0) {
      console.log(`⚠️ Nenhum registro encontrado com o valor: ${primeiroNomeP}`);
  } else {
      console.log('✅ BUSCA PRODUTO EXISTENTE:', primeiroNomeP);
  }            

  const prodInexistenteP = `PRODUTO INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(prodInexistenteP);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA PRODUTO INEXISTENTE:', prodInexistenteP);    


  // ==============================================================
  // 3. MÓDULO FATURAMENTO
  // ==============================================================
  const venBtnF = page.getByText(/vendas/i).first();
  await expect(venBtnF).toBeVisible();
  await venBtnF.click();
  console.log('✅ Clicou em Vendas');                
  
  await Promise.all([
      page.waitForURL(/facturacion/, { timeout: 15000 }),
      page.locator('a[href*="facturacion"]').first().click()
  ]);
  console.log('✅ Clicou em Faturamento');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIconsF = await page.locator('table img[src*="edit"], table svg').count();  
  expect(editIconsF, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM FATURAMENTO!').toBeGreaterThan(0);
  
  const linhasF = page.locator('tbody tr');      
  const linhaSelecionadaF = linhasF.nth(1);
  const colunasF = linhaSelecionadaF.locator('td');
  const totalColunasF = await colunasF.count();
  const nomeclienteF = totalColunasF > 0 ? (await colunasF.nth(4).innerText().catch(() => '')).trim() : '';
  const primeiroNomeF = nomeclienteF.toString().replace(/[^a-zA-ZÀ-ÿ\s]/g, '').replace(/\s+/g, ' ').trim();                        
  
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNomeF);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosF = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosF === 0) {
      console.log(`⚠️ Nenhum registro encontrado com o valor: ${primeiroNomeF}`);
  } else {
      console.log('✅ FATURA EXISTENTE:', primeiroNomeF);
  }            

  const prodInexistenteF = `CLIENTE INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(prodInexistenteF);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA FATURA INEXISTENTE:', prodInexistenteF);

  // ==============================================================
  // 5. MÓDULO DAV
  // ==============================================================
  const venBtnD = page.getByText(/vendas/i).first();
  await expect(venBtnD).toBeVisible();
  await venBtnD.click();
  console.log('✅ Clicou em Vendas');
  
  await Promise.all([
      page.waitForURL(/dav/, { timeout: 15000 }),
      page.locator('a[href*="dav"]').first().click()
  ]);
  console.log('✅ Clicou em DAV');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIconsD = await page.locator('table img[src*="edit"], table svg').count();  
  expect(editIconsD, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM DAV!').toBeGreaterThan(0);

  const linhasD = page.locator('tbody tr');      
  const linhaSelecionadaD = linhasD.nth(1);
  const colunasD = linhaSelecionadaD.locator('td');
  const totalColunasD = await colunasD.count();
  const nomedavD = totalColunasD > 0 ? (await colunasD.nth(2).innerText().catch(() => '')).trim() : '';        

  const davNomeD = nomedavD.toString().replace(/[^a-zA-ZÀ-ÿ\s]/g, '').replace(/\s+/g, ' ').trim();                        
  
  await page.getByLabel(/pesquisar registro/i).fill(davNomeD);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosD = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosD === 0) {
      console.log(`⚠️ Nenhum registro encontrado com o valor: ${davNomeD}`);
  } else {
      console.log('✅ BUSCA DAV EXISTENTE:', davNomeD);
  }    

  const davInexistenteD = `CLIENTE DAV INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(davInexistenteD);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA DAV INEXISTENTE:', davInexistenteD);

  
  // ==============================================================
  // 4. MÓDULO USUÁRIOS
  // ==============================================================
  const usuariosBtn = page.getByText(/usu[aá]rios/i).first();
  await expect(usuariosBtn).toBeVisible();
  await usuariosBtn.click();
  console.log('✅ Clicou em Usuários');

  const listadoU = page.locator('a[href*="usuario/listado"]');
  await expect(listadoU).toBeVisible();
  await listadoU.click();
  console.log('✅ Clicou em Listagem de Usuários');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIconsU = await page.locator('table img[src*="edit"], table svg').count();  
  expect(editIconsU, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM USUÁRIOS!').toBeGreaterThan(0);
  
  const linhasU = page.locator('tbody tr');      
  const linhaSelecionadaU = linhasU.nth(1);
  const colunasU = linhaSelecionadaU.locator('td');
  const totalColunasU = await colunasU.count();
  const nomeusuarioU = totalColunasU > 0 ? (await colunasU.nth(3).innerText().catch(() => '')).trim() : '';

  const primeiroNomeU = nomeusuarioU.toString().trim();     
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNomeU);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  const registrosEncontradosU = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosU === 0) {
      console.log(`⚠️ Nenhum registro encontrado com o valor: ${primeiroNomeU}`);
  } else {
      console.log('✅ BUSCA USUÁRIO EXISTENTE:', primeiroNomeU);
  }    

  const prodInexistenteU = `USUÁRIO INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(prodInexistenteU);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA USUÁRIO INEXISTENTE:', prodInexistenteU);

      // ==============================================================
  // 6. MÓDULO PERFIL DE ACESSO
  // ============================================================== 

  await page.waitForTimeout(1000);
  await page.locator('a[href*="usuario/perfil"]').click();
  console.log('✅ Clicou em Perfil de Acesso');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIconsPerfil = await page.locator('table img[src*="edit"], table svg').count();  
  expect(editIconsPerfil, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM PERFIL DE ACESSO!').toBeGreaterThan(0);
  
  const linhasPerfil = page.locator('tbody tr');      
  const linhaSelecionadaPerfil = linhasPerfil.nth(1);
  const colunasPerfil = linhaSelecionadaPerfil.locator('td');
  const totalColunasPerfil = await colunasPerfil.count();
  const perfilP = totalColunasPerfil > 0 ? (await colunasPerfil.nth(2).innerText().catch(() => '')).trim() : '';

  const primeiroNomePerfil = perfilP.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNomePerfil);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosPerfil = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosPerfil === 0) {
      console.log(`⚠️ Nenhum registro encontrado com o valor: ${primeiroNomePerfil}`);
  } else {
      console.log('✅ BUSCA PERFIL EXISTENTE:', primeiroNomePerfil);
  }        

  const prodInexistentePerfil = `PERFIL INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(prodInexistentePerfil);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA PERFIL INEXISTENTE:', prodInexistentePerfil);
  
  console.log(`🕒 Finalização de TODOS os testes de busca: ${formatarDataHora(new Date())}`);        


});