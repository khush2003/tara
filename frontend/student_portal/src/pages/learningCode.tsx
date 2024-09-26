
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Check, Stars } from "lucide-react"
import { useNavigate } from 'react-router-dom'

export default function LearningCodePage() {
  const [otp, setOtp] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const navigate = useNavigate();

  const handleComplete = (value: string) => {
    setOtp(value)
    setIsComplete(value.length === 6)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting OTP:', otp)
    navigate('/dashboard');

    // Here you would typically send the OTP to your backend for verification
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-purple-600">
            Learning Code!
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Enter the special code your teacher gave you to start learning!
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <InputOTP
                containerClassName='flex justify-center'
                maxLength={6}
                onComplete={handleComplete}
                className="gap-2 w-full"
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="rounded-xl border-2 border-purple-400 text-purple-600 text-2xl"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              type="submit"
              disabled={!isComplete}
            >
              {isComplete ? (
                <>
                  Confirm <Check className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  Enter all numbers <Stars className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}