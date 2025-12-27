// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg"></div>
          <span className="text-xl font-bold text-gray-900">KacharaAlert</span>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 text-gray-700 hover:text-teal-600"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Smart Waste Management for <span className="text-teal-600">Modern Societies</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Streamline waste collection, track disposal, and create cleaner living spaces
          with our comprehensive waste management platform.
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            href="/register"
            className="px-8 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 border border-teal-500 text-teal-500 rounded-lg font-medium hover:bg-teal-50 transition"
          >
            Learn More
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose KacharaAlert?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🗑️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Scheduling</h3>
              <p className="text-gray-600">Automated waste collection schedules tailored to your society's needs.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Tracking</h3>
              <p className="text-gray-600">Monitor waste collection status and receive notifications.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics & Reports</h3>
              <p className="text-gray-600">Detailed waste management reports and environmental impact analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">&copy; 2024 KacharaAlert. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <Link href="/about" className="hover:text-teal-400">About</Link>
            <Link href="/privacy" className="hover:text-teal-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-teal-400">Terms of Service</Link>
            <Link href="/contact" className="hover:text-teal-400">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}