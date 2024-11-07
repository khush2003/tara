import React from "react";
import ContentContainer from "@/components/ContentContainer";
import StorySectionMultiple from "@/components/StorySectionMultiple";

const Exercise4_0002: React.FC = () => {
    const [storedAnswers, setStoredAnswers] = React.useState([
        [
            "In winter, the weather is _____",
            "We wear hats and coats that are _____",
            "In spring, flowers grow,",
            "In summer, we _____",
            "And autumn brings leaves that all _____"
          ],
          [
            "The sun is so _____",
            "In autumn, the leaves turn _____",
            "Winter brings cold _____"
          ]
    ]);

    const handleAnswerCheck = () => {
        return { answers: storedAnswers.join(" ") };
    };

    return (
        <ContentContainer title="Complete the Limerick and Haiku" overrideClass="max-w-6xl" onSubmit={handleAnswerCheck} isTeacherScoredExercise>
            <div className="space-y-6 ">
                <div className={"max-w-lg"}>
                    <StorySectionMultiple
                        text={[
                            "In winter, the weather is _____",
                            "We wear hats and coats that are _____",
                            "In spring, flowers grow,",
                            "In summer, we _____",
                            "And autumn brings leaves that all _____"
                          ]}
                        placeholder=""
                        borderColor="border-purple-400"
                        index={0}
                        setStoredAnswers={setStoredAnswers}
                    />
                </div>
                <div className={"ml-auto max-w-lg"}>
                    <StorySectionMultiple
                        text={[
                            "The sun is so _____",
                            "In autumn, the leaves turn _____",
                            "Winter brings cold _____"
                          ]}
                        placeholder=""
                        borderColor="border-green-400"
                        index={1}
                        setStoredAnswers={setStoredAnswers}
                    />
                </div>
            </div>
        </ContentContainer>
    );
};

export default Exercise4_0002;
