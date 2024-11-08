import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import useClassroomStore from "@/stores/classroomStore";
import { motion } from "framer-motion";
import {Badge} from "@/components/ui/badge";
import { useEffect } from "react";
import ContentContainer from "@/components/ContentContainer";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
    const [classrooms, classroomError, classroomLoading, fetchAllClassrooms] = useClassroomStore((state) => [
        state.classrooms,
        state.classroomError,
        state.classroomLoading,
        state.fetchAllClassrooms,
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllClassrooms();
    }, [fetchAllClassrooms]);

    if (classroomLoading) {
        return <div>Loading...</div>;
    }

    if (classroomError) {
        return <div>{classroomError && "Classroom Error: " + classroomError} </div>;
    }

    return (
        <ContentContainer>
            <div className="flex-1 overflow-auto">
                

                {/* Main content */}
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {/* <div className="flex space-x-4 mb-6 overflow-x-auto py-2">
            <Button className="rounded-full bg-gray-900 text-white px-6">All</Button>
            <Button variant="outline" className="rounded-full px-6">IT & Software</Button>
            <Button variant="outline" className="rounded-full px-6">Media Training</Button>
            <Button variant="outline" className="rounded-full px-6">Business</Button>
            <Button variant="outline" className="rounded-full px-6">Interior</Button>
          </div> */}
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Classes</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {classrooms?.map((classItem, index) => (
                                <motion.div key={classItem._id} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                                    <Card className="overflow-hidden rounded-3xl shadow-sm border-gray-200">
                                        <CardHeader className={`p-6 ${["bg-red-100", "bg-yellow-100", "bg-purple-100", "bg-green-100"][index % 4]}`}>
                                            <CardTitle className="text-lg mb-2">{classItem.classroom_name}</CardTitle>
                                            <CardDescription>Classroom Code: {classItem.classroom_code}</CardDescription>
                                            <div className="flex justify-between items-center mt-4">
                                                <span className="text-sm text-gray-600">{classItem.students_enrolled.length} students</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="mb-4">
                                                <Badge variant="outline" className="mb-2 rounded-full">Today's Lesson</Badge>
                                                <p className="text-sm text-gray-600">
                                                    {classItem.today_lesson ? classItem.today_lesson.name : "No lesson set"}
                                                </p>
                                            </div>
                                            <div className="mb-4">
                                                <Badge variant="outline" className="mb-2 rounded-full">Announcement</Badge>
                                                <p className="text-sm text-gray-600">{classItem.announcement || "No Announcement Set"}</p>
                                            </div>
                                            <Button onClick={() => navigate("/classDetails/" + classItem.classroom_code)} className="w-full rounded-full">View Class</Button>
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
