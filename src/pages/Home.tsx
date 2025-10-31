/**
 * 🏠 Home Page - Music Poster Generator (Paywall Only)
 *
 * Landing page per vendere poster musicali su Etsy.
 * 100% dietro paywall - nessuna demo gratuita.
 */

export function Home() {
  const ETSY_SHOP_URL = 'https://www.etsy.com/shop/Moodlabstudios';

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            POSTERGEN
          </h1>
          <a
            href={ETSY_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black text-xs font-bold uppercase tracking-[0.08em] px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            Shop on Etsy
          </a>
        </div>
      </header>

      {/* Hero Section with Blurred Background */}
      <main className="pt-20">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/starboy.png)',
              filter: 'blur(40px)',
              transform: 'scale(1.1)'
            }}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70" />

          {/* Content */}
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Text */}
              <div className="text-left">
                <h2
                  className="text-[56px] md:text-[72px] lg:text-[96px] font-bold leading-[0.9] tracking-tight mb-6 text-white"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                >
                  CUSTOM<br />
                  ALBUM<br />
                  POSTERS
                </h2>
                <p
                  className="text-[18px] md:text-[20px] text-gray-300 max-w-[500px] mb-8 leading-[1.6]"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                >
                  Create high-quality custom posters for your favorite albums.
                  Digital delivery, instant download after purchase.
                </p>

                {/* Main CTA */}
                <a
                  href={ETSY_SHOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-black text-base font-bold uppercase tracking-[0.08em] px-12 py-4 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                >
                  Buy Now on Etsy
                </a>
              </div>

              {/* Right: Starboy Poster */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-2xl opacity-30 blur-2xl group-hover:opacity-50 transition-opacity" />
                  <img
                    src="/starboy.png"
                    alt="Starboy poster example"
                    className="relative w-full max-w-[380px] lg:max-w-[480px] rounded-xl shadow-2xl border-4 border-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Poster Gallery */}
        <section className="bg-zinc-900 px-6 lg:px-12 py-24 lg:py-32">
          <div className="max-w-[1400px] mx-auto">
            <h3
              className="text-xs font-bold uppercase tracking-[0.08em] text-gray-400 mb-8 text-center"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              More Examples
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="group relative aspect-[3/4] overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all hover:scale-105 duration-300">
                <img
                  src="/billie.png"
                  alt="Billie Eilish poster example"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all hover:scale-105 duration-300">
                <img
                  src="/taylor.png"
                  alt="Taylor Swift poster example"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all hover:scale-105 duration-300">
                <img
                  src="/amor.png"
                  alt="Poster example"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-zinc-950 text-white px-6 lg:px-12 py-24 lg:py-32">
          <div className="max-w-[1400px] mx-auto">
            <h3
              className="text-xs font-bold uppercase tracking-[0.08em] text-gray-400 mb-16 text-center"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              What you get
            </h3>
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              <div className="text-center lg:text-left">
                <h4
                  className="text-[28px] font-bold mb-4 leading-tight text-white"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                >
                  High Quality Prints
                </h4>
                <p
                  className="text-[16px] text-gray-300 leading-relaxed"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                >
                  Professional 4K resolution ready for any frame size, from phone wallpapers to wall prints.
                </p>
              </div>
              <div className="text-center lg:text-left">
                <h4
                  className="text-[28px] font-bold mb-4 leading-tight text-white"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                >
                  Full Customization
                </h4>
                <p
                  className="text-[16px] text-gray-300 leading-relaxed mb-4"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                >
                  Make it truly yours with complete control over every detail:
                </p>
                <ul
                  className="text-[14px] text-gray-300 space-y-2 leading-relaxed"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                >
                  <li>• Choose from multiple font styles</li>
                  <li>• Customize background colors</li>
                  <li>• Add personal messages or dates</li>
                  <li>• Adjust layouts and spacing</li>
                  <li>• Select color schemes</li>
                </ul>
              </div>
              <div className="text-center lg:text-left">
                <h4
                  className="text-[28px] font-bold mb-4 leading-tight text-white"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                >
                  Instant Delivery
                </h4>
                <p
                  className="text-[16px] text-gray-300 leading-relaxed"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                >
                  Purchase on Etsy and receive your creation link via email within minutes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="bg-black px-6 lg:px-12 py-24 lg:py-32 border-t border-white/10">
          <div className="max-w-[1400px] mx-auto">
            <h3
              className="text-xs font-bold uppercase tracking-[0.08em] text-gray-400 mb-16 text-center"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              How it works
            </h3>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h4
                    className="text-[20px] font-bold mb-2 text-white"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                  >
                    Purchase on Etsy
                  </h4>
                  <p
                    className="text-[16px] text-gray-400 leading-relaxed"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                  >
                    Secure payment through Etsy, instant confirmation.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h4
                    className="text-[20px] font-bold mb-2 text-white"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                  >
                    Get Your Link
                  </h4>
                  <p
                    className="text-[16px] text-gray-400 leading-relaxed"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                  >
                    Check your email for your personal creation link (valid for 30 days).
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h4
                    className="text-[20px] font-bold mb-2 text-white"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                  >
                    Design Your Poster
                  </h4>
                  <p
                    className="text-[16px] text-gray-400 leading-relaxed"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                  >
                    Search for your favorite album and customize every detail online.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h4
                    className="text-[20px] font-bold mb-2 text-white"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                  >
                    Download & Print
                  </h4>
                  <p
                    className="text-[16px] text-gray-400 leading-relaxed"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                  >
                    One-time HD download (4K quality). Print it anywhere you like!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative bg-zinc-950 text-white px-6 lg:px-12 py-24 lg:py-32 overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-blue-950/20" />

          <div className="relative z-10 max-w-[900px] mx-auto text-center">
            <h3
              className="text-[48px] md:text-[64px] font-bold mb-6 leading-tight"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
            >
              Ready to get started?
            </h3>
            <p
              className="text-[18px] text-gray-300 mb-10 leading-relaxed"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
            >
              Purchase now and create your custom album poster.
            </p>
            <a
              href={ETSY_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-black text-base font-bold uppercase tracking-[0.08em] px-12 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              Buy Now on Etsy
            </a>
            <p
              className="text-xs text-gray-500 mt-8"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
            >
              Already purchased? Check your email for your creation link.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black px-6 lg:px-12 py-8 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <p
            className="text-sm text-gray-400"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
          >
            © 2025 POSTERGEN - Custom Album Poster Generator
          </p>
          <div
            className="flex gap-6 text-sm text-gray-400"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
          >
            <span>Digital Product</span>
            <span>·</span>
            <span>No Refunds</span>
            <span>·</span>
            <span>One-Time Download</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
