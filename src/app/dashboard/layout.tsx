'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { onAuthChange, signOut, getUserData } from '@/lib/auth'
import { User as FirebaseUser } from 'firebase/auth'
import { User } from '@/types'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Calendar, 
  Activity, 
  Users, 
  UserCircle, 
  LogOut,
  Dumbbell 
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        setFirebaseUser(user)
        const data = await getUserData(user.uid)
        setUserData(data)
        setLoading(false)
      } else {
        router.push('/auth/signin')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Activity className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground">Laster...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Oversikt' },
    { href: '/dashboard/bookings', icon: Calendar, label: 'Bookinger' },
    { href: '/dashboard/workouts', icon: Activity, label: 'Treningslogg' },
    { href: '/dashboard/classes', icon: Users, label: 'Gruppetimer' },
    { href: '/dashboard/profile', icon: UserCircle, label: 'Profil' },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FitnessHub</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="mb-3 flex items-center gap-3 px-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {userData?.name || firebaseUser?.displayName || 'Bruker'}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {userData?.membershipType || 'basic'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logg ut
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-muted/50">
        <div className="h-full overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
