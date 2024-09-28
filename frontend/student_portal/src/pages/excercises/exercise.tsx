import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// ID: 0001E0001
const ExercisePage: React.FC = () => {
  const navigate = useNavigate();
 

  return (
    <div className="relative flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="flex items-center justify-center mb-3 bg-gradient-to-r from-[#002761] to-[#5E0076] pr-14 rounded-md border-1">
          <div className="">
            <h1 className="text-white text-4xl">EXERCISE: FOODS</h1>
          </div>
        </div>
        <Card className="p-8 shadow-md rounded-xl bg-white">
          <h2 className="text-2xl font-bold font-mono mb-4 text-center text-gray-700">
            ENGLISH OR THAI?
          </h2>
          <p className="text-center mb-6 text-gray-600">
            Translate this text to your native language
          </p>
          <div className="text-center mb-6">
            <blockquote className="italic text-gray-600 bg-gray-100 p-4 rounded-lg">
              Tom is hungry. He walks to the kitchen and gets some eggs. He
              takes some oil and puts a pan on the stove. Next, he turns on the
              heat and pours the oil into the pan. He cracks the eggs into a
              bowl, mixes them, and then pours them into the hot pan. He waits
              while the eggs cook. They cook for two minutes. Next, Tom puts the
              eggs on a plate and places the plate on the dining room table. Tom
              feels happy because he cooked eggs. He sits down in the big wooden
              chair, and eats the eggs with a spoon. They are good. He washes
              the plate with dishwashing soap, then washes the pan. He wets a
              sponge and finally cleans the table.
            </blockquote>
          </div>
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg mb-6"
            placeholder="Write your translation here..."
          ></textarea>
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
        </Card>
      </div>

    </div>
  );
};

export default ExercisePage;
