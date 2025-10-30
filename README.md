# 🎵 Album Poster Generator

**[Mood Lab Studios](https://moodlabstudio.com)** - Create beautiful, customizable posters from your favorite albums.

## ✨ Features

- 🎨 **Fully Customizable** - Colors, backgrounds, fonts, layouts, frames
- 📊 **Track List with Waveforms** - Visual representation of your music
- 🖼️ **Multiple Layout Options** - 60/40 or 50/50 split layouts
- 🎭 **Frame Styles** - None, Thin, or Gallery frame
- 🌈 **Background Themes** - White, Beige, Black, Blur, or Custom color
- 💾 **High Resolution Export** - 4K quality PNG download
- 🔒 **Secure Token System** - One-time download per purchase
- 📧 **Automated Email Delivery** - Instant access link delivery
- 🛍️ **Etsy Integration** - Seamless payment processing

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Google Apps Script + Google Sheets
- **Payment**: Etsy
- **Deployment**: Vercel
- **APIs**: Spotify Web API

## 📦 Setup

### Prerequisites

- Node.js 18+
- Spotify Developer Account ([Get credentials](https://developer.spotify.com/dashboard))
- Google Account (for Apps Script)
- Etsy Shop (for payments)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/album-poster-generator.git
cd album-poster-generator
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
cp .env.example .env
# Edit .env and add your Spotify credentials
```

4. **Start development server**:
```bash
npm run dev
```

## ⚙️ Configuration

### 1. Google Sheets Backend

Follow the guide: [SETUP_GOOGLE_SHEETS.md](SETUP_GOOGLE_SHEETS.md)

### 2. Etsy Integration

Follow the guide: [SETUP_ETSY_WEBHOOK.md](SETUP_ETSY_WEBHOOK.md)

## 🏗️ Build & Deploy

### Build for production:
```bash
npm run build
```

### Deploy to Vercel:
1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

## 🎨 Customization Options

- **Backgrounds**: White, Beige, Black, Blur effect, Custom color
- **Fonts**: Inter, Playfair Display, Bebas Neue, Roboto Mono, Space Grotesk
- **Layouts**: 60/40 split or 50/50 split
- **Frames**: None, Thin border, Gallery frame
- **Border Radius**: Adjustable corner roundness
- **Custom Tagline**: Add personalized text
- **Toggle Elements**: Duration, copyright, waveform display

## 📧 Support

For support and inquiries:
- Email: [moodlabstudios@gmail.com](mailto:moodlabstudios@gmail.com)
- Website: [moodlabstudio.com](https://moodlabstudio.com)

## 📄 License

© 2025 Mood Lab Studios - All rights reserved

---

Made with ❤️ by Mood Lab Studios
