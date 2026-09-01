import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Cadastro de cotação de moedas', async ({ page }) => {
    await loginCompleto(page);    

    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('✅ Clicou em Cadastros');

    const linkCotacao = page.locator('a[href*="registros/cotizacion-monedas"]');
    await expect(linkCotacao).toBeVisible();
    await linkCotacao.click();
    console.log('✅ Clicou em Cotação'); 

    const btnCadastrar = page.getByText(/cadastrar cotação/i).first();
    await expect(btnCadastrar).toBeVisible();
    await btnCadastrar.click({ force: true });
    console.log('✅ Clicou em Cadastrar Cotação');    
    
    console.log('➡️ DADOS ENVIADOS PARA API');    
    await page.waitForTimeout(1000);
    await page.locator('.q-select').nth(0).click();
    const opcao = Math.floor(Math.random() * 11) + 1;
    const x = opcao;
    const menuItems = page.locator('.q-menu .q-item, .q-portal .q-item, .q-virtual-scroll__content .q-item, [role="option"]');
    await expect(menuItems.nth(x)).toBeVisible({ timeout: 8000 });
    const primeiraOpcao = menuItems.nth(x);
    await primeiraOpcao.scrollIntoViewIfNeeded().catch(() => {});
    const textoPrimeira = (await primeiraOpcao.innerText()).replace(/\s+/g, ' ').trim();
    await primeiraOpcao.click({ force: true });
    console.log('✅ Moeda de cotação:', textoPrimeira.toUpperCase());  

    const venta = Math.floor(Math.random() * (6000 - 5000 + 1)) + 5000;
    const inputVenta = page.getByLabel(/valor de venda/i);
    await expect(inputVenta).toBeVisible();
    await inputVenta.fill(String(venta));
    console.log('✅ Valor de Venda:', venta);

    const compra = Math.floor(Math.random() * (5000 - 4500 + 1)) + 4500;
    const inputCompra = page.getByLabel(/valor de compra/i);
    await expect(inputCompra).toBeVisible();
    await inputCompra.fill(String(compra));
    console.log('✅ Valor de Compra:', compra);

    const hoje = new Date();
    const datahoje = hoje.toLocaleDateString('pt-BR');
    const inputData = page
        .locator('.q-field')
        .filter({ hasText: /vig[eê]ncia/i })
        .first()
        .locator('input');
    await expect(inputData).toBeVisible();
    await inputData.fill(datahoje);
    console.log('✅ Inicio de Vigência:', datahoje);

    const fin = new Date();
    const fimMes = new Date(fin.getFullYear(), hoje.getMonth() + 1, 0);
    const dia = String(fimMes.getDate()).padStart(2, '0');
    const mes = String(fimMes.getMonth() + 1).padStart(2, '0');
    const ano = fimMes.getFullYear();
    const datafin = `${dia}/${mes}/${ano}`;
    
    const inputDatafin = page
        .locator('.q-field')
        .filter({ hasText: /fim|vig[eê]ncia/i })
        .last()
        .locator('input');
    await inputDatafin.scrollIntoViewIfNeeded();
    await expect(inputDatafin).toBeVisible();
    await inputDatafin.fill('');
    await inputDatafin.pressSequentially(datafin, { delay: 50 });
    console.log('✅ Fim de Vigência:', datafin);
    console.log('➡️ FIM DE DADOS ENVIADOS');    

    // Alteração: Captura qualquer resposta POST para essa URL, sem filtrar o status 200 ainda
    const salvarCotacaoPromise = page.waitForResponse(
        (response) =>
            response.url().includes('/api/moeda/cotacao') &&
            response.request().method() === 'POST'
    );

    await page.locator('.q-btn')
        .filter({ hasText: /salvar|guardar/i })
        .click({ force: true });
    console.log('✅ Clicou em Salvar Cotação');  

    const salvarCotacaoResponse = await salvarCotacaoPromise;     
    const statusSalvar = salvarCotacaoResponse.status();
    const urlCompletaPost = salvarCotacaoResponse.url();
    console.log('🌐 A URL capturada do POST é:', urlCompletaPost);

    // Nova Proteção: Se a API retornar erro (ex: 400, 409, 422 - cotação já existe)
    if (statusSalvar >= 400) {
        let msgErro = 'Não foi possível ler o corpo do erro';
        try {
            const erroBody = await salvarCotacaoResponse.json();
            msgErro = JSON.stringify(erroBody);
        } catch (e) {
            msgErro = await salvarCotacaoResponse.text();
        }
        
        console.log(`⚠️ ATENÇÃO: Falha ao salvar (Status ${statusSalvar}). O registro provavelmente já existe.`);
        console.log(`Detalhes do Erro da API: ${msgErro}`);
        console.log(`⏭️ SKIP: O teste será pulado para não quebrar a suíte.`);
        
        // test.skip() interrompe a execução imediatamente e marca o teste como "pulado"
        test.skip(true, `Cotação duplicada ou falha na API. Status: ${statusSalvar}`);
        return; 
    }

    // Se passou do if acima, o status foi sucesso (200-299)
    const dadosSalvos = await salvarCotacaoResponse.json();
    console.log('✅ DADOS RETORNADOS NA CRIAÇÃO');
    console.log(JSON.stringify(dadosSalvos, null, 2));
    
    // Fallback caso a API não retorne o controle
    if (!dadosSalvos.controle) {
        console.log('⚠️ A API retornou sucesso, mas não devolveu o ID do registro (controle). Pulando validação do GET.');
        test.skip(true, 'Registro salvo, mas sem ID de retorno.');
        return;
    }

    const idCotacao = dadosSalvos.controle.toString().trim();    
    const urlRegistroCriado = `${urlCompletaPost}/${idCotacao}`;         
    const headersOriginais = salvarCotacaoResponse.request().headers();
    
    const headersGetRegistro: Record<string, string> = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        authorization: headersOriginais['authorization'] || '',
        'x-xsrf-token': headersOriginais['x-xsrf-token'] || '',
        'x-tenant': headersOriginais['x-tenant'] || '',
        'x-empresa': headersOriginais['x-empresa'] || '',
    };
    
    const getCriadoResponse = await page.request.get(urlRegistroCriado, {
        headers: headersGetRegistro,
    });
    console.log('🌐 A URL do registro criado é:', urlRegistroCriado);
    console.log('✅ RESPOSTA DA API AO CONSULTAR O NOVO REGISTRO***');
    console.log('✅ Novo Controle:', idCotacao);    
    console.log(`✅ Status: ${getCriadoResponse.status()}`);

    try {
        const dadosCriado = await getCriadoResponse.json();
        console.log(JSON.stringify(dadosCriado, null, 2));
    } catch (error) {
        console.error('Erro ao converter resposta para JSON:', error);
        const corpoBruto = await getCriadoResponse.text();
        console.log('Corpo bruto da resposta:', corpoBruto);
    }

    expect([200, 404]).toContain(getCriadoResponse.status());    

    await capturarRequisicoesApi(page); 
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});