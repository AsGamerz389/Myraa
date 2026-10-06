export interface PerformanceStats {
  fps: number;
  frameTimeMs: number;
  memoryMb?: number;
  dropRate: number;
}

export class PerformanceController {
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 60;
  private frameTimeMs: number = 16.6;

  public tick(): PerformanceStats {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameTimeMs = Math.round(elapsed / this.frameCount * 10) / 10;
      this.frameCount = 0;
      this.lastTime = now;
    }

    const memoryMb = (performance as any).memory
      ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
      : undefined;

    return {
      fps: this.fps,
      frameTimeMs: this.frameTimeMs,
      memoryMb,
      dropRate: this.fps < 30 ? (30 - this.fps) / 30 : 0,
    };
  }

  public getFps(): number {
    return this.fps;
  }
}
