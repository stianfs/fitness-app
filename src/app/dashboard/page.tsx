'use client'

import { useEffect, useState } from 'react'
import { onAuthChange } from '@/lib/auth'
import { User as FirebaseUser } from 'firebase/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Calendar, TrendingUp, Users } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Velkommen tilbake!</h1>
        <p className="text-muted-foreground">Her er oversikten over din treningsaktivitet</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Økter denne uken</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+2 fra forrige uke</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kommende bookinger</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Neste: I morgen kl 18:00</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale økter</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">De siste 30 dagene</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gruppetimer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Denne måneden</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Siste økter</CardTitle>
            <CardDescription>Din treningsaktivitet de siste dagene</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Styrketrening', date: 'I dag', duration: '60 min' },
                { name: 'Yoga', date: 'I går', duration: '45 min' },
                { name: 'Spinning', date: '2 dager siden', duration: '50 min' },
              ].map((workout, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{workout.name}</p>
                    <p className="text-sm text-muted-foreground">{workout.date}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{workout.duration}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kommende bookinger</CardTitle>
            <CardDescription>Dine planlagte timer og klasser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Personlig trening', date: 'I morgen kl 18:00', trainer: 'Erik Hansen' },
                { name: 'CrossFit', date: 'Fredag kl 17:00', trainer: 'Anna Berg' },
                { name: 'Yoga', date: 'Lørdag kl 10:00', trainer: 'Maria Olsen' },
              ].map((booking, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{booking.name}</p>
                    <p className="text-sm text-muted-foreground">{booking.date}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{booking.trainer}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
