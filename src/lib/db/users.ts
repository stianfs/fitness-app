import { db } from '@/lib/firebase'
import { adminDb } from '@/lib/firebase-admin'
import { collection, doc, getDoc, setDoc, updateDoc, DocumentData } from 'firebase/firestore'

export interface User {
  id: string
  email: string
  displayName?: string
  createdAt: Date
  updatedAt: Date
}

export async function createUser(userId: string, data: Partial<User>) {
  const userRef = doc(db, 'users', userId)
  await setDoc(userRef, {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

export async function getUser(userId: string): Promise<User | null> {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)
  
  if (!userSnap.exists()) {
    return null
  }
  
  return { id: userSnap.id, ...userSnap.data() } as User
}

export async function updateUser(userId: string, data: Partial<User>) {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date(),
  })
}

export async function getUserAdmin(userId: string) {
  const userDoc = await adminDb.collection('users').doc(userId).get()
  
  if (!userDoc.exists) {
    return null
  }
  
  return { id: userDoc.id, ...userDoc.data() }
}
