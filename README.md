# 🎠 Carousel CRM

Enterprise-grade CRM system built with Next.js 15, TypeScript, Supabase, and modern UI components. Targeting $50M ARR by Year 3.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🎯 Features

### Core CRM Functionality

- **Contact Management**: Full CRUD with bulk operations, duplicate detection
- **Deal Pipeline**: Visual kanban with drag-and-drop, custom stages
- **Company Management**: Comprehensive organization profiles
- **Task & Activity Tracking**: Assignments, due dates, automated workflows
- **Phone Integration**: Call history, quick dial, contact management
- **Email Management**: Compose, organize, template system
- **Document Management**: File storage, organization, sharing
- **Team Management**: Role-based permissions, collaboration tools

### Advanced Features

- **AI-Powered Lead Scoring**: Intelligent contact prioritization
- **Automation Workflows**: Custom triggers and actions
- **Advanced Analytics**: Real-time dashboards, custom reports
- **Crew Management**: Team organization and resource allocation
- **Time Tracking**: Project time logs, productivity insights
- **Progressive Web App**: Offline support, mobile-optimized

## 🏗️ Architecture

### Performance Standards

- Page load time: <2s desktop, <3s mobile
- API response time: <200ms for 95% of requests
- Core Web Vitals: "Good" range
- Lighthouse Score: 95+

### Security Standards

- Row Level Security (RLS) on all database operations
- Input validation with Zod schemas
- XSS protection and sanitization
- Environment variable security
- WCAG 2.1 AA accessibility compliance

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account

### Environment Variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Kyroscrm/carousel-crm.git
cd carousel-crm

# Install dependencies
npm install

# Run development server
npm run dev
```

### Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
carousel-crm/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard-specific components
│   ├── contacts/          # Contact management components
│   ├── deals/             # Deal pipeline components
│   └── ...               # Other feature components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
│   ├── supabase.ts        # Supabase client configuration
│   ├── supabase-types.ts  # Generated TypeScript types
│   └── utils.ts           # General utilities
└── styles/                # Global styles
```

## 🔧 Development Principles

### Code Quality

- TypeScript strict mode
- Server Components by default
- Proper error handling and loading states
- Self-documenting code with clear naming
- Comprehensive testing (>90% coverage)

### Framework Patterns

```typescript
// Server Component Pattern
export default async function ContactsPage() {
  const contacts = await getContacts();
  return <ContactsList contacts={contacts} />;
}

// Client Component Pattern (when needed)
('use client');
export default function InteractiveComponent() {
  const [state, setState] = useState();
  // Interactive logic here
}
```

### Database Operations

```typescript
// Supabase with proper error handling
const { data, error } = await supabase
  .from('contacts')
  .select('*')
  .eq('organization_id', organizationId);

if (error) {
  console.error('Database error:', error);
  throw new Error('Failed to fetch contacts');
}
```

## 🎨 UI/UX Guidelines

- **Design System**: 8px grid system for consistent spacing
- **Responsive**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: React.memo for optimization
- **Loading States**: Skeleton components and proper feedback
- **Error Handling**: User-friendly error messages

## 🔒 Security Features

- **Authentication**: Supabase Auth with session management
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row Level Security (RLS) policies
- **Input Validation**: Zod schemas for all user inputs
- **XSS Protection**: Input sanitization and CSP headers

## 📊 Success Metrics

- **Performance**: <2s load time, 95+ Lighthouse score
- **Reliability**: <0.01% error rate
- **Accessibility**: WCAG 2.1 AA compliance
- **Security**: Zero vulnerabilities
- **Code Quality**: 100% TypeScript coverage

## 🚀 Deployment

The application is optimized for deployment on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Custom server deployment**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🎯 Business Goals

- **Year 1**: MVP launch with core CRM features
- **Year 2**: Advanced automation and AI features
- **Year 3**: $50M ARR target with enterprise scalability

---

**Built with ❤️ by the Carousel CRM Team**
