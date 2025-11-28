
// Security utilities for input validation and sanitization

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePhone = (phone: string): boolean => {
  // Kenyan phone number validation (basic)
  const phoneRegex = /^(?:\+254|0)?[7][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateAmount = (amount: number): boolean => {
  return amount >= 100 && amount <= 10000000 && Number.isInteger(amount);
};

export const validateGuestCount = (guests: number, maxCapacity: number): boolean => {
  return guests >= 1 && guests <= maxCapacity && Number.isInteger(guests);
};

export const validateDateRange = (checkIn: string, checkOut: string): boolean => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return checkInDate >= today && checkOutDate > checkInDate;
};
