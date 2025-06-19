✅ Step-by-Step Setup

🚀 Getting Started

First, install the dependencies:

npm install
# or
npm install deep --legacy-peer-deps
# or
yarn install


Create a .env.local file in the root directory and add the following:

JWT_SECRET_KEY=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

Then, run the development server:

npm run dev
# or
yarn dev

🛠️ Scripts

dev – runs the development server
build – builds the app for production
start – starts the production server
lint – runs ESLint


📦 Tech Stack

Framework: Next.js
Language: JavaScript/TypeScript
Styling: Tailwind CSS / SCSS / CSS Modules (customize as needed)
Deployment: Vercel / Netlify / Custom server

📁 Folder Structure

├── app/          # App routes
├── public/         # Static assets
├── styles/         # CSS/SCSS files
├── components/     # Reusable components
├── lib/            # Utilities (optional)
└── README.md
