// ==================== FILE 2: app/(auth)/components/RegisterForm.tsx ====================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        society: '',
        building: '',
        apartment: '',
        terms: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const passwordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email formating';
        }
        if (!formData.phone) {
            newErrors.phone = 'Phone is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone must be 10 digits';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.society) newErrors.society = 'Society is required';
        if (!formData.building.trim()) newErrors.building = 'Building is required';
        if (!formData.apartment.trim()) newErrors.apartment = 'Apartment number is required';
        if (!formData.terms) newErrors.terms = 'You must accept the terms';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep2()) return;

        setLoading(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Store auth data
            if (typeof window !== 'undefined') {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userName', formData.name);
                localStorage.setItem('userEmail', formData.email);
            }

            // Success - redirect to dashboard
            alert('Account created successfully!');
            router.push('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const strength = passwordStrength(formData.password);
    const strengthColors = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'];
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

    return (
        <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center">
                <div className="flex items-center">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        1
                    </div>
                    <div
                        className={`w-20 h-1 mx-2 transition-all ${currentStep >= 2 ? 'bg-teal-500' : 'bg-gray-200'}`}
                    ></div>
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        2
                    </div>
                </div>
            </div>

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                if (errors.name) setErrors({ ...errors, name: '' });
                            }}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                } focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition`}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors({ ...errors, email: '' });
                            }}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                } focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition`}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="1234567890"
                            value={formData.phone}
                            onChange={(e) => {
                                setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') });
                                if (errors.phone) setErrors({ ...errors, phone: '' });
                            }}
                            maxLength={10}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                } focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition`}
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    if (errors.password) setErrors({ ...errors, password: '' });
                                }}
                                className={`w-full px-4 py-3 pr-12 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

                        {/* Password Strength Meter */}
                        {formData.password && (
                            <div className="space-y-2">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-colors ${level <= strength ? strengthColors[strength - 1] : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-600">
                                    Strength: {strength > 0 ? strengthLabels[strength - 1] : 'None'}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleNext}
                        className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        Next Step
                    </button>
                </div>
            )}

            {/* Step 2: Address Info */}
            {currentStep === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <label htmlFor="society" className="block text-sm font-semibold text-gray-700">
                            Society/Complex
                        </label>
                        <select
                            id="society"
                            value={formData.society}
                            onChange={(e) => {
                                setFormData({ ...formData, society: e.target.value });
                                if (errors.society) setErrors({ ...errors, society: '' });
                            }}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.society ? 'border-red-500' : 'border-gray-300'
                                } focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-white`}
                        >
                            <option value="">Select your society</option>
                            <option value="greenview">Greenview Apartments</option>
                            <option value="sunnydale">Sunnydale Complex</option>
                            <option value="riverside">Riverside Residency</option>
                            <option value="skyline">Skyline Towers</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.society && <p className="text-sm text-red-500">{errors.society}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="building" className="block text-sm font-semibold text-gray-700">
                                Building/Tower
                            </label>
                            <input
                                id="building"
                                placeholder="A, B, C..."
                                value={formData.building}
                                onChange={(e) => {
                                    setFormData({ ...formData, building: e.target.value });
                                    if (errors.building) setErrors({ ...errors, building: '' });
                                }}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.building ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition`}
                            />
                            {errors.building && <p className="text-sm text-red-500">{errors.building}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="apartment" className="block text-sm font-semibold text-gray-700">
                                Apartment No.
                            </label>
                            <input
                                id="apartment"
                                placeholder="101, 202..."
                                value={formData.apartment}
                                onChange={(e) => {
                                    setFormData({ ...formData, apartment: e.target.value });
                                    if (errors.apartment) setErrors({ ...errors, apartment: '' });
                                }}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.apartment ? 'border-red-500' : 'border-gray-300'
                                    } focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition`}
                            />
                            {errors.apartment && <p className="text-sm text-red-500">{errors.apartment}</p>}
                        </div>
                    </div>

                    <div className="flex items-start space-x-2">
                        <input
                            id="terms"
                            type="checkbox"
                            checked={formData.terms}
                            onChange={(e) => {
                                setFormData({ ...formData, terms: e.target.checked });
                                if (errors.terms) setErrors({ ...errors, terms: '' });
                            }}
                            className={`w-4 h-4 mt-1 rounded border-gray-300 text-teal-500 focus:ring-teal-500 cursor-pointer ${errors.terms ? 'border-red-500' : ''
                                }`}
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                            I agree to the{' '}
                            <Link href="/terms" className="text-teal-600 hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-teal-600 hover:underline">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>
                    {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="flex-1 py-3 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            )}

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                    href="/login"
                    className="text-teal-600 hover:text-teal-700 hover:underline font-semibold"
                >
                    Sign In
                </Link>
            </p>

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}
