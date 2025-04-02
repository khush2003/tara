import { useMemo } from 'react'
import { User, Star, Trophy, Zap, Shield, Swords } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useAuthStore from '@/store/authStore'
import { useClassroom } from '@/hooks/useClassroom'
import { useUsers } from '@/hooks/useUsers'
import { useUser } from '@/hooks/useUser'

// Define the user type based on the provided schema
type GameProfile = {
  game_points: number
  level: number
  class: number
  strength: number
  extraStrength: number
  defense: number
  extraDefense: number
  speed: number
  extraSpeed: number
}

type UserType = {
  _id: string
  name: string
  profile_picture: string
  game_profile: GameProfile
}

// Function to convert class number to string
const getClassName = (classNumber: number): string => {
  const classes = [
    'Baker', 'Bat', 'Charlie', 'Crusader', 'Egirl', 'Fridgeon', 'GodPigeon',
    'Hatoshi', 'Infiltrator', 'Kawaii', 'Knight', 'Mimic', 'Normal', 'Pigeon',
    'Selfie', 'Sink', 'Stronga', 'Whey', 'Winged', 'Winged2', 'Wizard', 'Wyrm', 'Platy'
  ]
  return classes[classNumber] || 'Unknown'
}

// Function to calculate total score for ranking
const calculateTotalScore = (user: UserType): number => {
  const { game_profile: gp } = user
  const totalAttributes = 
    gp.strength + gp.extraStrength + 
    gp.defense + gp.extraDefense + 
    gp.speed + gp.extraSpeed
  
  return gp.level * 1000 + totalAttributes * 100 + gp.game_points
}


export default function Leaderboard() {

    const {
        data: currentUser,
        error: userError,
        isLoading: userIsLoading,
    } = useUser();

    const {
        data: classroom,
        error: classroomError,
        isLoading: classroomIsLoading,
    } = useClassroom(currentUser?.classroom[0].toString())

    const {
        data: users,
        isLoading: usersLoading,
        error: usersError,
    } = useUsers(classroom?.students_enrolled.map(student => student.student) || []);

  const rankedUsers = useMemo(() => {
    if (!users) return []
    
    return users
      .sort((a, b) => calculateTotalScore(b) - calculateTotalScore(a))
      .map((user, index) => ({
        ...user,
        ranking: index + 1,
        totalScore: calculateTotalScore(user)
      }))
  }, [users])

  if (usersError || classroomError || userError) return <div>Failed to load leaderboard</div>
  if (usersLoading || classroomIsLoading || userIsLoading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-purple-600">
            <Trophy className="inline-block mr-2 text-yellow-400" />
            Super Learners Leaderboard
          </h1>
          <div className="space-y-6">
            {rankedUsers.map((user) => (
              <div key={user._id} className={`flex items-center p-4 rounded-2xl shadow-md transition-transform hover:scale-105 ${user._id === currentUser?._id ? 'bg-gradient-to-r from-purple-200 via-blue-200 to-blue-500' : 'bg-gradient-to-r from-yellow-200 via-green-200 to-blue-200'}`}>
                <div className="flex-shrink-0 mr-4">
                  <div className="relative">
                    {user.profile_picture ? <img
                      src={user.profile_picture}
                      alt={`${user.name}'s profile`}
                      width={50}
                      height={50}
                      className="rounded-full border-4 border-white"
                    /> : <User className="w-12 h-12 text-gray-400" />}
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-md">
                      {user.ranking}
                    </span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      Level {user.game_profile.level}
                    </span>
                    <span className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 mr-1 text-blue-500" />
                      {user.game_profile.game_points} Points
                    </span>
                    <span className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-1 text-green-500" />
                      {getClassName(user.game_profile.class)}
                    </span>
                    <span className="flex items-center text-sm text-gray-600">
                      <Swords className="w-4 h-4 mr-1 text-red-500" />
                      Strength: {user.game_profile.strength + user.game_profile.extraStrength}
                    </span>
                    <span className="flex items-center text-sm text-gray-600">
                      <Shield className="w-4 h-4 mr-1 text-indigo-500" />
                      Defense: {user.game_profile.defense + user.game_profile.extraDefense}
                    </span>
                    <span className="flex items-center text-sm text-gray-600">
                      <Zap className="w-4 h-4 mr-1 text-orange-500" />
                      Speed: {user.game_profile.speed + user.game_profile.extraSpeed}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-purple-600">
                    Total Score: {user.totalScore}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
          <p className="text-center text-white font-semibold">
            Level up, boost your attributes, and climb the leaderboard! 🚀
          </p>
        </div>
        <div className='p-8'>
            <Button
            disabled={
                currentUser?.game_profile?.game_minutes_left === 0 ||
                classroom?.is_game_blocked === true ||
                (classroom?.game_restriction_period &&
                    new Date().setHours(
                        new Date(classroom.game_restriction_period.start).getHours(),
                        new Date(classroom.game_restriction_period.start).getMinutes()
                    ) < new Date().getTime() &&
                    new Date().setHours(
                        new Date(classroom.game_restriction_period.end).getHours(),
                        new Date(classroom.game_restriction_period.end).getMinutes()
                    ) > new Date().getTime())
            }
            className="w-full  text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
             onClick={() => {
                window.location.href = 'http://localhost:8082?token=' + useAuthStore.getState().accessToken
            }}>
                Play Game
            </Button>
        </div>
      </div>
    </div>
  )
}