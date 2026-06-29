import { Page } from '@playwright/test';

export async function capturarRequisicaoApiDelete(
  page: Page,
  endpoint: string
): Promise<{ payload: any; resposta: any }> {
  return new Promise((resolve, reject) => {
    let payloadCapturado: any = null;
    let respostaCapturada: any = null;

    // Captura requisição DELETE
    page.on('request', request => {
  if (request.method() === 'DELETE' && request.url().includes(endpoint)) {
    try {
      const payload = request.postDataJSON?.() ?? null;
      const payloadStr = payload === null ? 'null' : JSON.stringify(payload);
      console.log('📤 PAYLOAD DELETE:', limparAnsi(payloadStr));
    } catch (err) {
      console.error('⚠️ Erro ao capturar payload DELETE:', err);
    }
  }
});


    
    page.on('response', async response => {
      if (response.request().method() === 'DELETE' && response.url().includes(endpoint)) {
        try {
          let respostaLimpa: any = null;
          
          const body = await response.body();
          if (body && body.length > 0) {
            try {
              respostaCapturada = JSON.parse(body.toString());
              respostaLimpa = limparObjeto(respostaCapturada);
            } catch {
              respostaLimpa = body.toString(); 
            }
          } else {
            respostaLimpa = { mensagem: 'Sem conteúdo na resposta (204 No Content)' };
          }

          console.log(
            `📥 RESPOSTA DELETE [${response.status()}]:\n${JSON.stringify(respostaLimpa, null, 2)}`
          );
          resolve({ payload: payloadCapturado, resposta: respostaLimpa });
        } catch (err) {
          reject('⚠️ Erro ao capturar resposta DELETE: ' + err);
        }
      }
    });

    // Timeout de segurança
    setTimeout(() => {
      if (!payloadCapturado && !respostaCapturada) {
        reject('⚠️ Nenhuma requisição DELETE capturada!');
      }
    }, 5000);
  });
}

function limparAnsi(texto: string): string {
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
