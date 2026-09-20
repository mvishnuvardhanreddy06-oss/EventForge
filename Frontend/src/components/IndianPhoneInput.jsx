import React, { useState, useEffect } from 'react';
import {
  extractMobileDigits,
  formatMobileDisplay,
  normalizeIndianPhone,
  validateIndianPhone
} from '../utils/phoneUtils';

const IndianPhoneInput = ({
  label = 'Mobile Number',
  value = '',
  onChange,
  required = false,
  error = '',
  placeholder = '98765 43210',
  disabled = false,
  className = '',
  id
}) => {
  const [displayValue, setDisplayValue] = useState(() => formatMobileDisplay(value));
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState('');

  // Synchronize when external value changes
  useEffect(() => {
    setDisplayValue(formatMobileDisplay(value));
  }, [value]);

  const handleInputChange = (e) => {
    const rawInput = e.target.value;
    // Extract only digits, max 10
    const digits = extractMobileDigits(rawInput);
    const formatted = formatMobileDisplay(digits);
    setDisplayValue(formatted);

    // Provide normalized storage value to parent: +919876543210 (no spaces)
    const normalized = digits ? `+91${digits}` : '';
    onChange?.(normalized);

    // Validate on change if already touched
    if (touched) {
      const validation = validateIndianPhone(normalized, required);
      setInternalError(validation.isValid ? '' : validation.error);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const normalized = normalizeIndianPhone(displayValue);
    const validation = validateIndianPhone(normalized, required);
    setInternalError(validation.isValid ? '' : validation.error);
  };

  const activeError = error || internalError;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Visual Input Field with separated +91 Country Code */}
      <div
        className={`flex items-center rounded-xl border bg-white overflow-hidden transition-all ${
          activeError
            ? 'border-rose-400 ring-2 ring-rose-500/10'
            : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20'
        } ${disabled ? 'opacity-60 bg-slate-50 cursor-not-allowed' : ''}`}
      >
        {/* Fixed Non-Editable Country Code */}
        <div className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-700 select-none flex items-center space-x-1 shrink-0">
          <span className="text-[11px]">🇮🇳</span>
          <span>+91</span>
          <span className="text-slate-300 ml-1 font-light">|</span>
        </div>

        {/* 10-digit Mobile Number Field */}
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={11} // 10 digits + 1 space
          className="w-full px-3 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal bg-transparent outline-none"
        />
      </div>

      {activeError && (
        <p className="text-[11px] font-semibold text-rose-500 mt-1">
          {activeError}
        </p>
      )}
    </div>
  );
};

export default IndianPhoneInput;
