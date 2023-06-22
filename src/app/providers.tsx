'use client'

import dynamic from 'next/dynamic'

const Toaster = dynamic(
  async () => {
    const { Toaster: BaseToaster } = await import('react-hot-toast')
    return BaseToaster
  },
  {
    ssr: false,
  }
)

export const GlobalProviders = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <>
    <Toaster />
    {children}
  </>
)
