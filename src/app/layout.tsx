import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NAV Dashboard',
  description: 'Public Mutual Fund NAV Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
