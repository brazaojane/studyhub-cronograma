STUDYHUB - Cronograma de Estudos
🇺🇸 [Read in English](README.md)
Acesso: [janetebs.github.io/studyhub-cronograma](https://brazaojane.github.io/studyhub-cronograma/)

Aplicação web que gera automaticamente um cronograma semanal de estudos a partir das matérias, cargas horárias e prioridades definidas pelo usuário.

## FUNCIONALIDADES
• Cadastro de matérias: nome, horas semanais e prioridades (alta, média ou baixa)
• Distribuição automática das sessões de estudos ao longo dos 7 dias da semana,
com base na prioridade de cada matéria.
• Grade semanal visual, com cores exclusivas para cada matéria.
• Reordenação da grade por ordem de adição, prioridade, horas ou nome.
• Resumo da semana; total de horas, número de matérias, quantidade de sessões e dias ativos..
• Barra de progresso mostrando a carga proporcional de cada matéria.
• Exportação para PDF via impressão do navegador.
• Persistência local;os dados ficam salvos no navegador (localStorage),
sem necessidade de login ou servidor.

## TECNOLOGIAS
• HTML5
• CSS3
• JavaScript (Vanilla)
Sem frameworks, sem dependências externas - projeto 100% front-end,
hospedado no GitHub Pages.

## COMO USAR
1. Acesse a aplicação pelo link acima
2. No painel lateral, digite o nome da matéria, defina horas por semana e prioridade
3. Clique em "+ Adicionar Matéria"
4. A grade semanal é gerada automaticamente, distribuindo as sessões de estudo pelos dias
5. Use os botões de ordenação para reorganizar a visualização
6. Clique em "imprimir" para exportar o cronograma em PDF.

## LÓGICA DE DISTRIBUIÇÃO
• Matérias de prioridade alta são distribuídas em até 5 dias da semana
• Prioridade média, em até 3 dias
• Prioridade baixa, em até 2 dias
• As horas semanais de cada matéria são divididas em sessões de aproximadamente 1h30.

## ESTRUTURA DO PROJETO
index.html
style.css
script.js

## AUTORIA ──── ୨୧ ────
Desenvolvido por Janete Brazão como projeto de portfólio.
