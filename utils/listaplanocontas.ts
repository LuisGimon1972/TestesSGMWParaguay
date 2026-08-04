export type PlanoConta = {
  id: string;
  nomeConta: string;
};

export const planosContas: PlanoConta[] = [
  { id: '1', nomeConta: 'Ativo' },
  { id: '1.1', nomeConta: 'Ativo Circulante' },
  { id: '1.1.1', nomeConta: 'Caixa e Equivalentes de Caixa' },
  { id: '1.1.1.01', nomeConta: 'Caixa Geral' },
  { id: '1.1.1.02', nomeConta: 'Bancos Conta Movimento' },
  { id: '1.1.1.03', nomeConta: 'Aplicações Financeiras de Curto Prazo' },
  { id: '1.1.2', nomeConta: 'Contas a Receber' },
  { id: '1.1.2.01', nomeConta: 'Clientes Interno' },
  { id: '1.1.2.02', nomeConta: 'Clientes Externo' },
  { id: '1.1.3', nomeConta: 'Estoques' },
  { id: '1.1.3.01', nomeConta: 'Mercadorias para Revenda' },
  { id: '1.1.3.02', nomeConta: 'Matéria-Prima' },
  { id: '1.2', nomeConta: 'Ativo Não Circulante' },
  { id: '1.2.1', nomeConta: 'Realizável a Longo Prazo' },
  { id: '1.2.2', nomeConta: 'Investimentos' },
  { id: '1.2.3', nomeConta: 'Imobilizado' },
  { id: '1.2.3.01', nomeConta: 'Máquinas e Equipamentos' },
  { id: '1.2.3.02', nomeConta: 'Móveis e Utensílios' },
  { id: '1.2.3.03', nomeConta: 'Veículos' },
  { id: '1.2.4', nomeConta: 'Intangível' },
  { id: '1.2.4.01', nomeConta: 'Softwares e Licenças' },
  { id: '2', nomeConta: 'Passivo' },
  { id: '2.1', nomeConta: 'Passivo Circulante' },
  { id: '2.1.1', nomeConta: 'Fornecedores' },
  { id: '2.1.1.01', nomeConta: 'Fornecedores Nacionais' },
  { id: '2.1.1.02', nomeConta: 'Fornecedores Estrangeiros' },
  { id: '2.1.2', nomeConta: 'Obrigações Trabalhistas' },
  { id: '2.1.2.01', nomeConta: 'Salários a Pagar' },
  { id: '2.1.2.02', nomeConta: 'INSS a Recolher' },
  { id: '2.1.2.03', nomeConta: 'FGTS a Recolher' },
  { id: '2.1.3', nomeConta: 'Obrigações Tributárias' },
  { id: '2.1.3.01', nomeConta: 'Impostos Federais a Recolher' },
  { id: '2.1.3.02', nomeConta: 'Impostos Estaduais a Recolher' },
  { id: '2.1.3.03', nomeConta: 'Impostos Municipais a Recolher' },
  { id: '2.2', nomeConta: 'Passivo Não Circulante' },
  { id: '2.2.1', nomeConta: 'Empréstimos e Financiamentos a Longo Prazo' },
  { id: '2.3', nomeConta: 'Patrimônio Líquido' },
  { id: '2.3.1', nomeConta: 'Capital Social' },
  { id: '2.3.2', nomeConta: 'Reservas de Lucros' },
  { id: '2.3.3', nomeConta: 'Prejuízos Acumulados' },
  { id: '3', nomeConta: 'Receitas' },
  { id: '3.1', nomeConta: 'Receita Bruta de Vendas' },
  { id: '3.1.1', nomeConta: 'Receita com Venda de Produtos' },
  { id: '3.1.2', nomeConta: 'Receita com Prestação de Serviços' },
  { id: '3.2', nomeConta: 'Deduções da Receita Bruta' },
  { id: '3.2.1', nomeConta: 'Impostos Incidentes sobre Vendas' },
  { id: '3.2.2', nomeConta: 'Devoluções e Abatimentos' },
  { id: '3.3', nomeConta: 'Outras Receitas Operacionais' },
  { id: '3.3.1', nomeConta: 'Receitas Financeiras' },
  { id: '4', nomeConta: 'Despesas' },
  { id: '4.1', nomeConta: 'Despesas Operacionais' },
  { id: '4.1.1', nomeConta: 'Despesas com Vendas' },
  { id: '4.1.1.01', nomeConta: 'Comissões de Vendas' },
  { id: '4.1.1.02', nomeConta: 'Propaganda e Publicidade' },
  { id: '4.1.2', nomeConta: 'Despesas Administrativas' },
  { id: '4.1.2.01', nomeConta: 'Despesas com Pessoal Administrativo' },
  { id: '4.1.2.02', nomeConta: 'Despesas com Aluguel' },
  { id: '4.1.2.03', nomeConta: 'Despesas com Energia e Água' },
  { id: '4.1.2.04', nomeConta: 'Despesas com Material de Escritório' },
  { id: '4.1.3', nomeConta: 'Despesas Financeiras' },
  { id: '4.1.3.01', nomeConta: 'Juros Passivos' },
  { id: '4.1.3.02', nomeConta: 'Tarifas Bancárias' },
  { id: '4.2', nomeConta: 'Custo dos Produtos Vendidos (CPV)' },
  { id: '4.3', nomeConta: 'Custo dos Serviços Prestados (CSP)' }
];

export function obterNomeContaAleatoria(): string {
  return planosContas[Math.floor(Math.random() * planosContas.length)].nomeConta;
}

export function obterPlanoContaAleatorio(): PlanoConta {
  return planosContas[Math.floor(Math.random() * planosContas.length)];
}