import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Check, LogOut, Stars } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import LogoutModal from '@/components/logoutmodal'
import useAuthStore from '@/store/authStore'

/**
 * LearningCodePage component
 * 
 * This component renders a page where users can enter a special code provided by their teacher
 * to join a classroom. It uses OTP (One-Time Password) input fields for the code entry.
 * 
 * @returns {JSX.Element} The rendered LearningCodePage component
 */
export default function LearningCodePage(): JSX.Element {
  const [classCode, setClassCode] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const navigate = useNavigate();
  const addCurrentUserToClassroom = useUserStore((state) => state.addCurrentUserToClassroom);
  const [isLogoutModalVisible, setLogoutModalVisible] =
  useState<boolean>(false);
  const logout = useAuthStore((state) => state.logout);

  /**
   * Handles the completion of the OTP input.
   * 
   * @param {string} value - The complete OTP value entered by the user
   */
  const handleComplete = (value: string) => {
    setClassCode(value)
    setIsComplete(value.length === 6)
  }

  /**
   * Handles the form submission to join the classroom.
   * 
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addCurrentUserToClassroom(classCode);
      navigate('/dashboard');
    } catch (error) {
      alert((error as Error).message || "Failed to join classroom, check the code and try again");
    }
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
            <div className="flex flex-col w-full justify-center gap-4 text-sm text-gray-500">
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
            <Button
                    variant="outline"
                    size="icon"
                    className="w-full rounded-xl text-lg"
                    onClick={() => {
                      logout()
                      navigate('/')
                    }}
                >
                    Log Out
                </Button>
                <LogoutModal
                isVisible={isLogoutModalVisible}
                onClose={() => setLogoutModalVisible(false)}
            />
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}