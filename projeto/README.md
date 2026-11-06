# A entrega que virou jardim

Curta original de 52 segundos e duas versões de uma cena, para o episódio 03 de **Luiz Amorim — IA na Prática**. Criado por agente de IA com código editável. Sem serviço de geração de vídeo, sem chave de API e sem gasto externo de geração.

## Resultado e técnicas

| Composição | Duração | Técnica |
|---|---:|---|
| Jardim25D | 52 s | Personagens Canvas2D em cenário Three.js; câmera, luzes, sombras, planta e props em geometria |
| JardimComparacao | 10 s | Trecho 20–30 s do principal, para comparação |
| JardimPapel | 10 s | Desenho de recortes, articulação e sombras de camadas próprios |
| JardimPixel | 10 s | Sprites desenhados em 180×320, grade inteira, poses quantizadas a 12 Hz e saída a 30 fps |

As três versões mantêm Nico (boné laranja, casaco vinho), a moradora (vestido amarelo, gola vinho), o vaso e a ação de crescimento que ergue o entregador. Não são três modelos generativos nem uma simples troca de paleta.

## Usar o kit

Requisitos: Node.js 22 ou mais recente e npm. O projeto foi executado com Node 24.18.0. O áudio final necessário ao vídeo já está em `public/mix.mp3`; Python e FFmpeg são necessários apenas para refazer a trilha.

```powershell
npm ci
npm run check
npm run studio
```

Abra o endereço local informado pelo servidor. A porta padrão deste kit é 3323; nenhuma janela é aberta automaticamente. Escolha a composição na lateral e mova a linha do tempo.

```powershell
# Prévia de 540×960; custo de processamento menor.
node scripts/render.mjs Jardim25D ../media/jardim-preview.mp4 0.5

# Masters 1080×1920, H.264, 30 fps, áudio AAC.
npm run render
npm run render:paper
npm run render:pixel

# Mesma passagem do principal para comparação.
node scripts/render.mjs JardimComparacao ../media/jardim-comparacao.mp4

# Quadros verificáveis; números são frames, não segundos.
node scripts/stills.mjs 540,570,780,990 Jardim25D qa/revisao
```

O render usa uma aba headless, concorrência 1 e dois threads no encoder. Isso ainda consome CPU/GPU; feche o render se precisar dos recursos para outra atividade. Não há captura ou controle do desktop.

## Pedir alterações à IA

Leia `story.md` primeiro. Exemplo recomendado, não transcrição de conversa:

> Leia este projeto. Preserve Nico, a moradora, a história e os tempos dos acontecimentos. Mude o formato das pétalas para uma flor azul, com folhas redondas. Gere quadros do crescimento e do desfecho antes de renderizar. Confira se os pés continuam apoiados na folha e se o bico do regador continua conectado. Não chame serviços pagos.

- Roteiro, crescimento, elevação e câmera: `src/story.ts`.
- Personagens, cenário, regador, vaso e flor: `src/world.ts`.
- Papel e pixel art: `src/Alternatives.tsx`.
- Composições e áudio: `src/Root.tsx`.
- Partitura e efeitos originais: `scripts/audio.py`.

## Refazer a trilha original

```powershell
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt
# Se ffmpeg não estiver no PATH, aponte a variável FFMPEG para seu executável.
$env:FFMPEG = 'C:/caminho/ffmpeg.exe'
.venv/Scripts/python scripts/audio.py
```

O script sintetiza instrumentos, passos, movimento de folhas, gota d’água e efeitos de surpresa. Grava stems separados em `audio/`, mix em `public/mix.mp3` e um registro dos efeitos em `audio/cues.json`. Nenhuma voz, API, biblioteca de música ou arquivo pago é usado.

## Proveniência e limites

A base de desenho, shaders e texturas procedurais deriva do projeto MROMIDEV, sob licença MIT preservada em `LICENSE-MROMIDEV`. História, encenação, planta, estilos alternativos e trilha foram criados para este episódio. O código novo deste kit também pode ser usado sob os termos MIT em `LICENSE`.

Renderizar sem erro não comprova qualidade artística. Confira movimento, contato entre objetos, ritmo e áudio. `LOG-EXECUCAO.md` distingue as revisões realizadas das verificações que ainda precisam de avaliação humana. O kit não inclui credenciais, identificadores de voz, cache do navegador, `node_modules` ou arquivos de outros episódios.
