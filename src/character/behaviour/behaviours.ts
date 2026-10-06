export type CharacterBehaviourState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'greeting'
  | 'happy'
  | 'tired';

export interface BehaviourConfig {
  state: CharacterBehaviourState;
  expression: string;
  gazeIntensity: number;
  bodyEnergy: number;
  speechAllowed: boolean;
}

export const BEHAVIOURS: Record<CharacterBehaviourState, BehaviourConfig> = {
  idle: {
    state: 'idle',
    expression: 'neutral',
    gazeIntensity: 0.7,
    bodyEnergy: 0.5,
    speechAllowed: false,
  },
  listening: {
    state: 'listening',
    expression: 'smile',
    gazeIntensity: 1.0,
    bodyEnergy: 0.8,
    speechAllowed: false,
  },
  thinking: {
    state: 'thinking',
    expression: 'neutral',
    gazeIntensity: 0.3,
    bodyEnergy: 0.3,
    speechAllowed: false,
  },
  speaking: {
    state: 'speaking',
    expression: 'smile',
    gazeIntensity: 0.9,
    bodyEnergy: 0.9,
    speechAllowed: true,
  },
  greeting: {
    state: 'greeting',
    expression: 'joy',
    gazeIntensity: 1.0,
    bodyEnergy: 1.0,
    speechAllowed: true,
  },
  happy: {
    state: 'happy',
    expression: 'joy',
    gazeIntensity: 0.9,
    bodyEnergy: 0.9,
    speechAllowed: false,
  },
  tired: {
    state: 'tired',
    expression: 'sorrow',
    gazeIntensity: 0.4,
    bodyEnergy: 0.2,
    speechAllowed: false,
  },
};
