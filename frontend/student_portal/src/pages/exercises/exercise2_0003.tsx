import React from "react";
import ContentContainer from "@/components/ContentContainer";
import StorySectionMultiple from "@/components/StorySectionMultiple";



// ID: 0001E0001
const Exercise2_0003: React.FC = () => {
  const [storedAnswers, setStoredAnswers] = React.useState([["The cat _____  asleep on the couch.", "We _____ at the museum yesterday.", "The books _____ on the shelf.", "She _____ very happy about her new bike."], ["The children _____ excited to go on a trip.", "The cake _____ delicious.", "The stars _____ bright in the sky last night.", "My book _____ on the table."]] );

  const handleAnswerCheck = () => {
    return { answers: storedAnswers.join(" ") };
  }

  return (
    <ContentContainer title="Was or Were?" overrideClass="max-w-6xl" onSubmit={handleAnswerCheck} isTeacherScoredExercise>
            <div className="space-y-6 ">
              <div className={"max-w-lg"}>
              <StorySectionMultiple
                text={["The cat _____  asleep on the couch.", "We _____ at the museum yesterday.", "The books _____ on the shelf.", "She _____ very happy about her new bike."]}
                placeholder="was/were"
                borderColor="border-purple-400"
                index={0}
                setStoredAnswers={setStoredAnswers}
              />
              </div>
              <div className={"ml-auto max-w-lg"}>
              <StorySectionMultiple
                text={["The children _____ excited to go on a trip.", "The cake _____ delicious.", "The stars _____ bright in the sky last night.", "My book _____ on the table."]}
                placeholder="was/were"
                borderColor="border-green-400"
                index={1}
                setStoredAnswers={setStoredAnswers}
              />
              </div>
            </div>
    </ContentContainer>
  );
};


export default Exercise2_0003;