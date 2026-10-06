import { CharacterSystem } from '../../character/core/CharacterSystem';
import { runCharacterEngineTests, TestResult } from '../../character/testing/CharacterTests';

export interface StudioApi {
  runTests: () => TestResult[];
  setExpression: (name: string) => void;
  setBehaviour: (name: any) => void;
  resetPose: () => void;
}

export function createStudioApi(system: CharacterSystem | null): StudioApi {
  return {
    runTests: () => runCharacterEngineTests(),
    setExpression: (name: string) => system?.face.setExpression(name),
    setBehaviour: (name: any) => system?.behaviour.setState(name),
    resetPose: () => {
      if (system?.currentModel?.skeleton) {
        system.poseBuffer.restore(system.currentModel.skeleton);
      }
    },
  };
}
