/**
 * Wake word detection placeholder & web speech integration
 */

export interface WakeWordConfig {
  wakeWord: string;
  enabled: boolean;
  sensitivity: number;
}

export class WakeWordDetector {
  public enabled: boolean = false;
  private onDetectedCb?: () => void;

  constructor(public config: WakeWordConfig = { wakeWord: 'Hey Myraa', enabled: false, sensitivity: 0.7 }) {
    this.enabled = config.enabled;
  }

  public setCallback(cb: () => void): void {
    this.onDetectedCb = cb;
  }

  public start(): void {
    this.enabled = true;
  }

  public stop(): void {
    this.enabled = false;
  }
}
