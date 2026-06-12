import { test } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';
import { capturarRequisicoesApi } from '../utils/capturaApi';

test('Setup login', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginCompleto(page);  
  console.log('AUTENTICAÇÃO OK');  

  await capturarRequisicoesApi(page); 
  await page.waitForTimeout(4000);
});