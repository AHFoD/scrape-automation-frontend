# NAV Dashboard - Frontend

A modern Next.js dashboard for viewing Public Mutual fund NAV prices with real-time data from Supabase.

## Features

- 📊 Display current NAV prices for all funds
- 📈 Search and sort functionality
- 📉 Track NAV changes with visual indicators
- 📊 Analytics metrics (average, highest, lowest NAV)
- 🔄 Real-time data updates via Supabase subscriptions
- 📱 Fully responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Real-time Subscriptions

## Setup

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd scrape-automation-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main dashboard page
│   └── globals.css      # Global styles
├── components/
│   ├── NavTable.tsx     # NAV prices table with search/sort
│   ├── NavChanges.tsx   # Latest NAV changes view
│   └── Analytics.tsx    # Metrics cards
└── lib/
    └── supabase.ts      # Supabase client setup
```

## Features Explained

### NAV Table
- Search by fund name or abbreviation
- Sort by name or NAV value
- Color-coded percentage changes (green/red)
- Pagination showing fund count

### NAV Changes
- Shows top 20 changes by magnitude
- Visual progress bars for change percentages
- Color-coded (green for gains, red for losses)

### Analytics
- Total number of funds
- Average NAV across all funds
- Highest and lowest NAV values

## Building for Production

```bash
npm run build
npm run start
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and select your repo
4. Add environment variables in settings
5. Deploy!

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### Deploy to Netlify

1. Push code to GitHub
2. Connect to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Add environment variables
6. Deploy!

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key (safe to expose in frontend)

**Note**: The `NEXT_PUBLIC_` prefix makes these variables available in the browser. Use them only for non-sensitive data.

## Contributing

Feel free to submit issues or pull requests!

## License

MIT
