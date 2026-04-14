# SHOP EXPRESS ZM

**Your trusted online marketplace for local and international products, powered by Inland Express Zambia's shipping expertise.**

A multi-vendor e-commerce platform for Zambia with local marketplace, international product sourcing ("Buy For Me"), delivery logistics, and payment integration.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Auth.js v5 (email/password with role-based access)
- **UI**: Tailwind CSS + shadcn/ui
- **State**: Zustand (cart), Server Actions (mutations)
- **Validation**: Zod + React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or pnpm

### 1. Clone & Install

```bash
git clone <repo-url>
cd shopexpresszm
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your database URL and secrets:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/shopexpresszm"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopexpresszm.com | Password123 |
| Customer | mwansa@example.com | Password123 |
| Customer | grace@example.com | Password123 |
| Vendor | david@techzone.zm | Password123 |
| Vendor | chileshe@zedfashion.zm | Password123 |
| Vendor | bwalya@homestyle.zm | Password123 |

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages (home, shop, about, etc.)
│   ├── (customer)/        # Customer dashboard
│   ├── (vendor)/          # Vendor portal
│   ├── (admin)/           # Admin dashboard
│   ├── auth/              # Sign in / Sign up
│   └── api/               # API routes
├── actions/               # Server actions
├── components/
│   ├── common/            # Shared components (ProductCard, etc.)
│   ├── dashboard/         # Dashboard sidebars & widgets
│   ├── home/              # Homepage sections
│   ├── layout/            # Header, Footer, Providers
│   ├── shop/              # Shop page components
│   └── ui/                # shadcn/ui primitives
├── config/                # Site configuration
├── hooks/                 # Custom hooks (cart, etc.)
├── lib/                   # Utilities, DB, auth, validation
└── types/                 # TypeScript declarations
```

## Key Features

- **Multi-vendor marketplace** with vendor approval workflow
- **Buy For Me** international sourcing service (USA, UK, China)
- **Role-based access**: Guest, Customer, Vendor, Admin
- **Cart & Checkout** with Zustand state management
- **Product catalog** with categories, search, filters
- **Admin dashboard** with analytics overview
- **Delivery zones** with configurable fees
- **Payment abstraction** ready for card, mobile money, bank transfer
- **CMS-lite** for banners, FAQs, and content pages
- **Mobile-first** responsive design

## Payment Integration

The payment module is abstracted to support:
- Card payments (Visa/Mastercard)
- Mobile money (MTN, Airtel, Zamtel)
- Bank transfer with manual confirmation

To connect a live gateway, implement the payment provider interface in `src/lib/payments/` and update the checkout flow.

## Deployment

### Vercel (Recommended)

```bash
vercel
```

Set environment variables in Vercel dashboard. Use a managed PostgreSQL provider (Neon, Supabase, etc.).

### Database Migrations

For production, use Prisma migrations instead of `db push`:

```bash
npx prisma migrate dev --name init
npx prisma migrate deploy  # in production
```

## Future Roadmap

- Flutter mobile app (API layer ready)
- Loyalty points & referral system
- Real courier API integrations
- Real-time shipment tracking
- Multilingual support (English, Bemba, Nyanja)
- SMS notifications via Zamtel/MTN APIs

## License

Proprietary - Inland Express Zambia
