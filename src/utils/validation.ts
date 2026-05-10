export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateEmail = (email: string): ValidationResult => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      isValid: false,
      message: 'Email address is required',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address',
    };
  }

  if (trimmedEmail.length > 254) {
    return {
      isValid: false,
      message: 'Email address is too long',
    };
  }

  return {
    isValid: true,
    message: '',
  };
};

export const validatePassword = (password: string, isSignUp: boolean = false): ValidationResult => {
  if (!password) {
    return {
      isValid: false,
      message: 'Password is required',
    };
  }

  if (isSignUp) {
    if (password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long',
      };
    }

    if (password.length > 72) {
      return {
        isValid: false,
        message: 'Password is too long (max 72 characters)',
      };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strengthChecks = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

    if (strengthChecks < 2) {
      return {
        isValid: false,
        message: 'Password should include at least 2 of: uppercase, lowercase, number, special character',
      };
    }
  } else {
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'Password must be at least 6 characters',
      };
    }
  }

  return {
    isValid: true,
    message: '',
  };
};

export const getPasswordStrength = (password: string): {
  strength: 'weak' | 'fair' | 'good' | 'strong';
  score: number;
  color: string;
} => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  if (score <= 2) {
    return { strength: 'weak', score, color: 'bg-red-500' };
  } else if (score <= 3) {
    return { strength: 'fair', score, color: 'bg-orange-500' };
  } else if (score <= 4) {
    return { strength: 'good', score, color: 'bg-yellow-500' };
  } else {
    return { strength: 'strong', score, color: 'bg-green-500' };
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim();
};
