### 🎬 BetterStreaming — Unified Torrent-Based Streaming Desktop App

BetterStreaming is a Tauri + Next.js desktop application that enables seamless torrent-based streaming from Stremio-compatible sources like [ThePirateBay+](https://stremio-addons.com/thepiratebayplus.html) and [Torrentio](https://torrentio.strem.fun).

🔗 **Magnet-based** playback with auto-selected best quality streams  
🧠 **Smart stream selector**: prioritizes highest peer count & reasonable file size  
📦 Powered by a **Rust-native torrent engine** for true progressive streaming  
🎥 Clean, lightweight UI for browsing, watching, and managing titles  
🖥️ Runs as a secure Tauri desktop app with local HTTP server for stream delivery

---

### 🚀 Features

- Browse content from public Stremio addons (e.g. TPB+, Torrentio)
- Auto-play the best torrent stream (under 5GB, max peers)
- Native torrent downloading via `webtorrent` CLI or Rust backend
- Stream video directly inside the Tauri desktop app
- Fully local, no user data collected

---

### 🛠️ Tech Stack

- **Frontend**: Next.js, TailwindCSS, TypeScript  
- **Backend**: Rust (Tauri), Warp for local streaming  
- **Torrent Engine**: `webtorrent` CLI (Node) or [torrent-rs](https://github.com/Jayceph/torrent-rs)

---

### 🧪 In Progress

- Switch from WebTorrent CLI → Rust-native progressive torrent client  
- UI/UX polish & dashboard analytics for stream usage  
- Admin tools for session tracking, account management  
- Multi-service metadata integration  

---

Let me know if you want a shorter version for the README title or description box!