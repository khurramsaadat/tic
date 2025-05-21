# Tic-Tac-Toe

A modern, responsive Tic-Tac-Toe game built with Next.js and featuring a sleek UI design.

## Features
- Responsive layout with Navbar and Footer on all pages
- Two Players mode with custom player names
- Score tracking that persists between games
- Keyboard navigation support
- Winning animations and confetti celebration
- Mobile-friendly design with burger menu
- Accessibility features

## Game Modes
- Two Players: Play against a friend locally
- Play with System: Coming soon! (AI opponent)

## Tech Stack
- Next.js 15.3.2
- React 18
- TypeScript
- CSS Modules
- react-confetti

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm (v9 or newer recommended)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/khurramsaadat/tic-tac-toe.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `app/components/` - Reusable components (Navbar, Footer, TestGameBoard, etc.)
- `app/two-players/` - Two Players game mode
- `app/play-with-system/` - AI opponent mode (coming soon)
- `app/instructions/` - Game instructions and rules
- `public/` - Static assets (images, SVGs)

## Deployment
The game is deployed on Netlify. Visit [Live Demo](#) to play!

## License
This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
