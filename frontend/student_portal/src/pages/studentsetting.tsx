import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RxAvatar, RxCamera, RxEnvelopeClosed, RxLockClosed } from "react-icons/rx";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FiSave } from "react-icons/fi";
import { LuKey, LuKeyRound, LuRefreshCw } from "react-icons/lu";
import useAuthStore from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const [avatarSrc, setAvatarSrc] = useState("/placeholder.svg?height=100&width=100")
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const updatePassword = useAuthStore((state) => state.updatePassword);
  const [errorProfile, setErrorProfile] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }

  }, [isLoggedIn, navigate, user]);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      setErrorPassword("Old and new password are required");
      return;
    }
    if (oldPassword === newPassword) {
      setErrorPassword("New password must be different from the old password");
      return;
    }
    if (newPassword.length < 6) {
      setErrorPassword("New password must be at least 6 characters long");
      return;
    }
    setErrorPassword("");
    const error = await updatePassword(oldPassword, newPassword);
    if (error) {
      setErrorPassword(error);
      return;
    }
    alert("Password updated successfully");
    console.log("Password Updated");
  }

  const handleProfileUpdate = async () => {
    if (!name || !email) {
      setErrorProfile("Name and email are required");
      return;
    } 
    if (email == user?.email) {
      if (name == user?.name) {
        setErrorProfile("No changes detected");
        return;
    }}
   // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorProfile("Invalid email format");
      return;
    }
    // Check name length
    if (name.length < 3) {
      setErrorProfile("Name must be at least 3 characters long");
      return;
    }
    setErrorProfile("");
    const error = await updateProfile(name, email);
    if (error) {
      setErrorProfile(error);
      return;
    }
    alert("Profile updated successfully");
    console.log("Profile Updated:", {
      name,
      email,
    });
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setAvatarSrc(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-purple-800 text-center mb-8">Your Explorer Settings</h1>
          
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 bg-purple-100 rounded-full">
              <TabsTrigger value="profile" className="rounded-full data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <RxAvatar className="w-5 h-5 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="password" className="rounded-full data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <RxLockClosed className="w-5 h-5 mr-2" />
                Secret Code
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-40 h-40 border-4 border-purple-400">
                  <AvatarImage src={avatarSrc} alt="Profile picture" />
                  <AvatarFallback className="bg-purple-200 text-purple-600 text-4xl">ME</AvatarFallback>
                </Avatar>
                <Label htmlFor="avatar" className="cursor-pointer bg-purple-600 text-white py-3 px-6 rounded-full hover:bg-purple-700 transition-colors flex items-center space-x-2">
                  <RxCamera className="w-5 h-5" />
                  <span>Choose Your Avatar</span>
                  <Input id="avatar" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                </Label>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lg font-medium text-gray-700 flex items-center">
                    <RxAvatar className="w-5 h-5 mr-2 text-purple-600" />
                    Explorer Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your awesome explorer name"
                    className="text-lg p-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg font-medium text-gray-700 flex items-center">
                    <RxEnvelopeClosed className="w-5 h-5 mr-2 text-purple-600" />
                    Email Galaxy
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="text-lg p-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all"
                  />
                </div>
              </div>
              {errorProfile && <p className="text-red-600 text-lg">{errorProfile}</p>}
              <Button onClick={handleProfileUpdate} className="w-full text-xl py-6 rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <FiSave className="w-6 h-6" />
                <span>Save Your Profile Changes</span>
              </Button>
            </TabsContent>
            
            <TabsContent value="password" className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword" className="text-lg font-medium text-gray-700 flex items-center">
                    <LuKey className="w-5 h-5 mr-2 text-purple-600" />
                    Current Secret Code
                  </Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter your current secret code"
                    className="text-lg p-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-lg font-medium text-gray-700 flex items-center">
                    <LuKeyRound className="w-5 h-5 mr-2 text-purple-600" />
                    New Secret Code
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a new secret code"
                    className="text-lg p-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all"
                  />
                </div>
              </div>
              {errorPassword && <p className="text-red-600 text-lg">{errorPassword}</p>}
              <Button onClick={handlePasswordChange} className="w-full text-xl py-6 rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <LuRefreshCw className="w-6 h-6" />
                <span>Update Your Secret Code</span>
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}