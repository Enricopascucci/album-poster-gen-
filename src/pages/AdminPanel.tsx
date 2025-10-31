/**
 * 🔐 Admin Panel - Manual Order Creation
 *
 * Permette di creare ordini manualmente quando Etsy webhook non funziona.
 * Protetto da password.
 *
 * Updated: 2025-10-31
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
  emailSent?: boolean;
  emailError?: string;
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Admin Panel</h1>
              <p className="text-gray-400 mt-1">Manual Order Management System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-black px-10 py-10 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Create New Order</h2>
            </div>
            <p className="text-gray-400 text-base">
              Generate and send a personalized poster creation link to your customer
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Customer Email
                <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="customer@example.com"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Customer Name
                <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Fracazzz da velletri"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Admin Password
                <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter admin password"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-black text-white font-bold py-5 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Order...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                  Send Email to Customer
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-red-900">Error Occurred</h3>
                    <p className="text-sm text-red-800 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {response && response.success && (
              <div className="space-y-4">
                {/* Main Success Box */}
                <div className="bg-black text-white p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">Order Created Successfully</h3>
                      <p className="text-gray-300 mt-1">{response.message}</p>
                      <div className="mt-4 space-y-2.5 bg-white/10 p-4 rounded-lg border border-white/20">
                        <div className="flex gap-3">
                          <span className="text-gray-400 font-semibold min-w-[90px]">Order ID:</span>
                          <code className="text-white font-mono text-sm">{response.orderId}</code>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-gray-400 font-semibold min-w-[90px]">Token:</span>
                          <code className="text-white font-mono text-sm break-all">{response.token}</code>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-gray-400 font-semibold min-w-[90px]">Email:</span>
                          <span className="text-white font-medium">{response.customerEmail}</span>
                        </div>
                        {response.expiresAt && (
                          <div className="flex gap-3">
                            <span className="text-gray-400 font-semibold min-w-[90px]">Expires:</span>
                            <span className="text-white">{new Date(response.expiresAt).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Status Box */}
                {response.emailSent !== undefined && (
                  <div className={`border-l-4 p-5 rounded-lg ${
                    response.emailSent
                      ? 'bg-green-50 border-green-600'
                      : 'bg-yellow-50 border-yellow-600'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {response.emailSent ? (
                          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${
                          response.emailSent ? 'text-green-900' : 'text-yellow-900'
                        }`}>
                          {response.emailSent ? 'Email Sent Successfully' : 'Email Delivery Failed'}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          response.emailSent ? 'text-green-800' : 'text-yellow-800'
                        }`}>
                          {response.emailSent
                            ? 'The welcome email with the poster creation link has been successfully delivered to the customer.'
                            : 'The order was created successfully, but the email could not be sent. Please send the link manually.'}
                        </p>
                        {response.emailError && (
                          <div className="mt-3 bg-yellow-100 border border-yellow-300 p-3 rounded">
                            <p className="text-sm text-yellow-900">
                              <span className="font-bold">Error Details:</span> {response.emailError}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Info Box */}
          <div className="bg-gray-50 px-10 py-8 border-t border-gray-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-3">How it works</h3>
                <div className="space-y-2">
                  {[
                    'Enter the customer\'s email address',
                    'Optionally add their name for personalization',
                    'Enter your admin password to authorize',
                    'Customer receives an email with their unique creation link',
                    'Link is valid for 30 days and can be used once'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-10 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </main>
    </div>
  );
}
