'use client'

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, LogOut, Plus, Settings, Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "@/stores/authStore"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/useUser"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ContentContainerProps {
  children?: React.ReactNode | React.ReactNode[]
}

const ContentContainer: React.FC<ContentContainerProps> = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useUser()

  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  useEffect(() => {
    if (!accessToken) {
      navigate("/login")
    }
  }, [accessToken, navigate])

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="ml-4">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="mt-2 h-4 w-[150px]" />
        </div>
      </div>
    )
  }

  if (userError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Alert variant="destructive" className="w-[400px]">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{userError && "User Error: " + userError}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center rounded-full bg-primary p-2 text-primary-foreground"
            >
              <Home className="h-5 w-5" />
            </motion.button>
            <div className="hidden items-center space-x-3 sm:flex">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{user?.name}</h2>
                <p className="text-sm text-gray-500">School: {user?.school}</p>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Tara Teacher Portal</h1>

          <div className="flex items-center space-x-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden items-center space-x-2 rounded-full bg-primary px-4 py-2 text-primary-foreground sm:flex"
              href="/createClass"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Class</span>
            </motion.a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Menu className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="sm:hidden" onClick={() => navigate("/createClass")}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create New Class</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}

export default ContentContainer