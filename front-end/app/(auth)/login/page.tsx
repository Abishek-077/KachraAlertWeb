// app/(auth)/login/page.tsx
import { Leaf } from 'lucide-react';
import LoginForm from '../_components/LoginForm'; // Note: using _components
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login - KacharaAlert',
    description: 'Sign in to your KacharaAlert account for smart waste management',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-4">
            <div className="w-full max-w-md animate-[fadeInUp_0.6s_ease-out]">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    {/* Logo and Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-2xl mb-4 shadow-lg">
                            <Leaf className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">KacharaAlert</h1>
                        <p className="text-gray-600">Smart Waste Management</p>
                    </div>

                    <LoginForm />
                </div>
            </div>
        </div>
    );
}