import { db } from '@/lib/firebase'
import { adminDb } from '@/lib/firebase-admin'
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore'

export interface Workout {
  id: string
  userId: string
  name: string
  type: string
  duration: number
  calories?: number
  notes?: string
  createdAt: Date
  completedAt?: Date
}

export async function createWorkout(userId: string, data: Omit<Workout, 'id' | 'userId' | 'createdAt'>) {
  const workoutsRef = collection(db, 'workouts')
  const newWorkoutRef = doc(workoutsRef)
  
  await setDoc(newWorkoutRef, {
    ...data,
    userId,
    createdAt: new Date(),
  })
  
  return newWorkoutRef.id
}

export async function getUserWorkouts(userId: string): Promise<Workout[]> {
  const workoutsRef = collection(db, 'workouts')
  const q = query(
    workoutsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Workout))
}

export async function getWorkout(workoutId: string): Promise<Workout | null> {
  const workoutRef = doc(db, 'workouts', workoutId)
  const workoutSnap = await getDoc(workoutRef)
  
  if (!workoutSnap.exists()) {
    return null
  }
  
  return { id: workoutSnap.id, ...workoutSnap.data() } as Workout
}

export async function updateWorkout(workoutId: string, data: Partial<Workout>) {
  const workoutRef = doc(db, 'workouts', workoutId)
  await updateDoc(workoutRef, data)
}

export async function deleteWorkout(workoutId: string) {
  const workoutRef = doc(db, 'workouts', workoutId)
  await deleteDoc(workoutRef)
}
