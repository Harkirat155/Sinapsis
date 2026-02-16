# SYNAPSE - Quick Start Guide

## 🚀 Getting Started (2 minutes)

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Quick Start

```bash
# 1. Clone and navigate
cd wild

# 2. Start all services with Docker
docker-compose up -d

# 3. Check status
docker-compose ps

# Services will be available at:
# - Memory API: http://localhost:8000
# - Intent Analyzer: http://localhost:8001
# - Rapid Engine: http://localhost:8002
# - Feedback Loop: http://localhost:8003
# - Web Interface: http://localhost:3000
```

### Test the System

```bash
# Test Memory API
curl http://localhost:8000

# Test Intent Analyzer
curl -X POST http://localhost:8001/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "I need to build a secure login system ASAP!"}'

# You'll get back:
# - Detected intent: "build_feature" + "security"
# - Emotional context: "urgent"
# - Urgency score: 0.85
# - Hidden goals: ["protect_users", "meet_deadline"]
```

## 💡 How It Works

1. **User sends a request** → Intent Analyzer extracts true meaning
2. **Memory Layer retrieves context** → Past interactions, preferences
3. **Rapid Engine tests solutions** → Parallel validation
4. **Feedback Loop learns** → Success/failure patterns
5. **Next interaction is smarter** → Personalized, contextual

## 📊 Example Flow

```javascript
// User: "I'm stuck with this API integration"

// Intent Analysis detects:
{
  intent: "debug_issue",
  emotion: "frustrated",
  urgency: 0.6,
  hiddenGoals: ["unblock_progress", "understand_root_cause"]
}

// Memory recalls:
- User prefers Python over JavaScript (confidence: 0.85)
- Recently worked on REST APIs (3 days ago)
- Successfully used requests library before

// System responds with:
- Python-specific solution
- Addresses root cause
- References past successful approach
```

## 🎯 What Makes This Different

Traditional AI: "Here's how to do X"
SYNAPSE: "Based on your past 12 interactions, you prefer Y, you're feeling frustrated, and you have a deadline. Here's the approach that worked before, tested in 3 parallel environments."

## 🛠️ Development

```bash
# Install all dependencies
npm run install:all

# Run services locally (without Docker)
cd synapse-core && python api.py       # Terminal 1
cd synapse-intent && npm run dev       # Terminal 2
cd synapse-rapid && npm run dev        # Terminal 3
cd synapse-feedback && python api.py   # Terminal 4
cd synapse-bridge && npm run dev       # Terminal 5

# Or use Docker (recommended)
docker-compose up
```

## 💰 Business Model in Action

### For Developers (Free Tier)
- 1,000 API calls/month
- Basic intent analysis
- Local memory storage

### For Startups ($499/mo)
- 10,000 interactions/month
- Custom intent models
- Team memory sharing
- Analytics dashboard

### For Enterprises (Custom)
- Unlimited usage
- White-label option
- Dedicated support
- Custom integrations

## 📈 Success Metrics

We measure success by:
1. **Reduction in clarifying questions** (baseline vs. after learning)
2. **First-attempt success rate** (solution works without iteration)
3. **User satisfaction** (feedback scores)
4. **Time to resolution** (how fast we solve problems)

## 🔮 Roadmap

**Phase 1 (Current):** Foundation
- ✅ Memory Layer
- ✅ Intent Analyzer
- 🚧 Rapid Prototyping
- 🚧 Feedback Loop
- 🚧 Web Interface

**Phase 2:** Intelligence
- Multi-user learning
- Predictive assistance
- Conflict resolution
- Advanced analytics

**Phase 3:** Scale
- B2B SaaS launch
- Marketplace for templates
- White-label partnerships
- API monetization

## 🤝 Contributing

This is an experimental playground. Wild ideas welcome!

```bash
# Create a feature branch
git checkout -b feature/your-wild-idea

# Make magic happen
# ...

# Submit PR
git push origin feature/your-wild-idea
```

## 📄 License

MIT - Build the future with this

---

**Questions?** Open an issue or check the docs in `/docs`

**Ready to make AI assistants that actually understand humans?** Let's go! 🚀
