import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.split('Bearer ')[1]
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const workoutsSnapshot = await adminDb
      .collection('workouts')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .get()

    const workouts = workoutsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ workouts })
  } catch (error: any) {
    console.error('Get workouts error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch workouts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { name, type, duration, calories, notes } = data

    if (!name || !type || !duration) {
      return NextResponse.json(
        { error: 'Name, type, and duration are required' },
        { status: 400 }
      )
    }

    const workoutRef = await adminDb.collection('workouts').add({
      userId: user.uid,
      name,
      type,
      duration,
      calories: calories || null,
      notes: notes || '',
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      workoutId: workoutRef.id,
    })
  } catch (error: any) {
    console.error('Create workout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create workout' },
      { status: 500 }
    )
  }
}
