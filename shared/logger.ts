export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  child(tag: string): Logger;
}

class ConsoleLogger implements Logger {
  constructor(private prefix: string = 'MYRAA') {}

  debug(...args: any[]): void {
    console.debug(`[${this.prefix}]`, ...args);
  }

  info(...args: any[]): void {
    console.info(`[${this.prefix}]`, ...args);
  }

  warn(...args: any[]): void {
    console.warn(`[${this.prefix}]`, ...args);
  }

  error(...args: any[]): void {
    console.error(`[${this.prefix}]`, ...args);
  }

  child(tag: string): Logger {
    return new ConsoleLogger(`${this.prefix}:${tag}`);
  }
}

export const logger: Logger = new ConsoleLogger();
export function createLogger(tag: string): Logger {
  return new ConsoleLogger(tag);
}
