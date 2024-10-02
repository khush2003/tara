import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, PenTool, Mic, BookText, ArrowLeft, Star } from 'lucide-react'
import { useNavigate, useParams } from "react-router-dom"

const unitData = {
  id: 1,
  title: "Animals",
  progress: 40,
  lessons: [
    { id: "0001L0001", title: "Farm Animals Vocabulary", type: "vocabulary", icon: BookOpen, completed: true },
    { id: "0001L0002", title: "Wild Animals Vocabulary", type: "vocabulary", icon: BookOpen, completed: false },
    { id: "0001L0003", title: "Animal Adjectives", type: "grammar", icon: PenTool, completed: false },
  ],
  exercises: [
    { id: "0001E0001", title: "Match the Animal Sounds", type: "listening", icon: Mic, completed: true },
    { id: "0001E0002", title: "Complete the Animal Poem", type: "reading", icon: BookText, completed: false },
    { id: "0001E0003", title: "Describe Your Favorite Animal", type: "writing", icon: PenTool, completed: false },
  ]
}

export default function NewLearningHome() {
  const { id } = useParams()
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-r from-blue-400 to-purple-400 p-6">
        <Button onClick={() => navigate("/dashboard")} variant="ghost" className="fixed top-5 left-5 text-lg  mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">{unitData.title} Unit</h1>
        
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6 bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
          <Progress value={unitData.progress} className="h-4" />
          <p className="text-sm text-muted-foreground mt-1">{unitData.progress}% Complete</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Lessons</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unitData.lessons.map((lesson) => (
              <Card key={lesson.id} className={`hover:shadow-lg transition-shadow ${lesson.completed ? 'bg-green-50' : ''}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">{lesson.title}</CardTitle>
                  <lesson.icon className={`h-5 w-5 ${lesson.completed ? 'text-green-500' : 'text-muted-foreground'}`} />
                </CardHeader>
                <CardContent>
                    <Button onClick={() => navigate("/learning/" + lesson.id)} className="w-full">{lesson.completed ? 'Review Lesson' : 'Start Lesson'}</Button>
                  {lesson.completed && <Star className="text-yellow-400 mt-2 mx-auto" />}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Exercises</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unitData.exercises.map((exercise) => (
              <Card key={exercise.id} className={`hover:shadow-lg transition-shadow ${exercise.completed ? 'bg-green-50' : ''}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">{exercise.title}</CardTitle>
                  <exercise.icon className={`h-5 w-5 ${exercise.completed ? 'text-green-500' : 'text-muted-foreground'}`} />
                </CardHeader>
                <CardContent>
                  
                    <Button onClick={() => navigate("/learning/" + exercise.id)} className="w-full">{exercise.completed ? 'Retry Exercise' : 'Start Exercise'}</Button>
                  
                  {exercise.completed && <Star className="text-yellow-400 mt-2 mx-auto" />}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}