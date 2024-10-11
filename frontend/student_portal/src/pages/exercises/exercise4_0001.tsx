import React from "react";
import LessonContainer from "@/components/LessonContainer";
import img from "@/assets/L4_1.png";

// ID: 0001E0001
const Exercise1_0001: React.FC = () => {
    const [results, setResults] = React.useState<string>("");

    const handleAnswerCheck = () => {
        return { answers: results };
    };

    return (
        <LessonContainer title="Icebreaker - Persona Poems" overrideClass="max-w-4xl" isTeacherScoredExercise onSubmit={handleAnswerCheck}>
            <img src={img} className="text-left bg-green-50 p-10 rounded-2xl mt-5 text-lg mb-6"></img>
            {/* Word and fill in the synonym 2 columns */}
                <div className="flex flex-col gap-3 w-full">
                    <span className="font-semibold">Write your answer here</span>
                    <textarea rows={7}  className="w-full p-2  border border-gray-300 rounded-lg" placeholder="Write your poem or sentence ..." onChange={
                        (e) => setResults(e.target.value) 
                    } />
                </div>
            
        </LessonContainer>
    );
};

export default Exercise1_0001;
