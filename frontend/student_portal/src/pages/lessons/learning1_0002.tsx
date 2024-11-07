import React from "react";
import recipe from "../../assets/recipe.png";
import ContentContainer from "@/components/ContentContainer";

const Learning1_0002: React.FC = () => {

  return (
    
      <ContentContainer title="What is a recipe" overrideClass="max-w-6xl">
          <div className="text-center mb-6">
           <img src={recipe} alt="" />
          </div>
         </ContentContainer>
        
  );
};

export default Learning1_0002;
