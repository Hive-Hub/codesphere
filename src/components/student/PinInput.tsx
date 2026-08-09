import React, { useRef, useEffect } from 'react';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({
  value,
  onChange,
  onComplete,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split string into array of 6 digits
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    if (!/^\d*$/.test(inputVal)) return;

    const newDigits = [...digits];
    // Keep last typed char if typing multiple
    newDigits[index] = inputVal.slice(-1);
    const combined = newDigits.join('');
    onChange(combined);

    // Auto-focus next input if typed a digit
    if (inputVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (combined.length === 6 && onComplete) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const numericData = pastedData.replace(/\D/g, '').slice(0, 6);

    if (numericData) {
      onChange(numericData);
      if (numericData.length === 6 && onComplete) {
        onComplete(numericData);
      }
      const focusIndex = Math.min(numericData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className="w-11 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold font-mono bg-surface-card border-2 border-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-white outline-none transition-all shadow-inner disabled:opacity-50"
        />
      ))}
    </div>
  );
};
