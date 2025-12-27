// app/(auth)/layout.tsx - CORRECTED VERSION
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'KachraAlert - Waste Management',
    description: 'Efficient waste management system for societies',
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // REMOVED <html> and <body> tags here
        <div className={`${inter.className} bg-gray-50 min-h-screen`}>
            {children}
            <h5>this include all the childrens </h5>
        </div>
    );
}