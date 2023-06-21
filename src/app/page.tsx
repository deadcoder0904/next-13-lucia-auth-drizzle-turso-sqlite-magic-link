'use client'

import Link from 'next/link'
import ky from 'ky'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const deleteAll = async () => {
    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          const { success }: { success: string } = await ky
            .delete('/api/delete-all')
            .json()
          if (success) {
            resolve()
          } else {
            reject()
          }
        } catch (e) {
          reject()
        }
      }),
      {
        loading: 'Deleting all rows...',
        success: 'All rows deleted!!!',
        error: 'Error deleting...',
      }
    )
  }

  return (
    <main className="space-x-2 flex w-full">
      <Link href="/signup" className="anchor">
        signup
      </Link>
      <Link href="/login" className="anchor">
        login
      </Link>
      <button
        onClick={deleteAll}
        className="text-red-500 underline absolute right-8"
      >
        delete all
      </button>
      <Toaster />
    </main>
  )
}
