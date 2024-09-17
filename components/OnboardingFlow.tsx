'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, User, Calendar, Ruler, Weight, Target, Dumbbell, Zap, Mail, Lock, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { auth } from '../app/providers'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

export default function OnboardingFlow() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    height: '',
    weight: '',
    goal: '',
    workoutPlan: '',
    workoutDuration: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData')
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData)
      if (parsedUserData.onboardingCompleted) {
        router.push('/dashboard')
      } else {
        setStep(2) // Start onboarding process
        setUserData(prevData => ({
          ...prevData,
          ...parsedUserData
        }))
      }
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setUserData(prevData => ({ ...prevData, [name]: value }))
  }

  const calculateBMI = () => {
    const heightInMeters = parseFloat(userData.height) / 100
    return (parseFloat(userData.weight) / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const handleAuthentication = async (isSignUp: boolean) => {
    try {
      let userCredential
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
        await updateProfile(userCredential.user, { displayName: userData.name })
      } else {
        userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password)
      }
      localStorage.setItem('userData', JSON.stringify({ ...userData, uid: userCredential.user.uid }))
      setStep(2) // Move to onboarding after successful authentication
    } catch (error: any) {
      console.error("Authentication error:", error)
      setError(error.message)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      localStorage.setItem('userData', JSON.stringify({ 
        name: result.user.displayName, 
        email: result.user.email, 
        uid: result.user.uid 
      }))
      setStep(2) // Move to onboarding after successful authentication
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      setError('Failed to sign in with Google. Please try again.')
    }
  }

  const completeOnboarding = () => {
    const completeUserData = {
      ...userData,
      bmi: calculateBMI(),
      onboardingCompleted: true
    }
    localStorage.setItem('userData', JSON.stringify(completeUserData))
    router.push('/dashboard')
  }

  const renderAuthStep = () => (
    <Card className="w-[350px] bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{step === 0 ? 'Welcome Back!' : 'Create Account'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          {step === 1 && (
            <div className="flex flex-col space-y-1.5">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" />
                <Input
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/20 text-white placeholder-gray-300"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col space-y-1.5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleInputChange}
                className="pl-10 bg-white/20 text-white placeholder-gray-300"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1.5">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleInputChange}
                className="pl-10 bg-white/20 text-white placeholder-gray-300"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {error && <p className="text-red-300 text-sm">{error}</p>}
        <Button onClick={() => handleAuthentication(step === 1)} className="w-full bg-white text-purple-600 hover:bg-purple-100">
          {step === 0 ? 'Login' : 'Sign Up'} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full text-white hover:bg-white/20">
          Sign in with Google
        </Button>
        <p className="text-sm text-center">
          {step === 0 ? "Don't have an account? " : "Already have an account? "}
          <Button variant="link" className="text-yellow-300 p-0" onClick={() => setStep(step === 0 ? 1 : 0)}>
            {step === 0 ? 'Sign up' : 'Log in'}
          </Button>
        </p>
      </CardFooter>
    </Card>
  )

  const renderOnboardingStep = () => {
    switch (step) {
      case 2:
        return (
          <Card className="w-[350px] bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Let's calculate your BMI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" />
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      placeholder="Height (cm)"
                      value={userData.height}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/20 text-white placeholder-gray-300"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" />
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      placeholder="Weight (kg)"
                      value={userData.weight}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/20 text-white placeholder-gray-300"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setStep(3)} className="w-full bg-white text-purple-600 hover:bg-purple-100">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )
      case 3:
        return (
          <Card className="w-[350px] bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Set your fitness goal</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => handleSelectChange('goal', value)}>
                <SelectTrigger className="bg-white/20 text-white">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                  <SelectItem value="endurance">Improve Endurance</SelectItem>
                  <SelectItem value="flexibility">Increase Flexibility</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setStep(4)} className="w-full bg-white text-purple-600 hover:bg-purple-100">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )
      case 4:
        return (
          <Card className="w-[350px] bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Choose your workout plan</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => handleSelectChange('workoutPlan', value)}>
                <SelectTrigger className="bg-white/20 text-white">
                  <SelectValue placeholder="Select a workout plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setStep(5)} className="w-full bg-white text-purple-600 hover:bg-purple-100">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )
      case 5:
        return (
          <Card className="w-[350px] bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Set your program duration</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => handleSelectChange('workoutDuration', value)}>
                <SelectTrigger className="bg-white/20 text-white">
                  <SelectValue placeholder="Select program duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 weeks</SelectItem>
                  <SelectItem value="8">8 weeks</SelectItem>
                  <SelectItem value="12">12 weeks</SelectItem>
                  <SelectItem value="16">16 weeks</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Button onClick={completeOnboarding} className="w-full bg-white text-purple-600 hover:bg-purple-100">
                Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900">
      {step < 2 ? renderAuthStep() : renderOnboardingStep()}
    </div>
  )
}