import React from "react";
import recipe from "../../assets/recipe.png";
import LessonContainer from "@/components/LessonContainer";

const Learning1_0002: React.FC = () => {

  return (
    
      <LessonContainer title="What is a recipe" overrideClass="max-w-6xl">
          <div className="text-center mb-6">
           <img src={recipe} alt="" />
          </div>
         </LessonContainer>
        
  );
};

export default Learning1_0002;
