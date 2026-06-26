import { Page } from '@playwright/test';

export async function capturarRequisicaoApiCadastro(page: Page, endpoint: string): Promise<{ payload: any; resposta: any }> {
  return new Promise((resolve, reject) => {
    let payloadCapturado: any = null;
    let respostaCapturada: any = null;

    page.on('request', request => {
    if (['POST', 'PUT', 'PATCH'].includes(request.method()) && request.url().includes(endpoint)) {
    try {
      payloadCapturado = request.postDataJSON();      
    } catch (err) {
      console.error('⚠️ Erro ao capturar payload:', err);
    }
  }
  });

    page.on('response', async response => {
    if (['POST', 'PUT', 'PATCH'].includes(response.request().method()) && response.url().includes(endpoint)) {
    try {
    respostaCapturada = await response.json();    
    const respostaLimpa = limparObjeto(respostaCapturada);    
    console.log(
    `📥 RESPOSTA DA API [${response.status()}]:\n${JSON.stringify(respostaLimpa, null, 2)}`
    );
    resolve({ payload: payloadCapturado, resposta: respostaLimpa });
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

function limparAnsi(texto: string): string {
  // Remove sequências ANSI (cores, resets e outros escapes invisíveis)
  const regex = /\x1B\[[0-9;]*[A-Za-z]|[\x00-\x1F\x7F]/g;
  return texto.replace(regex, '');
}

function limparObjeto(obj: Record<string, unknown>): Record<string, unknown> {
  const limpo: Record<string, unknown> = {};
  for (const [chave, valor] of Object.entries(obj)) {
    limpo[chave] = typeof valor === 'string' ? limparAnsi(valor) : valor;
  }
  return limpo;
}














