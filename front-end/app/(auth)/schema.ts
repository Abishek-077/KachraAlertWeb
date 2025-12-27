// ==================== FILE 6: app/(auth)/schema.ts ====================
/**
 * Validation schemas for authentication forms
 * Using Zod for runtime type checking and validation
 */

export interface LoginFormData {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterFormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    society: string;
    building: string;
    apartment: string;
    terms: boolean;
}

// Validation functions
export const validateLoginData = (data: LoginFormData): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = 'Invalid email format';
    }

    if (!data.password) {
        errors.password = 'Password is required';
    } else if (data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export const validateRegisterData = (data: RegisterFormData): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!data.name.trim()) {
        errors.name = 'Name is required';
    }

    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = 'Invalid email format';
    }

    if (!data.phone) {
        errors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(data.phone)) {
        errors.phone = 'Phone must be 10 digits';
    }

    if (!data.password) {
        errors.password = 'Password is required';
    } else if (data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (!data.society.trim()) {
        errors.society = 'Society name is required';
    }

    if (!data.building.trim()) {
        errors.building = 'Building is required';
    }

    if (!data.apartment.trim()) {
        errors.apartment = 'Apartment is required';
    }

    if (!data.terms) {
        errors.terms = 'You must accept the terms and conditions';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};