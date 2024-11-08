import React from "react";
import LessonContainer from "@/components/LessonContainer";
import { CheckCircle, XCircle } from "lucide-react";

// Begin, cut, warmup, delicious, clean, pointy, soft
const scrambled = [
    {
        scarmbledWords: "was / cake / the / for / party / the / perfect",
        solution: ["the cake was perfect for the party", "the cake was perfect for the party."],
    },
    {
        scarmbledWords: "friends / beach / were / the / my / at / last weekend",
        solution: ["my friends were at the beach last weekend", "my friends were at the beach last weekend."],
    },
    {
        scarmbledWords: "bicycle / his / broken / was / morning / this",
        solution: ["his bicycle was broken this morning", "his bicycle was broken this morning."],
    },
    {
        scarmbledWords: "homework / my / difficult / was / last night",
        solution: ["my homework was difficult last night", "my homework was difficult last night."],
    },
];

const Exercise2_0004: React.FC = () => {
    const [results, setResults] = React.useState<{ [key: string]: boolean }>({});
    const [answers, setAnswers] = React.useState<string[]>(new Array(scrambled.length).fill(""));

    const handleInputChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleAnswerCheck = () => {
        const newResults: { [key: string]: boolean } = {};

        answers.forEach((answer, index) => {
            const isCorrect = scrambled[index].solution.includes(answer.toLowerCase().trim());
            newResults[scrambled[index].scarmbledWords] = isCorrect;
        });

        setResults(newResults);

        let score = 0;
        let total = 0;
        for (const key in newResults) {
            total++;
            if (newResults[key]) {
                score++;
            }
        }
        const answersMD = Object.keys(newResults)
            .map((word) => {
                const isCorrect = newResults[word];
                const foundScrambled = scrambled.find((s) => s.scarmbledWords === word);
                const solution = foundScrambled ? foundScrambled.solution[0] : "No solution found";
                const studentAnswer = answers[scrambled.findIndex((s) => s.scarmbledWords === word)] || "No answer provided";
                return `- **${word}**: ${isCorrect ? "Correct" : "Incorrect"} - ${solution} (Student Answer: ${studentAnswer})`;
            })
            .join("\n");
        const scorePercent = (score / total) * 100;

        return { answers: answersMD, score: scorePercent };
    };

    return (
        <LessonContainer title="Exercise: Scambled Senteces!" overrideClass="max-w-4xl" isInstantScoredExercise onSubmit={handleAnswerCheck}>
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Let's rewrite the sentences in the correct order</h2>
            <div className="grid grid-cols-2 gap-4 px-10">
                {scrambled.map((synonym, index) => (
                    <div key={synonym.scarmbledWords} className=" items-center space-x-4">
                        <div className="text-left bg-green-50 p-10 rounded-2xl mt-5 text-lg mb-6">
                            <span className="font-semibold">{synonym.scarmbledWords}</span>
                        </div>
                        <div className="flex flex-row items-center space-x-4">
                            <input
                                type="text"
                                className="w-96 p-2 border border-gray-300 rounded-lg"
                                placeholder="Correct Order"
                                value={answers[index]}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                            />
                            {results[synonym.scarmbledWords] !== undefined &&
                                (results[synonym.scarmbledWords] ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />)}
                        </div>
                    </div>
                ))}
            </div>
        </LessonContainer>
    );
};

export default Exercise2_0004;