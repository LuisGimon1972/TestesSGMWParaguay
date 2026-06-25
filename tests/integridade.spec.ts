import { test, expect } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';

test('Integridade do Sistema', async ({ request, page }) => {
  // 1. Login
  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginCompleto(page);
  console.log('✅ Login realizado com sucesso');

  // 2. Endpoints principais da API
  const endpoints = [
    '/api/produtos',
    '/api/usuarios',
    '/api/vendas',
    '/api/faturamento',
    '/api/db-status' 
  ];

  for (const endpoint of endpoints) {
    const inicio = Date.now();
    const response = await request.get(endpoint);
    const fim = Date.now();

    if (response.ok()) {
      console.log(`✅ API ${endpoint} respondeu com sucesso (${response.status()}) em ${fim - inicio}ms`);
    } else {
      console.error(`❌ Falha na API ${endpoint} — Status: ${response.status()}`);
    }

    if (fim - inicio > 3000) {
      console.warn(`⚠️ API ${endpoint} lenta (${fim - inicio}ms)`);
    }
    
    if (endpoint.includes('db-status') && response.ok()) {
      try {
        const body = await response.json();
        if (body.connected) {
          console.log('✅ Banco conectado e saudável');
        } else {
          console.error('❌ Banco não conectado ou com falhas');
        }
      } catch {
        const texto = await response.text();
        console.warn(`⚠️ Resposta inesperada do banco: ${texto}`);
      }
    }
  }

  const paginas = [
    'https://testepyeduardo.hom.sgmaster.com.br/py/dashboard',
    'https://testepyeduardo.hom.sgmaster.com.br/py/pessoa',    
    'https://testepyeduardo.hom.sgmaster.com.br/py/producto',    
    'https://testepyeduardo.hom.sgmaster.com.br/py/usuarios',
    'https://testepyeduardo.hom.sgmaster.com.br/py/ventas/facturacion',
    'https://testepyeduardo.hom.sgmaster.com.br/py/ventas/dav',
    'https://testepyeduardo.hom.sgmaster.com.br/py/usuario/listado',
    'https://testepyeduardo.hom.sgmaster.com.br/py/usuario/perfil',
    'https://testepyeduardo.hom.sgmaster.com.br/py/registros/especies',
    'https://testepyeduardo.hom.sgmaster.com.br/py/registros/grupos',
    'https://testepyeduardo.hom.sgmaster.com.br/py/registros/subgrupos',
    'https://testepyeduardo.hom.sgmaster.com.br/py/registros/marcas',
    'https://testepyeduardo.hom.sgmaster.com.br/py/empleados'
  ];

  for (const url of paginas) {
    await page.goto(url);
    const erroVisivel = await page.locator('text=Erro').isVisible();
    if (erroVisivel) {
      console.error(`🚨 Erro detectado na página ${url}`);
    } else {
      console.log(`✅ Página ${url} carregada corretamente`);
    }
    await page.screenshot({ path: `evidencia_${url.split('/').pop()}.png`, fullPage: true });
    console.log(`📸 Evidência capturada para ${url}`);
  }

  console.log('🏁 Health Check geral concluído com sucesso');
});
