import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { User } from '@/types'

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export async function signUp(email: string, password: string, name: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update display name
    await updateProfile(user, { displayName: name })

    // Create user document in Firestore
    const userData: User = {
      id: user.uid,
      email: email,
      name: name,
      membershipType: 'basic',
      membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: new Date(),
    }

    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      membershipExpiry: userData.membershipExpiry.toISOString(),
      createdAt: userData.createdAt.toISOString(),
    })

    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export async function getUserData(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      const data = userDoc.data()
      return {
        ...data,
        membershipExpiry: new Date(data.membershipExpiry),
        createdAt: new Date(data.createdAt),
      } as User
    }
    return null
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

export async function updateUserData(userId: string, data: Partial<User>) {
  try {
    const updateData: any = { ...data }
    
    if (data.membershipExpiry) {
      updateData.membershipExpiry = data.membershipExpiry.toISOString()
    }
    if (data.createdAt) {
      updateData.createdAt = data.createdAt.toISOString()
    }

    await updateDoc(doc(db, 'users', userId), updateData)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}
