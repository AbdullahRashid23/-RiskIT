# !RiskIT Intelligence Platform

A discrete mathematics-powered financial intelligence platform using React and Google Gemini AI.

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

For local development (optional):
```bash
cp .env.example .env.local
# Edit .env.local and add your API key
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🌐 Deploy to Vercel

### Step 1: Prepare Your Repository
```
your-repo/
├── api/
│   └── intelligence.js    ← Serverless function
├── src/
│   ├── App.jsx           ← Main React component
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .gitignore
```

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `gen-lang-client-0868386615`
6. Click "Deploy"

## 🔒 Security

- ✅ API key is stored securely in Vercel environment variables
- ✅ API calls are proxied through serverless function
- ✅ No sensitive data in frontend code
- ✅ CORS properly configured

## 📦 Features

### Portfolio Architect
Generate AI-powered investment recommendations based on:
- Investment amount
- Market sector
- Time horizon
- Halal/Sharia compliance

### Binary Comparator
Head-to-head comparison of two financial assets with:
- Detailed scorecard metrics
- Binary decision logic
- Visual comparisons

### Deep Pathfinder
Deep analysis of individual assets including:
- Historical event timeline
- Future path predictions
- Node health metrics
- Critical dependencies

### Market Pulse
Real-time market event feed with logic state changes.

## 🛠 Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI:** Google Gemini 2.5 Flash
- **Deployment:** Vercel (Serverless Functions)

## 📄 License

MIT License - Feel free to use and modify!
