/**
 * 日志系统
 */
class Logger {
  constructor() {
    this.enabled = true;
    this.level = 'info';
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setLevel(level) {
    this.level = level;
  }

  log(level, message, data = {}) {
    if (!this.enabled) return;

    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    if (levels[level] < levels[this.level]) return;

    const timestamp = new Date().toISOString();
    const logData = { timestamp, level, message, ...data };

    if (level === 'error') {
      console.error(`[${timestamp}] [${level.toUpperCase()}]`, message, data);
    } else if (level === 'warn') {
      console.warn(`[${timestamp}] [${level.toUpperCase()}]`, message, data);
    } else {
      console.log(`[${timestamp}] [${level.toUpperCase()}]`, message, data);
    }

    return logData;
  }

  debug(message, data) {
    return this.log('debug', message, data);
  }

  info(message, data) {
    return this.log('info', message, data);
  }

  warn(message, data) {
    return this.log('warn', message, data);
  }

  error(message, data) {
    return this.log('error', message, data);
  }
}

export const logger = new Logger();
