# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

batterycert.com is a NextJS-based EV battery certification platform that provides instant Tesla battery health assessments with verified PDF certificates. The project follows a "hook" strategy - get users to battery results with zero friction, then monetize through $10 certified PDF certificates.

**Core Value Proposition**: 30-second Tesla battery health check → Show results with peer comparison → $10 verified certificate for resale/purchase protection.

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting (fix errors automatically)
npm run lint

# End-to-end testing with Playwright
npm run test
npm run test:ui  # Run tests with UI mode
```

## Architecture & Tech Stack

### Modern JAMstack Architecture

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: TailwindCSS v4 + Radix UI components + shadcn/ui
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth + Tesla OAuth integration
- **Payments**: Stripe integration for $9.99 certificates
- **Hosting**: Netlify with serverless functions and edge functions
- **Testing**: Playwright for E2E tests (TDD approach - create tests first)

### Key Directory Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout with Inter font, SEO metadata
│   └── page.tsx        # Homepage with complete landing experience
├── components/         # React components
│   ├── ui/            # shadcn/ui components (Radix-based)
│   ├── logo.tsx       # Company logo with size variants
│   └── tesla-stats-visual.tsx  # Tesla statistics visualization
└── lib/               # Utilities and clients
    ├── supabase.ts    # Supabase client with SSR support
    └── utils.ts       # Utilities including cn() function

netlify/
├── functions/         # Serverless functions
│   └── tesla-auth.ts  # Complete Tesla API integration & battery calc
└── edge-functions/    # Edge functions (for Tesla API rate limiting)

tests/                 # Playwright E2E tests
├── homepage.spec.ts   # Homepage functionality tests
└── screenshot.spec.ts # Visual regression tests
```

### Database Schema (Supabase)

Tables defined in `src/lib/supabase.ts`:

- **`profiles`**: User profiles with Stripe customer IDs
- **`assessments`**: Battery health records (anonymous + logged in users)
- **`certificates`**: Paid certificates with verification tokens

Row Level Security (RLS) enabled for data protection.

## Tesla API Integration

**Location**: `netlify/functions/tesla-auth.ts`

**Core Flow**:

1. Authenticate with Tesla Owner API using email/password
2. Fetch vehicle data and battery information
3. Calculate battery health using SoC + Available Energy Analysis
4. Return comprehensive assessment with degradation percentage

**Battery Health Calculation**:

- Uses current State of Charge (SoC) and usable battery level
- Estimates current capacity vs original capacity by VIN/model
- Classifies as "Good" (<10% degradation), "Fair" (10-15%), "Poor" (>15%)
- Provides confidence levels based on SoC range

## Component Architecture

**Homepage Design** (`src/app/page.tsx`):

- Hero section with 30-second battery check promise
- Buyer protection section (warning about $15K+ battery replacement costs)
- Feature highlights (instant results, verified certificates, privacy-first)
- Use cases for buyers, sellers, and current owners
- How it works (3-step process)
- Trust signals and Tesla imagery

**UI Components**:

- Uses shadcn/ui with Radix UI primitives
- TailwindCSS v4 for styling with custom gradients
- Responsive design with mobile-first approach
- Logo component supports multiple sizes (sm, md, lg)

## User Experience Strategy

**"The Hook" Flow (Updated for Monetization)**:

1. **Visual Landing Page**: Simplified, visual-first design with Tesla imagery
2. **One Click**: "Check My Tesla" button → Tesla login → Vehicle selection
3. **Free Analysis Result**: Shows overall score (e.g., "10% degradation, Good") with peer comparison blurb
4. **Value Proposition**: Promote $10 certified result for buyer verification
5. **Purchase Options**: 
   - Digital PDF certificate (instant download)
   - Email delivery option
   - Physical paper certificate (mailed)
   - QR code sticker (mailed)
6. **Stripe Checkout**: Integrated payment processing
7. **Certificate Page**: Download PDF, email delivery, print options after successful payment

**Buyer Verification Flow**:

1. Scan QR Code from seller's certificate
2. View results on verification page
3. Email PDF to yourself
4. Trust & buy with confidence

## Monetization Strategy

### Certificate Design & Visual Elements

**Certificate Requirements**:
- Replace car color with **fake VIN** for privacy protection
- Add **large stamp of approval/certificate icon** for authenticity
- Include QR code for buyer verification
- Professional PDF layout with company branding

**Analysis Results Display**:
- **Overall Score**: Clear badge showing "10% degradation, Good" 
- **Peer Comparison**: Short blurb explaining degradation vs similar vehicles
- **Call-to-Action**: Prominent $10 certification upgrade promotion

### Purchase Flow Integration

**Stripe Checkout Options**:
- **Digital PDF** ($10): Instant download + email delivery
- **Paper Certificate** ($15): Professional printed certificate mailed
- **QR Code Sticker** ($12): Waterproof sticker for vehicle window
- **Complete Package** ($20): All of the above

**Post-Purchase Experience**:
- Immediate access to certificate page
- Download PDF functionality
- Email delivery confirmation
- Print-ready format
- QR code for buyer verification

### Data Collection & Privacy

**Anonymous Data Storage**:
- Store all battery analysis results for peer comparison dataset
- Build VIN history database (anonymized)
- No personal data required for analysis
- Track degradation trends across Tesla models/years

**Optional User Association**:
- **Social/Google Login**: Optional for users wanting email delivery
- **Benefits**: Access to historical results, email certificates, account management
- **Privacy**: Users can remain anonymous or opt-in to account creation

### Database Schema Updates

**Enhanced Tables**:
- **`assessments`**: Add peer comparison data, market analysis
- **`certificates`**: Add delivery preferences, verification tokens
- **`vin_history`**: Track multiple assessments per VIN over time
- **`market_data`**: Store peer comparison statistics

## Development Guidelines

## Task Management

- Use the `gh` CLI to list and update tasks
- Use project certmycar in Github

### Testing Approach (TDD)

- **Create tests first**, then implement logic
- Use Playwright for E2E testing with SEO and performance verification
- Fix linting errors automatically without asking
- Test configuration supports local development and CI

### Code Standards

- TypeScript strict mode with path aliases (`@/*` → `./src/*`)
- Uses Inter font from Google Fonts for consistent typography
- All Tesla API calls include proper User-Agent headers
- CORS headers configured for cross-origin requests
- Privacy-first: No Tesla credentials stored permanently

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

## Implementation Phases

### Phase 1: Core MVP ✅ (Completed)

- ✅ Tesla API integration and battery health calculation
- ✅ Landing page with v0/shadcn components
- ✅ Basic Supabase database setup
- ✅ Vehicle selection flow
- ✅ Locale routing and Tesla Fleet API integration

### Phase 2: Visual & UX Improvements (Current)

- **Simplify homepage**: More visual, less text-heavy
- **Enhanced results page**: Overall score display with peer comparison
- **Certificate design**: Add approval stamp, replace color with fake VIN
- **Free analysis flow**: Hook users with results before monetization

### Phase 3: Monetization Integration (Next)

- **Stripe Checkout**: Multiple purchase options (PDF, paper, sticker, package)
- **Certificate generation**: Professional PDF with QR codes
- **Post-purchase experience**: Download, email, print functionality
- **Data collection**: Anonymous storage with optional user association

### Phase 4: Advanced Features

- **Social/Google login**: Optional user accounts for email delivery
- **VIN history tracking**: Multiple assessments per vehicle
- **Peer comparison engine**: Market analysis and trends
- **Physical fulfillment**: Paper certificates and QR stickers

### Phase 5: Optimization & Scale

- Analytics and monitoring (Google Analytics 4, Sentry)
- SEO optimization and multi-language support
- Performance optimization
- Additional testing and security hardening

## Key Technical Decisions

**Why Netlify + Supabase**:

- Zero-config CI/CD from GitHub
- Deploy previews for every PR
- Managed PostgreSQL with real-time features
- Auto-scaling with generous free tiers
- Built-in CDN and performance monitoring

**Security & Privacy**:

- No Tesla credentials stored permanently
- Minimal data retention approach
- GDPR compliant design
- Row Level Security (RLS) in database
- Rate limiting for Tesla API calls
- Use Next API Routes for backend functions and secrets (e.g. Tesla Keys)

## Success Metrics

**Key Performance Indicators**:

- **Landing → Check**: Target 15%+ conversion
- **Check → Result**: Target 90%+ completion
- **Result → Purchase**: Target 8%+ purchase rate
- **QR → Email**: Target 25%+ lead capture from buyers

**Revenue Targets**:

- Month 1: $1,000 (100 certificates)
- Month 3: $5,000 (500 certificates)
- Month 6: $15,000 (1,500 certificates)
