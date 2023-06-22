import { Inter } from 'next/font/google'
import clsx from 'clsx'

import { GlobalProviders } from '@/app/providers'
import '@/app/styles/index.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'magic link using lucia auth',
  description:
    'a sample demo of magic link using lucia auth with drizzle & sqlite',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={clsx(
          inter.className,
          'min-h-screen bg-gray-900 text-white p-4'
        )}
      >
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  )
}

export default RootLayout
