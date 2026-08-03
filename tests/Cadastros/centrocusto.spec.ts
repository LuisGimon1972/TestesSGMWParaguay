import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora   } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';
import { obterNomeCentroCustoAleatorio } from '../../utils/listacentrocusto';

test('Cadastro de marcas', async ({ page }) => {
    await loginCompleto(page);    

    await page.waitForTimeout(2000);           
    const salvarCentroPromise = page.waitForResponse((response) =>
    response.url().includes('/api/centro/custo') &&
    ['POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300);
 
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('✅ Clicou em Cadastros');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/centro-costos"]').click()
    console.log('✅ Clicou em Centro de Custos'); 

    const btnCadastrar = page.getByText(/cadastrar centro de custo/i).first();
    await btnCadastrar.waitFor();
    await btnCadastrar.click({ force: true });
    console.log('✅ Clicou em Cadastrar Centro de Custo');    

    console.log('***DADOS ENVIADOS PRA API***');
    const centrocusto = obterNomeCentroCustoAleatorio();
    await page.getByLabel(/centro de custo/i).fill(centrocusto);
    console.log('✅ Nome do Centro de Custo:', centrocusto.toUpperCase());     
    console.log('✅FIM DE DADOS ENVIADOS');      

    await page.locator('.q-btn')
    .filter({ hasText: /confirmar|guardar/i })
    .click({ force: true });
    console.log('✅ Clicou em Salvar Centro de Custo');  

    const salvarUrlResponse = await salvarCentroPromise;     
    const urlCompletaPost = salvarUrlResponse.url();
    console.log('🌐 A URL capturada do POST é:', urlCompletaPost);

    const salvarPessoaResponse = await salvarCentroPromise;
    const dadosSalvos = await salvarPessoaResponse.json();
    console.log('✅ DADOS RETORNADOS NA CRIAÇÃO');
    console.log(JSON.stringify(dadosSalvos, null, 2));
    
    const idCentro = dadosSalvos.controle.toString().trim();    
    const urlRegistroCriado = `${urlCompletaPost}/${idCentro}`;                
    const headersOriginais = salvarPessoaResponse.request().headers();
    const headersGetRegistro: Record<string, string> = {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      authorization: headersOriginais['authorization'],
      'x-xsrf-token': headersOriginais['x-xsrf-token'],
      'x-tenant': headersOriginais['x-tenant'],
      'x-empresa': headersOriginais['x-empresa'],
    };
    
    const getCriadoResponse = await page.request.get(urlRegistroCriado, {
      headers: headersGetRegistro,
    });
    console.log('🌐 A URL do registro criado é:', urlRegistroCriado);
    console.log('✅ RESPOSTA DA API AO CONSULTAR O NOVO REGISTRO');
    console.log('✅ Novo Controle:', idCentro);            
    console.log(`✅ Status: ${getCriadoResponse.status()}`);

    try {
      const dadosCriado = await getCriadoResponse.json();
      console.log(JSON.stringify(dadosCriado, null, 2));
    } catch (error) {
      console.error('Erro ao converter resposta para JSON:', error);
      const corpoBruto = await getCriadoResponse.text();
      console.log('Corpo bruto da resposta:', corpoBruto);
    }

    expect([404, 200]).toContain(getCriadoResponse.status());    

    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);      
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});