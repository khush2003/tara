import React from "react";
import birds from "../../assets/birds.jpg"; 
import beach from "../../assets/beach.jpg"; 
import LessonContainer from "@/components/LessonContainer";
import StorySection from "@/components/StorySection";



// ID: 0001E0001
const Exercise2_0001: React.FC = () => {
  const [storedAnswers, setStoredAnswers] = React.useState(["Yesterday, my family and I _____ (was/were) at the park. The weather _____ (was/were) perfect, and the trees _____ (was/were) full of birds. My favorite part _____ (was/were) the ice cream stand!", "Last weekend, my friends and I _____ (was/were) at the beach. The water _____ (was/were) warm, and the waves _____ (was/were) big. Our sandcastle _____ (was/were) huge! We _____ (was/were) so happy when it didn't fall down."]);

  const handleAnswerCheck = () => {
    return { answers: storedAnswers.join("\n") };
  };

  return (
    <LessonContainer title="Was and Were Limericks" overrideClass="max-w-6xl" isTeacherScoredExercise onSubmit={handleAnswerCheck}>
            <div className="space-y-6">
              <StorySection
                text="Yesterday, my family and I _____ (was/were) at the park. The weather _____ (was/were) perfect, and the trees _____ (was/were) full of birds. My favorite part _____ (was/were) the ice cream stand!"
                image={birds}
                index={0}
                imageAlt="Bird on a branch"
                borderColor="border-purple-400"
                setStoredAnswers={setStoredAnswers}
              />
              <StorySection
                text="Last weekend, my friends and I _____ (was/were) at the beach. The water _____ (was/were) warm, and the waves _____ (was/were) big. Our sandcastle _____ (was/were) huge! We _____ (was/were) so happy when it didn't fall down."
                image={beach}
                index={1}
                imageAlt="Sandcastle"
                borderColor="border-green-400"
                setStoredAnswers={setStoredAnswers}
              />
            </div>
       
    </LessonContainer>
  );
};

export default Exercise2_0001;