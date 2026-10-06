import { CharacterSystem } from '../character/core/CharacterSystem';
import { CharacterBehaviourState } from '../character/behaviour/behaviours';

export class CompanionActor {
  private characterSystem: CharacterSystem | null = null;

  public bindSystem(system: CharacterSystem): void {
    this.characterSystem = system;
  }

  public setBehaviour(state: CharacterBehaviourState): void {
    this.characterSystem?.behaviour.setState(state);
  }

  public triggerTapReaction(): void {
    if (!this.characterSystem) return;
    this.characterSystem.behaviour.setState('happy');
    setTimeout(() => {
      this.characterSystem?.behaviour.setState('idle');
    }, 2500);
  }

  public setExpression(name: string): void {
    this.characterSystem?.face.setExpression(name);
  }
}

export const companionActor = new CompanionActor();
