'use client'

import React, { useState } from 'react'
import { ArrowRight, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '../../app/providers'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const router = useRouter()
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [signUpError, setSignUpError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      const user = userCredential.user

      await updateProfile(user, { displayName: userData.name })

      router.push('/dashboard')
    } catch (error: any) {
      console.error("Error signing up:", error)
      setSignUpError('Failed to sign up. Please try again.')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/dashboard')
    } catch (error: any) {
      console.error("Error signing in with Google:", error)
      setSignUpError('Failed to sign in with Google. Please try again.')
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900">
      <Card className="w-[350px] bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/20 text-white placeholder-gray-300"
                />
              </div>
            </div>
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
          {signUpError && <p className="text-red-300 text-sm">{signUpError}</p>}
          <Button onClick={handleSignUp} className="w-full bg-white text-purple-600 hover:bg-purple-100">
            Sign Up <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full text-white hover:bg-white/20">
            Sign up with Google
          </Button>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Button variant="link" className="text-yellow-300 p-0" onClick={() => router.push('/')}>
              Log in
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}