// ==================== FILE 4: app/(auth)/register/page.tsx ====================
import { Leaf } from 'lucide-react';
import RegisterForm from '../_components/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register - KacharaAlert',
    description: 'Create your KacharaAlert account to get started with smart waste management',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-4">
            <div className="w-full max-w-2xl animate-fade-in-up">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    {/* Logo and Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-2xl mb-4 shadow-lg">
                            <Leaf className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Join KacharaAlert today</p>
                    </div>

                    <RegisterForm />
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
        </div>
    );
}