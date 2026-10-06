export interface ExpressionPreset {
  name: string;
  weights: Record<string, number>;
}

export const EXPRESSION_PRESETS: Record<string, ExpressionPreset> = {
  neutral: {
    name: 'neutral',
    weights: { 'まばたき': 0, '笑顔': 0, 'あ': 0 },
  },
  joy: {
    name: 'joy',
    weights: { '笑顔': 0.8, 'にやり': 0.4, '笑い': 0.6 },
  },
  smile: {
    name: 'smile',
    weights: { '笑顔': 0.6, '口角上げ': 0.5 },
  },
  surprised: {
    name: 'surprised',
    weights: { 'びっくり': 0.9, 'お': 0.5, '見開き': 0.7 },
  },
  anger: {
    name: 'anger',
    weights: { '怒り': 0.8, '口角下げ': 0.5 },
  },
  sorrow: {
    name: 'sorrow',
    weights: { '困る': 0.7, '悲しい': 0.8, 'う': 0.3 },
  },
  wink: {
    name: 'wink',
    weights: { 'ウィンク': 1.0, '笑顔': 0.4 },
  },
  shy: {
    name: 'shy',
    weights: { '照れ': 0.8, '困る': 0.3, '笑顔': 0.4 },
  },
};
