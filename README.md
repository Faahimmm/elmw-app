# ELMW App

A modern React-based web application built with Vite. ELMW App provides a streamlined interface for managing enrollment, audit history, settings, and user authentication.

## Features

- 🔐 **Authentication** – Secure login/auth screen with biometric fingerprint simulation + 6-digit PIN
- 📊 **Dashboard** – Overview with door lock toggle, LED brightness control, ventilation motor control, and live audit streaming
- 📋 **Enrollment** – 4-step wizard: user details → biometric scan → credential verify → PIN assignment
- 🕵️ **Audit History** – Real-time access event logging with filtering and action menus
- ⚙️ **Settings** – Wi-Fi SSID, baud rate, auto-lock, failed attempt limits, and firmware info

## Tech Stack

- **React 19** – UI framework
- **Vite 8** – Lightning-fast build tool & dev server
- **Lucide React** – Beautiful icon library
- **Vanilla CSS** – Custom design system with glassmorphism & animations

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Faahimmm/elmw-app.git
cd elmw-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Access

1. Click **SIMULATE BIOMETRIC INPUT** on the fingerprint screen
2. Enter PIN **`123456`** on the keypad

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |

## Project Structure

```
elmw-app/
├── public/           # Static assets
├── src/
│   ├── screens/      # Page-level components
│   │   ├── AuthScreen.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Enrollment.jsx
│   │   ├── AuditHistory.jsx
│   │   └── Settings.jsx
│   ├── App.jsx       # Root component & routing
│   ├── App.css       # Component styles
│   ├── index.css     # Global design system
│   └── main.jsx      # App entry point
├── index.html
├── vite.config.js
└── package.json
```

## License

MIT
