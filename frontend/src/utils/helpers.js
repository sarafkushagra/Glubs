/**
 * Frontend Utility Functions
 * Common utilities for error handling, validation, and formatting
 */

/**
 * Error Handler
 * Converts API errors to user-friendly messages
 */
export const handleApiError = (error) => {
  if (!error) {
    return 'An unexpected error occurred';
  }

  // Handle different error types
  if (error.status === 400) {
    return error.message || 'Invalid request. Please check your input.';
  }
  if (error.status === 401) {
    return 'Your session has expired. Please log in again.';
  }
  if (error.status === 403) {
    return 'You do not have permission to access this resource.';
  }
  if (error.status === 404) {
    return 'The requested resource was not found.';
  }
  if (error.status === 409) {
    return 'This resource already exists. Please use a different value.';
  }
  if (error.status === 422) {
    return error.message || 'Please check your input and try again.';
  }
  if (error.status === 500 || error.status === 502) {
    return 'Server error. Please try again later.';
  }
  if (error.status === 503) {
    return 'Service temporarily unavailable. Please try again later.';
  }
  if (error.status === 504) {
    return 'Request timeout. Please try again.';
  }

  return error.message || 'An error occurred. Please try again.';
};

/**
 * Form Validation
 * Common validation rules
 */
export const validators = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  password: (password) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  },

  phone: (phone) => {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
  },

  username: (username) => {
    // 3-30 chars, alphanumeric with _, -
    const re = /^[a-zA-Z0-9_-]{3,30}$/;
    return re.test(username);
  },

  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },

  strongPassword: (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
  },

  notEmpty: (value) => value && value.toString().trim().length > 0,

  minLength: (value, length) => value && value.toString().length >= length,

  maxLength: (value, length) => value && value.toString().length <= length,

  match: (value1, value2) => value1 === value2,

  isNumber: (value) => !isNaN(value) && Number(value) === value,

  isPositive: (value) => Number(value) > 0,
};

/**
 * Format Utilities
 */
export const formatters = {
  // Format date to readable string
  date: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Format date and time
  dateTime: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Format time only
  time: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  },

  // Format currency
  currency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  // Format number with commas
  number: (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  },

  // Format file size
  fileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  // Truncate text
  truncate: (text, length = 50) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  },

  // Capitalize first letter
  capitalize: (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  // Title case
  titleCase: (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  // Slug
  slug: (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};

/**
 * Local Storage Utilities
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading from localStorage: ${key}`, e);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing to localStorage: ${key}`, e);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing from localStorage: ${key}`, e);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  },
};

/**
 * Array Utilities
 */
export const arrayUtils = {
  // Remove duplicates from array
  unique: (arr, key = null) => {
    if (key) {
      return [...new Map(arr.map((item) => [item[key], item])).values()];
    }
    return [...new Set(arr)];
  },

  // Group by property
  groupBy: (arr, key) => {
    return arr.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) result[group] = [];
      result[group].push(item);
      return result;
    }, {});
  },

  // Sort by property
  sortBy: (arr, key, order = 'asc') => {
    return [...arr].sort((a, b) => {
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  },

  // Filter unique by property
  filterUnique: (arr, key) => {
    const seen = new Set();
    return arr.filter((item) => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  },

  // Chunk array into smaller arrays
  chunk: (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  // Flatten nested array
  flatten: (arr) => {
    return arr.reduce((flat, toFlatten) => {
      return flat.concat(
        Array.isArray(toFlatten) ? arrayUtils.flatten(toFlatten) : toFlatten
      );
    }, []);
  },
};

/**
 * Object Utilities
 */
export const objectUtils = {
  // Deep clone
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  // Merge objects
  merge: (target, source) => {
    const result = { ...target };
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          result[key] = objectUtils.merge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    return result;
  },

  // Pick specific keys
  pick: (obj, keys) => {
    return keys.reduce((result, key) => {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key];
      }
      return result;
    }, {});
  },

  // Omit specific keys
  omit: (obj, keys) => {
    const result = { ...obj };
    keys.forEach((key) => delete result[key]);
    return result;
  },
};

/**
 * URL Utilities
 */
export const urlUtils = {
  // Get query parameters
  getParams: () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  // Get specific param
  getParam: (key) => {
    return new URLSearchParams(window.location.search).get(key);
  },

  // Build query string
  buildQuery: (obj) => {
    const params = new URLSearchParams();
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    return params.toString();
  },
};

export default {
  handleApiError,
  validators,
  formatters,
  storage,
  arrayUtils,
  objectUtils,
  urlUtils,
};
