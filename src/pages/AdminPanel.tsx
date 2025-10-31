/**
 * 🔐 Admin Panel - Manual Order Creation
 *
 * Permette di creare ordini manualmente quando Etsy webhook non funziona.
 * Protetto da password.
 */

import { useState } from 'react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby0ZhqZ70fR2N6WgPylTtZqPSJMW3xCW3uPb-7BPdRa8wQ2xSSh1euAo0Ubm9hljXcY/exec';

interface OrderResponse {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
  orderId?: string;
  customerEmail?: string;
  expiresAt?: string;
}

export function AdminPanel() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<OrderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      // Use GET instead of POST to avoid CORS preflight
      const params = new URLSearchParams({
        action: 'manual-order',
        email: email.trim(),
        name: name.trim() || 'Customer',
        password: password
      });

      const res = await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
        method: 'GET',
      });

      const data: OrderResponse = await res.json();

      if (data.success) {
        setResponse(data);
        // Reset form
        setEmail('');
        setName('');
        setPassword('');
      } else {
        setError(data.error || 'Failed to create order');
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">Manual Order Creation</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-gray-800 to-black px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Create Manual Order</h2>
            <p className="text-gray-300 text-sm mt-1">
              Send a poster creation link to a customer manually
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="customer@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Password *
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Order...
                </span>
              ) : (
                'Send Email to Customer'
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {response && response.success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-semibold text-green-800">Success!</h3>
                    <p className="text-sm text-green-700 mt-1">{response.message}</p>
                    <div className="mt-3 space-y-1 text-xs">
                      <p className="text-green-800">
                        <span className="font-semibold">Order ID:</span> {response.orderId}
                      </p>
                      <p className="text-green-800">
                        <span className="font-semibold">Token:</span> <code className="bg-green-100 px-2 py-0.5 rounded">{response.token}</code>
                      </p>
                      <p className="text-green-800">
                        <span className="font-semibold">Email sent to:</span> {response.customerEmail}
                      </p>
                      {response.expiresAt && (
                        <p className="text-green-800">
                          <span className="font-semibold">Expires:</span> {new Date(response.expiresAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Info Box */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">How it works</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. Enter the customer's email address</li>
              <li>2. Optionally add their name for personalization</li>
              <li>3. Enter your admin password</li>
              <li>4. Customer receives email with their unique creation link</li>
              <li>5. Link is valid for 30 days and can be used once</li>
            </ul>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Back to Home
          </a>
        </div>
      </main>
    </div>
  );
}
