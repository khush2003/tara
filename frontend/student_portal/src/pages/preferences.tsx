import { useState } from 'react'
import { Compass, Dumbbell, Atom } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { setLearningPreferences } from '@/api/userApi'
import { useNavigate } from 'react-router-dom'

export default function LearningPreference() {
  const [selectedOption] = useState<string | null>(null)
    const navigate = useNavigate()
  const handleOptionClick = (option: string) => {
    setLearningPreferences([option])
    navigate("/dashboard")
  }

  const options = [
    { id: 'adventure', icon: Compass, label: 'Adventure & Exploration', color: 'bg-yellow-400', hoverColor: 'hover:bg-yellow-500' },
    { id: 'sports', icon: Dumbbell, label: 'Sports & Physical Activities', color: 'bg-green-400', hoverColor: 'hover:bg-green-500' },
    { id: 'science', icon: Atom, label: 'Science & Technology', color: 'bg-blue-400', hoverColor: 'hover:bg-blue-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-5xl w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-opacity-10 bg-yellow-300 background-pattern"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-center mb-8 text-purple-600 animate-bounce">
            What's Your Favorite?
          </h1>
          <div className="grid gap-6 md:grid-cols-3">
            {options.map((option) => (
              <Button
                key={option.id}
                onClick={() => handleOptionClick(option.label)}
                className={`h-auto flex flex-col items-center p-6 rounded-2xl transform transition-all duration-300 ease-in-out ${option.color} ${option.hoverColor} hover:scale-105 hover:shadow-lg`}
              >
                <option.icon className="w-20 h-20 text-white" />
                <p className="text-xl font-bold text-center text-white p-6">{option.label}</p>
              </Button>
            ))}
          </div>
          {selectedOption && (
            <div className="mt-8 text-center animate-fadeIn">
              <p className="text-2xl font-bold text-purple-700">
                Wow! You chose:
              </p>
              <p className="text-3xl font-extrabold text-pink-600 mt-2">
                {selectedOption}
              </p>
            </div>
          )}
          <div className="mt-12 text-center">
            <p className="text-lg text-purple-700 font-medium">
              Select your favorite activity!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
