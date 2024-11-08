import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useAllUnits } from "@/hooks/useAllUnits";
import { Exercise, Lesson } from "@/types/dbTypes";
import { ChosenUnitsType, createClassroom } from "@/api/useAPI";

export default function ClassCreationPage() {
    const [className, setClassName] = useState("");
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const {
        data: units,
        isLoading: unitLoading,
        error: unitError,
    } = useAllUnits();

    const navigate = useNavigate();

    const handleModuleSelect = (moduleId: string) => {
        setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        let chosen_units: ChosenUnitsType = [];
        if (units){
            chosen_units = units?.filter((unit) => selectedModules.includes(unit._id)).map((unit) => ({
                name: unit.name,
                description: unit.description,
                difficulty: unit.difficulty,
                skills: unit.skills,
                unit: unit._id,
            }));
        }
        const classCode = await createClassroom(className, chosen_units);
        if (typeof classCode === 'number') {
            setSuccessMessage(`Class created successfully. Share this code with your students: ${classCode}`);
            setIsLoading(false);
            return;
        } else {
            alert("Failed to create class. Please try again.");
            setIsLoading(false);
        }
    };

    if (unitLoading) {
        return <div>Loading...</div>;
    }

    if (unitError) {
        return <div>Error: {unitError}</div>;
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
                            {units?.map((module, index) => (
                                <Card key={index} className="relative">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle>{module.name}</CardTitle>
                                                <CardDescription>{module.description}</CardDescription>
                                            </div>
                                            <Checkbox
                                                id={`module-${module._id}`}
                                                checked={selectedModules.includes(module._id)}
                                                onCheckedChange={() => handleModuleSelect(module._id)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex space-x-2 mb-2">
                                            <Badge variant="secondary">{module.difficulty}</Badge>
                                            <Badge variant="outline">{module._id}</Badge>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="lessons">
                                                <AccordionTrigger>Lessons ({module.lessons.length})</AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="space-y-2">
                                                        {module.lessons.map((l, key) => {
                                                            const lesson = l as unknown as Lesson
                                                            return (
                                                            <li key={key} className="text-sm">
                                                                <strong>{lesson.title}</strong> - {lesson._id}
                                                                <p className="text-muted-foreground">{lesson.description}</p>
                                                                <p>{lesson.instruction}</p>
                                                                <p>Lesson Type: {lesson.lesson_type}</p>
                                                                <p>Lesson Order: {lesson.order}</p>
                                                                <img src={lesson.image} alt="lesson preview"
                                                                className="w-200 h-200 object-cover rounded-lg"
                                                                />
                                                            </li>
                                                        )})}
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="exercises">
                                                <AccordionTrigger>Exercises ({module.exercises.length})</AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="space-y-2">
                                                        {module.exercises.map((e) => {
                                                            const exercise = e as unknown as Exercise
                                                            return (
                                                            <li key={exercise._id} className="text-sm">
                                                                <strong>{exercise.title}</strong> - {exercise._id}
                                                                <p className="text-muted-foreground">{exercise.description}</p>
                                                                <p className="text-xs text-muted-foreground">Max Score: {exercise.max_score}</p>
                                                                <p>Exercise Type: {exercise.exercise_type}</p>
                                                                <img src={exercise.image} alt="exercise preview" className="w-200 h-200 object-cover rounded-lg" />
                                                                <p>Automatic scored: {exercise.is_instant_scored}</p>
                                                                <p>Instruction {exercise.instruction}</p>
                                                                <p>Order: {exercise.order}</p>
                                                                <p>An exercise may have one or more vairents so the preview might not be what students see.</p>
                                                                <p>Varients: {!!exercise.varients}</p>
                                                            </li>
                                                        )})}
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
