'use client'

import ky from 'ky'
import { toast } from 'react-hot-toast'

export const DeleteAll = () => {
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
        loading: 'deleting all rows...',
        success: 'all rows deleted!!!',
        error: 'error deleting...',
      }
    )
  }

  return (
    <button
      onClick={deleteAll}
      className="text-red-500 underline absolute right-8"
    >
      delete all
    </button>
  )
}
