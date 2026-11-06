// Aparência do curta por horário. Só muda céu, luz e paleta do cenário:
// história, personagens, movimentos, câmera e áudio continuam os mesmos.
// Troque ESTILO_PADRAO para 'dia' para voltar ao visual original,
// ou passe {"estilo":"dia"} como input prop na renderização.
import {getInputProps} from 'remotion';
type V3 = [number, number, number];
export type Estilo = {
  ceu: [number, string][];       // degradê vertical do céu (0 = topo da tela, 1 = base)
  fundo: string;                 // cor de segurança atrás do canvas
  neblina: string; neblinaPerto: number; neblinaLonge: number;
  sol: {pos: V3; cor: string; intensidade: number};
  hemi: {ceu: string; chao: string; intensidade: number};
  luz: V3; sombra: V3; elevarSombra: V3; rebote: V3; saturacao: number; // cenário (shade.ts TONE)
  peleTom: V3; peleSombra: number;                                      // personagens (shade.ts CHAR)
  nuvem: string; vento: string; poeira: string;
  grade: number;                 // 0 = grade 'day', 1 = grade 'golden'
};
export const ESTILOS: Record<'dia' | 'tarde', Estilo> = {
  dia: {
    ceu: [[0, '#74b5ee'], [1, '#74b5ee']], fundo: '#74b5ee',
    neblina: '#b9daf0', neblinaPerto: 38, neblinaLonge: 115,
    sol: {pos: [-14, 26, 18], cor: '#fff1d5', intensidade: 2.8},
    hemi: {ceu: '#d9eaff', chao: '#a49b75', intensidade: .7},
    luz: [1.58, 1.5, 1.33], sombra: [.38, .37, .52], elevarSombra: [.05, .06, .11], rebote: [0, 0, 0], saturacao: 1.08,
    peleTom: [1, .96, .95], peleSombra: .87,
    nuvem: '#ffffff', vento: '#effaff', poeira: '#ead8b4',
    grade: 0,
  },
  tarde: {
    // fim de tarde quente: azul suave no alto, pêssego e âmbar perto do horizonte
    ceu: [[0, '#7c95d0'], [.22, '#c9a6b8'], [.42, '#f4b48e'], [.65, '#ffc587'], [1, '#ffdca2']], fundo: '#f3b896',
    neblina: '#f6c294', neblinaPerto: 34, neblinaLonge: 110,
    // sol mais baixo e alaranjado, vindo da esquerda e da frente: sombras mais longas para trás das casas
    sol: {pos: [-30, 15, 22], cor: '#ffc98e', intensidade: 3.0},
    hemi: {ceu: '#ffd9b5', chao: '#8a6a60', intensidade: .6},
    luz: [1.74, 1.24, .76], sombra: [.36, .31, .5], elevarSombra: [.07, .05, .13], rebote: [.05, .025, 0], saturacao: 1.12,
    // tom quente nos personagens; cardshade.ts normaliza a luminância, então os rostos continuam claros
    peleTom: [1, .88, .76], peleSombra: .9,
    nuvem: '#ffd7bc', vento: '#fff0dc', poeira: '#efc9a0',
    grade: .6,
  },
};
export const ESTILO_PADRAO: keyof typeof ESTILOS = 'tarde';
export function estiloAtual(): Estilo {
  const pedido = getInputProps().estilo as keyof typeof ESTILOS | undefined;
  return ESTILOS[pedido && pedido in ESTILOS ? pedido : ESTILO_PADRAO];
}
