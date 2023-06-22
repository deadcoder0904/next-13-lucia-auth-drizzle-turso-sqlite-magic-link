'use client'

import ky from 'ky'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export const Logout = () => {
  const router = useRouter()

  const logout = async () => {
    toast.promise(
      new Promise<string>(async (resolve, reject) => {
        try {
          await ky.delete('/api/logout', {
            hooks: {
              afterResponse: [
                async (_, __, res) => {
                  if (res.status === 200) {
                    resolve(res.statusText)
                    setTimeout(() => {
                      return router.push('/login')
                    }, 2000)
                  }
                  if (res.status === 400 && res.statusText) {
                    reject(res.statusText)
                  }
                },
              ],
            },
          })
        } catch (e) {
          reject()
        }
      }),
      {
        loading: 'logging out...',
        success: (msg) => msg,
        error: (err) => err || 'error logging out...',
      }
    )
  }

  return (
    <button
      onClick={logout}
      className="text-sky-500 underline absolute right-8"
    >
      logout
    </button>
  )
}
