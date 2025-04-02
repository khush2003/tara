import { useState } from "react";
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
import { Book, Award, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import ContentContainer from "@/components/ContentContainer";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { Exercise, Lesson } from "@/types/dbTypes";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";
import { useUsers } from "@/hooks/useUsers";
import { scoreExerciseSubmissionAPI, setFeedbackAPI } from "@/api/useAPI";
import { useClassroom } from "@/hooks/useClassroom";
import { useExtraPoints } from "@/hooks/useExtraPoints";
import { useUnits } from "@/hooks/useUnit";
import { cn } from "@/lib/utils";

enum VARIENT_TYPE {
    Base = "Base",
    Adventure = "Adventure & Exploration",
    Sports = "Sports & Physical Activities",
    Science = "Science & Technology",
}

export default function StudentProgressDetails() {
    const [activeTab, setActiveTab] = useState("module-breakdown");
    const { studentId, classId } = useParams();

    const { data: units, isLoading: unitsLoading, error: unitsError } = useUnits(classId);

    const { data: classroom, isLoading: classroomLoading, error: classroomError } = useClassroom(classId);

    const { data: extraPoints, isLoading: extraPointsLoading, error: extraPointsError } = useExtraPoints(studentId, classId);

    const studentIdN = studentId || "";
    const { data: students, isLoading: studentLoading, error: studentError, mutate: usersMutate } = useUsers([studentIdN]);

    const student = students?.find((student) => student._id === studentId);

    const [score, setScore] = useState<{ class_progress_info_id: string; exercise_submission_id: string; score: number }[]>([]);

    const [feedback, setFeedback] = useState<
        {
            class_progress_info_id: string;
            exercise_submission_id: string;
            feedback: string;
        }[]
    >([]);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (imageUrl: string | undefined) => {
        if (imageUrl) setSelectedImage(imageUrl);
    };

    const { toast } = useToast();

    const handleFeedbackChange = (exercise_submission_id: string, class_progress_info_id: string, feedback: string) => {
        setFeedback((prev) => {
            const index = prev.findIndex(
                (f) => f.exercise_submission_id === exercise_submission_id && f.class_progress_info_id === class_progress_info_id
            );
            if (index === -1) {
                return [...prev, { exercise_submission_id, class_progress_info_id, feedback }];
            }
            const newFeedback = [...prev];
            newFeedback[index].feedback = feedback;
            return newFeedback;
        });
    };

    const handleScoreChange = (exercise_submission_id: string, class_progress_info_id: string, score: number) => {
        setScore((prev) => {
            const index = prev.findIndex(
                (s) => s.exercise_submission_id === exercise_submission_id && s.class_progress_info_id === class_progress_info_id
            );
            if (index === -1) {
                return [...prev, { exercise_submission_id, class_progress_info_id, score }];
            }
            const newScore = [...prev];
            newScore[index].score = score;
            return newScore;
        });
    };

    if (!student) {
        return <div>Student not found</div>;
    }

    if (extraPointsLoading || unitsLoading || studentLoading || classroomLoading) {
        return <div>Loading...</div>;
    }

    if (extraPointsError || unitsError || studentError || classroomError) {
        return <div>Error: {extraPointsError || unitsError || studentError || extraPointsError}</div>;
    }

    // Find units where unit._id is in classroom.chosen_units
    const classUnits = units?.filter((unit) => classroom?.chosen_units.some((chosenUnit) => chosenUnit.unit === unit._id));

    const handleFeedbackSubmit = async (exercise_submission_id: string, class_progress_info_id: string) => {
        if (studentId) {
            const error = await setFeedbackAPI(
                exercise_submission_id,
                class_progress_info_id,
                feedback.find((f) => f.exercise_submission_id === exercise_submission_id && f.class_progress_info_id === class_progress_info_id)
                    ?.feedback || "",
                studentId
            );
            if (error) {
                toast({
                    title: "Error",
                    description: error,
                });
                return;
            } else {
                toast({
                    title: "Feedback updated",
                    description: "Feedback has been successfully updated",
                });
                usersMutate();
            }
        }
    };

    const handleScoreSubmission = async (exercise_submission_id: string, class_progress_info_id: string) => {
        if (studentId) {
            const error = await scoreExerciseSubmissionAPI(
                exercise_submission_id,
                class_progress_info_id,
                score.find((s) => s.exercise_submission_id === exercise_submission_id && s.class_progress_info_id === class_progress_info_id)
                    ?.score || 0,
                studentId
            );
            if (error) {
                toast({
                    title: "Error",
                    description: error,
                });
                return;
            } else {
                toast({
                    title: "Score updated",
                    description: "Score has been successfully updated",
                });
            }
        }
        usersMutate();
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
                <Card className="mb-6 max-w-3xl">
                    <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                            <Avatar className="h-24 w-24 border-4 border-primary/10">
                                <AvatarImage src={student?.profile_picture} alt={student?.name} />
                                <AvatarFallback className="text-2xl font-bold">
                                    {student?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center sm:text-left">
                                <CardTitle className="text-3xl mb-1">{student?.name}</CardTitle>
                                <p className="text-muted-foreground mb-2">ID: {student?._id}</p>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary">
                                    <Award className="w-5 h-5 mr-2" />
                                    <p className="text-lg font-semibold">{student?.game_profile?.game_points.toFixed(0) || 0} Points</p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-xl font-semibold mb-4">Overall Progress</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {student?.class_progress_info
                                ?.filter((info) => info.class.toString() == classId)
                                ?.map((class_progress_info, index) => {
                                    const completedLessonsNames = class_progress_info.lessons_completed?.map(
                                        (lesson) =>
                                            units
                                                ?.find((unit) => unit.lessons.find((l) => l._id == lesson.toString()))
                                                ?.lessons.find((l) => l._id == lesson.toString())?.title
                                    );
                                    const completedExercisesNames = class_progress_info.exercises?.map(
                                        (ex) =>
                                            units
                                                ?.find((unit) => unit.exercises.find((e) => e._id.toString() == ex.exercise.toString()))
                                                ?.exercises.find((e) => e._id.toString() == ex.exercise.toString())?.title
                                    );
                                    return (
                                        <Card key={index} className="overflow-hidden">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-center">
                                                    <CardTitle className="text-lg">{class_progress_info.unit.name || "Unknown Unit"}</CardTitle>
                                                    <Badge variant="secondary">{class_progress_info.unit.id.toString()}</Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-2">
                                                <div className="flex justify-between items-center mb-1 text-sm">
                                                    <span className="font-medium">Progress</span>
                                                    <span className="font-medium">{class_progress_info.progress_percent.toFixed(2) || 0}%</span>
                                                </div>
                                                <Progress value={class_progress_info.progress_percent || 0} className="h-2 mb-4" />
                                                <div className="space-y-2 text-sm text-muted-foreground">
                                                    <details>
                                                        <summary className="font-medium cursor-pointer">
                                                            Completed Lessons ({class_progress_info.lessons_completed?.length || 0})
                                                        </summary>
                                                        <p className="mt-1 pl-4">
                                                            {class_progress_info.lessons_completed?.length || 0 > 0
                                                                ? completedLessonsNames?.join(", ")
                                                                : "None yet"}
                                                        </p>
                                                    </details>
                                                    <details>
                                                        <summary className="font-medium cursor-pointer">
                                                            Completed Exercises ({class_progress_info.exercises?.length || 0})
                                                        </summary>
                                                        <p className="mt-1 pl-4">
                                                            {class_progress_info.exercises?.length || 0 > 0
                                                                ? completedExercisesNames?.join(", ")
                                                                : "None yet"}
                                                        </p>
                                                    </details>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
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
                            <ScrollArea className="h-full rounded-xl px-4 p-y-6">
                                {classUnits?.map((unit, key) => {
                                    const sortedExercises = unit.exercises.sort((a, b) => {
                                        return a.order - b.order;
                                    });
                                    const sortedLessons = unit.lessons.sort((a, b) => {
                                        return a.order - b.order;
                                    });
                                    return (
                                        <Accordion type="single" collapsible key={key} className="mb-4">
                                            <AccordionItem value={unit._id}>
                                                <AccordionTrigger className="text-lg font-semibold">{unit.name}</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-4">
                                                        <Accordion type="single" collapsible key={0} className="mb-4">
                                                            <AccordionItem value={unit._id + "0"}>
                                                                <AccordionTrigger className="text-xl font-semibold">
                                                                    <h4 className="text-xl font-semibold flex items-center">
                                                                        <Book className="w-5 h-5 mr-2" /> Lessons
                                                                    </h4>
                                                                </AccordionTrigger>
                                                                <AccordionContent>
                                                                    <div className="grid grid-cols-1 gap-4 p-6">
                                                                        {sortedLessons.map((l) => {
                                                                            const lesson = l as unknown as Lesson;
                                                                            return (
                                                                                <Card key={lesson._id}>
                                                                                    <CardContent className="p-4">
                                                                                        <div className="flex justify-between items-start mb-2">
                                                                                            <div>
                                                                                                <h5 className="font-semibold text-lg">
                                                                                                    {lesson.title}
                                                                                                </h5>
                                                                                                <p className="text-sm text-gray-500">
                                                                                                    {lesson.description}
                                                                                                </p>
                                                                                                <p className="text-sm text-gray-500">
                                                                                                    Code: {lesson._id}
                                                                                                </p>
                                                                                            </div>
                                                                                            {student?.class_progress_info
                                                                                                ?.find(
                                                                                                    (progress) =>
                                                                                                        progress.class.toString() == classId &&
                                                                                                    progress.unit.id.toString() == unit._id.toString()
                                                                                                )
                                                                                                ?.lessons_completed?.find(
                                                                                                    (l) => l.toString() == lesson._id
                                                                                                ) ? (
                                                                                                <Badge
                                                                                                    variant="default"
                                                                                                    className="flex items-center"
                                                                                                >
                                                                                                    <CheckCircle className="w-4 h-4" />
                                                                                                    Completed
                                                                                                </Badge>
                                                                                            ) : (
                                                                                                <Badge
                                                                                                    variant="destructive"
                                                                                                    className="flex items-center"
                                                                                                >
                                                                                                    <XCircle className="w-4 h-4" />
                                                                                                    Incomplete
                                                                                                </Badge>
                                                                                            )}
                                                                                        </div>
                                                                                        {lesson.image ? (
                                                                                            <img
                                                                                                src={lesson.image}
                                                                                                alt="Lesson thumbnail"
                                                                                                className="w-full h-80 object-scale-down rounded-md cursor-pointer"
                                                                                                onClick={() => handleImageClick(lesson.image)}
                                                                                            />
                                                                                        ) : (
                                                                                            <div className="w-full h-80 bg-gray-100 rounded-xl flex flex-col justify-center items-center text-center">
                                                                                                <p className="text-base">No preview available yet!</p>
                                                                                            </div>
                                                                                        )}
                                                                                    </CardContent>
                                                                                </Card>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        </Accordion>

                                                        <Accordion type="single" collapsible key={1} className="mb-4">
                                                            <AccordionItem value={unit._id + "1"}>
                                                                <AccordionTrigger className="text-xl font-semibold">
                                                                    <h4 className="text-xl font-semibold flex items-center">
                                                                        <FileText className="w-5 h-5 mr-2" /> Exercises
                                                                    </h4>
                                                                </AccordionTrigger>
                                                                <AccordionContent>
                                                                    <div className="grid grid-cols-1 gap-4 p-6">
                                                                        {sortedExercises.map((e) => {
                                                                            const exercise = e as unknown as Exercise;
                                                                            const classProgressInfo = student?.class_progress_info.find(
                                                                                (progress) =>
                                                                                    progress.class.toString() == classId &&
                                                                                progress.unit.id.toString() == unit._id.toString()
                                                                            ) as unknown as
                                                                                | ((typeof student.class_progress_info)[0] & { _id: string })
                                                                                | undefined;
                                                                            const exerciseProgress = classProgressInfo?.exercises?.find(
                                                                                (ex) => ex.exercise.toString() == exercise._id
                                                                            ) as unknown as
                                                                                | {
                                                                                      exercise: string;
                                                                                      attempts: {
                                                                                          attempt_number: number;
                                                                                          score: number;
                                                                                          answers: string;
                                                                                      }[];
                                                                                      best_score: number;
                                                                                      coins_earned: number;
                                                                                      feedback: string;
                                                                                      _id: string;
                                                                                  }
                                                                                | undefined;
                                                                            const varientType =
                                                                                exercise.varients.find((v) => v.id == exercise._id)?.type || "Base";
                                                                            const num_attempts = exerciseProgress?.attempts.length || 0;
                                                                            const color =
                                                                                varientType == VARIENT_TYPE.Sports
                                                                                    ? "bg-purple-600"
                                                                                    : varientType == VARIENT_TYPE.Adventure
                                                                                    ? "bg-green-600"
                                                                                    : varientType == VARIENT_TYPE.Science
                                                                                    ? "bg-blue-600"
                                                                                    : "bg-black";
                                                                            const isStudentVarientType = !!student.learning_preferences.find(
                                                                                (l) => l == varientType
                                                                            );
                                                                            return (
                                                                                <Card key={exercise._id}>
                                                                                    <CardContent
                                                                                        className={cn(
                                                                                            "p-4",
                                                                                            isStudentVarientType ? "bg-gray-200" : ""
                                                                                        )}
                                                                                    >
                                                                                        <div className="space-y-2">
                                                                                            <div className="space-y-4">
                                                                                                <div className="flex justify-between items-start">
                                                                                                    <div className="space-y-2">
                                                                                                        <h5 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                                                                            {exercise.title}
                                                                                                        </h5>
                                                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                                                            {exercise.description}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                    <div className="flex flex-wrap gap-2">
                                                                                                        <Badge
                                                                                                            variant={
                                                                                                                num_attempts === 0
                                                                                                                    ? "destructive"
                                                                                                                    : "default"
                                                                                                            }
                                                                                                            className="flex items-center px-2 py-1"
                                                                                                        >
                                                                                                            <Clock className="w-3 h-3 mr-1" />
                                                                                                            <span>
                                                                                                                {exerciseProgress?.attempts.length ||
                                                                                                                    0}{" "}
                                                                                                                Attempts
                                                                                                            </span>
                                                                                                        </Badge>
                                                                                                        <Badge
                                                                                                            variant="default"
                                                                                                            className={cn(
                                                                                                                "flex items-center px-2 py-1",
                                                                                                                color
                                                                                                            )}
                                                                                                        >
                                                                                                            <Clock className="w-3 h-3 mr-1" />
                                                                                                            <span>{varientType}</span>
                                                                                                        </Badge>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                                                                                    <div className="flex items-center space-x-2">
                                                                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                                                                            Best Score:
                                                                                                        </span>
                                                                                                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                                                                            {exerciseProgress?.best_score ||
                                                                                                                "Not Scored"}
                                                                                                            /{exercise.max_score}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    <div className="flex items-center space-x-2">
                                                                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                                                                            Coins Earned:
                                                                                                        </span>
                                                                                                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                                                                            {exerciseProgress?.coins_earned || "0"}/
                                                                                                            {exercise.max_score}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                {exercise.image ? (
                                                                                                    <img
                                                                                                        src={exercise.image}
                                                                                                        alt="Exercise preview"
                                                                                                        className="w-full h-80 object-cover rounded-lg shadow-md cursor-zoom-in transition-transform hover:scale-[1.02]"
                                                                                                        onClick={() =>
                                                                                                            handleImageClick(exercise.image)
                                                                                                        }
                                                                                                    />
                                                                                                ) : (
                                                                                                    <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col justify-center items-center text-center">
                                                                                                        <svg
                                                                                                            className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4"
                                                                                                            fill="none"
                                                                                                            viewBox="0 0 24 24"
                                                                                                            stroke="currentColor"
                                                                                                        >
                                                                                                            <path
                                                                                                                strokeLinecap="round"
                                                                                                                strokeLinejoin="round"
                                                                                                                strokeWidth={2}
                                                                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                                                            />
                                                                                                        </svg>
                                                                                                        <p className="text-base text-gray-600 dark:text-gray-400">
                                                                                                            No preview available yet!
                                                                                                        </p>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                            <div>
                                                                                                {exerciseProgress?.attempts[
                                                                                                    exerciseProgress?.attempts.length - 1
                                                                                                ] && (
                                                                                                    <p className="text-sm">
                                                                                                        Score:{" "}
                                                                                                        {
                                                                                                            exerciseProgress?.attempts[
                                                                                                                exerciseProgress?.attempts.length - 1
                                                                                                            ]?.score
                                                                                                        }
                                                                                                    </p>
                                                                                                )}
                                                                                                <p className="text-md font-medium py-4">
                                                                                                    Latest Answer:
                                                                                                </p>
                                                                                                <div className="text-sm bg-gray-100 p-2 rounded">
                                                                                                    <Markdown
                                                                                                        remarkPlugins={[
                                                                                                            [remarkGfm, { singleTilde: false }],
                                                                                                        ]}
                                                                                                        className="flex flex-col gap-4"
                                                                                                    >
                                                                                                        {exerciseProgress?.attempts[
                                                                                                            exerciseProgress?.attempts.length - 1
                                                                                                        ]?.answers || "Not Answered"}
                                                                                                    </Markdown>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <p className="text-md font-medium py-4">
                                                                                                        Correct Answers:
                                                                                                    </p>
                                                                                                    {exercise.is_instant_scored && (
                                                                                                        <div className="text-sm bg-gray-100 p-2 rounded">
                                                                                                            <Markdown
                                                                                                                remarkPlugins={[
                                                                                                                    [
                                                                                                                        remarkGfm,
                                                                                                                        { singleTilde: false },
                                                                                                                    ],
                                                                                                                ]}
                                                                                                                className="flex flex-col gap-4"
                                                                                                            >
                                                                                                                {exercise.correct_answers.toString() ||
                                                                                                                    "No answers provided"}
                                                                                                            </Markdown>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>

                                                                                                {exerciseProgress?.attempts.map((attempt, index) => (
                                                                                                    <Accordion
                                                                                                        type="single"
                                                                                                        collapsible
                                                                                                        key={index}
                                                                                                        className="mb-2"
                                                                                                    >
                                                                                                        <AccordionItem
                                                                                                            value={attempt.attempt_number.toString()}
                                                                                                        >
                                                                                                            <AccordionTrigger className="text-sm font-medium">
                                                                                                                Attempt {attempt.attempt_number}
                                                                                                            </AccordionTrigger>
                                                                                                            <AccordionContent>
                                                                                                                <div className="space-y-2">
                                                                                                                    <p className="text-sm">
                                                                                                                        Score: {attempt.score}
                                                                                                                    </p>
                                                                                                                    <div className="text-sm bg-gray-100 p-2 rounded">
                                                                                                                        <Markdown
                                                                                                                            remarkPlugins={[
                                                                                                                                [
                                                                                                                                    remarkGfm,
                                                                                                                                    {
                                                                                                                                        singleTilde:
                                                                                                                                            false,
                                                                                                                                    },
                                                                                                                                ],
                                                                                                                            ]}
                                                                                                                            className="flex flex-col gap-4"
                                                                                                                        >
                                                                                                                            {attempt.answers ||
                                                                                                                                "No answers provided"}
                                                                                                                        </Markdown>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </AccordionContent>
                                                                                                        </AccordionItem>
                                                                                                    </Accordion>
                                                                                                ))}
                                                                                            </div>
                                                                                            {exerciseProgress?.attempts &&
                                                                                                exerciseProgress.attempts.length > 0 && (
                                                                                                    <div>
                                                                                                        <div>
                                                                                                            <p className="text-sm font-medium">
                                                                                                                Feedback:
                                                                                                            </p>
                                                                                                            <p className="text-sm">
                                                                                                                {exerciseProgress?.feedback ||
                                                                                                                    "No feedback provided"}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                        <div className="space-y-2 mt-4">
                                                                                                            <Input
                                                                                                                placeholder="New score"
                                                                                                                value={
                                                                                                                    score.find(
                                                                                                                        (item) =>
                                                                                                                            item.class_progress_info_id ==
                                                                                                                                classProgressInfo?._id &&
                                                                                                                            item.exercise_submission_id ==
                                                                                                                                exerciseProgress?._id
                                                                                                                    )?.score || ""
                                                                                                                }
                                                                                                                onChange={(e) =>
                                                                                                                    handleScoreChange(
                                                                                                                        exerciseProgress?._id || "",
                                                                                                                        classProgressInfo?._id || "",
                                                                                                                        parseInt(e.target.value)
                                                                                                                    )
                                                                                                                }
                                                                                                            />
                                                                                                            <Button
                                                                                                                onClick={() =>
                                                                                                                    handleScoreSubmission(
                                                                                                                        exerciseProgress?._id || "",
                                                                                                                        classProgressInfo?._id || ""
                                                                                                                    )
                                                                                                                }
                                                                                                            >
                                                                                                                Update Score
                                                                                                            </Button>
                                                                                                            <Textarea
                                                                                                                placeholder="New feedback"
                                                                                                                value={
                                                                                                                    feedback.find(
                                                                                                                        (item) =>
                                                                                                                            item.class_progress_info_id ==
                                                                                                                                classProgressInfo?._id &&
                                                                                                                            item.exercise_submission_id ==
                                                                                                                                exerciseProgress?._id
                                                                                                                    )?.feedback || ""
                                                                                                                }
                                                                                                                onChange={(e) =>
                                                                                                                    handleFeedbackChange(
                                                                                                                        exerciseProgress?._id || "",
                                                                                                                        classProgressInfo?._id || "",
                                                                                                                        e.target.value
                                                                                                                    )
                                                                                                                }
                                                                                                            />
                                                                                                            <Button
                                                                                                                onClick={() =>
                                                                                                                    handleFeedbackSubmit(
                                                                                                                        exerciseProgress?._id || "",
                                                                                                                        classProgressInfo?._id || ""
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
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        </Accordion>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    );
                                })}
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="extra-points" className="h-full">
                            <ScrollArea className="h-full pr-4">
                                <div className="space-y-4">
                                    {extraPoints?.map((point, key) => (
                                        <Card key={key}>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <Award className="w-6 h-6 text-yellow-500 mr-2" />
                                                        <div>
                                                            <p className="font-semibold text-lg">{point.amount} points</p>
                                                            <p className="text-sm text-gray-500">{point.details}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {new Date(point.createdAt).toLocaleString()}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="submissions" className="bg-white rounded-xl p-3 h-full">
                            <ScrollArea className="h-full pr-4">
                                <div className="space-y-4">
                                    {classUnits?.map((unit, key) => (
                                        <Accordion type="single" collapsible key={key} className="mb-4">
                                            <AccordionItem value={unit._id}>
                                                <AccordionTrigger className="text-lg font-semibold">{unit.name}</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-4">
                                                        <h4 className="text-xl font-semibold flex items-center">
                                                            <Book className="w-5 h-5 mr-2" /> Submissions
                                                        </h4>
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {unit.exercises
                                                                .filter((exx) => {
                                                                    const e = exx as unknown as Exercise;
                                                                    const exerciseProgress = student?.class_progress_info
                                                                        .find(
                                                                            (progress) =>
                                                                                progress.class.toString() == classId &&
                                                                                progress.unit.id.toString() == unit._id.toString()
                                                                        )
                                                                        ?.exercises?.find((ex) => ex.exercise.toString() == e._id);
                                                                    return exerciseProgress?.attempts && exerciseProgress.attempts.length > 0;
                                                                })
                                                                .map((e) => {
                                                                    const exercise = e as unknown as Exercise;
                                                                    
                                                                    const classProgressInfo = student?.class_progress_info.find(
                                                                        (progress) =>
                                                                            progress.class.toString() == classId &&
                                                                            progress.unit.id.toString() == unit._id.toString()
                                                                    ) as unknown as
                                                                        | ((typeof student.class_progress_info)[0] & { _id: string })
                                                                        | undefined;
                                                                    const exerciseProgress = classProgressInfo?.exercises?.find(
                                                                        (ex) => ex.exercise.toString() == exercise._id
                                                                    ) as unknown as
                                                                        | {
                                                                              exercise: string;
                                                                              attempts: { attempt_number: number; score: number; answers: string }[];
                                                                              best_score: number;
                                                                              coins_earned: number;
                                                                              feedback: string;
                                                                              _id: string;
                                                                          }
                                                                        | undefined;
                                                                    console.log(exerciseProgress);
                                                                    const varientType =
                                                                        exercise.varients.find((v) => v.id == exercise._id)?.type || "Base";
                                                                    const num_attempts = exerciseProgress?.attempts.length || 0;
                                                                    const color =
                                                                        varientType == VARIENT_TYPE.Sports
                                                                            ? "bg-purple-600"
                                                                            : varientType == VARIENT_TYPE.Adventure
                                                                            ? "bg-green-600"
                                                                            : varientType == VARIENT_TYPE.Science
                                                                            ? "bg-blue-600"
                                                                            : "bg-black";
                                                                    return (
                                                                        <Card key={exercise._id}>
                                                                            <CardContent className="p-4">
                                                                                <div className="space-y-2">
                                                                                    <div className="space-y-4">
                                                                                        <div className="flex justify-between items-start">
                                                                                            <div className="space-y-2">
                                                                                                <h5 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                                                                    {exercise.title}
                                                                                                </h5>
                                                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                                                    {exercise.description}
                                                                                                </p>
                                                                                            </div>
                                                                                            <div className="flex flex-wrap gap-2">
                                                                                                <Badge
                                                                                                    variant={
                                                                                                        num_attempts === 0 ? "destructive" : "default"
                                                                                                    }
                                                                                                    className="flex items-center px-2 py-1"
                                                                                                >
                                                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                                                    <span>
                                                                                                        {exerciseProgress?.attempts.length || 0}{" "}
                                                                                                        Attempts
                                                                                                    </span>
                                                                                                </Badge>
                                                                                                <Badge
                                                                                                    variant="default"
                                                                                                    className={cn(
                                                                                                        "flex items-center px-2 py-1",
                                                                                                        color
                                                                                                    )}
                                                                                                >
                                                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                                                    <span>{varientType}</span>
                                                                                                </Badge>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                                                                    Best Score:
                                                                                                </span>
                                                                                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                                                                    {exerciseProgress?.best_score || "Not Scored"}/
                                                                                                    {exercise.max_score}
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                                                                    Coins Earned:
                                                                                                </span>
                                                                                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                                                                    {exerciseProgress?.coins_earned || "0"}/
                                                                                                    {exercise.max_score}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        {exercise.image ? (
                                                                                            <img
                                                                                                src={exercise.image}
                                                                                                alt="Exercise preview"
                                                                                                className="w-full h-80 object-cover rounded-lg shadow-md cursor-zoom-in transition-transform hover:scale-[1.02]"
                                                                                                onClick={() => handleImageClick(exercise.image)}
                                                                                            />
                                                                                        ) : (
                                                                                            <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col justify-center items-center text-center">
                                                                                                <svg
                                                                                                    className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4"
                                                                                                    fill="none"
                                                                                                    viewBox="0 0 24 24"
                                                                                                    stroke="currentColor"
                                                                                                >
                                                                                                    <path
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                        strokeWidth={2}
                                                                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                                                    />
                                                                                                </svg>
                                                                                                <p className="text-base text-gray-600 dark:text-gray-400">
                                                                                                    No preview available yet!
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div>
                                                                                        {exerciseProgress?.attempts[
                                                                                            exerciseProgress?.attempts.length - 1
                                                                                        ] && (
                                                                                            <p className="text-sm">
                                                                                                Score:{" "}
                                                                                                {
                                                                                                    exerciseProgress?.attempts[
                                                                                                        exerciseProgress?.attempts.length - 1
                                                                                                    ]?.score
                                                                                                }
                                                                                            </p>
                                                                                        )}
                                                                                        <p className="text-md font-medium py-4">Latest Answer:</p>
                                                                                        <div className="text-sm bg-gray-100 p-2 rounded">
                                                                                            <Markdown
                                                                                                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                                                                                                className="flex flex-col gap-4"
                                                                                            >
                                                                                                {exerciseProgress?.attempts[
                                                                                                    exerciseProgress?.attempts.length - 1
                                                                                                ]?.answers || "Not Answered"}
                                                                                            </Markdown>
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-md font-medium py-4">
                                                                                                Correct Answers:
                                                                                            </p>
                                                                                            {exercise.is_instant_scored && (
                                                                                                <div className="text-sm bg-gray-100 p-2 rounded">
                                                                                                    <Markdown
                                                                                                        remarkPlugins={[
                                                                                                            [remarkGfm, { singleTilde: false }],
                                                                                                        ]}
                                                                                                        className="flex flex-col gap-4"
                                                                                                    >
                                                                                                        {exercise.correct_answers.toString() ||
                                                                                                            "No answers provided"}
                                                                                                    </Markdown>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>

                                                                                        {exerciseProgress?.attempts.map((attempt, index) => (
                                                                                            <Accordion
                                                                                                type="single"
                                                                                                collapsible
                                                                                                key={index}
                                                                                                className="mb-2"
                                                                                            >
                                                                                                <AccordionItem
                                                                                                    value={attempt.attempt_number.toString()}
                                                                                                >
                                                                                                    <AccordionTrigger className="text-sm font-medium">
                                                                                                        Attempt {attempt.attempt_number}
                                                                                                    </AccordionTrigger>
                                                                                                    <AccordionContent>
                                                                                                        <div className="space-y-2">
                                                                                                            <p className="text-sm">
                                                                                                                Score: {attempt.score}
                                                                                                            </p>
                                                                                                            <div className="text-sm bg-gray-100 p-2 rounded">
                                                                                                                <Markdown
                                                                                                                    remarkPlugins={[
                                                                                                                        [
                                                                                                                            remarkGfm,
                                                                                                                            { singleTilde: false },
                                                                                                                        ],
                                                                                                                    ]}
                                                                                                                    className="flex flex-col gap-4"
                                                                                                                >
                                                                                                                    {attempt.answers ||
                                                                                                                        "No answers provided"}
                                                                                                                </Markdown>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </AccordionContent>
                                                                                                </AccordionItem>
                                                                                            </Accordion>
                                                                                        ))}
                                                                                    </div>
                                                                                    {exerciseProgress?.attempts &&
                                                                                        exerciseProgress.attempts.length > 0 && (
                                                                                            <div>
                                                                                                <div>
                                                                                                    <p className="text-sm font-medium">Feedback:</p>
                                                                                                    <p className="text-sm">
                                                                                                        {exerciseProgress?.feedback ||
                                                                                                            "No feedback provided"}
                                                                                                    </p>
                                                                                                </div>
                                                                                                <div className="space-y-2 mt-4">
                                                                                                    <Input
                                                                                                        placeholder="New score"
                                                                                                        value={
                                                                                                            score.find(
                                                                                                                (item) =>
                                                                                                                    item.class_progress_info_id ==
                                                                                                                        classProgressInfo?._id &&
                                                                                                                    item.exercise_submission_id ==
                                                                                                                        exerciseProgress?._id
                                                                                                            )?.score || ""
                                                                                                        }
                                                                                                        onChange={(e) =>
                                                                                                            handleScoreChange(
                                                                                                                exerciseProgress?._id || "",
                                                                                                                classProgressInfo?._id || "",
                                                                                                                parseInt(e.target.value)
                                                                                                            )
                                                                                                        }
                                                                                                    />
                                                                                                    <Button
                                                                                                        onClick={() =>
                                                                                                            handleScoreSubmission(
                                                                                                                exerciseProgress?._id || "",
                                                                                                                classProgressInfo?._id || ""
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        Update Score
                                                                                                    </Button>
                                                                                                    <Textarea
                                                                                                        placeholder="New feedback"
                                                                                                        value={
                                                                                                            feedback.find(
                                                                                                                (item) =>
                                                                                                                    item.class_progress_info_id ==
                                                                                                                        classProgressInfo?._id &&
                                                                                                                    item.exercise_submission_id ==
                                                                                                                        exerciseProgress?._id
                                                                                                            )?.feedback || ""
                                                                                                        }
                                                                                                        onChange={(e) =>
                                                                                                            handleFeedbackChange(
                                                                                                                exerciseProgress?._id || "",
                                                                                                                classProgressInfo?._id || "",
                                                                                                                e.target.value
                                                                                                            )
                                                                                                        }
                                                                                                    />
                                                                                                    <Button
                                                                                                        onClick={() =>
                                                                                                            handleFeedbackSubmit(
                                                                                                                exerciseProgress?._id || "",
                                                                                                                classProgressInfo?._id || ""
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
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </ContentContainer>
    );
}
