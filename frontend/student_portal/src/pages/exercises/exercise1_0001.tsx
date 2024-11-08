import React from "react";
import LessonContainer from "@/components/LessonContainer";

// ID: 0001E0001
const Exercise1_0001: React.FC = () => {
  const [translation, setTranslation] = React.useState("");
 

  return (
    <LessonContainer title="Exercise: Let's Translate!" overrideClass="max-w-4xl" isTeacherScoredExercise onSubmit={
      () => {
        return { answers:  translation};
      }
    }>
        
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          Translate this text to your native language
          </h2>
          <div className="text-left bg-green-50 p-10 rounded-2xl mt-5 text-lg mb-6">
            
              Tom is hungry. He walks to the kitchen and gets some eggs. He
              takes some oil and puts a pan on the stove. Next, he turns on the
              heat and pours the oil into the pan. He cracks the eggs into a
              bowl, mixes them, and then pours them into the hot pan. He waits
              while the eggs cook. They cook for two minutes. 
              <br /> <br />Next, Tom puts the eggs on a plate and places the plate on the dining room table. Tom
              feels happy because he cooked eggs. He sits down in the big wooden
              chair, and eats the eggs with a spoon. They are good.<br /> <br /> He washes
              the plate with dishwashing soap, then washes the pan. He wets a
              sponge and finally cleans the table. 
              
          </div>
          <textarea
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="w-full h-40 p-4 border border-gray-300 rounded-lg mb-6"
            placeholder="Write your translation here..."
          ></textarea>
          
        
      </LessonContainer>
  );
};

export default Exercise1_0001;
