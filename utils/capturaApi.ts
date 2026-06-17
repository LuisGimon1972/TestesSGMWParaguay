import { Page } from '@playwright/test';

export async function capturarRequisicoesApi(page: Page) {  
  console.log(`***REQUISIÇÕES DA API ⬅️***`);

  page.on('request', request => {
    console.log(`➡️ Requisição: ${request.method()} ${request.url()}`);
  });
  
  page.on('response', async response => {
    const status = response.status();
    console.log(`⬅️ Resposta: [${status}] ${response.url()}`);    
    
  });
}
