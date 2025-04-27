# 🎬 BetterStreaming — Unified Torrent-Based Streaming Desktop App

**BetterStreaming** is a Tauri + Next.js desktop application that enables seamless torrent-based streaming from Stremio-compatible sources like [ThePirateBay+](https://stremio-addons.com/thepiratebayplus.html) and [Torrentio](https://torrentio.strem.fun).

🔗 **Magnet-based** playback with auto-selected best quality streams  
🧠 **Smart stream selector**: prioritizes highest peer count & reasonable file size  
📦 Powered by a **Rust-native torrent engine** for true progressive streaming  
🎥 Clean, lightweight UI for browsing, watching, and managing titles  
🖥️ Runs as a secure Tauri desktop app with a local HTTP server for stream delivery

---

## 🚀 Features

- 📚 Browse content from public Stremio addons (PirateBay+, Torrentio)
- 🔥 Auto-play the best available torrent stream (optimized for quality and size)
- 🧲 Magnet link parsing and torrent streaming with no full download required
- 📥 Fully local streaming server (no external APIs after metadata fetch)
- 🖥️ Desktop experience via Tauri (cross-platform support)
- 🎞️ Subtitles support and search filtering
- 👩‍💻 Admin dashboard for managing titles and user accounts

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, TailwindCSS, TypeScript
- **Backend**: Tauri (Rust), Warp (Rust server for streaming)
- **ORM & DB**: Prisma + PostgreSQL
- **Torrent Engine**: `webtorrent-hybrid` CLI (moving to [torrent-rs](https://github.com/Jayceph/torrent-rs))
- **Authentication**: OTP-based registration & secure login system

---

## ⚡ Preview

| Login | Register | Dashboard |
|:----:|:----:|:----:|
| ![Login](./screenshots/Screenshot%202025-04-27%20at%207.27.02 AM.png) | ![Register](./screenshots/Screenshot%202025-04-27%20at%207.27.14 AM.png) | ![Dashboard](./screenshots/Screenshot%202025-04-27%20at%207.27.52 AM.png) |

| Admin Panel | Browse Titles | Search |
|:----:|:----:|:----:|
| ![Admin Panel](./screenshots/Screenshot%202025-04-27%20at%207.28.06 AM.png) | ![Browse Titles](./screenshots/Screenshot%202025-04-27%20at%207.28.42 AM.png) | ![Search](./screenshots/Screenshot%202025-04-27%20at%207.29.08 AM.png) |

| Search Results | Streaming Player |
|:----:|:----:|
| ![Search Results](./screenshots/Screenshot%202025-04-27%20at%207.30.31 AM.png) | ![Streaming](./screenshots/Screenshot%202025-04-27%20at%207.42.04 AM.png) |

---

## ⚠️ Important Disclaimer

BetterStreaming connects to **public torrent ecosystems** for metadata and streams.  
This can include **copyrighted content**.  
This project is intended **solely for educational, personal, and experimental purposes** around decentralized streaming technology.  
**Users are responsible for complying with local copyright laws.**

---

## 📈 Roadmap

- [ ] Full Rust-native progressive streaming (replace WebTorrent CLI)  
- [ ] Metadata fallback from multiple public sources  
- [ ] Dashboard analytics (stream usage, peer metrics)  
- [ ] Multi-user session tracking and control

---

## 📫 Contact

Interested in decentralized streaming? Open-source media projects?  
Feel free to connect and collaborate! 🚀

---

# Tags

`#Nextjs` `#Tauri` `#WebTorrent` `#Rust` `#Prisma` `#PostgreSQL` `#Streaming` `#DecentralizedTech` `#OpenSource` `#SoftwareDevelopment`

---

---

✅ **NOTES**:  
- All images you uploaded are linked correctly assuming you place them inside a `/screenshots/` folder in your repo.  
- If you want, I can give you a **shorter "Project Title + Tagline"** too (for GitHub repo description) like:

> "**BetterStreaming** — A seamless, torrent-based media streaming desktop app powered by Next.js and Rust."

