import React from "react";
import LessonContainer from "@/components/LessonContainer";

// Begin, cut, warmup, delicious, clean, pointy, soft
const synonyms = [
  { word: "Begin", synonym: ["start", "starts", "starting"] },
  { word: "Clean", synonym: ["wash", "washes", "washing"] },
  { word: "Cut", synonym: ["chop", "chops", "chopping"] },
  { word: "Pointy", synonym: ["sharp", "sharper", "sharpest"] },
  { word: "Warmup", synonym: ["heat", "heats", "heating"] },
  { word: "Soft", synonym: ["tender", "tenders", "tendering"] },
  { word: "Delicious", synonym: ["appealing", "appeals", "appealed"] },
];
import { CheckCircle, XCircle } from 'lucide-react'
// ID: 0001E0001
const Exercise1_0001: React.FC = () => {
  const [results, setResults] = React.useState<{ [key: string]: boolean }>({});

  const handleAnswerCheck = () => {
    const inputs = document.querySelectorAll("input");
    const newResults: { [key: string]: boolean } = {};

    inputs.forEach((input, index) => {
      const isCorrect = synonyms[index].synonym.includes(input.value.toLowerCase());
      newResults[synonyms[index].word] = isCorrect;
      input.style.backgroundColor = isCorrect ? "#D1FAE5" : "#FEE2E2";
    });

    setResults(newResults);

    let score = 0;
    let total = 0;
    Object.keys(newResults).forEach((word) => {
      total += 1;
      if (newResults[word]) {
        score += 1;
      }
    });
    const scorePercent = (score / total) * 100;

    const markdownResults = Object.keys(newResults).map((word) => {
      const isCorrect = newResults[word];
      const synonym = inputs[synonyms.findIndex(s => s.word === word)].value;
      return `- **${word}**: ${synonym} - ${isCorrect ? "Correct" : "Incorrect"}`;
    }).join("\n");

    return {answers: markdownResults, score: scorePercent};
  };
 

  return (
    <LessonContainer title="Exercise: Synonyms!" overrideClass="max-w-4xl" isInstantScoredExercise onSubmit={handleAnswerCheck}>
        
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
            Find the synonyms in the text
          </h2>
            <div className="text-left bg-green-50 p-10 rounded-2xl mt-5 text-lg mb-6">
            Tom is excited to cook his favorite recipe. He starts by getting a
              fresh set of vegetables from the market. He carefully washes them
              to make sure they are clean. Tom uses a sharp knife to chop the
              vegetables into small pieces. He heats some oil in a pan until it
              is hot. Then, he adds the vegetables and mixes them until they are
              tender. After cooking, Tom puts the vegetables on a plate. The
              meal looks very appealing, and Tom feels happy with his delicious
              dish.
              
            </div>
            {/* Word and fill in the synonym 2 columns */}
            <div className="grid grid-cols-2 gap-4 px-10">
            {synonyms.map((synonym) => (
              <div key={synonym.word} className="grid grid-cols-3 items-center space-x-4">
              <span className="font-semibold">{synonym.word}</span>
              <input
                type="text"
                className="w-40 p-2 border border-gray-300 rounded-lg"
                placeholder="Synonym"
              />
              {results[synonym.word] !== undefined && (
                results[synonym.word] ? (
                <CheckCircle className="text-green-500" />
                ) : (
                <XCircle className="text-red-500" />
                )
              )}
              </div>
            ))}
            </div>
            {/* Check answers button, use lowercase */}
            <div className="mt-8 text-center">
            </div>
        
      </LessonContainer>
  );
};

export default Exercise1_0001;
