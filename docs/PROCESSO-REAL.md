# Como este episódio foi produzido

O pedido inicial foi enviado ao Claude com três documentos do kit. Em seguida, o briefing definiu a história e separou os papéis: Claude para planejamento/revisão; Codex para implementação e render. A primeira interpretação ampliou o escopo e confundiu o trecho 00:20–00:30 com uma duração. O quarto pedido corrigiu explicitamente o intervalo, removeu os elementos extras e escolheu 2.5D para o filme completo. Papel e pixel ficaram restritos aos dez segundos equivalentes.

Os quatro pedidos abaixo foram preservados literalmente, sem reconstruir uma conversa fictícia. O log bruto de interface não faz parte do kit.

## inicial

Leia este kit e crie uma história animada original curta, com começo, conflito e desfecho. Proponha três estilos: 2.5D, recorte de papel e pixel art. Mantenha a mesma história e personagens nas prévias para eu comparar. Depois de escolhermos um estilo, produza a animação com movimento, áudio e arquivos editáveis. Mostre prévias antes da exportação e não use serviços pagos sem me avisar.

## historia

Quero uma semi-continuação de Entrega pelo ar: Nico, o entregador de mochila amarela, leva uma semente minúscula a uma moradora numa praça quente. A semente cai num vaso; a última gota de água provoca um crescimento enorme. Uma folha ergue Nico, a flor abre e o devolve ao chão, deixando sombra para a praça inteira. Título: A entrega que virou jardim. Duração: 52 segundos, sem diálogos, humor visual. Antes de gerar qualquer animação, faça só o roteiro com tempos e revise a lógica das ações. Compare como animar o mesmo trecho de 20 a 30 segundos em 2.5D, recorte de papel e pixel art. A execução do projeto será feita no Codex; aqui vamos trabalhar o briefing e a revisão. Não use serviços pagos.

## inline

O documento fica carregando aqui. Cole o conteúdo essencial diretamente nesta conversa, sem criar outro artefato: tabela curta dos 52 segundos, o que causa cada ação e a comparação do trecho 20–30 s em 2.5D, papel e pixel. Ajuste um detalhe: quem usa a última gota do regador é a moradora; Nico recebe a consequência na folha. Termine com três cuidados de contato físico para eu levar ao Codex.

## revisao-escopo

Vamos manter o escopo pequeno. Você interpretou “20–30 s” como duração, mas é o intervalo de 00:20 até 00:30, exatamente dez segundos. Não acrescente leitor, assinatura, torneira, pétala solta nem regador se enchendo. A linha do tempo que vou executar é: 0–4 encomenda se mexe; 4–10 Nico atravessa a praça e encontra moradora com vaso e regador; 10–15 abre caixa e revela semente; 15–20 semente salta para o vaso e moradora usa última gota; 20–22 espera; 22–30 planta cresce e folha ergue Nico; 30–36 flor abre; 36–43 a mesma folha desce e devolve Nico ao chão; 43–50 vizinhos aproveitam sombra; 50–52 brotinho aparece no boné. Escolho 2.5D para o filme completo. Papel e pixel são só testes de 00:20–00:30. Responda aqui com uma tabela resumida de cenas e uma tabela de três estilos. Nos contatos, revise apenas pés na folha, mãos no regador e gota no vaso. Não crie artefatos nem execute nada.

## Produção e revisão por código

As correções físicas e visuais reais estão em `projeto/prompt-exato.md`. O roteiro e os tempos estão em `projeto/story.md`. Não se trata de três modelos generativos nem de um resultado pronto após uma única mensagem.
