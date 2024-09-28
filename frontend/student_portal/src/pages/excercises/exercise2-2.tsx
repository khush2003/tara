import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import StudentGuide from "../guidance";
import Logo from "../../assets/Chat.png";
import users from "../../assets/users.png";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";

const ExercisePageUnit2Ver2: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="flex items-center justify-center mb-3 bg-gradient-to-r from-[#002761] to-[#5E0076] pr-14 rounded-md border-1">
          <div className="">
            <h1 className="text-white text-4xl">EXERCISE: WAS AND WERE</h1>
          </div>
        </div>

        <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl font-bold">TRUE OR FALSE</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ExerciseSection
                story="Last summer, Emily and her friends were on a camping trip. The weather was hot, and the lake was perfect for swimming. The tents were set up quickly, and everyone was excited."
                questions={[
                  "The weather was chilly.",
                  "The lake was great for swimming.",
                  "The tents were set up slowly.",
                ]}
                image="/placeholder.svg?height=100&width=200"
                imageAlt="Camping scene with tent and campfire"
              />
              <ExerciseSection
                story="Last Friday, Alex and his family were at the zoo. The animals were active, and the weather was sunny. The lions were roaring loudly, and the penguins were swimming in the water. Alex's favorite part was watching the elephants play with water."
                questions={[
                  "The lions were sleeping quietly.",
                  "Alex's favorite part was watching the elephants.",
                  "The penguins were swimming in the water.",
                ]}
                image="/placeholder.svg?height=100&width=200"
                imageAlt="Zoo animals including a penguin, lion, and elephant"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4 mt-6">
          <Button className="p-4 bg-green-500 text-white rounded-lg">
            Complete Exercise
          </Button>
          <Button
            className="p-4 bg-blue-500 text-white rounded-lg"
            onClick={() => navigate("/nextlesson")}
          >
            Next Lesson
          </Button>
        </div>
      </div>
    </div>
  );

  function ExerciseSection({ story, questions, image, imageAlt }) {
    const [answers, setAnswers] = useState(Array(questions.length).fill(""));

    const handleAnswerChange = (index, value) => {
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

export default ExercisePageUnit2Ver2;
