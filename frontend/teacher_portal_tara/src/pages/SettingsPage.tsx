import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User, Mail, School, Lock, Loader2Icon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import ContentContainer from "@/components/ContentContainer"
import { changePassword, updateUserProfile } from "@/api/useAPI"
import { useUser } from "@/hooks/useUser"

export default function UserSettings() {

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useUser()

  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name,
    email: user?.email,
    school: user?.school
  })

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [isLoading, setIsLoading] = useState(false)

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (userLoading) {
    return <div>Loading...</div>
  }

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    

      const error = await updateUserProfile(
        personalInfo.name,
        personalInfo.email,
        personalInfo.school
      )
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      } else {
        toast({
          title: "Personal information updated",
          description: "Your personal information has been successfully updated.",
        })
        setIsLoading(false)
      }
      

  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    
    const error = await changePassword(
      passwords.oldPassword,
      passwords.newPassword
    )

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }
    else {
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      })
      setIsLoading(false)
    }
  }

  return (
    <ContentContainer>
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">User Settings</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <Toaster />
        <CardContent>
          <form onSubmit={handlePersonalInfoSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school" className="flex items-center">
                  <School className="w-4 h-4 mr-2" />
                  School
                </Label>
                <Input
                  id="school"
                  name="school"
                  value={personalInfo.school}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="mt-4" disabled={isLoading}>
              {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Update Personal Information
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Change your account password here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword" className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Current Password
                </Label>
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="mt-4" disabled={isLoading}>
              {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </ContentContainer>
  )
}