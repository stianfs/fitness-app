'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function WorkoutsPage() {
  const router = useRouter()

  return (
    <div className="p-6 space-y-6">
      <h1>Hello list</h1>
      
      <Button onClick={() => router.push('/dashboard/workouts/new')}>
        Ny Workout
      </Button>
    </div>
  )
}
