import React, {useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book, RefreshCcw, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ContentContainer from "@/components/ContentContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster"
import { useUnits } from "@/hooks/useUnit";
import { useClassrooms } from "@/hooks/useClassrooms";
import { useUser } from "@/hooks/useUser";
import { awardPoints, PointsLogType, setAnnoucementAPI, setGameRestrictionPeriodAPI, setIsGameActive, updateChosenUnits } from "@/api/useAPI";
import { useUsers } from "@/hooks/useUsers";
import { setTodayUnit as setTodayUnitFull } from "@/api/useAPI";
import { Exercise, Lesson } from "@/types/dbTypes";

export default function ClassDetailsPage() {
    const { id } = useParams();
    const {
        data: user,
        isLoading: userLoading,
        error: userError,
        mutate: mutateUser
    } = useUser();

    const {
        data: classrooms,
        isLoading: classroomLoading,
        error: classroomError,
        mutate: mutateClassrooms,
    } = useClassrooms(user?.classroom as string[] | undefined);

    const classroom = classrooms?.find((classroom) => classroom._id === id);

    const {
        data: students,
        isLoading: studentLoading,
        error: studentError,
        mutate: mutateStudents
    } = useUsers(classroom?.students_enrolled.map(student => student.student) || []);

    const {
        data: learningModules,
        isLoading: moduleLoading,
        error: moduleError,
    } = useUnits(id);
    

    const { toast } = useToast()
    
    const navigate = useNavigate();

    const [todayUnit, setTodayUnit] = useState(
        classroom?.today_unit?.unit || ""
    );
    const [announcement, setAnnouncement] = useState(classroom?.announcement || "");
    const [isGameBlocked, setIsGameBlocked] = useState(
        classroom?.is_game_blocked || false
    );
    const [gameRestrictionPeriod, setGameRestrictionPeriod] = useState({
        start: classroom?.game_restriction_period?.start || "",
        end: classroom?.game_restriction_period?.end || "",
    });
    const [chosenUnits, setChosenUnits] = useState(
            classroom?.chosen_units
        );
    const [extraPoints, setExtraPoints] = useState({ student: "", points: 0, reason: "" });

    const toggleModuleSelection = (unitId: string) => {
        const unit = learningModules?.find((unit) => unit._id === unitId);
        
        if (unit) {
            const { name, description, difficulty, skills, _id } = unit;
            setChosenUnits((prev = []) => 
                prev.some((chosenUnit) => chosenUnit.unit === _id) 
                ? prev.filter((chosenUnit) => chosenUnit.unit !== _id) 
                : [...prev, { name, description, difficulty, skills, unit: _id }]
            );
        }
    };

    const handleExtraPointsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setExtraPoints({ student: "", points: 0, reason: "" });
        if (id && user?._id) {
            const error = await awardPoints(id, extraPoints.student, extraPoints.points, extraPoints.reason, user._id, PointsLogType.EXTRA_POINTS);
            if (!error) {toast({title: "Extra points awarded successfully"});} else {toast({title: "Failed to award extra points"});}
            mutateStudents();
        }
    };

    if (moduleLoading || classroomLoading || userLoading || studentLoading) {
        return <div>Loading...</div>;
    }

    if (moduleError || classroomError || userError || studentError) {
        return (
            <div>
                {moduleError && "Module Error: " + moduleError} {classroomError && "Classroom Error: " + classroomError}{" "} {userError && "User Error: " + userError} {studentError && "Student Error: " + studentError}
            </div>
        );
    }

    function renderProgress() {
        const items = []
        if (students){
            for (let i = 0; i < students.length; i++) {
                const localStudent = students[i];
                for (let j = 0; j < localStudent.class_progress_info.length; j++) {
                    const localProgress = localStudent.class_progress_info[j];
                    console.log("Local Progress: ", localProgress);
                        const item = (
                            <Card key={i + " " + j} className= "mb-6 bg-white border border-gray-200 rounded-lg last:mb-0">
                                <CardHeader className="border-b border-gray-200">
                                <div className="flex flex-row justify-between">
                                    Unit:{" "}
                                    {localProgress.unit?.name || ""}
                                    <Badge
                                        variant="outline"
                                        className={
                                            localProgress.progress_percent == 100
                                                ? "text-green-500 border-green-500"
                                                : "text-blue-500 border-blue-500"
                                        }
                                    >
                                        {localProgress.progress_percent == 100 ? "Complete" : "In Progress"}
                                    </Badge>
                                </div>
                                </CardHeader>
                                <CardContent className="mt-4 last:mb-0">
                                                    <div className="flex items-center justify-between py-2">
                                                        <div className="flex items-center space-x-4">
                                                            <Avatar>
                                                                <AvatarImage
                                                                    src={localStudent.profile_picture}
                                                                    alt={localStudent.name}
                                                                    className="w-full h-full rounded-full"
                                                                />
                                                                <AvatarFallback>
                                                                    {localStudent.name
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("")}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-medium">{localStudent.name}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm font-medium text-gray-800">Progress</span>
                                                            <span className="text-sm font-medium">{localProgress.progress_percent}%</span>
                                                        </div>
                                                        <Progress value={localProgress.progress_percent} className="w-full bg-gray-200" />
                                                    </div>
                                                    <div className="mt-4 space-y-2">
                                                        <p className="text-sm font-medium text-gray-800">Completed:</p>
                                                        <div className="flex items-center space-x-2">
                                                            <Book className={`h-4 w-4 text-gray-800`} />
                                                            <p className={`text-sm text-gray-800`}>
                                                                Lessons:{" "}
                                                                {localProgress.lessons_completed?.length || 0 > 0
                                                                    ? localProgress.lessons_completed?.join(", ")
                                                                    : "None yet"}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Trophy className={`h-4 w-4 text-gray-800`} />
                                                            <p className={`text-sm text-gray-800`}>
                                                                Exercises:{" "}
                                                                {localProgress.exercises?.length || 0 > 0
                                                                    ? localProgress.exercises?.map(ex => ex.exercise).join(", ")
                                                                    : "None yet"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                            </Card>
                        )
                        items.push(item);
                    }
                   
                }
            }
        return items;
    }

    return (
        <ContentContainer>
            <div className="container mx-auto p-6">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">{classroom?.name}</CardTitle>
                        <CardDescription>Class Code: {classroom?.class_join_code}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <Users className="h-5 w-5 text-gray-500" />
                                <span>{classroom?.students_enrolled.length} Students</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Book className="h-5 w-5 text-gray-500" />
                                <span>{classroom?.chosen_units.length} Modules</span>
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
                                <CardTitle>Today's Unit</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select value={todayUnit} onValueChange={setTodayUnit}>
                                    <SelectTrigger className="w-full text-black">
                                        <SelectValue placeholder="Select a lesson" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {learningModules?.map((unit) => (
                                            <SelectItem key={unit._id} value={unit._id}>
                                                {unit.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={async () => {
                                        if (id) {
                                            const error = await setTodayUnitFull(todayUnit, id);
                                            if (!error) {toast({title: "Today's lesson updated successfully"});}
                                            else {toast({title: "Failed to update today's lesson"});}
                                            mutateClassrooms();
                                        }
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
                                        onClick={async () => {
                                            if (id) {const error = await setAnnoucementAPI(id, announcement);
                                            if (!error) {toast({title: "Announcement updated successfully"});}
                                            else {toast({title: "Failed to update announcement"});}
                                            mutateClassrooms();}
                                        }}
                                    >
                                        Post Announcement
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (id){
                                                const error = setAnnoucementAPI(id, "");
                                                if (!error) {toast({title: "Announcement removed successfully"});}
                                                else {toast({title: "Failed to remove announcement"});}
                                                mutateClassrooms();
                                                setAnnouncement("");
                                            }
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
                                        checked={isGameBlocked}
                                        onCheckedChange={async () => {
                                            if (id) {
                                                const error = await setIsGameActive(id, isGameBlocked);
                                                if (!error) {toast({title: "Game restriction updated successfully"});}
                                                else {toast({title: "Failed to update game restriction"});}
                                                mutateClassrooms();
                                                setIsGameBlocked(!isGameBlocked);
                                            }
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
                                                    start: newDate.toISOString(),
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
                                                    end: newDate.toISOString(),
                                                });
                                            }}
                                        />
                                    </div>
                                    <Button
                                        onClick={async () => {
                                            if (id) {
                                                const error = await setGameRestrictionPeriodAPI(id,
                                                    gameRestrictionPeriod.start,
                                                    gameRestrictionPeriod.end
                                                );
                                                if (!error) {
                                                    toast({title: "Game restriction period updated successfully"});
                                                    mutateClassrooms();
                                                } else {
                                                    toast({title: "Failed to update game restriction period"});
                                                }
                                            }
                                        }}
                                        className="mt-4 w-full"
                                    >
                                        Update Restriction Period
                                    </Button>
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
                                        {students?.map((student) => {
                                            return (
                                                <div key={student._id} className="mb-6 last:mb-0">
                                                    <div className="mb-6 last:mb-0">
                                                        <div className="flex items-center justify-between py-2">
                                                            <div className="flex items-center space-x-4">
                                                                <Avatar>
                                                                    <AvatarImage 
                                                                        src={student?.profile_picture}
                                                                        alt={student?.name}
                                                                        className="w-full h-full rounded-full"
                                                                    />
                                                                    <AvatarFallback>
                                                                        {student?.name
                                                                            .split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="text-sm font-medium">{student?.name}</p>
                                                                    <p className="text-sm text-gray-500">ID: {student?._id}</p>
                                                                </div>
                                                            </div>
                                                            <Button onClick={() => navigate("/studentDetails/" + student?._id + "/" + classroom?._id)} variant="outline">View Progress Details</Button>
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
                                            mutateClassrooms();
                                            mutateStudents();
                                            mutateUser();

                                        }}
                                        className="p-2"
                                    >
                                        <RefreshCcw />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[400px] w-full px-4">
                                        {renderProgress()}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="modules">
                        <Card>
                            <CardHeader>
                                <CardTitle>Units</CardTitle>
                                <p>If you would like to see and interact with a unit, we recommend creating a dummy student account as some exercise preview might not be available!</p>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                                    {learningModules?.map((unit) => (
                                        <div key={unit._id} className="mb-4 last:mb-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={chosenUnits?.some((chosenUnit) => chosenUnit.unit === unit._id)}
                                                        onCheckedChange={() => toggleModuleSelection(unit._id)}
                                                    />
                                                    <span className="text-lg font-medium">{unit.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="secondary">{unit.difficulty}</Badge>
                                                    <span className="text-sm text-gray-500">{unit._id}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{unit.description}</p>
                                            <Accordion type="single" collapsible className="mt-2">
                                                <AccordionItem value={`lessons-${unit._id}`}>
                                                    <AccordionTrigger>Lessons ({unit.lessons.length})</AccordionTrigger>
                                                    <AccordionContent>
                                                        {unit.lessons.map((l) => {
                                                            const lesson = l as unknown as Lesson;
                                                            return (
                                                            <Dialog key={lesson._id}>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="link" className="w-full justify-start p-0 h-auto">
                                                                        <div className="flex justify-between w-full">
                                                                            <span>{lesson.title}</span>
                                                                            <div>
                                                                                <span className="text-sm mr-3 text-gray-500">Id: {lesson._id}</span>
                                                                                <span>Order: {lesson.order}</span>
                                                                            </div>
                                                                        </div>
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-3xl">
                                                                    <DialogHeader>
                                                                        <DialogTitle>{lesson.title}</DialogTitle>
                                                                        <DialogDescription>{lesson.description}</DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className=" flex flex-col gap-3 mt-4">
                                                                        <p>Instruction: {lesson.instruction}</p>
                                                                        <p>Type: {lesson.lesson_type}</p>
                                                                        <p>Order: {lesson.order}</p>
                                                                        {lesson.image ? <img src={lesson.image} alt="lesson image" /> : null}
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        )})}
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value={`exercises-${unit._id}`}>
                                                    <AccordionTrigger>Exercises ({unit.exercises.length})</AccordionTrigger>
                                                    <AccordionContent>
                                                        {unit.exercises.map((e) => {
                                                            const exercise = e as unknown as Exercise;
                                                            return (
                                                            <Dialog key={exercise._id}>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="link" className="w-full justify-start p-0 h-auto">
                                                                        <div className="flex justify-between w-full">
                                                                            <span>{exercise.title}</span>
                                                                            <div>
                                                                                <span className="text-sm mr-3 text-gray-500">Id: {exercise._id}</span>
                                                                                <span>Order: {exercise.order}</span>
                                                                            </div>
                                                                        </div>
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-3xl">
                                                                    <DialogHeader>
                                                                        <DialogTitle>{exercise.title}</DialogTitle>
                                                                        <DialogDescription>{exercise.description}</DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="mt-4">
                                                                    <div className=" flex flex-col gap-3 mt-4">
                                                                        <p>Instruction: {exercise.instruction}</p>
                                                                        <p>Type: {exercise.exercise_type}</p>
                                                                        <p>Order: {exercise.order}</p>
                                                                        <p>Automatic Checking: {exercise.is_instant_scored ? "true" : "false"}</p>
                                                                        <p>Maximum Score: {exercise.max_score}</p>
                                                                        <p>An exercise may have varients (maximum 3) which may be presented to students differently so the preview might not indicate what student sees.</p>
                                                                        {exercise.image ? <img src={exercise.image} alt="exercise image" /> : null}
                                                                    </div>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        )})}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    ))}
                                </ScrollArea>
                                <Button
                                onClick={
                                    async () => {
                                        if (id && chosenUnits) {
                                            const error = await updateChosenUnits(id, chosenUnits);
                                            if (!error) {toast({title: "Modules updated successfully"});}
                                            else {toast({title: "Failed to update modules"});}
                                            mutateClassrooms();
                                        }
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
                                                {students?.map((student) => {
                                                    return (
                                                        <SelectItem key={student._id} value={student._id}>
                                                            {student?.name}
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
