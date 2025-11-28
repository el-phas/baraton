/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitize user input by removing potentially harmful characters
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .slice(0, 1000); // Limit length
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (basic validation)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

/**
 * Generate secure reference ID for payments
 */
export const generateSecureReference = (prefix: string = ''): string => {
  const timestamp = Date.now().toString();
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomPart}`.toUpperCase();
};

/**
 * Validate amount is within acceptable range
 */
export const validateAmount = (amount: number, min: number = 100, max: number = 10000000): boolean => {
  return amount >= min && amount <= max && Number.isInteger(amount);
};