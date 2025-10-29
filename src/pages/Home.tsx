/**
 * Home Page - DICE.fm Style (clean version)
 */
import starboyPoster from '../assets/music/starboy_poster.png';

export function Home() {
  const ETSY_SHOP_URL = 'https://www.etsy.com/shop/Moodlabstudios';

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            POSTERGEN
          </h1>
          <a
            href={ETSY_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white text-xs font-bold uppercase tracking-[0.08em] px-6 py-2.5 rounded-full hover:opacity-75 transition-opacity"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            Shop
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-20">
        <section className="bg-white px-6 lg:px-12 py-24 lg:py-32">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Title + Copy */}
            <div>
              <h2
                className="text-[64px] md:text-[96px] lg:text-[128px] font-bold leading-[0.9] tracking-tight mb-10"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
              >
                CUSTOM<br />
                ALBUM<br />
                POSTERS
              </h2>
              <p
                className="text-[18px] md:text-[22px] text-gray-700 max-w-[600px] mb-12 leading-[1.5]"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
              >
                Create high-quality custom posters for your favorite albums.
                Digital delivery, instant download.
              </p>
              <a
                href={ETSY_SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white text-xs font-bold uppercase tracking-[0.08em] px-8 py-3.5 rounded-full hover:opacity-75 transition-opacity"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
              >
                Get Started
              </a>
            </div>

            {/* Right: Sample poster image */}
            <div className="relative">
              <img
                src={starboyPoster}
                alt="Sample album poster"
                className="w-full h-auto rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-gray-200 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-black text-white px-6 lg:px-12 py-24 lg:py-32">
          <div className="max-w-[1400px] mx-auto">
            <h3
              className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500 mb-16"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              What you get
            </h3>
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              <div>
                <h4
                  className="text-[28px] font-bold mb-4 leading-tight"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                >
                  High Quality Prints
                </h4>
                <p
                  className="text-[16px] text-gray-400 leading-relaxed"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                >
                  Professional resolution ready for any frame size.
                </p>
              </div>
              <div>
                <h4
                  className="text-[28px] font-bold mb-4 leading-tight"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                >
                  Full Customization
                </h4>
                <p
                  className="text-[16px] text-gray-400 leading-relaxed"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                >
                  Pick your colors, fonts, and layout options.
                </p>
              </div>
              <div>
                <h4
                  className="text-[28px] font-bold mb-4 leading-tight"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                >
                  Instant Delivery
                </h4>
                <p
                  className="text-[16px] text-gray-400 leading-relaxed"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                >
                  Receive your link via email right after purchase.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="bg-white px-6 lg:px-12 py-24 lg:py-32">
          <div className="max-w-[1400px] mx-auto">
            <h3
              className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500 mb-16"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              How it works
            </h3>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h4
                    className="text-[20px] font-bold mb-2"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                  >
                    Purchase on Etsy
                  </h4>
                  <p
                    className="text-[16px] text-gray-600 leading-relaxed"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                  >
                    Secure payment, instant confirmation.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h4
                    className="text-[20px] font-bold mb-2"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                  >
                    Get Your Link
                  </h4>
                  <p
                    className="text-[16px] text-gray-600 leading-relaxed"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                  >
                    Check your email for your personal creation link.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h4
                    className="text-[20px] font-bold mb-2"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                  >
                    Design Your Poster
                  </h4>
                  <p
                    className="text-[16px] text-gray-600 leading-relaxed"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                  >
                    Search any album and customize every detail.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h4
                    className="text-[20px] font-bold mb-2"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                  >
                    Download & Print
                  </h4>
                  <p
                    className="text-[16px] text-gray-600 leading-relaxed"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                  >
                    One-time HD download. Print anywhere you like.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black text-white px-6 lg:px-12 py-24 lg:py-32">
          <div className="max-w-[900px] mx-auto text-center">
            <h3
              className="text-[48px] md:text-[64px] font-bold mb-6 leading-tight"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
            >
              Ready to get started?
            </h3>
            <p
              className="text-[18px] text-gray-400 mb-10 leading-relaxed"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
            >
              Purchase now and create your custom poster.
            </p>
            <a
              href={ETSY_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-black text-xs font-bold uppercase tracking-[0.08em] px-10 py-3.5 rounded-full hover:opacity-75 transition-opacity"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              Buy Now
            </a>
            <p
              className="text-xs text-gray-600 mt-8"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
            >
              Already purchased? Check your email for your link.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white px-6 lg:px-12 py-8">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <p
            className="text-sm text-gray-500"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
          >
            © 2025 POSTERGEN
          </p>
          <div
            className="flex gap-6 text-sm text-gray-500"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
          >
            <span>Digital Product</span>
            <span>·</span>
            <span>No Refunds</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
