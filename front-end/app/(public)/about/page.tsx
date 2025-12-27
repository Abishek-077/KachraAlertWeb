// app/(public)/about/page.tsx
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
            {/* Navigation */}
            <nav className="px-6 py-4 flex justify-between items-center border-b">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg"></div>
                    <span className="text-xl font-bold text-gray-900">KacharaAlert</span>
                </Link>
                <div className="flex space-x-4">
                    <Link href="/" className="px-4 py-2 text-gray-700 hover:text-teal-600">
                        Home
                    </Link>
                    <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-teal-600">
                        Login
                    </Link>
                    <Link href="/register" className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* About Content */}
            <main className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">About KacharaAlert</h1>

                <div className="space-y-8">
                    <section className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            KacharaAlert was founded with a simple yet powerful mission: to revolutionize
                            waste management in residential societies through technology. We believe that
                            efficient waste management is crucial for sustainable urban living.
                        </p>
                    </section>

                    <section className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Do</h2>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start">
                                <span className="text-teal-500 mr-2">✓</span>
                                <span>Automated waste collection scheduling and tracking</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-teal-500 mr-2">✓</span>
                                <span>Real-time notifications for residents and staff</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-teal-500 mr-2">✓</span>
                                <span>Waste segregation monitoring and reporting</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-teal-500 mr-2">✓</span>
                                <span>Environmental impact analytics and insights</span>
                            </li>
                        </ul>
                    </section>

                    <section className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
                        <p className="text-gray-600 mb-6">
                            We are a team of passionate environmentalists, technologists, and urban planners
                            dedicated to creating cleaner, smarter cities.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl">👨‍💻</span>
                                </div>
                                <h3 className="font-semibold">Tech Innovation</h3>
                            </div>
                            <div className="text-center">
                                <div className="w-24 h-24 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl">🌱</span>
                                </div>
                                <h3 className="font-semibold">Environmental Focus</h3>
                            </div>
                            <div className="text-center">
                                <div className="w-24 h-24 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl">🏙️</span>
                                </div>
                                <h3 className="font-semibold">Urban Solutions</h3>
                            </div>
                        </div>
                    </section>

                    <div className="text-center pt-8">
                        <Link
                            href="/register"
                            className="inline-block px-8 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition"
                        >
                            Join Us Today
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <p className="mb-4">&copy; 2024 KacharaAlert. All rights reserved.</p>
                    <div className="flex justify-center space-x-6">
                        <Link href="/" className="hover:text-teal-400">Home</Link>
                        <Link href="/about" className="hover:text-teal-400">About</Link>
                        <Link href="/contact" className="hover:text-teal-400">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}