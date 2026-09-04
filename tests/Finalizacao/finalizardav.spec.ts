import { test, expect } from '@playwright/test';
import { loginCompleto, formatarDataHora } from '../../utils/loginCompleto';

test('Teste de Finalizar DAV', async ({ page }) => {
    await loginCompleto(page);          
    
    await page.waitForTimeout(2000); 
    
    const venBtn = page.getByText(/vendas/i).first();
    await expect(venBtn).toBeVisible();
    await venBtn.click();
    console.log('CLICOU EM VENDAS');
  
    await Promise.all([
      page.waitForURL(/dav/, { timeout: 15000 }),
      page.locator('a[href*="dav"]').first().click()
    ]);
    console.log('CLICOU EM DAV');    
    
    await page.waitForSelector('table img[src="/icons/edit.svg"]', { state: 'visible', timeout: 15000 });

    const editIcons = await page.locator('table img[src="/icons/edit.svg"]').count();
    console.log('QUANTIDADE DE REGISTROS NA GRADE:', editIcons.toString().trim());

    if (editIcons === 0) {
        console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EDITAR.');
        return; 
    }
    
    const linhasAbierto = page.locator('table tr', { hasText: /abierto|aberto/i });
    const quantidadeAbierto = await linhasAbierto.count();
    console.log('QUANTIDADE DE REGISTROS COM STATUS "ABIERTOOU ABERTO":', quantidadeAbierto.toString().trim());
    
    if (quantidadeAbierto === 0) {
        console.log('Nenhum registro com status Abierto foi encontrado na grade.');
        return; // Encerra o teste se não achar a condição necessária
    }    

    const getRegistroEditadoPromise = page.waitForResponse((response) =>
        response.url().includes('/api/py/venda') &&
        response.request().method() === 'GET' &&
        response.status() === 200 &&
        /\/api\/py\/venda\/[^/?]+/.test(response.url())
    );

    const getVendaPromise = page.waitForResponse((response) =>
        response.url().includes('/api/py/venda') &&
        response.request().method() === 'GET' &&
        response.status() === 200
    );  

    // Ação que dispara as requisições
    await linhasAbierto.first().locator('img[src="/icons/edit.svg"]').click();
    console.log('Clicou no ícone de editar do registro com status Abierto.');

    await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() => {
        document.body.style.zoom = '0.8'; 
    });
    console.log('🔍 Zoom ajustado para 80% via CSS');
    
    const respostaVendaInicial = await getVendaPromise;
    const dadosAntes = await respostaVendaInicial.json();
    console.log('*** DADOS DO REGISTRO NO BANCO (ANTES DA ALTERAÇÃO) ***');
    console.log(JSON.stringify(dadosAntes, null, 2));  

    const getRegistroEditadoResponse = await getRegistroEditadoPromise;
    const urlRegistroEditado = getRegistroEditadoResponse.url();
    const headersOriginais = getRegistroEditadoResponse.request().headers();

    console.log('URL DO REGISTRO EDITADO:', urlRegistroEditado);
    console.log('*** DADOS ENVIADOS PRA API ***');  
    
    await page.waitForTimeout(500);
    await page.locator('.q-select').nth(1).click();        
    const opcaoFinalizado = page.locator('.q-menu .q-item', { hasText: 'Finalizado' });        
    await opcaoFinalizado.waitFor({ state: 'visible' });
    await opcaoFinalizado.click();
    
    const statusdav = await page.locator('input[aria-label="Situação"]').inputValue();      
    console.log('✅ Selecionou o Status:', statusdav.toUpperCase());

    await page.waitForTimeout(1000);

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataISO = `${dia}-${mes}-${ano}`;    
    const inputValidade = page.getByLabel(/validade do orçamento|previsão da entrega/i);
    await inputValidade.waitFor({ state: 'visible' });
    await inputValidade.fill(dataISO);    
    console.log('✅ Data de Operação:', dataISO);        

    const salvar = page.locator('button.q-btn').filter({ hasText: 'SALVAR' }).first();
    await salvar.waitFor({ state: 'visible' });
    console.log('✅ Clicou em Salvar');
    
    const [respostaSalvar] = await Promise.all([
        page.waitForResponse((response) => {
            const url = response.url();
            const metodo = response.request().method();
            return url.includes('/api/py/venda') && 
                   ['POST', 'GET', 'PUT', 'PATCH'].includes(metodo) && // Adicionei métodos comuns de salvamento
                   response.status() >= 200 && 
                   response.status() < 300;
        }, { timeout: 30000 }),
        salvar.click() 
    ]);       
    
    console.log('✅ Resposta de salvamento capturada com status:', respostaSalvar.status());
    
    const headersGetRegistro: Record<string, string> = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    };
    
    if (headersOriginais.authorization) headersGetRegistro.authorization = headersOriginais.authorization;
    if (headersOriginais['x-xsrf-token']) headersGetRegistro['x-xsrf-token'] = headersOriginais['x-xsrf-token'];
    if (headersOriginais['x-tenant']) headersGetRegistro['x-tenant'] = headersOriginais['x-tenant'];
    if (headersOriginais['x-empresa']) headersGetRegistro['x-empresa'] = headersOriginais['x-empresa'];
    
    const getVendaFinalResponse = await page.request.get(urlRegistroEditado, {
        headers: headersGetRegistro,
    });
    
    console.log(`STATUS GET REGISTRO EDITADO: ${getVendaFinalResponse.status()}`);
    
    const textoResposta = await getVendaFinalResponse.text();
    if (!getVendaFinalResponse.ok()) {
        throw new Error(`GET registro editado falhou: ${getVendaFinalResponse.status()} - ${textoResposta}`);
    }
    
    const dadosDepois = JSON.parse(textoResposta);
    console.log('*** DADOS APÓS DA ALTERAÇÃO (GET DO REGISTRO EDITADO) ***');
    console.log(JSON.stringify(dadosDepois, null, 2));

    function calcularEfectivo(total: number): number {
        return Math.ceil(total / 10) * 10;
    }
    
    console.log(`🕒 Finalização do teste: ${formatarDataHora(new Date())}`);   
});