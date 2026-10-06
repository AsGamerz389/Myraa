import { MorphController } from './MorphController';

export interface VowelWeights {
  aa: number; // あ
  ih: number; // い
  ou: number; // う
  ee: number; // え
  oh: number; // お
}

export class LipSync {
  private morphController: MorphController | null = null;
  private isSpeaking: boolean = false;
  private speakingTime: number = 0;
  private audioAnalyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  public setMorphController(controller: MorphController): void {
    this.morphController = controller;
  }

  public setAudioAnalyser(analyser: AnalyserNode): void {
    this.audioAnalyser = analyser;
    this.dataArray = new Uint8Array(analyser.frequencyBinCount);
  }

  public startSpeech(): void {
    this.isSpeaking = true;
    this.speakingTime = 0;
  }

  public stopSpeech(): void {
    this.isSpeaking = false;
    if (this.morphController) {
      this.morphController.setWeight('あ', 0);
      this.morphController.setWeight('い', 0);
      this.morphController.setWeight('う', 0);
      this.morphController.setWeight('え', 0);
      this.morphController.setWeight('お', 0);
    }
  }

  public update(delta: number): void {
    if (!this.morphController) return;

    if (this.audioAnalyser && this.dataArray) {
      this.audioAnalyser.getByteFrequencyData(this.dataArray as any);
      let sum = 0;
      for (let i = 0; i < 32; i++) {
        sum += this.dataArray[i];
      }
      const volume = Math.min(1.0, (sum / 32) / 128);

      if (volume > 0.05) {
        this.morphController.setWeight('あ', volume * 0.9);
        this.morphController.setWeight('お', volume * 0.4);
      } else {
        this.morphController.setWeight('あ', 0);
        this.morphController.setWeight('お', 0);
      }
      return;
    }

    if (this.isSpeaking) {
      this.speakingTime += delta;
      // Procedural natural speech vowel oscillation
      const v = Math.abs(Math.sin(this.speakingTime * 9.0)) * 0.7;
      const v2 = Math.abs(Math.cos(this.speakingTime * 6.0)) * 0.4;
      this.morphController.setWeight('あ', v);
      this.morphController.setWeight('い', v2 * 0.5);
    }
  }
}
