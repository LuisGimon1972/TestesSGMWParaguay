import { test} from '@playwright/test';
import { loginCompleto } from '../../utils/loginCompleto';

test('Desempenho do login - tempo de resposta', async ({ page }) => {
  const inicio = Date.now();
  await loginCompleto(page);
  const fim = Date.now();

  const tempoResposta = fim - inicio;
  console.log(`Tempo de resposta do login: ${tempoResposta} ms`);

  console.log(`Tempo de resposta: ${tempoResposta} ms`);
  if (tempoResposta > 5000) {
    console.warn('⚠️ Tempo acima do limite esperado');
  }
});
