/**
 * Indian Phone Number Utility Functions
 * Enforces +91 country code and 10-digit mobile number format: +91 98765 43210
 * Stored normalized value: +919876543210
 */

/**
 * Strips all non-digit characters from string.
 * If begins with 91 and has 12 digits total, extracts the 10 mobile digits.
 */
export const extractMobileDigits = (val) => {
  if (!val) return '';
  const digits = String(val).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  return digits.slice(0, 10);
};

/**
 * Formats mobile digits with space after 5 digits: 98765 43210
 */
export const formatMobileDisplay = (val) => {
  const digits = extractMobileDigits(val);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
};

/**
 * Full display format with +91: +91 98765 43210
 */
export const formatIndianPhone = (val) => {
  if (!val) return '';
  const digits = extractMobileDigits(val);
  if (!digits) return '';
  if (digits.length <= 5) return `+91 ${digits}`;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
};

/**
 * Normalizes to standard database storage format: +919876543210 (no spaces)
 */
export const normalizeIndianPhone = (val) => {
  const digits = extractMobileDigits(val);
  if (!digits) return '';
  return `+91${digits}`;
};

/**
 * Validates Indian mobile number.
 * Exactly 10 digits required after +91.
 */
export const validateIndianPhone = (val, isRequired = true) => {
  if (!val || !String(val).trim()) {
    if (isRequired) {
      return { isValid: false, error: 'Mobile number is required.' };
    }
    return { isValid: true, error: '' };
  }

  // Check if someone tried to paste an international number like +1, +44, +61
  const str = String(val).trim();
  if (str.startsWith('+') && !str.startsWith('+91')) {
    return { isValid: false, error: 'Enter a valid 10-digit Indian mobile number.' };
  }

  const digits = extractMobileDigits(val);
  if (digits.length !== 10) {
    return { isValid: false, error: 'Enter a valid 10-digit Indian mobile number.' };
  }

  return { isValid: true, error: '' };
};
