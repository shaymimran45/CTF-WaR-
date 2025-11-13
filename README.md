# CyberCTF - Modern CTF Platform

A sleek, modern Capture The Flag (CTF) platform built with Next.js 15, React 19, and Tailwind CSS.

## Features

- 🎯 **Challenge System** - Browse and solve CTF challenges across multiple categories
- 🏆 **Leaderboard** - Compete with other players and track your ranking
- 👤 **User Profiles** - Track your progress, points, and solved challenges
- 🔐 **Authentication** - Secure login and registration system
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Beautiful gradients and smooth transitions

## Challenge Categories

- **Web Exploitation** - XSS, SQL Injection, CSRF, and more
- **Cryptography** - Break ciphers and encryption algorithms
- **Reverse Engineering** - Analyze and decompile binaries
- **Forensics** - Investigate digital evidence
- **Binary Exploitation (Pwn)** - Buffer overflows and memory corruption
- **Miscellaneous** - Programming, steganography, and more

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd ctf-practice
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ctf-practice/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── challenges/         # Challenges list and detail pages
│   │   ├── leaderboard/        # Leaderboard page
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── profile/            # User profile page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   └── components/             # React components
│       └── Navigation.tsx      # Navigation bar
├── public/                     # Static assets
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Icons**: Emoji-based (no dependencies)

## Future Enhancements

- Database integration (Supabase/PostgreSQL)
- Real-time submissions
- Admin panel for challenge management
- Team competitions
- Write-ups and solutions
- Flag validation system
- Points and scoring system
- Achievement badges

## License

MIT
