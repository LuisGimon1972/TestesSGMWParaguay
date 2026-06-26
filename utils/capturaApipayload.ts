import { Page } from '@playwright/test';

export async function capturarRequisicaoApiCadastro(page: Page): Promise<{ payload: any; resposta: any }> {
  return new Promise((resolve, reject) => {
    let payloadCapturado: any = null;
    let respostaCapturada: any = null;

    page.on('request', request => {
    if (['POST', 'PUT', 'PATCH'].includes(request.method()) && request.url().includes('/api/usuario')) {
    try {
      payloadCapturado = request.postDataJSON();
      console.log('📤 Payload capturado:', payloadCapturado);
    } catch (err) {
      console.error('⚠️ Erro ao capturar payload:', err);
    }
  }
  });

    page.on('response', async response => {
    if (['POST', 'PUT', 'PATCH'].includes(response.request().method()) && response.url().includes('/api/usuario')) {
    try {
      respostaCapturada = await response.json();
      console.log(`⬅️ Resposta [${response.status()}]:`, respostaCapturada);
      resolve({ payload: payloadCapturado, resposta: respostaCapturada });
    } catch (err) {
      reject('⚠️ Erro ao capturar resposta: ' + err);
    }
    }
    });

    setTimeout(() => {
      if (!payloadCapturado && !respostaCapturada) {
        reject('⚠️ Nenhuma requisição de cadastro capturada!');
      }
    }, 5000);
  });
}
