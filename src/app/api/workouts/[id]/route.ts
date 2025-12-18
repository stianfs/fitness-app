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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const workoutDoc = await adminDb.collection('workouts').doc(params.id).get()

    if (!workoutDoc.exists) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      )
    }

    const workout = workoutDoc.data()

    if (workout?.userId !== user.uid) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      id: workoutDoc.id,
      ...workout,
    })
  } catch (error: any) {
    console.error('Get workout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch workout' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const workoutDoc = await adminDb.collection('workouts').doc(params.id).get()

    if (!workoutDoc.exists) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      )
    }

    const workout = workoutDoc.data()

    if (workout?.userId !== user.uid) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const data = await request.json()
    await adminDb.collection('workouts').doc(params.id).update({
      ...data,
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update workout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update workout' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const workoutDoc = await adminDb.collection('workouts').doc(params.id).get()

    if (!workoutDoc.exists) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      )
    }

    const workout = workoutDoc.data()

    if (workout?.userId !== user.uid) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await adminDb.collection('workouts').doc(params.id).delete()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete workout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete workout' },
      { status: 500 }
    )
  }
}
