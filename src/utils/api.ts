export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const auth = await import('firebase/auth')
  const { auth: firebaseAuth } = await import('@/lib/firebase')
  
  const user = auth.getAuth().currentUser
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const token = await user.getIdToken()

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

export async function createWorkout(data: {
  name: string
  type: string
  duration: number
  calories?: number
  notes?: string
}) {
  return fetchWithAuth('/api/workouts', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getWorkouts() {
  return fetchWithAuth('/api/workouts')
}

export async function updateWorkout(id: string, data: any) {
  return fetchWithAuth(`/api/workouts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteWorkout(id: string) {
  return fetchWithAuth(`/api/workouts/${id}`, {
    method: 'DELETE',
  })
}
