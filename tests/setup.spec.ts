import { test } from '@playwright/test';
import { loginCompleto } from '../utils/loginCompleto';

test('Setup login', async ({ page }) => {
  await loginCompleto(page);  
  await page.waitForTimeout(5000);
});