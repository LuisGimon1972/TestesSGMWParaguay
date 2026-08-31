import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';

test('Teste de Busca Crítico Unificado: Pessoas, Produtos, Faturamento, Usuários e DAV', async ({ page }) => {
  test.setTimeout(180000);

  await loginCompleto(page);
  console.log(`🕒 Início das buscas: ${formatarDataHora(new Date())}`);

  // ==============================================================
  // MÓDULO PESSOAS
  // ==============================================================
  await page.getByText(/pessoas/i).click({ force: true }); 
  console.log('✅ Clicou em Pessoas');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIcons = await page.locator('table img[src*="edit"], table svg').count();  

  if (editIcons === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }


  // ==============================================================
  // 2. MÓDULO PRODUTOS
  // ==============================================================
  await Promise.all([
      page.waitForURL(/producto/, { timeout: 15000 }),
      page.locator('a[href*="producto"]').first().click()
  ]);
  console.log('✅ Clicou em Produtos');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); 
  
  const editIconsP = await page.locator('table img[src*="edit"], table svg').count();  
  
  if (editIconsP === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }


  // ==============================================================
  // MÓDULO FATURAMENTO
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
  
  if (editIconsF === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }

  // ==============================================================
  // MÓDULO DAV
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
  
  if (editIconsD === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }

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
  
  if (editIconsEspecie === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }

  // ==============================================================
  // MÓDULO COTAÇÃO DE MOEDAS
  // ==============================================================
  await page.waitForTimeout(1000);
  await page.locator('a[href*="registros/cotizacion-monedas"]').click();
  console.log('✅ Clicou em Cotação de Moedas');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); 
  
  const codigos = await page.locator('table td span[class*="tw-text-ellipsis"][class*="tw-text-nowrap"]').allTextContents();
  
  if (codigos.length === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }


  // ==============================================================
  // MÓDULO GRUPOS
  // ==============================================================
  await page.waitForTimeout(1000);
  await page.locator('a[href*="registros/grupos"]').click();
  console.log('✅ Clicou em Grupos');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // Respiro para a grade renderizar na tela
  
  const editIconsGrupo = await page.locator('table img[src*="edit"], table svg').count();  
  
  if (editIconsGrupo === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }

  // ==============================================================
  // MÓDULO SUBGRUPOS
  // ==============================================================
  await page.waitForTimeout(1000);
  await page.locator('a[href*="registros/subgrupos"]').click();
  console.log('✅ Clicou em Subgrupos');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); 
  
  const editIconsSubgrupo = await page.locator('table img[src*="edit"], table svg').count();  

  if (editIconsSubgrupo === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }


  // ==============================================================
  // MÓDULO MARCAS
  // ==============================================================
  await page.waitForTimeout(1000);
  await page.locator('a[href*="registros/marcas"]').click();
  console.log('✅ Clicou em Marcas'); 

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); 
  
  const editIconsMarca = await page.locator('table img[src*="edit"], table svg').count();  

  if (editIconsMarca === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }


  // ==============================================================
  // MÓDULO CENTRO DE CUSTOS
  // ==============================================================
  await page.waitForTimeout(1000);    
  await page.locator('a[href*="registros/centro-costos"]').click();
  console.log('✅ Clicou em Centro de Custos');  

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); 
  
  const trashIconsCentro = await page.locator('table img[src*="trash"]').count();

  if (trashIconsCentro === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }


  // ==============================================================
  // MÓDULO PLANO DE CONTAS
  // ==============================================================
  await page.waitForTimeout(1000);    
  await page.locator('a[href*="registros/plano-contas"]').click();
  console.log('✅ Clicou em Plano de Contas'); 

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); 
  
  const trashIconsPlano = await page.locator('table img[src*="trash"]').count();

  if (trashIconsPlano === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }


  // ==============================================================
  // MÓDULO CREDENCIADORA / TAXAS
  // ==============================================================
  await page.waitForTimeout(1000);
  await page.locator('a[href*="registros/credenciadoras-taxas"]').click();
  console.log('✅ Clicou em Credenciadora/taxas'); 

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); 
  
  const trashIconsCredenciadora = await page.locator('table img[src*="trash"]').count();

  if (trashIconsCredenciadora === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }

  // ==============================================================
  // MÓDULO FUNCIONÁRIOS
  // ==============================================================
  await page.waitForTimeout(1000);
  await page.getByText(/funcionários/i).click({ force: true });
  console.log('✅ Clicou em Funcionários');     

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); 
  
  const editIconsFuncionario = await page.locator('table img[src*="edit"], table svg').count();  
  
  if (editIconsFuncionario === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }


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
  await page.waitForTimeout(1500); 
  
  const editIconsU = await page.locator('table img[src*="edit"], table svg').count();  
  
  if (editIconsU === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }


  // ==============================================================
  // 6. MÓDULO PERFIL DE ACESSO
  // ============================================================== 
  await page.waitForTimeout(1000);
  await page.locator('a[href*="usuario/perfil"]').click();
  console.log('✅ Clicou em Perfil de Acesso');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); 
  
  const editIconsPerfil = await page.locator('table img[src*="edit"], table svg').count();  
  
  if (editIconsPerfil === 0) {
      console.log('⚠️ NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA BUSCAR!');
  } else {
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
  }
  
  console.log(`🕒 Finalização de TODOS os testes de busca: ${formatarDataHora(new Date())}`);        
});