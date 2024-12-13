import { useCallback, useState } from 'react';

interface ValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

type FormValue = string | number | boolean | File | File[] | null;

export function useFormValidation<T extends Record<string, FormValue>>(
  initialState: T,
  validationRules: Record<keyof T, ValidationRules>
) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const validateField = useCallback(
    (name: keyof T, value: FormValue) => {
      const rules = validationRules[name];
      if (!rules) return '';

      if (rules.required && !value) {
        return 'This field is required';
      }

      if (rules.min !== undefined && Number(value) < rules.min) {
        return `Value must be at least ${rules.min}`;
      }

      if (rules.max !== undefined && Number(value) > rules.max) {
        return `Value must be at most ${rules.max}`;
      }

      if (rules.minLength !== undefined && String(value).length < rules.minLength) {
        return `Must be at least ${rules.minLength} characters`;
      }

      if (rules.maxLength !== undefined && String(value).length > rules.maxLength) {
        return `Must be at most ${rules.maxLength} characters`;
      }

      if (rules.pattern && !rules.pattern.test(String(value))) {
        return 'Invalid format';
      }

      if (rules.custom && !rules.custom(value)) {
        return 'Invalid value';
      }

      return '';
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (name: keyof T, value: FormValue, shouldValidate = true) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      if (shouldValidate) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateField]
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField, values]
  );

  const validateAll = useCallback(() => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    for (const key of Object.keys(validationRules)) {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [validationRules, validateField, values]);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
  }, [initialState]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setValues,
  };
}
