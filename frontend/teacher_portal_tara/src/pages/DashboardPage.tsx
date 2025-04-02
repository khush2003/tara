import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import ContentContainer from "@/components/ContentContainer"
import { useNavigate } from "react-router-dom"
import { useUser } from "@/hooks/useUser"
import { useClassrooms } from "@/hooks/useClassrooms"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Users, BookOpen, Bell } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DashboardPage() {
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useUser()

  const {
    data: classrooms,
    isLoading: classroomLoading,
    error: classroomError
  } = useClassrooms(user?.classroom as string[] | undefined)

  const navigate = useNavigate()

  if (classroomLoading || userLoading) {
    return (
      <ContentContainer>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-[250px] mb-6" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-[300px] w-full" />
            ))}
          </div>
        </div>
      </ContentContainer>
    )
  }

  if (classroomError || userError) {
    return (
      <ContentContainer>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {classroomError ? "Classroom Error: " + classroomError : "User Error: " + userError}
            </AlertDescription>
          </Alert>
        </div>
      </ContentContainer>
    )
  }

  const backgroundColors = [
    "bg-red-100 dark:bg-red-900",
    "bg-yellow-100 dark:bg-yellow-900",
    "bg-purple-100 dark:bg-purple-900",
    "bg-green-100 dark:bg-green-900",
    "bg-blue-100 dark:bg-blue-900",
    "bg-pink-100 dark:bg-pink-900"
  ]

  return (
    <ContentContainer>
      <div className="flex-1 overflow-auto">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Your Classes</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {classrooms?.map((classItem, index) => (
                <motion.div
                  key={classItem._id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden rounded-xl shadow-lg border-0">
                    <CardHeader className={`p-6 ${backgroundColors[index % backgroundColors.length]}`}>
                      <CardTitle className="text-xl font-bold mb-2">{classItem.name}</CardTitle>
                      <CardDescription className="text-sm font-medium">
                        Classroom Join Code: {classItem.class_join_code}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Users className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {classItem.students_enrolled.length} students enrolled
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Today's Lesson
                          </Badge>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {classItem.today_unit ? classItem.today_unit.title : "No lesson set"}
                          </p>
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            <Bell className="h-4 w-4 mr-1" />
                            Announcement
                          </Badge>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {classItem.announcement || "No Announcement Set"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => navigate("/classDetails/" + classItem._id)}
                        className="w-full"
                        variant="outline"
                      >
                        View Class
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ContentContainer>
  )
}