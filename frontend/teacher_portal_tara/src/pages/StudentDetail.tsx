import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book, Award, FileText, BarChart, Clock, CheckCircle, XCircle } from "lucide-react";
import ContentContainer from "@/components/ContentContainer";
import useLearningStore from "@/stores/learningStore";
import useClassroomStore from "@/stores/classroomStore";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { Classroom, LearningModule, PerformanceRecord, User } from "@/types/dbTypes";
import { useTeacherStore } from "@/stores/userStore";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";

export default function StudentProgressDetails() {
    const [activeTab, setActiveTab] = useState("module-breakdown");
    const [feedbackInputs, setFeedbackInputs] = useState<{ [key: string]: { score: string; feedback: string } }>({});
    const [learningModules, moduleLoading, moduleError, fetchLearningModules] = useLearningStore((state) => [
        state.learningModules,
        state.moduleLoading,
        state.moduleError,
        state.fetchLearningModules,
    ]);
    const [classrooms, classroomLoading, classroomError, fetchAllClassrooms, addFeedback] = useClassroomStore((state) => [
        state.classrooms,
        state.classroomLoading,
        state.classroomError,
        state.fetchAllClassrooms,
        state.addFeedback,
    ]);
    const fetchStudentDetails = useTeacherStore((state) => state.fetchStudentDetails);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const { toast } = useToast();
    const { id, classCode } = useParams();
    console.log("Student ID:", id, "Classroom Code:", classCode);
    // const navigate = useNavigate();

    const [classInfo, setClassInfo] = useState<Classroom>();
    const [classLearningModules, setClassLearningModules] = useState<LearningModule[]>([]);
    const [student, setStudent] = useState<User>();

    const handleFeedbackChange = (exerciseId: string, field: "score" | "feedback", value: string) => {
        setFeedbackInputs((prev) => ({
            ...prev,
            [exerciseId]: {
                ...prev[exerciseId],
                [field]: value,
            },
        }));
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                if (id) {
                    const studentDetails = await fetchStudentDetails(id);
                    setStudent(studentDetails);
                } else {
                    toast({
                        title: "Error",
                        description: "Student ID not provided",
                    });
                }
            } catch {
                toast({
                    title: "Error",
                    description: "Failed to fetch student details",
                });
            }
        };

        if (!learningModules) {
            fetchLearningModules();
        }
        if (!classrooms) {
            fetchAllClassrooms();
        }
        if (id) {
            initialize();
        }

        if (classrooms) {
            let foundClass = classrooms?.find((classroom) => classroom.classroom_code === classCode);
            const filteredProgress = foundClass?.progress.filter((progress) => progress.studentId === id);
            if (filteredProgress && foundClass) {
                foundClass = {
                    ...foundClass,
                    progress: filteredProgress,
                };
            }
            setClassInfo(foundClass);
            console.log("Class Info:", foundClass);
            if (learningModules && foundClass) {
                const modules = learningModules.filter((module) => foundClass.learning_modules.map((m) => m.moduleCode).includes(module.moduleCode));
                setClassLearningModules(modules);

                //Populate feedback inputs with existing feedback
                const initialFeedbackInputs: { [key: string]: { score: string; feedback: string } } = {};
                foundClass.learning_modules.forEach((module) => {
                    module.exercises.forEach((exercise) => {
                        if (exercise.exerciseCode)
                            initialFeedbackInputs[exercise.exerciseCode] = {
                                score: "",
                                feedback:
                                    foundClass.performance_records
                                        .filter((record): record is PerformanceRecord => typeof record !== "string")
                                        .find((record) => record.exerciseDetails?.exerciseCode === exercise.exerciseCode)?.exerciseDetails
                                        ?.feedback || "",
                            };
                    });
                });
                setFeedbackInputs(initialFeedbackInputs);
            }
        }
    }, [id, classrooms, fetchAllClassrooms, fetchLearningModules, learningModules, classCode, fetchStudentDetails, toast]);

    if (moduleLoading || classroomLoading) {
        return <div>Loading...</div>;
    }

    if (moduleError || classroomError) {
        return <div>Error: {moduleError || classroomError}</div>;
    }

    const handleFeedbackSubmit = (performanceRecordId: string, exerciseId: string) => {
        if (!performanceRecordId) {
            toast({
                title: "Error",
                description: "Performance record not found, Student has not attempted this exercise",
            });
            return;
        }

        addFeedback(performanceRecordId, feedbackInputs[exerciseId].feedback, Number(feedbackInputs[exerciseId].score), () => {
            toast({
                title: "Feedback updated",
                description: "Feedback has been successfully updated",
            });
        });
    };

    return (
        <ContentContainer>
            <Toaster />
            {selectedImage && (
                <Dialog open={true} onOpenChange={() => setSelectedImage(null)}>
                    <DialogContent className="w-screen max-w-4xl">
                        <img src={selectedImage} alt="Full size" className="w-[80vw] h-auto" />
                    </DialogContent>
                </Dialog>
            )}
            <div className=" flex flex-row justify-around container gap-3 mx-auto p-4 max-w-full">
                <Card className="mb-6 flex-2">
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${student?.name}`} alt={student?.name} />
                                <AvatarFallback>
                                    {student?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-3xl">{student?.name}</CardTitle>
                                <p className="text-gray-500">ID: {student?._id}</p>
                                <div className="flex items-center mt-2">
                                    <Award className="w-6 h-6 text-yellow-500 mr-2" />
                                    <p className="text-xl font-semibold">Total Points: {student?.student_details?.game_points}</p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-xl font-semibold mb-4">Overall Progress</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {classInfo?.progress.map((progress) => (
                                <Card key={progress.moduleCode} className="bg-gray-50">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-lg font-medium">
                                                {classLearningModules.find((module) => module.moduleCode === progress.moduleCode)?.name ||
                                                    "Unknown Module"}
                                            </span>
                                            <Badge variant="outline">{progress.moduleCode}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium">Progress</span>
                                            <span className="text-sm font-medium">{progress.progressPercentage || 0}%</span>
                                        </div>
                                        <Progress value={progress.progressPercentage || 0} className="h-2 mb-2" />
                                        <div className="text-sm text-gray-500">
                                            <p>Completed Lessons: {progress.completedLessons.join(", ")}</p>
                                            <p>Completed Exercises: {progress.completedExercises.join(", ")}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab} className=" flex-1 space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="module-breakdown" className="flex items-center justify-center">
                            <Book className="w-4 h-4 mr-2" />
                            Module Breakdown
                        </TabsTrigger>
                        <TabsTrigger value="extra-points" className="flex items-center justify-center">
                            <Award className="w-4 h-4 mr-2" />
                            Extra Points Log
                        </TabsTrigger>
                        <TabsTrigger value="submissions" className="flex items-center justify-center">
                            <FileText className="w-4 h-4 mr-2" />
                            Submissions
                        </TabsTrigger>
                    </TabsList>
                    <div className="h-[80vh] overflow-hidden">
                        <TabsContent value="module-breakdown" className="bg-white rounded-xl p-3 h-full">
                            <ScrollArea className="h-full rounded-xl  pr-4">
                                {classLearningModules.map((module) => (
                                    <Accordion type="single" collapsible key={module.moduleCode} className="mb-4">
                                        <AccordionItem value={module.moduleCode}>
                                            <AccordionTrigger className="text-lg font-semibold">{module.name}</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-4">
                                                    <h4 className="text-xl font-semibold flex items-center">
                                                        <Book className="w-5 h-5 mr-2" /> Lessons
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {module.lessons.map((lesson) => (
                                                            <Card key={lesson.lessonCode}>
                                                                <CardContent className="p-4">
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div>
                                                                            <h5 className="font-semibold text-lg">{lesson.title}</h5>
                                                                            <p className="text-sm text-gray-500">{lesson.description}</p>
                                                                            <p className="text-sm text-gray-500">Code: {lesson.lessonCode}</p>
                                                                        </div>
                                                                        {classInfo?.performance_records.find(
                                                                            (record) =>
                                                                                lesson.lessonCode &&
                                                                                record.lessonDetails?.lessonCode == lesson.lessonCode
                                                                        )?.lessonDetails?.is_complete ? (
                                                                            <Badge variant="default" className="flex items-center">
                                                                                <CheckCircle className="w-4 h-4" />
                                                                                Completed
                                                                            </Badge>
                                                                        ) : (
                                                                            <Badge variant="destructive" className="flex items-center">
                                                                                <XCircle className="w-4 h-4" />
                                                                                Incomplete
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <img
                                                                        src={"/public/" + lesson.lessonCode + ".png"}
                                                                        alt="Lesson thumbnail"
                                                                        className="w-full h-80 object-scale-down rounded-md cursor-pointer"
                                                                        onClick={() => handleImageClick("/public/" + lesson.lessonCode + ".png")}
                                                                    />
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                    <h4 className="text-xl font-semibold flex items-center">
                                                        <FileText className="w-5 h-5 mr-2" /> Exercises
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {module.exercises.map((exercise) => (
                                                            <Card key={exercise.exerciseCode}>
                                                                <CardContent className="p-4">
                                                                    <div className="space-y-2">
                                                                        <div className="flex justify-between items-start">
                                                                            <div>
                                                                                <h5 className="font-semibold text-lg">{exercise.title}</h5>
                                                                                <p className="text-sm text-gray-500">{exercise.description}</p>
                                                                                <p className="text-sm text-gray-500">Code: {exercise.exerciseCode}</p>
                                                                            </div>
                                                                            <Badge variant="outline" className="flex items-center">
                                                                                <Clock className="w-4 h-4 mr-1" />
                                                                                Attempt{" "}
                                                                                {classInfo?.performance_records.find(
                                                                                    (record) =>
                                                                                        record.exerciseDetails?.exerciseCode === exercise.exerciseCode
                                                                                )?.exerciseDetails?.attempt || 0}
                                                                            </Badge>
                                                                        </div>
                                                                        <p className="text-sm">
                                                                            Score:{" "}
                                                                            {classInfo?.performance_records.find(
                                                                                (record) =>
                                                                                    record.exerciseDetails?.exerciseCode === exercise.exerciseCode
                                                                            )?.exerciseDetails?.score || "Not Scored"}
                                                                            /{exercise.maxScore}
                                                                        </p>
                                                                        <img
                                                                            src={"/public/" + exercise.exerciseCode + ".png"}
                                                                            alt="Lesson thumbnail"
                                                                            className="w-full h-80 object-scale-down rounded-md cursor-pointer"
                                                                            onClick={() =>
                                                                                handleImageClick("/public/" + exercise.exerciseCode + ".png")
                                                                            }
                                                                        />
                                                                        <div>
                                                                            <p className="text-sm font-medium">Student Answer:</p>
                                                                            <div className="text-sm bg-gray-100 p-2 rounded">
                                                                                <Markdown
                                                                                    remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                                                                                    className="flex flex-col gap-4"
                                                                                >
                                                                                    {classInfo?.performance_records.find(
                                                                                        (record) =>
                                                                                            record.exerciseDetails?.exerciseCode ===
                                                                                            exercise.exerciseCode
                                                                                    )?.exerciseDetails?.answers || "Not Answered"}
                                                                                </Markdown>
                                                                            </div>
                                                                        </div>
                                                                        {classInfo?.performance_records.some(
                                                                            (record) => record.exerciseDetails?.exerciseCode === exercise.exerciseCode
                                                                        ) && (
                                                                            <div>
                                                                                <div>
                                                                                    <p className="text-sm font-medium">Feedback:</p>
                                                                                    <p className="text-sm">
                                                                                        {classInfo?.performance_records.find(
                                                                                            (record) =>
                                                                                                record.exerciseDetails?.exerciseCode ===
                                                                                                exercise.exerciseCode
                                                                                        )?.exerciseDetails?.feedback || "No feedback provided"}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="space-y-2 mt-4">
                                                                                    <Input
                                                                                        placeholder="New score"
                                                                                        value={
                                                                                            exercise.exerciseCode
                                                                                                ? feedbackInputs[exercise.exerciseCode]?.score || ""
                                                                                                : ""
                                                                                        }
                                                                                        onChange={(e) =>
                                                                                            handleFeedbackChange(
                                                                                                exercise.exerciseCode || "",
                                                                                                "score",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    <Textarea
                                                                                        placeholder="New feedback"
                                                                                        value={
                                                                                            exercise.exerciseCode
                                                                                                ? feedbackInputs[exercise.exerciseCode]?.feedback || ""
                                                                                                : ""
                                                                                        }
                                                                                        onChange={(e) =>
                                                                                            handleFeedbackChange(
                                                                                                exercise.exerciseCode || "",
                                                                                                "feedback",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    <Button
                                                                                        onClick={() =>
                                                                                            handleFeedbackSubmit(
                                                                                                classInfo?.performance_records.find(
                                                                                                    (record) =>
                                                                                                        record.exerciseDetails?.exerciseCode ===
                                                                                                        exercise.exerciseCode
                                                                                                )?._id || "",
                                                                                                exercise.exerciseCode || ""
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Update Feedback
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="extra-points" className="h-full">
                            <ScrollArea className="h-full pr-4">
                                <div className="space-y-4">
                                    {classInfo?.extra_points_award
                                        .filter((award) => award.student_id === id)
                                        ?.map((point, key) => (
                                            <Card key={key}>
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <Award className="w-6 h-6 text-yellow-500 mr-2" />
                                                            <div>
                                                                <p className="font-semibold text-lg">{point.points} points</p>
                                                                <p className="text-sm text-gray-500">{point.reason}</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className="flex items-center">
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            {point.date_awarded}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="submissions" className="h-full">
                            <ScrollArea className="h-full pr-4">
                                <div className="space-y-4">
                                    {classLearningModules.flatMap((module) =>
                                        module.exercises
                                            .filter((exercise) =>
                                                classInfo?.performance_records.some(
                                                    (record) => record.exerciseDetails?.exerciseCode === exercise.exerciseCode
                                                )
                                            )
                                            .map((exercise) => (
                                                <Card key={exercise.exerciseCode}>
                                                    <CardContent className="p-4">
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h5 className="font-semibold text-lg">{exercise.title}</h5>
                                                                    <p className="text-sm text-gray-500">Module: {module.name}</p>
                                                                    <p className="text-sm text-gray-500">Code: {exercise.exerciseCode}</p>
                                                                </div>
                                                                <Badge variant="outline" className="flex items-center">
                                                                    <Clock className="w-4 h-4 mr-1" />
                                                                    Attempt{" "}
                                                                    {classInfo?.performance_records.find(
                                                                        (record) => record.exerciseDetails?.exerciseCode === exercise.exerciseCode
                                                                    )?.exerciseDetails?.attempt || 0}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <BarChart className="w-5 h-5 mr-2 text-green-500" />
                                                                <p className="text-sm">
                                                                    Score:{" "}
                                                                    {classInfo?.performance_records.find(
                                                                        (record) => record.exerciseDetails?.exerciseCode === exercise.exerciseCode
                                                                    )?.exerciseDetails?.score || "Not Scored"}
                                                                    /{exercise.maxScore}
                                                                </p>
                                                            </div>
                                                            <img
                                                                src={"/public/" + exercise.exerciseCode + ".png"}
                                                                alt="Lesson thumbnail"
                                                                className="w-full h-80 object-scale-down rounded-md cursor-pointer"
                                                                onClick={() => handleImageClick("/public/" + exercise.exerciseCode + ".png")}
                                                            />
                                                            <div>
                                                                <p className="text-sm font-medium">Student Answer:</p>
                                                                <div className="text-sm bg-gray-100 p-2 rounded">
                                                                    <Markdown
                                                                        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                                                                        className="flex flex-col gap-4"
                                                                    >
                                                                        {classInfo?.performance_records.find(
                                                                            (record) => record.exerciseDetails?.exerciseCode === exercise.exerciseCode
                                                                        )?.exerciseDetails?.answers || "Not Answered"}
                                                                    </Markdown>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">Feedback:</p>
                                                                <p className="text-sm">
                                                                    {classInfo?.performance_records.find(
                                                                        (record) => record.exerciseDetails?.exerciseCode === exercise.exerciseCode
                                                                    )?.exerciseDetails?.feedback || "No feedback provided"}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-2 mt-4">
                                                                <Input
                                                                    placeholder="New score"
                                                                    value={
                                                                        exercise.exerciseCode
                                                                            ? feedbackInputs[exercise.exerciseCode]?.score || ""
                                                                            : ""
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleFeedbackChange(exercise.exerciseCode || "", "score", e.target.value)
                                                                    }
                                                                />
                                                                <Textarea
                                                                    placeholder="New feedback"
                                                                    value={
                                                                        exercise.exerciseCode
                                                                            ? feedbackInputs[exercise.exerciseCode]?.feedback || ""
                                                                            : ""
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleFeedbackChange(exercise.exerciseCode || "", "feedback", e.target.value)
                                                                    }
                                                                />
                                                                <Button
                                                                    onClick={() =>
                                                                        handleFeedbackSubmit(
                                                                            classInfo?.performance_records.find(
                                                                                (record) =>
                                                                                    record.exerciseDetails?.exerciseCode === exercise.exerciseCode
                                                                            )?._id || "",
                                                                            exercise.exerciseCode || ""
                                                                        )
                                                                    }
                                                                >
                                                                    Update Feedback
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </ContentContainer>
    );
}
