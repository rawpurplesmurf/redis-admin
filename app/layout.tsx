import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Redis Database Manager',
  description: 'A tool to manage Redis databases',
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
