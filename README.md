# 🚗⚡ CertMyCar - EV Battery Certification Platform

> **Instant Tesla battery health assessments with verified PDF certificates**

[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://app.netlify.com/sites/placeholder/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Overview

CertMyCar provides instant Tesla battery health assessments with minimal user friction, monetized through verified PDF certificates. Perfect for car sales, purchases, and peace of mind.

### The Problem

- EV battery degradation is a major concern for buyers
- No easy way to verify battery health claims
- Expensive diagnostic tools required for accurate assessment
- Lack of trusted, official documentation

### Our Solution

1. **30-second battery check** - Connect Tesla → Instant results
2. **Professional certificates** - $9.99 verified PDF reports
3. **QR verification** - Buyers can verify authenticity instantly
4. **Zero friction** - No complex setups or permissions needed

## 🚀 Live Demo

🌐 **[certmycar.com](https://certmycar.com)** _(Coming Soon)_

## 🏗️ Architecture

### Tech Stack

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   NextJS 14     │    │    Netlify      │    │    Supabase     │
│   (App Router)  │◄──►│   Functions     │◄──►│   (Database     │
│   + v0 UI       │    │   + Edge        │    │   + Auth + Storage) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Multi-lang    │    │   GitHub        │    │     Stripe      │
│   (next-intl)   │    │   CI/CD         │    │   Payments      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Why This Stack?

- ✅ **Zero-config CI/CD** from GitHub
- ✅ **Deploy previews** for every PR
- ✅ **Edge functions** for Tesla API calls
- ✅ **Managed database** with real-time features
- ✅ **Auto-scaling** and global CDN
- ✅ **Cost-effective** with generous free tiers

## 🎯 User Journey

### The "Hook" Strategy

1. **Landing Page**: "Check Your Tesla Battery Health in 30 Seconds"
2. **One Click**: "Check My Tesla" button
3. **Tesla Login**: Standard authentication (no account creation)
4. **Instant Result**: "Battery Health: Good (8% degradation)"
5. **Value Reveal**: "Get Official Certificate - $9.99"
6. **Account Creation**: Only when ready to purchase

### For Buyers (QR Verification)

1. **Scan QR Code** from seller's certificate
2. **View Results** on verification page
3. **Email PDF** to yourself for records
4. **Trust & Buy** with confidence

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- GitHub CLI (optional)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/pippuri/certmycar.git
cd certmycar

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Project Structure

```
├── netlify/
│   ├── functions/          # Serverless functions
│   └── edge-functions/     # Edge functions
├── src/
│   ├── app/               # NextJS App Router
│   ├── components/        # React components
│   ├── lib/              # Utilities and clients
│   └── messages/         # i18n translations
├── supabase/
│   ├── migrations/       # Database schema
│   └── seed.sql         # Initial data
└── docs/                # Documentation
```

## 📋 Project Phases

### Phase 1: Core MVP (Week 1-2)

- [x] Project setup and infrastructure
- [ ] Tesla API integration
- [ ] Battery health calculation
- [ ] Landing page and UI components

### Phase 2: Monetization (Week 3-4)

- [ ] Stripe payment integration
- [ ] PDF certificate generation
- [ ] QR verification system
- [ ] User authentication

### Phase 3: Optimization (Week 5-6)

- [ ] Analytics and monitoring
- [ ] SEO and multi-language
- [ ] Performance optimization
- [ ] Testing and security

## 🔧 Technical Details

### Battery Health Calculation

```typescript
// Simple but effective calculation
const currentSoC = batteryData.charge_state.battery_level; // e.g., 84%
const availableEnergy = batteryData.charge_state.usable_battery_level; // Wh
const totalCapacity = availableEnergy / (currentSoC / 100);
const degradation = (1 - totalCapacity / originalCapacity) * 100;

// Classification
const health = degradation < 10 ? "Good" : degradation < 15 ? "Fair" : "Poor";
```

### Tesla API Integration

- Uses unofficial Tesla Owner API
- No complex Fleet API permissions needed
- Rate limiting and error handling
- Supports all Tesla models

### Security & Privacy

- No Tesla credentials stored
- Minimal data retention
- GDPR compliant
- Row Level Security (RLS) in database

## 🚀 Deployment

### Automatic Deployment

Every push to `main` automatically deploys to Netlify:

1. GitHub Action runs tests
2. Netlify builds and deploys
3. Deploy preview for PRs
4. Environment variables managed in Netlify dashboard

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to Netlify
netlify deploy --prod
```

## 📊 Analytics & Monitoring

### Key Metrics

- **Landing → Check**: Target 15%+ conversion
- **Check → Result**: Target 90%+ completion
- **Result → Purchase**: Target 8%+ purchase rate
- **QR → Email**: Target 25%+ lead capture

### Tools

- **Google Analytics 4**: User behavior and conversions
- **Sentry**: Error monitoring and performance
- **Netlify Analytics**: Core web vitals and traffic

## 💰 Business Model

### Pricing

- **Free**: Battery health check
- **$9.99**: Official PDF certificate with QR verification

### Revenue Streams

1. **Direct sales** - Tesla owners buying certificates
2. **Lead generation** - Buyer verification emails
3. **Network effects** - Each certificate markets to new buyers

### Target Market

- **Primary**: US Tesla owners selling vehicles
- **Secondary**: EV enthusiasts and service centers
- **Global**: Multi-language expansion ready

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Issue Templates

- 🐛 Bug Report
- ✨ Feature Request
- 📚 Documentation
- 🔧 Technical Debt

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [certmycar.com](https://certmycar.com)
- **GitHub**: [github.com/pippuri/certmycar](https://github.com/pippuri/certmycar)
- **Issues**: [GitHub Issues](https://github.com/pippuri/certmycar/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pippuri/certmycar/discussions)

## 📞 Contact

- **Email**: hello@certmycar.com
- **Twitter**: [@certmycar](https://twitter.com/certmycar)
- **Discord**: [Join our community](https://discord.gg/certmycar)

---

**Made with ❤️ for the EV community**

_Helping buyers and sellers make informed decisions about EV battery health_
