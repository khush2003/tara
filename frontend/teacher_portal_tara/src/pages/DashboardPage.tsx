import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {Badge} from "@/components/ui/badge";
import ContentContainer from "@/components/ContentContainer";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useClassrooms } from "@/hooks/useClassrooms";

const DashboardPage = () => {

    const {
        data: user,
        isLoading: userLoading,
        error: userError,
    }  = useUser();

    const {
        data: classrooms,
        isLoading: classroomLoading,
        error: classroomError
    } = useClassrooms(user?.classroom as string[] | undefined);

    const navigate = useNavigate();

    if (classroomLoading || userLoading) {
        return <div>Loading...</div>;
    }

    if (classroomError || userError) {
        return <div>{classroomError ? "Classroom Error: " + classroomError : "User Error: " + userError} </div>;
    }

    return (
        <ContentContainer>
            <div className="flex-1 overflow-auto">

                {/* Main content */}
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Classes</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {classrooms?.map((classItem, index) => (
                                <motion.div key={classItem._id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                                    <Card className="overflow-hidden rounded-3xl shadow-sm border-gray-200">
                                        <CardHeader className={`p-6 ${["bg-red-100", "bg-yellow-100", "bg-purple-100", "bg-green-100"][index % 4]}`}>
                                            <CardTitle className="text-lg mb-2">{classItem.name}</CardTitle>
                                            <CardDescription>Classroom Join Code: {classItem.class_join_code}</CardDescription>
                                            <div className="flex justify-between items-center mt-4">
                                                <span className="text-sm text-gray-600">{classItem.students_enrolled.length} students</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="mb-4">
                                                <Badge variant="outline" className="mb-2 rounded-full">Today's Lesson</Badge>
                                                <p className="text-sm text-gray-600">
                                                    {classItem.today_unit ? classItem.today_unit.title : "No lesson set"}
                                                </p>
                                            </div>
                                            <div className="mb-4">
                                                <Badge variant="outline" className="mb-2 rounded-full">Announcement</Badge>
                                                <p className="text-sm text-gray-600">{classItem.announcement || "No Announcement Set"}</p>
                                            </div>
                                            <Button onClick={() => navigate("/classDetails/" + classItem._id)} className="w-full rounded-full">View Class</Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </ContentContainer>
    );
};

export default DashboardPage;
