# 📖 Quran Web Application

A premium, high-fidelity Quran reading application built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. Designed for a smooth, responsive, and professional reading experience with integrated audio support and persistent settings.

**Live Site:** [quran-web-application-i5gk.vercel.app](https://quran-web-application-i5gk.vercel.app)

---

## ✨ Features

- **📖 Complete Quran Reader**: Support for all 114 Surahs, 30 Juz, and 604 Pages.
- **🎧 Audio Playback**: High-quality audio per Ayah and interactive word-by-word audio playback.
- **🎨 Premium UI/UX**: Modern, pixel-perfect design inspired by QuranMazid, featuring a sleek dual-sidebar layout.
- **⚙️ Customizable Settings**:
  - Switch between multiple Arabic fonts (Amiri, Scheherazade).
  - Dynamic font size control for both Arabic and Translation text.
  - Persistent settings via `localStorage`.
- **🌙 Dark Mode**: Fully supported dark theme with curated color palettes for night-time reading.
- **⚡ Performance Optimized**:
  - Instant sidebar navigation using local metadata caching.
  - Efficient rendering with `React.memo` and `useDeferredValue` for search.
  - Static Site Generation (SSG) for all 750+ content pages.
- **📱 Fully Responsive**: Seamless experience across Mobile, Tablet, and Desktop devices.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Sources**:
  - [Al-Quran Cloud API](https://alquran.cloud/api)
  - [Quran.com API](https://quran.com/developers)
  - Local Filesystem Cache for ultra-fast navigation.

---

## 🛠 Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/shuvo794/Quran_Web_Application.git
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Warm up the cache (Optional)**:
   To ensure near-instant loading, run the cache warmup script:

   ```bash
   node scratch/warmup.js
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## ⚡ Performance Optimizations

This project implements advanced performance techniques to ensure a smooth user experience:

- **Persistent Filesystem Cache**: API responses are cached locally to eliminate network latency after the first load.
- **Single-Worker Build**: Configured to generate static pages reliably even under strict API rate limits.
- **Memoized Components**: Prevent unnecessary re-renders in large lists (e.g., Al-Baqarah with 286 Ayahs).
- **Network Resilience**: 30-second timeouts and automatic fallback data for offline reliability.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
