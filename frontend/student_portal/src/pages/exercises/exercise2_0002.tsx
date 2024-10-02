import React, { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import LessonContainer from "@/components/LessonContainer";
import camp from "../../assets/camp.png";
import zoo from "../../assets/zoo.png";

const Exercise2_0002: React.FC = () => {

  return (
    <LessonContainer title="Exercise: True or False" overrideClass="max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ExerciseSection
                story="Last summer, Emily and her friends were on a camping trip. The weather was hot, and the lake was perfect for swimming. The tents were set up quickly, and everyone was excited."
                questions={[
                  "The weather was chilly.",
                  "The lake was great for swimming.",
                  "The tents were set up slowly.",
                ]}
                image={camp}
                imageAlt="Camping scene with tent and campfire"
              />
              <ExerciseSection
                story="Last Friday, Alex and his family were at the zoo. The animals were active, and the weather was sunny. The lions were roaring loudly, and the penguins were swimming in the water. Alex's favorite part was watching the elephants play with water."
                questions={[
                  "The lions were sleeping quietly.",
                  "Alex's favorite part was watching the elephants.",
                  "The penguins were swimming in the water.",
                ]}
                image={zoo}
                imageAlt="Zoo animals including a penguin, lion, and elephant"
              />
            </div>
    </LessonContainer>
  );

  interface ExerciseSectionProps {
    story: string;
    questions: string[];
    image: string;
    imageAlt: string;
  }

  function ExerciseSection({ story, questions, image, imageAlt }: ExerciseSectionProps) {
    const [answers, setAnswers] = useState(Array(questions.length).fill(""));

    const handleAnswerChange = (index: number, value: string) => {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      setAnswers(newAnswers);
    };

    return (
      <div className="space-y-4">
        <div className="border border-green-500 p-4 rounded-lg">
          <p className="text-lg">{story}</p>
        </div>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="font-semibold">{index + 1}.</span>
              <p className="flex-grow">{question}</p>
              <RadioGroup
                value={answers[index]}
                onValueChange={(value) => handleAnswerChange(index, value)}
                className="flex space-x-4"
              >
                {/* True Option */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="true"
                    id={`true-${index}`}
                    className="w-4 h-4 rounded-full border border-gray-400 checked:bg-blue-600"
                    onClick={() => handleAnswerChange(index, "true")}

                  />
                  <Label htmlFor={`true-${index}`} className="cursor-pointer">
                    True
                  </Label>
                </div>

                {/* False Option */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="false"
                    id={`false-${index}`}
                    className="w-4 h-4 rounded-full border border-gray-400 checked:bg-red-600"
                    onClick={() => handleAnswerChange(index, "false")}
                  />
                  <Label htmlFor={`false-${index}`} className="cursor-pointer">
                    False
                  </Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-32 object-contain"
        />
      </div>
    );
  }
};

export default Exercise2_0002;
