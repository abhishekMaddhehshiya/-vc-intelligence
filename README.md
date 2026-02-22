# VC Intelligence

A premium full-stack VC discovery and company intelligence platform. Discover, analyze, and track venture-backed companies with AI-powered enrichment.

![VC Intelligence](https://via.placeholder.com/1200x600/4f46e5/ffffff?text=VC+Intelligence)

## Features

### Company Discovery
- 🔍 **Advanced Search** - Search companies by name, description, or tags
- 🏷️ **Smart Filters** - Filter by industry and location
- 📊 **Sortable Table** - Sort by any column with pagination
- 📱 **Responsive Design** - Works seamlessly on all devices

### AI-Powered Enrichment
- 🤖 **Automated Analysis** - One-click company enrichment
- 📝 **Structured Data** - Summary, what they do, keywords, signals
- 🔗 **Source Attribution** - Clickable sources with timestamps
- 🔄 **Re-run Capability** - Fresh data on demand

### Organization Tools
- 📋 **Custom Lists** - Create and manage company lists
- 📤 **Export Data** - Export to CSV or JSON
- 🔖 **Saved Searches** - Save and re-run search queries
- 📝 **Notes** - Add notes to any company

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Lucide Icons** - Icons
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Cheerio** - Web scraping
- **Google Gemini** - LLM integration
- **Helmet** - Security headers
- **CORS** - Cross-origin support
- **Express Rate Limit** - API protection

## Architecture

```
vc-intelligence/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities (storage, API)
│   │   ├── data/            # Mock data
│   │   └── hooks/           # Custom React hooks
│   └── ...config files
│
└── server/                   # Node.js backend
    ├── src/
    │   ├── controllers/     # Request handlers
    │   ├── routes/          # API routes
    │   ├── services/        # Business logic (scraper, LLM)
    │   ├── types/           # TypeScript types
    │   └── utils/           # Helper functions
    └── ...config files
```

## Data Flow

```
User clicks "Enrich" → Frontend sends POST /api/enrich
                             ↓
               Backend validates URL
                             ↓
               Scraper fetches website HTML
                             ↓
               Cheerio extracts text content
                             ↓
               OpenAI analyzes and structures data
                             ↓
               Backend returns enrichment JSON
                             ↓
               Frontend caches in localStorage
                             ↓
               UI displays enriched data
```

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Gemini API key (optional, uses mock data without it)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/vc-intelligence.git
cd vc-intelligence
```

2. **Install frontend dependencies**
```bash
cd client
npm install
```

3. **Install backend dependencies**
```bash
cd ../server
npm install
```

4. **Configure environment variables**
```bash
# In server directory
cp .env.example .env
# Edit .env and add your Gemini API key
```

### Environment Variables

#### Server (.env)
```env
# Server Port
PORT=3001

# Environment
NODE_ENV=development

# Gemini API Key (Get from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your-gemini-api-key-here

# CORS Origin
CORS_ORIGIN=http://localhost:5173
```

### Running Locally

1. **Start the backend server**
```bash
cd server
npm run dev
```
Server runs on http://localhost:3001

2. **Start the frontend (new terminal)**
```bash
cd client
npm run dev
```
Frontend runs on http://localhost:5173

3. **Open your browser**
Navigate to http://localhost:5173

## API Reference

### POST /api/enrich

Enrich a company based on their website URL.

**Request:**
```json
{
  "url": "https://stripe.com"
}
```

**Response:**
```json
{
  "summary": "Stripe is a technology company that builds economic infrastructure for the internet.",
  "whatTheyDo": [
    "Provides payment processing APIs for businesses",
    "Offers billing and subscription management",
    "Enables marketplace and platform payments"
  ],
  "keywords": ["fintech", "payments", "api", "infrastructure"],
  "signals": [
    "Strong developer ecosystem",
    "Expanding globally",
    "Active in enterprise market"
  ],
  "sources": [
    {
      "url": "https://stripe.com",
      "timestamp": "2024-02-15T10:30:00.000Z"
    }
  ]
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL

### Backend (Render/Railway)

1. Push your code to GitHub
2. Create new Web Service
3. Configure:
   - Build Command: `cd server && npm install && npm run build`
   - Start Command: `cd server && npm start`
4. Add environment variables:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `CORS_ORIGIN`: Your frontend URL
   - `NODE_ENV`: production

## Security

### API Keys
- All API keys stored server-side in `.env`
- Never exposed to frontend
- `.env` files are gitignored

### Rate Limiting
- 100 requests per 15 minutes per IP
- Prevents abuse and DoS attacks

### Input Validation
- URL validation before processing
- Content sanitization
- Request size limits

### Security Headers
- Helmet.js adds security headers
- CORS configured for specific origins
- XSS protection enabled

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Design inspired by [Harmonic](https://harmonic.ai) and [Affinity](https://affinity.co)
- Icons by [Lucide](https://lucide.dev)
- Built with [Vite](https://vitejs.dev)
