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
  // MÓDULO ESPÉCIES
  // ==============================================================
  await page.waitForTimeout(1000);
  await page.getByText(/cadastros/i).click({ force: true }); 
  console.log('✅ Clicou em Cadastros');

  await page.waitForTimeout(1000);
  await page.locator('a[href*="registros/metodos-pagos"]').click();
  console.log('✅ Clicou em Espécies'); 

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIconsEspecie = await page.locator('table img[src*="edit"], table svg').count();  
  expect(editIconsEspecie, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM ESPÉCIES!').toBeGreaterThan(0);
  
  const linhasEspecie = page.locator('tbody tr');      
  const linhaSelecionadaEspecie = linhasEspecie.nth(1);
  const colunasEspecie = linhaSelecionadaEspecie.locator('td');
  const totalColunasEspecie = await colunasEspecie.count();
  const nomeesp = totalColunasEspecie > 0 ? (await colunasEspecie.nth(2).innerText().catch(() => '')).trim() : '';

  const primeiroNomeEspecie = nomeesp.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNomeEspecie);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosEspecie = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosEspecie === 0) {
      console.log(`⚠️ Nenhum registro encontrado com o valor: ${primeiroNomeEspecie}`);
  } else {
      console.log('✅ BUSCA ESPÉCIE EXISTENTE:', primeiroNomeEspecie);
  }        

  const prodInexistenteEspecie = `ESPÉCIE INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(prodInexistenteEspecie);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA ESPÉCIE INEXISTENTE:', prodInexistenteEspecie);

  // ==============================================================
  // MÓDULO COTAÇÃO DE MOEDAS
  // ==============================================================
  // Nota: Certifique-se de que o menu "Cadastros" já foi aberto no módulo anterior.
  // Caso este teste rode isolado ou precise abrir o menu novamente, descomente a linha abaixo:
  // await page.getByText(/cadastros/i).click({ force: true }); 

  await page.waitForTimeout(1000);
  await page.locator('a[href*="registros/cotizacion-monedas"]').click();
  console.log('✅ Clicou em Cotação de Moedas');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const codigos = await page.locator('table td span[class*="tw-text-ellipsis"][class*="tw-text-nowrap"]').allTextContents();

  // 🛑 PROTEÇÃO ANTI FALSO-POSITIVO: Se não achar nenhum código, o teste falha aqui!
  expect(codigos.length, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM COTAÇÃO DE MOEDAS!').toBeGreaterThan(0);

  const codigoEscolhido = codigos[0].trim();
  await page.getByLabel(/pesquisar registro/i).fill(codigoEscolhido);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosMoeda = await page.locator('table td span[class*="tw-text-ellipsis"][class*="tw-text-nowrap"]').count();
  if (registrosEncontradosMoeda === 0) {
      console.log(`⚠️ Nenhum registro encontrado na grade com o valor: ${codigoEscolhido}`);
  } else {
      console.log('✅ BUSCA COTAÇÃO EXISTENTE:', codigoEscolhido);
  }
    
  await page.waitForLoadState('networkidle');   
  const moedainex = '003';
  await page.getByLabel(/pesquisar registro/i).fill(moedainex);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA COTAÇÃO INEXISTENTE:', moedainex);


  // ==============================================================
  // MÓDULO GRUPOS
  // ==============================================================
  // Nota: Certifique-se de que o menu "Cadastros" já está aberto.
  // Caso precise garantir que o menu esteja aberto, o comando de clique em Cadastros já foi executado no módulo anterior.

  await page.waitForTimeout(1000);
  await page.locator('a[href*="registros/grupos"]').click();
  console.log('✅ Clicou em Grupos');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIconsGrupo = await page.locator('table img[src*="edit"], table svg').count();  
  expect(editIconsGrupo, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM GRUPOS!').toBeGreaterThan(0);
  
  const linhasGrupo = page.locator('tbody tr');      
  const linhaSelecionadaGrupo = linhasGrupo.nth(1);
  const colunasGrupo = linhaSelecionadaGrupo.locator('td');
  const totalColunasGrupo = await colunasGrupo.count();
  const nomegrupo = totalColunasGrupo > 0 ? (await colunasGrupo.nth(2).innerText().catch(() => '')).trim() : '';

  const primeiroNomeGrupo = nomegrupo.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNomeGrupo);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosGrupo = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosGrupo === 0) {
      console.log(`⚠️ Nenhum registro encontrado na grade com o valor: ${primeiroNomeGrupo}`);
  } else {
      console.log('✅ BUSCA GRUPO EXISTENTE:', primeiroNomeGrupo);
  }             

  const prodInexistenteGrupo = `GRUPO INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(prodInexistenteGrupo);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA GRUPO INEXISTENTE:', prodInexistenteGrupo);

  // ==============================================================
  // MÓDULO SUBGRUPOS
  // ==============================================================
  await page.waitForTimeout(1000);
  await page.locator('a[href*="registros/subgrupos"]').click();
  console.log('✅ Clicou em Subgrupos');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIconsSubgrupo = await page.locator('table img[src*="edit"], table svg').count();  
  expect(editIconsSubgrupo, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM SUBGRUPOS!').toBeGreaterThan(0);
  
  const linhasSubgrupo = page.locator('tbody tr');      
  const linhaSelecionadaSubgrupo = linhasSubgrupo.nth(1);
  const colunasSubgrupo = linhaSelecionadaSubgrupo.locator('td');
  const totalColunasSubgrupo = await colunasSubgrupo.count();
  const nomesubgrupo = totalColunasSubgrupo > 0 ? (await colunasSubgrupo.nth(2).innerText().catch(() => '')).trim() : '';

  const primeiroNomeSubgrupo = nomesubgrupo.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNomeSubgrupo);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosSubgrupo = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosSubgrupo === 0) {
      console.log(`⚠️ Nenhum registro encontrado na grade com o valor: ${primeiroNomeSubgrupo}`);
  } else {
      console.log('✅ BUSCA SUBGRUPO EXISTENTE:', primeiroNomeSubgrupo);
  }         

  const prodInexistenteSubgrupo = `SUBGRUPO INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(prodInexistenteSubgrupo);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA SUBGRUPO INEXISTENTE:', prodInexistenteSubgrupo);


  // ==============================================================
  // MÓDULO MARCAS
  // ==============================================================
  await page.waitForTimeout(1000);
  await page.locator('a[href*="registros/marcas"]').click();
  console.log('✅ Clicou em Marcas'); 

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIconsMarca = await page.locator('table img[src*="edit"], table svg').count();  
  expect(editIconsMarca, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM MARCAS!').toBeGreaterThan(0);
  
  const linhasMarca = page.locator('tbody tr');      
  const linhaSelecionadaMarca = linhasMarca.nth(1);
  const colunasMarca = linhaSelecionadaMarca.locator('td');
  const totalColunasMarca = await colunasMarca.count();
  const marca = totalColunasMarca > 0 ? (await colunasMarca.nth(2).innerText().catch(() => '')).trim() : '';

  const primeiroNomeMarca = marca.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNomeMarca);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosMarca = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosMarca === 0) {
      console.log(`⚠️ Nenhum registro encontrado com o valor: ${primeiroNomeMarca}`);
  } else {
      console.log('✅ BUSCA MARCA EXISTENTE:', primeiroNomeMarca);
  }             

  const prodInexistenteMarca = `MARCA INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(prodInexistenteMarca);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA MARCA INEXISTENTE:', prodInexistenteMarca);


  // ==============================================================
  // MÓDULO CENTRO DE CUSTOS
  // ==============================================================
  // Nota: Certifique-se de que o menu "Cadastros" já está aberto.
  
  await page.waitForTimeout(1000);    
  await page.locator('a[href*="registros/centro-costos"]').click();
  console.log('✅ Clicou em Centro de Custos');  

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const trashIconsCentro = await page.locator('table img[src*="trash"]').count();
  expect(trashIconsCentro, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM CENTRO DE CUSTOS!').toBeGreaterThan(0);
  
  const linhasCentro = page.locator('tbody tr');      
  const linhaSelecionadaCentro = linhasCentro.nth(1);
  const colunasCentro = linhaSelecionadaCentro.locator('td');
  const totalColunasCentro = await colunasCentro.count();
  const nomeCentro = totalColunasCentro > 0 ? (await colunasCentro.nth(2).innerText().catch(() => '')).trim() : '';        

  const primeiroNomeCentro = nomeCentro.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNomeCentro);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosCentro = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosCentro === 0) {
      console.log(`⚠️ Nenhum registro encontrado com o valor: ${primeiroNomeCentro}`);
  } else {
      console.log('✅ BUSCA CENTRO DE CUSTO EXISTENTE:', primeiroNomeCentro);
  }        

  const prodInexistenteCentro = `CENTRO INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(prodInexistenteCentro);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA CENTRO DE CUSTO INEXISTENTE:', prodInexistenteCentro);


  // ==============================================================
  // MÓDULO PLANO DE CONTAS
  // ==============================================================
  // Nota: Certifique-se de que o menu "Cadastros" já está aberto.

  await page.waitForTimeout(1000);    
  await page.locator('a[href*="registros/plano-contas"]').click();
  console.log('✅ Clicou em Plano de Contas'); 

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const trashIconsPlano = await page.locator('table img[src*="trash"]').count();
  expect(trashIconsPlano, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM PLANO DE CONTAS!').toBeGreaterThan(0);
  
  const linhasPlano = page.locator('tbody tr');      
  const linhaSelecionadaPlano = linhasPlano.nth(1);
  const colunasPlano = linhaSelecionadaPlano.locator('td');
  const totalColunasPlano = await colunasPlano.count();
  const nomePlano = totalColunasPlano > 0 ? (await colunasPlano.nth(3).innerText().catch(() => '')).trim() : '';        

  const primeiroNomePlano = nomePlano.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNomePlano);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosPlano = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosPlano === 0) {
      console.log(`⚠️ Nenhum registro encontrado com o valor: ${primeiroNomePlano}`);
  } else {
      console.log('✅ BUSCA PLANO DE CONTAS EXISTENTE:', primeiroNomePlano);
  }        

  const prodInexistentePlano = `PLANO INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(prodInexistentePlano);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA PLANO DE CONTAS INEXISTENTE:', prodInexistentePlano);


  // ==============================================================
  // MÓDULO CREDENCIADORA / TAXAS
  // ==============================================================
  // Nota: Certifique-se de que o menu "Cadastros" já está aberto.

  await page.waitForTimeout(1000);
  await page.locator('a[href*="registros/credenciadoras-taxas"]').click();
  console.log('✅ Clicou em Credenciadora/taxas'); 

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const trashIconsCredenciadora = await page.locator('table img[src*="trash"]').count();
  expect(trashIconsCredenciadora, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM CREDENCIADORAS/TAXAS!').toBeGreaterThan(0);
  
  const linhasCredenciadora = page.locator('tbody tr');      
  const linhaSelecionadaCredenciadora = linhasCredenciadora.nth(1);
  const colunasCredenciadora = linhaSelecionadaCredenciadora.locator('td');
  const totalColunasCredenciadora = await colunasCredenciadora.count();
  const nomeCredenciadora = totalColunasCredenciadora > 0 ? (await colunasCredenciadora.nth(2).innerText().catch(() => '')).trim() : '';        

  const primeiroNomeCredenciadora = nomeCredenciadora.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNomeCredenciadora);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosCredenciadora = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosCredenciadora === 0) {
      console.log(`⚠️ Nenhum registro encontrado com o valor: ${primeiroNomeCredenciadora}`);
  } else {
      console.log('✅ BUSCA CREDENCIADORA EXISTENTE:', primeiroNomeCredenciadora);
  }        

  const prodInexistenteCredenciadora = `CREDENCIADORA INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(prodInexistenteCredenciadora);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA CREDENCIADORA INEXISTENTE:', prodInexistenteCredenciadora);

  // ==============================================================
  // MÓDULO FUNCIONÁRIOS
  // ==============================================================
  await page.waitForTimeout(1000);
  await page.getByText(/funcionários/i).click({ force: true });
  console.log('✅ Clicou em Funcionários');     

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIconsFuncionario = await page.locator('table img[src*="edit"], table svg').count();  
  expect(editIconsFuncionario, '⚠️ FALHA CRÍTICA: NENHUM REGISTRO ENCONTRADO EM FUNCIONÁRIOS!').toBeGreaterThan(0);
  
  const linhasFuncionario = page.locator('tbody tr');      
  const linhaSelecionadaFuncionario = linhasFuncionario.nth(1);
  const colunasFuncionario = linhaSelecionadaFuncionario.locator('td');
  const totalColunasFuncionario = await colunasFuncionario.count();
  const nomefuncionario = totalColunasFuncionario > 0 ? (await colunasFuncionario.nth(2).innerText().catch(() => '')).trim() : '';

  const primeiroNomeFuncionario = nomefuncionario.toString();
  await page.getByLabel(/pesquisar registro/i).fill(primeiroNomeFuncionario);
  await page.keyboard.press('Enter');
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const registrosEncontradosFuncionario = await page.locator('table img[src*="edit"], table svg').count();
  if (registrosEncontradosFuncionario === 0) {
      console.log(`⚠️ Nenhum registro encontrado com o valor: ${primeiroNomeFuncionario}`);
  } else {
      console.log('✅ BUSCA FUNCIONÁRIO EXISTENTE:', primeiroNomeFuncionario);
  }            

  const prodInexistenteFuncionario = `FUNCIONARIO INEXISTENTE`;
  await page.getByLabel(/pesquisar registro/i).fill(prodInexistenteFuncionario);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
  console.log('✅ BUSCA FUNCIONÁRIO INEXISTENTE:', prodInexistenteFuncionario);

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