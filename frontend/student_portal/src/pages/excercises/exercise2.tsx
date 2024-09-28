import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// ID: 0001E0002

const ExercisePage2: React.FC = () => {
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
            FILL IN THE BLANKS
          </h2>
          <p className="text-center mb-6 text-gray-600">
            Find the synonyms in the text
          </p>
          <div className="text-center mb-6">
            <blockquote className="italic text-gray-600 bg-gray-100 p-4 rounded-lg">
              Tom is excited to cook his favorite recipe. He starts by getting a
              fresh set of vegetables from the market. He carefully washes them
              to make sure they are clean. Tom uses a sharp knife to chop the
              vegetables into small pieces. He heats some oil in a pan until it
              is hot. Then, he adds the vegetables and mixes them until they are
              tender. After cooking, Tom puts the vegetables on a plate. The
              meal looks very appealing, and Tom feels happy with his delicious
              dish.
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

export default ExercisePage2;
