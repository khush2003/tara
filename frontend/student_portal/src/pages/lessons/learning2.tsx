import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import unit2 from "../../assets/unit2.png";
// import StudentGuide from "../guidance";
// import Logo from "../../assets/Chat.png"; // Import your logo image
// import users from "../../assets/users.png"; // Import your profile image
// import meal from "../../assets/TARA flashcards/meal.png";
// import breakfast from "../../assets/TARA flashcards/breakfast.png";
// import lunch from "../../assets/TARA flashcards/lunch.png";
// import dinner from "../../assets/TARA flashcards/dinner.png";
// import cake from "../../assets/TARA flashcards/cake.png";
// import bread from "../../assets/TARA flashcards/bread.png";
// import egg from "../../assets/TARA flashcards/egg.png";
// import rice from "../../assets/TARA flashcards/rice.png";

// ID: 0001L0001

const LearningContentPage2: React.FC = () => {
  const navigate = useNavigate();


  // Dummy flashcard data
  // const flashcardsData = [
  //   { image: meal, frontText: "Meal" },
  //   { image: breakfast, frontText: "Breakfast" },
  //   { image: lunch, frontText: "Lunch" },
  //   { image: dinner, frontText: "Dinner" },
  //   { image: cake, frontText: "Cake" },
  //   { image: bread, frontText: "Bread" },
  //   { image: egg, frontText: "Egg" },
  //   { image: rice, frontText: "Rice" },
  // ];
  return (
    <div className="relative flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="flex items-center justify-center mb-3 bg-gradient-to-r from-[#002761] to-[#5E0076] pr-14 rounded-md border-1">
          <div className="">
            <h1 className="text-white text-4xl font-mono">
              LESSON: WAS AND WERE
            </h1>
          </div>
        </div>
        <Card className="p-8 shadow-md rounded-xl bg-white">
          <h2 className="text-2xl font-bold font-mono mb-4 text-center text-gray-700">
            WAS and WERE - limericks
          </h2>

          <div className="text-center mb-6">
           <img src={unit2} alt="" />
          </div>
         
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

export default LearningContentPage2;
