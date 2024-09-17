'use client'

import React, { useState } from 'react'
import { CheckCircle, LogOut, User, X, TrendingUp, ArrowLeft, Frown, Meh, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Input } from '@/components/ui/input'
import { useAuth } from '../../contexts/AuthContext'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '../../app/providers'

// Mock user data
const userData = {
  name: 'John Doe',
  age: 28,
  height: 180,
  weight: 75,
  goal: 'Muscle Gain',
  plan: 'Intermediate'
}

// Mock workout plan
const workoutPlan = [
  {
    name: 'Upper Body Strength',
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 10, image: '/placeholder.svg?height=200&width=200' },
      { name: 'Pull-ups', sets: 3, reps: 8, image: '/placeholder.svg?height=200&width=200' },
      { name: 'Shoulder Press', sets: 3, reps: 10, image: '/placeholder.svg?height=200&width=200' },
      { name: 'Tricep Dips', sets: 3, reps: 12, image: '/placeholder.svg?height=200&width=200' },
    ]
  },
  {
    name: 'Lower Body Power',
    exercises: [
      { name: 'Squats', sets: 4, reps: 8, image: '/placeholder.svg?height=200&width=200' },
      { name: 'Deadlifts', sets: 3, reps: 8, image: '/placeholder.svg?height=200&width=200' },
      { name: 'Leg Press', sets: 3, reps: 12, image: '/placeholder.svg?height=200&width=200' },
      { name: 'Calf Raises', sets: 3, reps: 15, image: '/placeholder.svg?height=200&width=200' },
    ]
  },
]

// Mock weight data
const initialWeightData = [
  { week: 1, weight: 75 },
  { week: 2, weight: 74.5 },
  { week: 3, weight: 74.8 },
  { week: 4, weight: 74.2 },
]

const encouragementMessages = [
  "You're doing great! Keep pushing!",
  "Every workout brings you closer to your goals!",
  "Stay consistent, stay strong!",
  "You've got this! Another week, another victory!",
]

export default function MobileDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [weeklyStreak, setWeeklyStreak] = useState(3)
  const [completedWorkouts, setCompletedWorkouts] = useState(2)
  const [totalWeeklyWorkouts] = useState(4)
  const [showProfile, setShowProfile] = useState(false)
  const [currentWorkout, setCurrentWorkout] = useState<typeof workoutPlan[0] | null>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [weightData, setWeightData] = useState(initialWeightData)
  const [newWeight, setNewWeight] = useState('')
  const [encouragement] = useState(encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)])
  const [happinessLevel, setHappinessLevel] = useState<number | null>(null)

  const handleWorkoutComplete = () => {
    setCompletedWorkouts(completedWorkouts + 1)
    if (completedWorkouts + 1 === totalWeeklyWorkouts) {
      setWeeklyStreak(weeklyStreak + 1)
      setCompletedWorkouts(0)
    }
    setCurrentWorkout(null)
    setCurrentExerciseIndex(0)
    setHappinessLevel(null)
  }

  const handleNextExercise = () => {
    if (currentWorkout && currentExerciseIndex < currentWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
    }
  }

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const handleAddWeight = () => {
    const weight = parseFloat(newWeight)
    if (!isNaN(weight)) {
      setWeightData([...weightData, { week: weightData.length + 1, weight }])
      setNewWeight('')
    }
  }

  const renderDashboard = () => (
    <>
      <Card className="bg-white/10 shadow-xl mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-300">Weekly Streak</p>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-white">{weeklyStreak} weeks</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-yellow-300">This Week's Progress</p>
              <Progress value={(completedWorkouts / totalWeeklyWorkouts) * 100} className="h-2 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4 text-white">Your Workout Plan</h2>
      {workoutPlan.map((workout, index) => (
        <Card key={index} className="bg-white/10 shadow-xl mb-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-white">{workout.name}</h3>
            <p className="text-sm mb-4 text-yellow-200">{workout.exercises.length} exercises</p>
            <Button className="w-full bg-yellow-400 text-purple-900 hover:bg-yellow-300" onClick={() => setCurrentWorkout(workout)}>
              Start Workout
            </Button>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-white/10 shadow-xl mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4 text-white">Weight Progress</h2>
          <div className="flex items-center mb-4">
            <Input
              type="number"
              placeholder="Enter weight"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="mr-2 bg-white/20 border-none text-white placeholder-gray-400"
            />
            <Button onClick={handleAddWeight} className="bg-yellow-400 text-purple-900 hover:bg-yellow-300">
              <TrendingUp className="mr-2 h-4 w-4" /> Add Weight
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <XAxis dataKey="week" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: '#4c1d95', border: 'none' }} />
                <Line type="monotone" dataKey="weight" stroke="#fde68a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderWorkoutPage = () => {
    if (!currentWorkout) return null
    const currentExercise = currentWorkout.exercises[currentExerciseIndex]
    const isLastExercise = currentExerciseIndex === currentWorkout.exercises.length - 1

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setCurrentWorkout(null)} className="mb-4 text-yellow-300">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold text-white">{currentWorkout.name}</h2>
        <Card className="bg-white/10 shadow-xl">
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-white">{currentExercise.name}</h3>
            <p className="text-lg mb-4 text-yellow-200">{currentExercise.sets} sets x {currentExercise.reps} reps</p>
            <Image
              src={currentExercise.image}
              alt={currentExercise.name}
              width={300}
              height={300}
              className="rounded-lg mb-4"
            />
            <div className="flex justify-between mt-4">
              <Button onClick={handlePreviousExercise} disabled={currentExerciseIndex === 0} className="bg-yellow-400 text-purple-900 hover:bg-yellow-300">
                Previous
              </Button>
              {isLastExercise ? (
                <Button onClick={() => setHappinessLevel(0)} className="bg-green-400 text-purple-900 hover:bg-green-300">
                  Complete Workout
                </Button>
              ) : (
                <Button onClick={handleNextExercise} className="bg-yellow-400 text-purple-900 hover:bg-yellow-300">
                  Next Exercise
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        <Progress value={((currentExerciseIndex + 1) / currentWorkout.exercises.length) * 100} className="h-2" />
      </div>
    )
  }

  const renderHappinessLevel = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">How was your workout?</h2>
      <div className="flex justify-around">
        <Button onClick={() => { setHappinessLevel(1); handleWorkoutComplete(); }} className="bg-transparent hover:bg-white/10">
          <Frown className="h-12 w-12 text-yellow-400" />
        </Button>
        <Button onClick={() => { setHappinessLevel(3); handleWorkoutComplete(); }} className="bg-transparent hover:bg-white/10">
          <Meh className="h-12 w-12 text-yellow-400" />
        </Button>
        <Button onClick={() => { setHappinessLevel(5); handleWorkoutComplete(); }} className="bg-transparent hover:bg-white/10">
          <Smile className="h-12 w-12 text-yellow-400" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-4 overflow-y-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Hi, {user?.displayName || 'User'}!</h1>
          <p className="text-sm text-yellow-200">{encouragement}</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full text-yellow-300" onClick={() => setShowProfile(true)}>
          <User className="h-6 w-6" />
        </Button>
      </header>

      {showProfile ? (
        <Card className="bg-white/10 shadow-xl mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Profile</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowProfile(false)} className="text-yellow-300">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="space-y-2 text-white">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Age:</strong> {userData.age}</p>
              <p><strong>Height:</strong> {userData.height} cm</p>
              <p><strong>Weight:</strong> {userData.weight} kg</p>
              <p><strong>Goal:</strong> {userData.goal}</p>
              <p><strong>Plan:</strong> {userData.plan}</p>
            </div>
            <Button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </CardContent>
        </Card>
      ) : happinessLevel !== null ? (
        renderHappinessLevel()
      ) : currentWorkout ? (
        renderWorkoutPage()
      ) : (
        renderDashboard()
      )}
    </div>
  )
}