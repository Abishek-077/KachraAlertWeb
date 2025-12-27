// ==================== FILE 5: app/(auth)/layout.tsx ====================
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Authentication - KacharaAlert',
    description: 'Login or register for KacharaAlert',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="auth-layout">
            {children}
        </div>
    );
}