# Verificação dos arquivos entregues

Verificação realizada em 5 de novembro de 2026. Todos os vídeos são H.264, 1080×1920, 30 fps, com AAC estéreo a 48 kHz.

| Arquivo | Duração | Frames | Tamanho |
|---|---:|---:|---:|
| jardim-25d.mp4 | 52,000 s | 1560 | 68.162.371 bytes |
| jardim-papel.mp4 | 10,000 s | 300 | 1.372.766 bytes |
| jardim-pixel.mp4 | 10,000 s | 300 | 609.064 bytes |
| jardim-comparacao.mp4 | 10,000 s | 300 | 12.815.478 bytes |

As três comparações usam o intervalo narrativo 20–30 s. O principal tem trilha original, sem voz. Não há texto na imagem que exija uma segunda versão visual em inglês.

- TypeScript: passou.
- Decodificação integral com FFmpeg: nenhum erro nos quatro arquivos.
- Principal: −17,05 LUFS, −2,26 dBTP, LRA 5,20 LU.
- Papel/pixel: −18,25 LUFS, −4,26 dBTP, LRA 2,50 LU.
- Inspeção visual: 22 quadros do master, além de quadros iniciais e revisões de contato. Caixa, mão na alça, pés sobre a folha, descida e sombra foram revisados.
- A revisão técnica e de quadros não equivale a aprovação final do usuário nem a audição humana da trilha.

## SHA-256

```text
jardim-25d.mp4         842b75768e4fa8ca074ea23dbf8e544c447abd67e3b14070f7cb7e9077e4a375
jardim-papel.mp4       ca5ce1eb0d82846ca2d8a558a418219b0504b6ead28c8ff1884ad64a30ba16ec
jardim-pixel.mp4       66476b8481142bb7e8f8605d370b37c5815db614218a396a79731e08b68fbf4c
jardim-comparacao.mp4  ace597cebc99f82bedb9147478d14d2a8fd145050779072ad749b38aac58c0fd
```

Custo de geração externa: zero. Os renderizadores locais consumiram recursos do computador. O código e as trilhas são reproduzíveis a partir do kit; as licenças da base permanecem incluídas.

Revisão final do boné: raiz do broto e caule conectados à coroa desenhada. Emenda exata no keyframe49,400s;1482 frames do prefixo permaneceram idênticos por hash de pixels,78 frames finais conferidos contra a nova renderização. Master novamente decodificado semerro.
