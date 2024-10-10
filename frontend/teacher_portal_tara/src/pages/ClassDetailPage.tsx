import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book, RefreshCcw, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ContentContainer from "@/components/ContentContainer";
import useLearningStore from "@/stores/learningStore";
import useClassroomStore from "@/stores/classroomStore";
import { useParams } from "react-router-dom";
import { Classroom } from "@/types/dbTypes";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster"

export default function ClassDetailsPage() {
    const [learningModules, moduleLoading, moduleError, fetchLearningModules] = useLearningStore((state) => [
        state.learningModules,
        state.moduleLoading,
        state.moduleError,
        state.fetchLearningModules,
    ]);
    const [
        classrooms,
        classroomLoading,
        classroomError,
        fetchAllClassrooms,
        setTodayLesson,
        postAnnouncement,
        setIsGameActive,
        updateLearningModules,
        awardExtraPoints,
    ] = useClassroomStore((state) => [
        state.classrooms,
        state.classroomLoading,
        state.classroomError,
        state.fetchAllClassrooms,
        state.setTodayLesson,
        state.postAnnouncement,
        state.setIsGameActive,
        state.updateLearningModules,
        state.awardExtraPoints,
    ]);

    const { toast } = useToast()
    const { id } = useParams();

    const [todaysLesson, setTodaysLesson] = useState(
        classrooms?.find((classroom) => classroom.classroom_code === id)?.today_lesson?.name || "No Lesson Set"
    );
    const [announcement, setAnnouncement] = useState(classrooms?.find((classroom) => classroom.classroom_code === id)?.announcement || "");
    const [gameRestrictionEnabled, setGameRestrictionEnabled] = useState(
        classrooms?.find((classroom) => classroom.classroom_code === id)?.is_game_active || false
    );
    const [gameRestrictionPeriod, setGameRestrictionPeriod] = useState({
        start: classrooms?.find((classroom) => classroom.classroom_code === id)?.game_restriction_period?.start || "",
        end: classrooms?.find((classroom) => classroom.classroom_code === id)?.game_restriction_period?.end || "",
    });
    const [selectedModules, setSelectedModules] = useState(
        classrooms?.find((classroom) => classroom.classroom_code === id)?.learning_modules.map((module) => module.moduleCode) || []
    );
    const [extraPoints, setExtraPoints] = useState({ student: "", points: 0, reason: "" });
    const [classInfo, setClassInfo] = useState<Classroom>();

    useEffect(() => {
        if (!learningModules) {
            fetchLearningModules();
        }
        if (!classrooms) {
            fetchAllClassrooms();
        }

        if (classrooms) {
            const foundClass = classrooms?.find((classroom) => classroom.classroom_code === id);
            setClassInfo(foundClass);

            setTodaysLesson(foundClass?.today_lesson?.moduleCode || "No Lesson Set");
            setAnnouncement(foundClass?.announcement || "");
            setGameRestrictionEnabled(!foundClass?.is_game_active || false);
            setGameRestrictionPeriod(foundClass?.game_restriction_period || { start: "", end: "" });
            setSelectedModules(foundClass?.learning_modules.map((module) => module.moduleCode) || []);
        }
    }, [id, classrooms, fetchAllClassrooms, fetchLearningModules, learningModules]);

    const toggleModuleSelection = (moduleCode: string) => {
        setSelectedModules((prev) => (prev.includes(moduleCode) ? prev.filter((id) => id !== moduleCode) : [...prev, moduleCode]));
    };

    const handleExtraPointsSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setExtraPoints({ student: "", points: 0, reason: "" });
        if (id) awardExtraPoints(id, extraPoints.student, extraPoints.points, extraPoints.reason, () => toast({title: "Extra points awarded successfully"}));
    };

    if (moduleLoading || classroomLoading) {
        return <div>Loading...</div>;
    }

    if (moduleError || classroomError) {
        return (
            <div>
                {moduleError && "Module Error: " + moduleError} {classroomError && "Classroom Error: " + classroomError}{" "}
            </div>
        );
    }

    return (
        <ContentContainer>
            <div className="container mx-auto p-6">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">{classInfo?.classroom_name}</CardTitle>
                        <CardDescription>Class Code: {classInfo?.classroom_code}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <Users className="h-5 w-5 text-gray-500" />
                                <span>{classInfo?.students_enrolled.length} Students</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Book className="h-5 w-5 text-gray-500" />
                                <span>{classInfo?.learning_modules.length} Modules</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Toaster />

                <Tabs defaultValue="students" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="students">Students List</TabsTrigger>
                        <TabsTrigger value="lesson">Today's Lesson</TabsTrigger>
                        <TabsTrigger value="announcement">Class Announcement</TabsTrigger>
                        <TabsTrigger value="game-restriction">Game Restrictions</TabsTrigger>

                        <TabsTrigger value="modules">Learning Modules</TabsTrigger>
                        <TabsTrigger value="extra-points">Award Extra Points</TabsTrigger>
                    </TabsList>

                    <TabsContent value="lesson">
                        <Card>
                            <CardHeader>
                                <CardTitle>Today's Lesson</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select value={todaysLesson} onValueChange={setTodaysLesson}>
                                    <SelectTrigger className="w-full text-black">
                                        <SelectValue placeholder="Select a lesson" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {learningModules?.map((lesson) => (
                                            <SelectItem key={lesson._id} value={lesson.moduleCode}>
                                                {lesson.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={() => {
                                        if (id) setTodayLesson(todaysLesson, id, () => toast({title: "Lesson set successfully"}));
                                    }}
                                    className="mt-4"
                                >
                                    Set as Today's Lesson
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="announcement">
                        <Card>
                            <CardHeader>
                                <CardTitle>Class Announcement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Enter your announcement here"
                                    value={announcement}
                                    onChange={(e) => setAnnouncement(e.target.value)}
                                />
                                <div className="flex justify-between mt-4">
                                    <Button
                                        onClick={() => {
                                            if (id) postAnnouncement(id, announcement, () => toast({title: "Announcement posted successfully"}));
                                        }}
                                    >
                                        Post Announcement
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (id) postAnnouncement(id, "", () => toast({title: "Announcement removed!"}));
                                            setAnnouncement("");
                                        }}
                                        variant="outline"
                                    >
                                        Remove Announcement
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="game-restriction">
                        <Card>
                            <CardHeader>
                                <CardTitle>Game Restrictions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2 mb-4">
                                    <Switch
                                        id="game-restriction"
                                        checked={gameRestrictionEnabled}
                                        onCheckedChange={() => {
                                            if (id) setIsGameActive(id, gameRestrictionEnabled, () => toast({title: "Game Active status updated!"}));
                                            setGameRestrictionEnabled(!gameRestrictionEnabled);
                                        }}
                                    />
                                    <Label htmlFor="game-restriction">Block Game Now</Label>
                                </div>
                                <p className="text-gray-600">
                                    Turn this on if you want to stop the student from accessing the game currently or during your lecture
                                </p>
                                <p className="text-xl font-medium mt-8 mb-2">General Game Restriction Period</p>
                                <p className="text-gray-600">Set the time period when students are not allowed to play games.</p>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="start-time">Start Time</Label>
                                        <Input
                                            id="start-time"
                                            type="time"
                                            value={
                                                gameRestrictionPeriod.start
                                                    ? new Date(gameRestrictionPeriod.start).toLocaleTimeString("en-GB", {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      })
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                const [hours, minutes] = e.target.value.split(":").map(Number);
                                                const newDate = new Date();
                                                newDate.setHours(hours, minutes);
                                                setGameRestrictionPeriod({
                                                    ...gameRestrictionPeriod,
                                                    start: newDate,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end-time">End Time</Label>
                                        <Input
                                            id="end-time"
                                            type="time"
                                            value={
                                                gameRestrictionPeriod.end
                                                    ? new Date(gameRestrictionPeriod.end).toLocaleTimeString("en-GB", {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      })
                                                    : ""
                                            }
                                            onChange={(e) => {
                                                const [hours, minutes] = e.target.value.split(":").map(Number);
                                                const newDate = new Date();
                                                newDate.setHours(hours, minutes);
                                                setGameRestrictionPeriod({
                                                    ...gameRestrictionPeriod,
                                                    end: newDate,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="students">
                        <div className="flex flex-row w-full gap-3">
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle>Students Enrolled</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                                        {Array.from(new Set(classInfo?.progress.map((progress) => progress.studentId))).map((studentId) => {
                                            const studentProgress = classInfo?.progress.filter((progress) => progress.studentId === studentId)[0];
                                            return (
                                                <div key={studentProgress?.studentId} className="mb-6 last:mb-0">
                                                    <div className="mb-6 last:mb-0">
                                                        <div className="flex items-center justify-between py-2">
                                                            <div className="flex items-center space-x-4">
                                                                <Avatar>
                                                                    <AvatarFallback>
                                                                        {studentProgress?.studentName
                                                                            .split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="text-sm font-medium">{studentProgress?.studentName}</p>
                                                                    <p className="text-sm text-gray-500">ID: {studentProgress?.studentId}</p>
                                                                </div>
                                                            </div>
                                                            <Button variant="outline">View Progress Details</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            <Card className="w-full">
                                <CardHeader className="flex flex-row justify-between items-center">
                                    <CardTitle>Quick Overview of Student Progress</CardTitle>
                                    <Button
                                        onClick={() => {
                                            if (id) fetchAllClassrooms();
                                        }}
                                        className="p-2"
                                    >
                                        <RefreshCcw />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[400px] w-full px-4">
                                        {classInfo?.progress.map((progress) => (
                                            <Card
                                                key={progress.moduleCode + progress.studentId}
                                                className="mb-6 bg-white border border-gray-200 rounded-lg last:mb-0"
                                            >
                                                <CardHeader className="border-b border-gray-200">
                                                    <div className="flex flex-row justify-between">
                                                        Module:{" "}
                                                        {learningModules?.find((module) => module.moduleCode === progress.moduleCode)?.name ||
                                                            progress.moduleCode}
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                progress.progressPercentage == 100
                                                                    ? "text-green-500 border-green-500"
                                                                    : "text-blue-500 border-blue-500"
                                                            }
                                                        >
                                                            {progress.progressPercentage == 100 ? "Complete" : "In Progress"}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="mt-4 last:mb-0">
                                                    <div className="flex items-center justify-between py-2">
                                                        <div className="flex items-center space-x-4">
                                                            <Avatar>
                                                                <AvatarFallback>
                                                                    {progress.studentName
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("")}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-medium">{progress.studentName}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm font-medium text-gray-800">Progress</span>
                                                            <span className="text-sm font-medium">{progress.progressPercentage}%</span>
                                                        </div>
                                                        <Progress value={progress.progressPercentage} className="w-full bg-gray-200" />
                                                    </div>
                                                    <div className="mt-4 space-y-2">
                                                        <p className="text-sm font-medium text-gray-800">Completed:</p>
                                                        <div className="flex items-center space-x-2">
                                                            <Book className={`h-4 w-4 text-gray-800`} />
                                                            <p className={`text-sm text-gray-800`}>
                                                                Lessons:{" "}
                                                                {progress.completedLessons.length > 0
                                                                    ? progress.completedLessons.join(", ")
                                                                    : "None yet"}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Trophy className={`h-4 w-4 text-gray-800`} />
                                                            <p className={`text-sm text-gray-800`}>
                                                                Exercises:{" "}
                                                                {progress.completedExercises.length > 0
                                                                    ? progress.completedExercises.join(", ")
                                                                    : "None yet"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="modules">
                        <Card>
                            <CardHeader>
                                <CardTitle>Learning Modules</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                                    {learningModules?.map((module) => (
                                        <div key={module._id} className="mb-4 last:mb-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={selectedModules.includes(module.moduleCode)}
                                                        onCheckedChange={() => toggleModuleSelection(module.moduleCode)}
                                                    />
                                                    <span className="text-lg font-medium">{module.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="secondary">{module.difficulty}</Badge>
                                                    <span className="text-sm text-gray-500">{module.moduleCode}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                            <Accordion type="single" collapsible className="mt-2">
                                                <AccordionItem value={`lessons-${module.moduleCode}`}>
                                                    <AccordionTrigger>Lessons ({module.lessons.length})</AccordionTrigger>
                                                    <AccordionContent>
                                                        {module.lessons.map((lesson) => (
                                                            <Dialog key={lesson.lessonCode}>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="link" className="w-full justify-start p-0 h-auto">
                                                                        <div className="flex justify-between w-full">
                                                                            <span>{lesson.title}</span>
                                                                            <span className="text-sm text-gray-500">{lesson.lessonCode}</span>
                                                                        </div>
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>{lesson.title}</DialogTitle>
                                                                        <DialogDescription>{lesson.description}</DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="mt-4">
                                                                        <p>Lesson content would be displayed here.</p>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        ))}
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value={`exercises-${module.moduleCode}`}>
                                                    <AccordionTrigger>Exercises ({module.exercises.length})</AccordionTrigger>
                                                    <AccordionContent>
                                                        {module.exercises.map((exercise) => (
                                                            <Dialog key={exercise.exerciseCode}>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="link" className="w-full justify-start p-0 h-auto">
                                                                        <div className="flex justify-between w-full">
                                                                            <span>{exercise.title}</span>
                                                                            <span className="text-sm text-gray-500">{exercise.exerciseCode}</span>
                                                                        </div>
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>{exercise.title}</DialogTitle>
                                                                        <DialogDescription>{exercise.description}</DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="mt-4">
                                                                        <p>Exercise content would be displayed here.</p>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        ))}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    ))}
                                </ScrollArea>
                                <Button
                                onClick={
                                    () => {
                                        if (id) updateLearningModules(id, selectedModules, () => toast({title: "Modules updated successfully"}));
                                    }
                                } className="mt-4">Update Modules</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="extra-points">
                        <Card>
                            <CardHeader>
                                <CardTitle>Award Extra Points</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleExtraPointsSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="student-select">Select Student</Label>
                                        <Select
                                            value={extraPoints.student}
                                            onValueChange={(value) => setExtraPoints({ ...extraPoints, student: value })}
                                        >
                                            <SelectTrigger id="student-select">
                                                <SelectValue placeholder="Select a student" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from(new Set(classInfo?.progress.map((progress) => progress.studentId))).map((studentId) => {
                                                    const student = classInfo?.progress.find((progress) => progress.studentId === studentId);
                                                    return (
                                                        <SelectItem key={studentId} value={studentId}>
                                                            {student?.studentName}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="points-input">Points</Label>
                                        <Input
                                            id="points-input"
                                            type="number"
                                            placeholder="Enter points"
                                            value={extraPoints.points}
                                            onChange={(e) => setExtraPoints({ ...extraPoints, points: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="reason-input">Reason</Label>
                                        <Textarea
                                            id="reason-input"
                                            placeholder="Enter reason for awarding extra points"
                                            value={extraPoints.reason}
                                            onChange={(e) => setExtraPoints({ ...extraPoints, reason: e.target.value })}
                                        />
                                    </div>
                                    <Button type="submit">Award Points</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </ContentContainer>
    );
}
