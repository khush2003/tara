import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import useLearningStore from "@/stores/learningStore";
import useClassroomStore from "@/stores/classroomStore";
import { useNavigate } from "react-router-dom";

export default function ClassCreationPage() {
    const [className, setClassName] = useState("");
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [learningModules, moduleLoading, moduleError, fetchLearningModules] = useLearningStore((state) => [
        state.learningModules,
        state.moduleLoading,
        state.moduleError,
        state.fetchLearningModules,
    ]);
    const [createClassroom] = useClassroomStore((state) => [state.createClassroom]);
    const navigate = useNavigate();

    const handleModuleSelect = (moduleId: string) => {
        setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]));
    };

    useEffect(() => {
        fetchLearningModules();
    }, [fetchLearningModules]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const classCode = await createClassroom(className, selectedModules);
        console.log({ className, selectedModules, classCode });
        setSuccessMessage(`Class created successfully. Share this code with your students: ${classCode}`);
        setIsLoading(false);
    };

    if (moduleLoading) {
        return <div>Loading...</div>;
    }

    if (moduleError) {
        return <div>Error: {moduleError}</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Create a New Class</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <Label htmlFor="className">Class Name</Label>
                    <Input
                        id="className"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        required
                        placeholder="Enter class name"
                        className="max-w-md"
                    />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Learning Modules</h2>
                    <p className="text-sm text-muted-foreground">Select the modules you want to include in your class.</p>
                    <ScrollArea className="h-[600px] border rounded-md p-4">
                        <div className="space-y-4">
                            {learningModules?.map((module) => (
                                <Card key={module.moduleCode} className="relative">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle>{module.name}</CardTitle>
                                                <CardDescription>{module.description}</CardDescription>
                                            </div>
                                            <Checkbox
                                                id={`module-${module.moduleCode}`}
                                                checked={selectedModules.includes(module.moduleCode)}
                                                onCheckedChange={() => handleModuleSelect(module.moduleCode)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex space-x-2 mb-2">
                                            <Badge variant="secondary">{module.difficulty}</Badge>
                                            <Badge variant="outline">{module.moduleCode}</Badge>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="lessons">
                                                <AccordionTrigger>Lessons ({module.lessons.length})</AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="space-y-2">
                                                        {module.lessons.map((lesson) => (
                                                            <li key={lesson.lessonCode} className="text-sm">
                                                                <strong>{lesson.title}</strong> - {lesson.lessonCode}
                                                                <p className="text-muted-foreground">{lesson.description}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="exercises">
                                                <AccordionTrigger>Exercises ({module.exercises.length})</AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="space-y-2">
                                                        {module.exercises.map((exercise) => (
                                                            <li key={exercise.exerciseCode} className="text-sm">
                                                                <strong>{exercise.title}</strong> - {exercise.exerciseCode}
                                                                <p className="text-muted-foreground">{exercise.description}</p>
                                                                <p className="text-xs text-muted-foreground">Max Score: {exercise.maxScore}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <Separator />
                {successMessage ? (
                    <Card className="mt-6">
                        <CardContent className="pt-6">
                            <p className="text-green-600 font-semibold mb-4">{successMessage}</p>
                            <Button type="button" className="w-full" onClick={() => navigate("/dashboard")}>
                                Go to Class Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex justify-end">
                        <Button type="submit" size="lg" disabled={isLoading || selectedModules.length === 0}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Class
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
