import type { FilterFunction } from 'react-native';

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'color'
  | 'soft-light'
  | 'hard-light';

export type FrameStyle = 'none' | 'polaroid' | 'instax';

export type FilterPreset = {
  id: string;
  label: string;
  filter: readonly FilterFunction[];
  overlayColor: string;
  overlayBlend: BlendMode;
  /** 0 = off, 1 = normal strength, >1 = heavier vignette */
  vignette: number;
  grainOpacity: number;
  lightLeak: boolean;
  dateStamp: boolean;
  letterbox: boolean;
  frame: FrameStyle;
};

export const FILTERS: FilterPreset[] = [
  {
    id: 'natural',
    label: 'ナチュラル',
    filter: [],
    overlayColor: 'transparent',
    overlayBlend: 'normal',
    vignette: 0,
    grainOpacity: 0,
    lightLeak: false,
    dateStamp: false,
    letterbox: false,
    frame: 'none',
  },
  {
    id: 'film',
    label: 'フィルム',
    filter: [{ saturate: 0.85 }, { contrast: 0.95 }, { brightness: 1.03 }, { hueRotate: 5 }],
    overlayColor: 'rgba(255,235,205,0.16)',
    overlayBlend: 'overlay',
    vignette: 1,
    grainOpacity: 0.14,
    lightLeak: false,
    dateStamp: true,
    letterbox: false,
    frame: 'none',
  },
  {
    id: 'monochrome',
    label: 'モノクロ',
    filter: [{ grayscale: 1 }, { contrast: 1.25 }, { brightness: 1.02 }],
    overlayColor: 'transparent',
    overlayBlend: 'normal',
    vignette: 1,
    grainOpacity: 0.26,
    lightLeak: false,
    dateStamp: false,
    letterbox: false,
    frame: 'none',
  },
  {
    id: 'utsurun',
    label: '写ルンです風',
    filter: [{ saturate: 0.75 }, { contrast: 0.88 }, { brightness: 1.1 }, { hueRotate: 8 }],
    overlayColor: 'rgba(214,226,180,0.16)',
    overlayBlend: 'overlay',
    vignette: 1,
    grainOpacity: 0.3,
    lightLeak: false,
    dateStamp: false,
    letterbox: false,
    frame: 'none',
  },
  {
    id: 'kodak',
    label: 'コダック風',
    filter: [{ saturate: 1.35 }, { contrast: 1.12 }, { brightness: 1.02 }, { hueRotate: -4 }],
    overlayColor: 'rgba(255,170,60,0.16)',
    overlayBlend: 'soft-light',
    vignette: 1,
    grainOpacity: 0.1,
    lightLeak: false,
    dateStamp: false,
    letterbox: false,
    frame: 'none',
  },
  {
    id: 'harajuku',
    label: '原宿ポップ',
    filter: [{ saturate: 1.45 }, { contrast: 1.15 }, { brightness: 1.05 }],
    overlayColor: 'rgba(255,110,200,0.1)',
    overlayBlend: 'screen',
    vignette: 0,
    grainOpacity: 0.05,
    lightLeak: true,
    dateStamp: false,
    letterbox: false,
    frame: 'none',
  },
  {
    id: 'nostalgia',
    label: 'ノスタルジア',
    filter: [{ saturate: 0.55 }, { contrast: 0.9 }, { brightness: 0.97 }, { hueRotate: -8 }],
    overlayColor: 'rgba(255,195,130,0.28)',
    overlayBlend: 'multiply',
    vignette: 1.2,
    grainOpacity: 0.24,
    lightLeak: false,
    dateStamp: true,
    letterbox: false,
    frame: 'none',
  },
  {
    id: 'cinema',
    label: 'シネマ',
    filter: [{ contrast: 1.2 }, { saturate: 1.1 }, { hueRotate: -3 }],
    overlayColor: 'rgba(10,30,40,0.18)',
    overlayBlend: 'color',
    vignette: 1,
    grainOpacity: 0.09,
    lightLeak: false,
    dateStamp: false,
    letterbox: true,
    frame: 'none',
  },
  {
    id: 'polaroid',
    label: 'ポラロイド',
    filter: [{ saturate: 0.8 }, { contrast: 0.85 }, { brightness: 1.08 }],
    overlayColor: 'rgba(255,244,230,0.18)',
    overlayBlend: 'overlay',
    vignette: 0.8,
    grainOpacity: 0.1,
    lightLeak: false,
    dateStamp: false,
    letterbox: false,
    frame: 'polaroid',
  },
  {
    id: 'instax',
    label: 'チェキ風',
    filter: [{ saturate: 0.95 }, { contrast: 1.05 }, { brightness: 1.05 }, { hueRotate: -2 }],
    overlayColor: 'rgba(230,240,255,0.08)',
    overlayBlend: 'overlay',
    vignette: 0,
    grainOpacity: 0.08,
    lightLeak: false,
    dateStamp: false,
    letterbox: false,
    frame: 'instax',
  },
  {
    id: 'lomo',
    label: 'Lomo風',
    filter: [{ saturate: 1.6 }, { contrast: 1.35 }, { brightness: 0.97 }, { hueRotate: 6 }],
    overlayColor: 'rgba(255,0,120,0.06)',
    overlayBlend: 'color',
    vignette: 1.3,
    grainOpacity: 0.15,
    lightLeak: false,
    dateStamp: false,
    letterbox: false,
    frame: 'none',
  },
  {
    id: 'holga',
    label: 'トイカメラ風',
    filter: [{ saturate: 1.2 }, { contrast: 1.25 }, { brightness: 0.95 }],
    overlayColor: 'rgba(40,20,10,0.1)',
    overlayBlend: 'multiply',
    vignette: 1.3,
    grainOpacity: 0.18,
    lightLeak: true,
    dateStamp: false,
    letterbox: false,
    frame: 'none',
  },
  {
    id: 'agfa',
    label: 'アグファ風',
    filter: [{ saturate: 1.3 }, { contrast: 1.1 }, { hueRotate: 10 }],
    overlayColor: 'rgba(120,200,120,0.08)',
    overlayBlend: 'overlay',
    vignette: 1,
    grainOpacity: 0.08,
    lightLeak: false,
    dateStamp: false,
    letterbox: false,
    frame: 'none',
  },
  {
    id: 'crossprocess',
    label: 'クロスプロセス風',
    filter: [{ saturate: 1.5 }, { contrast: 1.3 }, { hueRotate: 15 }],
    overlayColor: 'rgba(255,230,0,0.1)',
    overlayBlend: 'screen',
    vignette: 1,
    grainOpacity: 0.12,
    lightLeak: false,
    dateStamp: false,
    letterbox: false,
    frame: 'none',
  },
  {
    id: 'y2k',
    label: 'Y2Kフラッシュ風',
    filter: [{ saturate: 1.25 }, { contrast: 1.15 }, { brightness: 1.15 }],
    overlayColor: 'rgba(255,255,255,0.1)',
    overlayBlend: 'screen',
    vignette: 1,
    grainOpacity: 0.18,
    lightLeak: false,
    dateStamp: true,
    letterbox: false,
    frame: 'none',
  },
];
