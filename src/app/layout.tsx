import Providers from '@/components/Providers'
import './globals.css'

export const metadata = {
  title: 'Chat Connect',
  description: 'Social Media Chatting Application made on top of Nextjs 13 provide sending friend request and chatting in realtime',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  )
}
