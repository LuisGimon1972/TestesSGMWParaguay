import { test } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';

test('Exclusão de datos funcionários', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  await loginCompleto(page);
  
  await page.getByText(/funcionários/i).click({ force: true });
  console.log('CLICOU EM FUNCIONÁRIOS');  
  
  await page.waitForTimeout(1000);        

  await page.waitForSelector('table', { state: 'visible' });
  const menuTresPontos = page.locator('table tr:first-child >> text=more_vert').first();
  console.log('LOCALIZOU OS TRÊS PONTOS');
  await menuTresPontos.click();
  console.log('CLICOU NOS TRÊS PONTOS');

  await page.waitForTimeout(1000);    
  await page.waitForSelector('text=Excluir', { state: 'visible' });
  await page.locator('text=Excluir').click();
  console.log('CLICOU EM EXCLUIR');   
  await page.waitForTimeout(2000);     

  await capturarRequisicoesApi(page);   
  await page.waitForTimeout(4000);  
});