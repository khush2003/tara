import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
// import StudentGuide from "./guidance";
import Logo from "../../assets/Chat.png"; // Import your logo image

const Learning0003: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="flex items-center justify-center mb-3 bg-gradient-to-r from-[#002761] to-[#5E0076] pr-14 rounded-md border-1">
          <div className="">
            <h1 className="text-white text-4xl">READING : BEAR</h1>
          </div>
        </div>
        <Card className="p-8 shadow-md rounded-xl bg-white">
          <h2 className="text-2xl font-bold font-mono mb-4 text-center text-gray-700">
            Reading the content
          </h2>
          <p className="text-center mb-6 text-gray-600">
          LEARN ABOUT BEARS
          </p>
          <div className="text-center mb-6">
            <blockquote className="italic text-gray-600 bg-gray-100 p-4 rounded-lg">
            Bears are large mammals that can be found in forests, mountains, and even arctic regions. There are several different species of bears, including the brown bear, black bear, and polar bear. Most bears are omnivores, which means they eat both plants and animals. Their diet can include fruits, berries, fish, insects, and small mammals. However, some bears, like the polar bear, rely mostly on meat, hunting seals for food.

During the warmer months, bears spend a lot of time eating to build up fat reserves. This is important because, in the winter, many bears hibernate. Hibernation is a special kind of deep sleep that helps bears conserve energy during the cold months when food is scarce. During hibernation, a bear's heart rate and body temperature drop, and they don't need to eat, drink, or go to the bathroom. Some bears, like polar bears, do not hibernate because they live in cold environments year-round and can hunt even in winter.

Despite their size, bears are excellent swimmers and climbers. Polar bears are especially skilled swimmers, using their strong paws to navigate icy waters. Black bears, on the other hand, are known for their climbing abilities and will often climb trees to escape danger or search for food.

Bears are generally solitary animals, although mothers are very protective of their cubs. Cubs stay with their mothers for about two years, learning how to find food and survive in the wild. After that, they venture off on their own.


            </blockquote>
          </div>
          {/* <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg mb-6"
            placeholder="Write your translation here..."
          ></textarea> */}
          <div className="flex justify-center space-x-4">
            {/* <Button className="p-4 bg-green-500 text-white rounded-lg">
              Complete Exercise
            </Button> */}
            {/* & Earn Points */}
            <Button
              className="p-4 bg-blue-500 text-white rounded-lg"
              onClick={() => navigate("login")}
            >
              Next 
            </Button>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default  Learning0003;
