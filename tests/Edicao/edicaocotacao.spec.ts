import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Edição de datos cotação de moedas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    
 
    const cadBtn = page.getByText(/cadastros/i).first();
    await expect(cadBtn).toBeVisible();
    await cadBtn.click();
    console.log('CLICOU EM CADASTRO');

    await page.waitForTimeout(1000);
    page.locator('a[href*="registros/cotizacion-monedas"]').click()
    console.log('CLICOU EM COTAÇÃO'); 
    
    const getCotacaoPromise = page.waitForResponse((response) =>
    response.url().includes('/api/moeda/cotacao') &&
    response.request().method() === 'GET' &&
    response.status() === 200 &&
    response.url().includes('page=')
  );


    await page.waitForSelector('table');    
    await page.locator('.q-skeleton').first().waitFor({ state: 'detached', timeout: 10000 });    

    const getCotacaoResponsee = await getCotacaoPromise;
    const dadosAntes = await getCotacaoResponsee.json();
    const headersOriginais = getCotacaoResponsee.request().headers();

    console.log('***DADOS ANTES DA ALTERAÇÃO***');
    console.log(JSON.stringify(dadosAntes, null, 2));

    await page.waitForTimeout(2000);

    const editIcons = await page.locator('table img[src="/icons/edit.svg"]').count();
    console.log('Quantidade de ícones de edição:', editIcons.toString().trim());

    await page.waitForTimeout(2000);

    if (editIcons === 0) {
    console.log('NENHUM ÍCONE DE EDIÇÃO ENCONTRADO NA GRADE, NADA PARA EDITAR.');
    return;
    }
 
    await page.waitForTimeout(2000);
    await page.locator('table img[src="/icons/edit.svg"]').first().click();
    console.log('CLICOU NO ÍCONE DE EDITAR');    

    const primeiroRegistro =
    dadosAntes.data?.data?.[0] ??
    dadosAntes.data?.[0] ??
    dadosAntes.rows?.[0] ??
    dadosAntes.items?.[0] ??
    dadosAntes.result?.[0] ??
    dadosAntes[0];

    const cotacaoId =
    primeiroRegistro?.id ??
    primeiroRegistro?.codigo ??
    primeiroRegistro?.uuid ??
    primeiroRegistro?.controle;

  if (!cotacaoId) {
    console.log('PRIMEIRO REGISTRO ENCONTRADO:');
    console.log(JSON.stringify(primeiroRegistro, null, 2));
    throw new Error('Não foi possível obter o ID do grupo editado.');
    }

    const baseUrl = new URL(getCotacaoResponsee.url()).origin;
    const urlRegistroEditado = `${baseUrl}/api/moeda/cotacao/${cotacaoId}`;

    console.log('ID DO REGISTRO EDITADO:', cotacaoId);
    console.log('URL DO REGISTRO EDITADO:', urlRegistroEditado);    

    await page.waitForTimeout(2000);

    console.log('***DADOS ENVIADOS PRA API**');    
    const moedaField = page.locator('[aria-label="Moeda de cotação (diferente da sua empresa)"]').first();
    await moedaField.scrollIntoViewIfNeeded();
    await expect(moedaField).toBeVisible();    
    await moedaField.evaluate(el => (el as HTMLElement).click());    
    const menu = page.locator('.q-menu');
    await expect(menu).toBeVisible();    
    const moedas = ['usd', 'brl', 'cad', 'eur', 'gbp'];    
    const moedaEscolhida = moedas[Math.floor(Math.random() * moedas.length)];    
    const opcao = menu.locator('.q-item', {
    hasText: new RegExp(moedaEscolhida, 'i')
    }).first();
    await opcao.click();
    console.log('MOEDA DE COTAÇÃO ALTERADA OK:', moedaEscolhida);

    const venta = Math.floor(Math.random() * (6000 - 5000 + 1)) + 5000;
    const inputVenta = page.getByLabel(/valor de venda/i);
    await expect(inputVenta).toBeVisible();
    await inputVenta.fill(String(venta));
    console.log('VALOR DE VENTA ALTERADA OK:', venta.toString().trim());

    const compra = Math.floor(Math.random() * (5000 - 4500 + 1)) + 4500;
    const inputCompra = page.getByLabel(/valor de compra/i);
    await expect(inputCompra).toBeVisible();
    await inputCompra.fill(String(compra));
    console.log('VALOR DE COMPRA ALTERADA OK:', compra.toString().trim());

    const hoje = new Date();
    const datahoje = hoje.toLocaleDateString('pt-BR');
    const inputData = page
    .locator('.q-field')
    .filter({ hasText: /vig[eê]ncia/i })
    .first()
    .locator('input');
    await expect(inputData).toBeVisible();
    await inputData.fill(datahoje);
    console.log('INICIO DE VIGÊNCIA ALTERADA OK:', datahoje);
    
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
    await inputDatafin.type(datafin, { delay: 50 });
    console.log('FIM DE VIGÊNCIA OK:', datafin);
    console.log('***FIM DE DADOS ENVIADOS PRA API**');    

    const salvarCotacaoPromise = page.waitForResponse((response) =>
    response.url().includes('/api/moeda/cotacao') &&
    ['PUT', 'PATCH', 'POST'].includes(response.request().method()) &&
    response.status() >= 200 &&
    response.status() < 300
  );

    await page.locator('.q-btn')
    .filter({ hasText: /salvar|guardar/i })
    .click({ force: true });
    console.log('CLICOU EM SALVAR COTAÇÃO');  

    await salvarCotacaoPromise;

    const headersGetRegistro: Record<string, string> = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    };

    if (headersOriginais.authorization) {
        headersGetRegistro.authorization = headersOriginais.authorization;
    }

    if (headersOriginais['x-xsrf-token']) {
        headersGetRegistro['x-xsrf-token'] = headersOriginais['x-xsrf-token'];
    }

    if (headersOriginais['x-tenant']) {
        headersGetRegistro['x-tenant'] = headersOriginais['x-tenant'];
    }

    if (headersOriginais['x-empresa']) {
        headersGetRegistro['x-empresa'] = headersOriginais['x-empresa'];
    }

    const getCotacaoResponse = await page.request.get(urlRegistroEditado, {
        headers: headersGetRegistro,
    });

    console.log(`STATUS GET REGISTRO EDITADO: ${String(getCotacaoResponse.status())}`);

    const textoResposta = await getCotacaoResponse.text();

    if (!getCotacaoResponse.ok()) {
        throw new Error(`GET registro editado falhou: ${getCotacaoResponse.status()} - ${textoResposta}`);
    }

    const dadosDepois = JSON.parse(textoResposta);

    console.log('***DADOS APÓS A ALTERAÇÃO (GET DO REGISTRO EDITADO)***');
    console.log(JSON.stringify(dadosDepois, null, 2));

    expect(JSON.stringify(dadosDepois)).toContain(cotacaoId.toString().trim());




  

  
   
    
    await capturarRequisicoesApi(page); 
    await page.waitForTimeout(4000);    
});