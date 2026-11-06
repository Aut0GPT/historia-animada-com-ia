# Execução real — episódio 03

Data local: 5 de novembro de 2026. Projeto isolado em `outputs/episodio-03/animacao`; os episódios anteriores não foram alterados.

## O que foi executado

1. Leitura das skills `animacao-2d-mromi` e `remotion-render`, das instruções de implementação e da base do episódio 02.
2. Cópia do código de desenho, shaders e pintura, lockfile e licença MIT. Para desenvolvimento local, uma junction reutilizou `node_modules` já instalado; ela não faz parte do kit público. O kit usa `npm ci`.
3. Escrita de história original de 52 segundos, novos eventos e câmeras, vaso, semente, regador, planta, folha elevatória e desfecho. Dois tratamentos adicionais foram desenhados separadamente em Canvas: papel e pixel art.
4. `npm run check`: TypeScript passou.
5. `python scripts/audio.py`, no Python local com NumPy: síntese de 52 segundos de música e efeitos. Resultado final: 29 cues, pico do premaster 0,29127, custo externo zero. FFmpeg produziu `public/mix.mp3`; relatório em `audio/mastering.txt`.
6. `node scripts/stills.mjs 55,240,400,540,660,780,990,1320,1530 Jardim25D qa/concept`: nove quadros iniciais de 540×960, inspecionados visualmente.
7. Renderização de quadros de papel e pixel, inspeção e correção do traje da moradora e enquadramento após revisão do agente principal.
8. `node scripts/render.mjs JardimComparacao ../media/jardim-comparacao-preview.mp4 0.5`: comparativo 2.5D de 10 segundos produzido.
9. `node scripts/render.mjs Jardim25D ../media/jardim-preview.mp4 0.5`: prévia integral de 52 segundos produzida. O agente principal inspecionou a sequência exportada e pediu correções de contato e sombra antes do master.
10. `node scripts/render.mjs JardimPapel ../media/jardim-papel.mp4 1` e o equivalente `JardimPixel`: versões 1080×1920 de 10 segundos produzidas, uma por vez.
11. `npm run studio`: servidor editável iniciado em `http://localhost:3323`, com `--no-open`; não abriu janela nem controlou o desktop.
12. Nova aprovação de direção após frames `qa/contact-review`, `qa/contact-review-v2` e `qa/contact-review-v3`. O master principal foi então iniciado.

## Correções visuais comprovadas

- **Regador:** no frame 540 inicial, a cabeça do bico estava separada do tubo. Orientações e ponto da gota foram corrigidos. Depois, o contato da mão com a alça foi refinado com projeção do ponto real da alça no plano do personagem; o frame 535 de `qa/contact-review-v3` mostra a correção.
- **Nico sobre a folha:** a pose de pernas suspensas criava um vão no frame 780. Foi substituída por uma pose apoiada, mantendo expressão e braços de susto.
- **Caixa:** a primeira prévia ocultava as mãos atrás da caixa. Os pulsos passaram para a frente do corpo e a caixa foi posicionada atrás do plano das mãos; os contatos ficaram visíveis. O enquadramento do gancho também passou a mostrar a reação de Nico.
- **Identidade:** o vestido amarelo e a gola vinho da moradora foram preservados em papel e pixel. O boné laranja e casaco vinho de Nico permanecem nos três estilos.
- **Sombra:** o desfecho ganhou máscara de sombra com forma de pétalas, bordas suaves e tonalização dos personagens que entram embaixo da flor. O chão iluminado fora da sombra permanece como contraste.
- **Continuidade:** a caixa acelera na queda curta; o regador é colocado no chão com a mão acompanhando a alça e permanece na cena. A planta conserva a escala depois de crescer; somente a folha que sustenta Nico desce.

Os frames anteriores foram preservados para documentar revisões reais. Não foram recriados artificialmente para fingir um erro de IA.

## Erros técnicos e resolução

- Uma primeira execução passou `numberOfGifLoops` ao render H.264. Remotion rejeitou a opção; ela foi removida.
- Uma escala decimal aproximada de 2/3 gerou uma dimensão não inteira. As prévias foram feitas em escala exata 0,5 (540×960).
- Um comando de correção usou um caminho relativo redundante; não alterou arquivos e foi repetido com o caminho correto.
- A regeneração final de áudio foi chamada uma vez com caminho errado para o Python. Foi refeita com o executável correto. O áudio final é aplicado aos masters após render, de modo que o kit e as saídas compartilhem a mesma trilha.
- Um render 1080 do principal foi interrompido a 9% para a revisão solicitada pelo agente principal. Não foi tratado como entrega pronta.

## Limites da verificação

Frames e contato da sequência foram inspecionados. Aprovação de direção pelo agente principal é distinta de aprovação final pelo usuário. Medições e decodificação técnica não substituem ouvir a trilha e assistir ao movimento completo. O relatório final `qa/FINAL-QA.json` registra as medições dos masters concluídos.

Não houve chamada paga, acesso a conta de voz, publicação externa, controle de mouse ou teclado, nem captura de outro aplicativo nesta sub tarefa.

## Conclusão técnica dos masters

- `jardim-25d.mp4`: 52,000 s, 1560 frames, 1080×1920, 30 fps, H.264, AAC estéreo 48 kHz, 68.162.371 bytes.
- `jardim-papel.mp4` e `jardim-pixel.mp4`: 10,000 s, 300 frames cada, 1080×1920, 30 fps, H.264/AAC. O áudio é o mesmo intervalo 20–30 s do principal.
- `jardim-comparacao.mp4`: recorte preciso 20–30 s do principal, também 1080×1920 e 30 fps; o vídeo foi recodificado para corte exato, sem depender de keyframe aproximado.
- FFmpeg decodificou integralmente os quatro arquivos sem mensagens de erro. TypeScript passou após a última alteração.
- Loudness medido no principal exportado: **−17,05 LUFS integrados**, pico verdadeiro **−2,26 dBTP**, LRA 5,20 LU. Nas alternativas: −18,25 LUFS e −4,26 dBTP, consistentes com o intervalo utilizado.
- Inspecionados 22 quadros extraídos do master, cobrindo gancho, caminhada, abertura, queda, rega, espera, crescimento, subida, abertura da flor, descida, sombra compartilhada e gag final. Contatos corrigidos permaneceram no export. A folha desce sem reduzir a planta. Regador permanece no chão.
- Evidence sheet: `qa/MASTER-SEQUENCIA.png`. JSON com streams, SHA-256, tamanhos e medições: `qa/FINAL-QA.json`.
- Não foi alegada audição humana da trilha. A aprovação final de som e ritmo pelo usuário permanece distinta dos testes técnicos e revisão dos quadros.


## Última revisão: broto preso ao boné

A revisão do agente principal encontrou uma regressão no plano final: o broto flutuava acima do boné. O ponto fixo foi substituído por ancoragem na coroa realmente desenhada no Canvas, incluindo a inclinação da cabeça; um caule contínuo conecta duas folhas ao boné. Quadros 1500,1530 e1559 foram inspecionados em `qa/crown-corrected`.

Somente os frames1482–1559 (49,400–52,000s) foram renderizados novamente. O corte corresponde a um keyframe existente. Prefixo e cauda foram unidos com cópia do stream, sem recodificar o restante. Comparação por hash dos pixels decodificados comprovou: os1482 primeiros frames permanecem idênticos ao master anterior, e os78 finais são idênticos ao novo render. O resultado continua com1560 frames/52s, decodificação integral semerro. Detalhes em `qa/crown-splice/splice-qa.json`.

O master, o ZIP de fonte, o manifesto e o QA anteriores foram invalidados e substituídos; versões anteriores permanecem apenas no arquivo interno de revisão.
