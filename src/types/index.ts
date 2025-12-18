export interface User {
  id: string
  email: string
  name: string
  photoURL?: string
  membershipType: 'basic' | 'premium' | 'vip'
  membershipExpiry: Date
  createdAt: Date
}

export interface Booking {
  id: string
  userId: string
  trainerId?: string
  type: 'pt' | 'group-class'
  classId?: string
  date: Date
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  createdAt: Date
}

export interface GroupClass {
  id: string
  name: string
  description: string
  instructorId: string
  instructorName: string
  category: 'yoga' | 'spinning' | 'crossfit' | 'pilates' | 'strength' | 'cardio'
  capacity: number
  bookedCount: number
  date: Date
  startTime: string
  endTime: string
  location: string
  imageUrl?: string
}

export interface Workout {
  id: string
  userId: string
  date: Date
  type: string
  duration: number // minutes
  calories?: number
  exercises?: Exercise[]
  notes?: string
  createdAt: Date
}

export interface Exercise {
  name: string
  sets?: number
  reps?: number
  weight?: number // kg
  distance?: number // km
  duration?: number // minutes
}

export interface Trainer {
  id: string
  name: string
  email: string
  photoURL?: string
  specialization: string[]
  bio: string
  available: boolean
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  description: string
  membershipType?: string
  createdAt: Date
}

export interface WorkoutStats {
  totalWorkouts: number
  totalDuration: number
  totalCalories: number
  averageDuration: number
  workoutsByType: Record<string, number>
  weeklyStats: {
    week: string
    count: number
    duration: number
  }[]
}
