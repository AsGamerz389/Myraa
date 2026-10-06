import { CharacterBehaviourState, BEHAVIOURS, BehaviourConfig } from './behaviours';
import { FaceController } from '../face/FaceController';
import { GazeController } from '../animation/GazeController';

export class BehaviourDirector {
  private currentState: CharacterBehaviourState = 'idle';

  constructor(
    private faceController?: FaceController,
    private gazeController?: GazeController
  ) {}

  public setControllers(face: FaceController, gaze: GazeController): void {
    this.faceController = face;
    this.gazeController = gaze;
  }

  public setState(state: CharacterBehaviourState): void {
    this.currentState = state;
    const config = BEHAVIOURS[state] || BEHAVIOURS.idle;

    if (this.faceController) {
      this.faceController.setExpression(config.expression);
      if (config.speechAllowed) {
        this.faceController.lipSync.startSpeech();
      } else {
        this.faceController.lipSync.stopSpeech();
      }
    }

    if (this.gazeController) {
      this.gazeController.enabled = config.gazeIntensity > 0.1;
    }
  }

  public getState(): CharacterBehaviourState {
    return this.currentState;
  }

  public update(delta: number): void {
    // Optional periodic behaviour transitions
  }
}
