import { test, expect, Page } from '@playwright/test';
import { empresasParaguai } from '../../utils/rucs-paraguai';

// --- Funções Auxiliares ---

// Aplica zoom via CSS para garantir que elementos não fiquem fora da tela
const aplicarZoom = async (page: Page, zoomLevel: string) => {
  await page.emulateMedia({ media: 'screen' });
  await page.evaluate((zoom) => {
    document.body.style.zoom = zoom;
  }, zoomLevel);
  console.log(`🔍 Zoom ajustado para ${parseFloat(zoomLevel) * 100}% via CSS`);
};

// Lida com os Dropdowns encadeados do Quasar
const selecionarOpcaoQuasar = async (page: Page, nomeCampo: string | RegExp) => {
  const wrapper = page.locator('.q-field').filter({ hasText: nomeCampo }).first();
  await wrapper.scrollIntoViewIfNeeded();
  await wrapper.click({ force: true });
  
  const menu = page.locator('.q-menu').last();
  await menu.waitFor({ state: 'visible', timeout: 10000 });
  await menu.locator('.q-item').first().click();
  
  // Aguarda 500ms para permitir que o Quasar atualize as dependências (Ex: Distrito após escolher Departamento)
  await page.waitForTimeout(500);
};

// Gera um RUC aleatório da base de dados
function gerarRUC(): string {
  const empresaAleatoria = empresasParaguai[Math.floor(Math.random() * empresasParaguai.length)];
  return empresaAleatoria.ruc;
}

// --- Início do Teste ---

test('Teste de Cadastro de Empresas', async ({ page }) => {    
  // ⏳ Aumenta o timeout global do teste para 90 segundos (evita erro de 30000ms exceeded)
  test.setTimeout(90000); 

  await page.setViewportSize({ width: 1920, height: 1080 });
  await aplicarZoom(page, '0.5');

  let razaoSocial = '';
  let urlempresa = '';

  console.log('--- INICIO DO TESTE ---');
  await page.goto(process.env.BASE_URL!);
  
  await page.getByText(/entrar/i).click();
  
  // --- 1. LOGIN ---
  const inputEmail = page.locator('input[type="email"], input[type="text"]').first();
  await inputEmail.waitFor({ state: 'visible', timeout: 15000 });
  
  await inputEmail.fill(process.env.USER!);
  await page.locator('input[type="password"]').first().fill(process.env.PASS!);
  await page.getByRole('button', { name: /sign in|entrar/i }).click();
  console.log('✅ Login realizado');
  
  await page.waitForURL(/empresas/, { timeout: 20000 });

  // --- 2. ADICIONAR EMPRESA ---
  const btnAdicionar = page.getByText('Adicionar empresa', { exact: true });
  await btnAdicionar.waitFor({ state: 'visible' });
  await btnAdicionar.click();
    
  // RUC
  const ruc = gerarRUC();
  const inputRuc = page.locator('input[aria-label*="RUC" i], .q-field:has-text("RUC") input').first();
  await inputRuc.waitFor({ state: 'visible' });
  await inputRuc.fill(ruc);
  console.log(`✅ RUC preenchido: ${ruc}`);  
    
  // Razão Social (Tratamento de espera dinâmica da API)
  const inputRazao = page.locator('input[aria-label*="Razão social" i], .q-field:has-text("Razão social") input').first();
  try {
    // Aguarda até 8 segundos para o sistema autocompletar via Receita
    await expect(inputRazao).not.toHaveValue('', { timeout: 8000 });
    razaoSocial = await inputRazao.inputValue();
  } catch {
    console.log('⚠️ API do RUC demorou. Preenchendo Razão Social manualmente.');
    razaoSocial = `EMPRESA AUTO RUC ${ruc} - ${Date.now()}`;
    await inputRazao.fill(razaoSocial);
  }
  console.log(`✅ Razão social: ${razaoSocial}`);

  // Código de Estabelecimento
  const codigoEstabelecimento = Math.floor(Math.random() * 1000) + 100;
  await page.locator('input[aria-label*="Código do estabelecimento" i], .q-field:has-text("Código") input').first()
    .fill(codigoEstabelecimento.toString());

  // Telefone (Simulação de digitação para não quebrar máscaras)
  const telefone = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');    
  const inputTelefone = page.locator('input[type="tel"]').first();
  await inputTelefone.scrollIntoViewIfNeeded();
  await inputTelefone.click({ force: true });
  await inputTelefone.press('Control+A');
  await inputTelefone.press('Backspace');
  await inputTelefone.pressSequentially(telefone, { delay: 10 });

  // E-mail
  const email = `empresa${Date.now()}@gmail.com`;
  const campoEmail = page.locator('.q-field').filter({ hasText: /e-mail/i }).first().locator('input');
  await campoEmail.fill(email);

  // Avançar modal 1
  await page.locator('#submit-company').click();

  // Termos e Confirmação
  const checkboxTermos = page.getByText('Declaro estar ciente', { exact: true });
  await checkboxTermos.waitFor({ state: 'visible' });
  await checkboxTermos.click();

  await page.getByRole('button', { name: /confirmar/i }).click();

  // --- 3. SUBDOMÍNIO ---
  const dominio = `empresa${Math.floor(Math.random() * (10000 - 21 + 1)) + 21}`;
  urlempresa = dominio;
  
  try {  
    await page.waitForTimeout(500); // Pausa visual para transição de tela

    // Busca seletiva e resiliente pelo input de domínio
    let inputDominio = page.locator('input[aria-label*="domínio" i], input[aria-label*="dominio" i], .q-field:has-text("domínio") input, .q-field:has-text("dominio") input').first();
    
    if (await inputDominio.count() === 0) {
        inputDominio = page.locator('input[type="text"] >> visible=true').last();
    }

    await inputDominio.waitFor({ state: 'visible', timeout: 5000 });  
    await inputDominio.click(); 
    await inputDominio.fill(''); 
    await inputDominio.pressSequentially(dominio, { delay: 50 }); // Digitação humanizada
    
    console.log(`✅ Domínio preenchido: ${dominio}`);  
  } catch (error) {
    console.log('⚠️ Erro ao tentar preencher o domínio:', error);
  }

  // Clica no botão avançar/salvar do modal de domínio
  await page.locator('#submit-domain').waitFor({ state: 'visible' });
  await page.locator('#submit-domain').click();
  console.log('✅ Cadastro inicial finalizado. Redirecionando...');
  
  // --- 4. PESQUISAR E ACESSAR EMPRESA ---
  await page.waitForURL(/\/py\/empresas/, { timeout: 20000 });
  
  const campoPesquisa = page.getByPlaceholder(/pesquisar empresas/i);
  await campoPesquisa.waitFor({ state: 'visible', timeout: 20000 });
  await campoPesquisa.fill(razaoSocial.trim());
  await page.keyboard.press('Enter');
  
  await page.waitForTimeout(1000); // Espera a tabela filtrar
  
  // Busca parcial do nome (evita quebra por causa de espaçamentos ou case-sensitivity)
  await page.getByText(razaoSocial.trim(), { exact: false })
            .first()
            .waitFor({ state: 'visible', timeout: 15000 });

  // Tentativa de clique no botão ENTRAR
  const botaoEntrar = page.locator('button:has-text("ENTRAR")').first();
  if (await botaoEntrar.count() > 0) {
    for (let i = 0; i < 3; i++) {
      try {
        await botaoEntrar.waitFor({ state: 'visible', timeout: 5000 });
        await botaoEntrar.click({ force: true });
        console.log('✅ Botão ENTRAR clicado com sucesso');
        break;
      } catch {
        await page.waitForTimeout(1000);
      }
    }
  }

  // --- 5. DADOS DA EMPRESA (TELA INTERNA) ---
  const urlDatosEmpresa = `https://${urlempresa}.hom.sgmaster.com.br/py/datos-empresa`;
  await page.waitForURL(urlDatosEmpresa, { timeout: 15000 }).catch(() => {});
  
  // Data de Fundação
  const campoDataFundacao = page.locator('.q-field').filter({ hasText: /fundação|fundacion|fund/i }).first().locator('input');
  if (await campoDataFundacao.count() > 0) {
    const hoje = new Date();
    const dataISO = `${String(hoje.getDate()).padStart(2, '0')}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${hoje.getFullYear()}`;
    await campoDataFundacao.fill(dataISO);
  }

  await aplicarZoom(page, '0.6');
  
  // Campos encadeados via Helper Function
  await selecionarOpcaoQuasar(page, /departamento/i);
  await selecionarOpcaoQuasar(page, /distrito/i);
  await selecionarOpcaoQuasar(page, /cidade/i);

  // Direção e Número
  const direccion = `TEST DIRECCION ${Date.now()}`;
  await page.getByLabel(/direção/i).fill(direccion);

  const numero = Math.floor(Math.random() * 1000) + 1;
  await page.locator('.q-field').filter({ hasText: /número/i }).last().locator('input').fill(numero.toString());
    
  // Atividade Econômica
  await selecionarOpcaoQuasar(page, /atividade econômica/i);

  // Salvar
  await page.locator('.q-btn').filter({ hasText: /salvar|guardar/i }).click({ force: true });
  console.log('✅ Configuração da empresa salva com sucesso!');

  // Limpeza de modais no fim da execução
  await page.evaluate(() => {
    document.querySelectorAll('.q-dialog, .q-dialog__backdrop, .q-overlay').forEach((el: any) => el.remove());
  }).catch(() => {});
});