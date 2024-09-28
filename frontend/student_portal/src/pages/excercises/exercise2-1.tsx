import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import birds from "../../assets/birds.jpg"; 
import beach from "../../assets/beach.jpg"; 



// ID: 0001E0001
const ExercisePageUnit2: React.FC = () => {
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
        <Card className="w-full max-w-5xl mx-auto bg-white shadow-lg mb-5">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl font-mono">FILL IN THE STORY</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <StorySection
                text="Yesterday, my family and I _____ (was/were) at the park. The weather _____ (was/were) perfect, and the trees _____ (was/were) full of birds. My favorite part _____ (was/were) the ice cream stand!"
                image={birds}
                imageAlt="Bird on a branch"
                borderColor="border-purple-400"
              />
              <StorySection
                text="Last weekend, my friends and I _____ (was/were) at the beach. The water _____ (was/were) warm, and the waves _____ (was/were) big. Our sandcastle _____ (was/were) huge! We _____ (was/were) so happy when it didn't fall down."
                image={beach}
                imageAlt="Sandcastle"
                borderColor="border-green-400"
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center space-x-4">
          <Button className="p-4 bg-green-500 text-white rounded-lg">
            Complete Exercise
          </Button>
          {/* & Earn Points */}
          <Button
            className="p-4 bg-blue-500 text-white rounded-lg"
            onClick={() => navigate("login")}
          >
            Next Lesson
          </Button>
        </div>
      </div>
    </div>
  );
};

function StorySection({ text, image, imageAlt, borderColor }) {
  const words = text.split(' ');
  const blankCount = words.filter((word) => word === '_____').length;
  const [answers, setAnswers] = useState(Array(blankCount).fill(''));

  const handleInputChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className={`p-4 border-2 ${borderColor} rounded-lg flex items-start space-x-4`}>
      <img src={image} alt={imageAlt} className="w-24 h-24 object-contain" />
      <p className="flex-1 text-lg">
        {words.map((word, wordIndex) => {
          if (word === '_____') {
            const blankIndex = words.slice(0, wordIndex).filter((w) => w === '_____').length;
            return (
              <input
                key={wordIndex}
                type="text"
                maxLength={4}
                value={answers[blankIndex]}
                onChange={(e) => handleInputChange(blankIndex, e.target.value)}
                className="w-16 inline-block mx-1 p-1 text-center border border-gray-300"
                aria-label={`Fill in the blank ${blankIndex + 1}`}
              />
            );
          }
          return <span key={wordIndex}>{word} </span>;
        })}
      </p>
    </div>
  );
}

export default ExercisePageUnit2;