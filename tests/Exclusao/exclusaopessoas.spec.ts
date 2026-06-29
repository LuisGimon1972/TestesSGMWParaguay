import { test, expect } from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';
import { capturarRequisicoesApi } from '../../utils/capturaApi';
import { capturarRequisicaoApiDelete } from '../../utils/capturaApidelete';

test('Exclusão de datos Pessoas', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginCompleto(page);    

    await page.waitForTimeout(1000);
    await page.getByText(/pessoas/i).click({ force: true }); 
    console.log('CLICOU PESSOAS');

    await page.waitForTimeout(2000);
  
    const menuTresPontos = page.locator('table tr:first-child >> text=more_vert');

    if (await menuTresPontos.count() > 0 && await menuTresPontos.isVisible()) {
      console.log('LOCALIZOU OS TRÊS PONTOS');
      await menuTresPontos.click();
      console.log('CLICOU NOS TRÊS PONTOS');

      await page.waitForTimeout(1000);
      await page.waitForSelector('text=Excluir', { state: 'visible' });
      await page.locator('text=Excluir').click();
      console.log('CLICOU EM EXCLUIR');

      await capturarRequisicaoApiDelete(page, '/api/py/pessoa'); 
  
      await capturarRequisicoesApi(page);
      await page.waitForTimeout(4000);
    } else {
      console.log('NENHUM REGISTRO ENCONTRADO NA GRADE, NADA PARA EXCLUIR.');
    }
});