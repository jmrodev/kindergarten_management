// utils/dateUtils.js
class DateUtils {
  // Parse date string to ensure consistent format
  static parseDate(dateString) {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date;
    } catch (error) {
      throw new Error(`Invalid date format: ${dateString}`);
    }
  }

  // Format date to YYYY-MM-DD
  static formatDate(date) {
    if (!date) return null;
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  // Format date to DD/MM/YYYY
  static formatDateDMY(date) {
    if (!date) return null;
    
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  // Get age from birth date
  static getAgeFromBirthDate(birthDate) {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  // Get age in months from birth date
  static getAgeInMonthsFromBirthDate(birthDate) {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    
    const yearDiff = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
    
    let totalMonths = yearDiff * 12 + monthDiff;
    
    // Adjust if the day of the month hasn't been reached yet
    if (dayDiff < 0) {
      totalMonths--;
    }
    
    return totalMonths;
  }

  // Add days to a date
  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // Check if date is in the past
  static isPastDate(date) {
    const currentDate = new Date();
    const checkDate = new Date(date);
    return checkDate < currentDate;
  }

  // Check if date is in the future
  static isFutureDate(date) {
    const currentDate = new Date();
    const checkDate = new Date(date);
    return checkDate > currentDate;
  }

  // Get first day of month
  static getFirstDayOfMonth(year, month) {
    return new Date(year, month - 1, 1);
  }

  // Get last day of month
  static getLastDayOfMonth(year, month) {
    return new Date(year, month, 0);
  }

  // Get number of days in a month
  static getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  // Format time to HH:MM:SS
  static formatTime(date) {
    if (!date) return null;
    
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  }

  // Format time to HH:MM
  static formatTimeHM(date) {
    if (!date) return null;
    
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }
}

module.exports = DateUtils;