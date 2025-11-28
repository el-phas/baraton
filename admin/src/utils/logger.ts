/**
 * Production-ready logging utility
 * Replaces console.log statements for better logging in production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private isDev = import.meta.env.DEV;

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const logEntry = this.formatMessage(level, message, data);
    
    if (this.isDev) {
      // In development, use console methods with proper formatting
      const logMethod = level === 'error' ? console.error : 
                       level === 'warn' ? console.warn : 
                       level === 'debug' ? console.debug : console.log;
      
      logMethod(`[${level.toUpperCase()}] ${message}`, data || '');
    } else {
      // In production, could send to external logging service
      // For now, we'll use console with structured logging
      console.log(JSON.stringify(logEntry));
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }
}

export const logger = new Logger();