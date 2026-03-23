<div align="center">

# 🤖 FinAI – Multi-Agent Financial Intelligence System

**AI-powered personal finance advisor using LangGraph multi-agent orchestration**

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.0.26-orange.svg)](https://github.com/langchain-ai/langgraph)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Contributing](#-contributing)

</div>

---

## 📌 Overview

**FinAI** is a production-ready, full-stack financial intelligence platform that orchestrates five specialised AI agents in a LangGraph pipeline to deliver personalised investment advice, real-time market insights, and portfolio analytics.

Users interact with a conversational chat interface backed by GPT-4-turbo. When an OpenAI key is unavailable the system falls back to rule-based agents so every feature remains functional offline.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Multi-Agent AI** | LangGraph pipeline with User Profile, Market Research, Risk, Strategy & Advisor agents |
| 💬 **AI Chat** | Conversational financial Q&A with streaming (SSE) support |
| 📊 **Portfolio Analytics** | Upload CSV/JSON holdings, visualise allocation, get rebalancing tips |
| 📈 **Market Insights** | Live news feed, sentiment analysis, sector trends, ticker data |
| 🔐 **JWT Auth** | Secure register / login with bcrypt password hashing |
| 📁 **File Upload** | Bulk-import portfolio, expenses, and income data |
| ⚡ **Streaming** | Server-Sent Events for real-time agent progress updates |
| 🗄️ **Persistence** | PostgreSQL for data, Redis for conversation history |
| 🐳 **Docker** | Multi-stage Dockerfile for the backend; production-ready |

---

## 🏗️ Architecture

### Multi-Agent Pipeline

```
User Message
      │
      ▼
┌─────────────────────────────────────────────────────┐
│                   LangGraph Pipeline                │
│                                                     │
│  ① User Profile Agent  →  analyses income,         │
│     savings, debt, financial health score           │
│          │                                          │
│          ▼                                          │
│  ② Market Research Agent  →  fetches live news,    │
│     computes sentiment, identifies sector trends    │
│          │                                          │
│          ▼                                          │
│  ③ Risk Analysis Agent  →  determines risk level   │
│     (conservative / moderate / aggressive)          │
│          │                                          │
│          ▼                                          │
│  ④ Investment Strategy Agent  →  builds portfolio  │
│     allocation and specific recommendations         │
│          │                                          │
│          ▼                                          │
│  ⑤ Advisor Agent  →  synthesises all outputs into  │
│     a clear, actionable financial advice response   │
└─────────────────────────────────────────────────────┘
      │
      ▼
Structured Response  (summary · advice · action items · warnings)
```

### Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **UI Components** | Radix UI primitives, Lucide icons, Recharts |
| **State / Data** | Zustand, TanStack React Query, Axios |
| **Backend** | FastAPI, Python 3.11, Uvicorn |
| **AI / LLM** | OpenAI GPT-4-turbo / GPT-3.5-turbo, LangChain, LangGraph |
| **Database** | PostgreSQL (async via SQLAlchemy + asyncpg) |
| **Cache / History** | Redis |
| **Auth** | JWT (python-jose), bcrypt (passlib) |
| **Infra** | Docker (multi-stage), slowapi rate-limiting |

---

## 📂 Project Structure

```
finAI-multi-Agent/
├── backend/
│   ├── app/
│   │   ├── agents/              # Five LangGraph agent modules
│   │   │   ├── advisor_agent.py
│   │   │   ├── market_agent.py
│   │   │   ├── risk_agent.py
│   │   │   ├── strategy_agent.py
│   │   │   └── user_profile_agent.py
│   │   ├── api/                 # FastAPI route handlers
│   │   │   ├── routes_chat.py
│   │   │   ├── routes_market.py
│   │   │   ├── routes_portfolio.py
│   │   │   ├── routes_upload.py
│   │   │   └── routes_user.py
│   │   ├── database/            # Async SQLAlchemy setup
│   │   ├── graph/               # LangGraph pipeline builder
│   │   ├── models/              # Pydantic + SQLAlchemy models
│   │   ├── services/            # Portfolio & news services
│   │   ├── utils/               # CSV parser helpers
│   │   ├── config.py            # Pydantic Settings
│   │   └── main.py              # FastAPI app factory
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   ├── components/          # Reusable React components
│   │   ├── lib/                 # API client, utilities
│   │   └── store/               # Zustand global state
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| Python | 3.11 |
| PostgreSQL | 14+ |
| Redis | 7+ |
| Docker (optional) | 24+ |

### 1 – Clone the repository

```bash
git clone https://github.com/chaitanya-maddala-236/finAI-multi-Agent.git
cd finAI-multi-Agent
```

### 2 – Backend setup

```bash
cd backend

# Create a virtual environment
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and edit environment variables
cp .env.example .env
```

Edit `.env` with your credentials (see [Environment Variables](#️-environment-variables)).

```bash
# Start the backend (auto-reload for development)
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 3 – Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4 – Docker (backend only)

```bash
cd backend

# Build the image
docker build -t finai-backend .

# Run with environment variables
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql+asyncpg://user:pass@host:5432/finai_db" \
  -e REDIS_URL="redis://host:6379/0" \
  -e OPENAI_API_KEY="sk-..." \
  -e SECRET_KEY="your-secret-key" \
  finai-backend
```

---

## ⚙️ Environment Variables

All backend configuration is driven by a single `.env` file.

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://user:password@localhost:5432/finai_db` | Async PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis URL for conversation history |
| `OPENAI_API_KEY` | *(empty)* | OpenAI key – omit for rule-based mode |
| `SECRET_KEY` | *(change me!)* | JWT signing secret (min 32 chars) |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | JWT expiry in minutes |
| `NEWS_API_KEY` | *(empty)* | [NewsAPI](https://newsapi.org/) key for live headlines |
| `ALPHA_VANTAGE_API_KEY` | *(empty)* | [Alpha Vantage](https://www.alphavantage.co/) key for ticker data |
| `ALLOWED_ORIGINS` | `http://localhost:3000,...` | CORS allowed origins (comma-separated) |
| `CHROMA_PERSIST_DIRECTORY` | `./chroma_db` | ChromaDB vector store path |
| `DEBUG` | `False` | Enable debug logging & hot-reload |

> **Note:** Without API keys the system operates in **rule-based mode**, returning deterministic mock outputs. This is great for development and demos.

---

## 📡 API Reference

Base URL: `http://localhost:8000/api/v1`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive a JWT token |
| `GET` | `/user-profile/{user_id}` | Get user profile (auth required) |
| `PUT` | `/user-profile/{user_id}` | Update user profile (auth required) |

### Chat (AI Advisory)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat` | Run full multi-agent pipeline |
| `POST` | `/chat/stream` | Stream results via Server-Sent Events |
| `GET` | `/chat/history/{user_id}` | Retrieve conversation history |

**Chat request body:**
```json
{
  "message": "Should I increase my SIP contributions?",
  "user_id": 1,
  "user_data": {
    "salary": 80000,
    "monthly_expenses": 40000,
    "risk_tolerance": "moderate",
    "financial_goals": "retirement planning"
  },
  "stream": false
}
```

### Portfolio

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/portfolio/{user_id}` | Get portfolio summary with allocation |
| `GET` | `/portfolio/{user_id}/items` | List all portfolio items |
| `POST` | `/portfolio/{user_id}/item` | Add a portfolio item |
| `DELETE` | `/portfolio/{user_id}/item/{item_id}` | Remove a portfolio item |
| `GET` | `/portfolio/{user_id}/rebalancing` | Get rebalancing suggestions |

### Market Insights

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/market-insights` | Overall market trends, news & sentiment |
| `GET` | `/market-insights/symbols?symbols=AAPL,GOOGL` | Ticker price/volume data |
| `GET` | `/market-insights/sentiment` | Standalone sentiment analysis |
| `GET` | `/market-insights/news?query=...` | Search financial news |

### File Upload

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload/financial-data` | Upload CSV/JSON for portfolio, expenses or income |

Supported `data_type` values: `portfolio`, `expenses`, `income`.  
Max file size: **5 MB**. Accepted formats: `.csv`, `.json`.

---

## 🤖 AI Agents

### ① User Profile Agent
Analyses the user's financial data to compute:
- **Financial health score** (0–100)
- Net worth, savings rate, debt-to-income ratio
- Emergency fund coverage (months)
- Risk appetite signal

### ② Market Research Agent
Fetches real-time financial news (via NewsAPI) and computes:
- Market **trend** (bullish / neutral / bearish)
- **Sentiment score** (-1 to +1)
- Recommended sectors
- Key risk factors & opportunities

### ③ Risk Analysis Agent
Combines user profile + market conditions to output:
- **Risk level**: conservative / moderate / aggressive
- **Risk score** (1–10)
- Max equity exposure & recommended debt ratio
- Reasoning and key risk factors

### ④ Investment Strategy Agent
Generates a tailored portfolio blueprint:
- **Asset allocation** (stocks, ETFs, mutual funds, gold, fixed income, …)
- Specific investment recommendations
- Expected return range
- Investment horizon

### ⑤ Advisor Agent (GPT-4-turbo)
Synthesises all four agent outputs into:
- **Summary** and detailed advice paragraph
- Prioritised **action items**
- Risk **warnings**
- Confidence score & next review date

---

## 🗂️ Portfolio CSV Format

When uploading a portfolio file the system expects these columns:

```csv
asset_name,asset_type,quantity,purchase_price,current_price,sector
Reliance Industries,stock,50,2400.00,2650.00,energy
HDFC Nifty 50 ETF,etf,100,180.50,195.00,diversified
Sovereign Gold Bond,gold,10,5500.00,6200.00,commodities
```

Supported `asset_type` values: `stock`, `etf`, `mutual_fund`, `gold`, `fixed_income`, `crypto`, `cash`.

---

## 🧪 Running Tests

```bash
cd backend
pytest -v
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** – see [LICENSE](LICENSE) for details.

---

<div align="center">
Built with ❤️ using FastAPI, LangGraph, and Next.js
</div>
