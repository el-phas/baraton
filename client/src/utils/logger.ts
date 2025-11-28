const isDevelopment = import.meta.env.DEV;

export const logger = {
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
  },
  
  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error || '');
    }
    // In production, you might want to send errors to a logging service
  },
  
  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }
};