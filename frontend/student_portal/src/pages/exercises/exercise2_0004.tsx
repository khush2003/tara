import React from "react";
import LessonContainer from "@/components/LessonContainer";
import { Button } from "@/components/ui/button";

// Begin, cut, warmup, delicious, clean, pointy, soft
const scrambled = [
  { scarmbledWords: "was / cake / the / for / party / the / perfect", solution: ["the cake was perfect for the party", "the cake was perfect for the party."] },
  { scarmbledWords: "friends / beach / were / the / my / at / last weekend", solution: ["my friends were at the beach last weekend", "my friends were at the beach last weekend."] },
  { scarmbledWords: "bicycle / his / broken / was / morning / this", solution: ["his bicycle was broken this morning", "his bicycle was broken this morning."] },
  { scarmbledWords: "homework / my / difficult / was / last night", solution: ["my homework was difficult last night", "my homework was difficult last night."] },
];
import { CheckCircle, XCircle } from 'lucide-react'
// ID: 0001E0001
const Exercise2_0004: React.FC = () => {
  const [results, setResults] = React.useState<{ [key: string]: boolean }>({});

  const handleAnswerCheck = () => {
    const inputs = document.querySelectorAll("input");
    const newResults: { [key: string]: boolean } = {};

    inputs.forEach((input, index) => {
      const isCorrect = scrambled[index].solution.includes(input.value.toLowerCase().trim());
      newResults[scrambled[index].scarmbledWords] = isCorrect;
      input.style.backgroundColor = isCorrect ? "#D1FAE5" : "#FEE2E2";
    });

    setResults(newResults);
  };
 

  return (
    <LessonContainer title="Exercise: Scambled Senteces!" overrideClass="max-w-4xl">
        
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
            Let's rewrite the sentences in the correct order
          </h2>
            {/* Word and fill in the synonym 2 columns */}
            <div className="grid grid-cols-2 gap-4 px-10">
            {scrambled.map((synonym) => (
              <div key={synonym.scarmbledWords} className=" items-center space-x-4">
                <div className="text-left bg-green-50 p-10 rounded-2xl mt-5 text-lg mb-6">
                <span className="font-semibold">{synonym.scarmbledWords}</span>
              
            </div>
             <div className="flex flex-row items-center space-x-4">
              <input
                type="text"
                className="w-96 p-2 border border-gray-300 rounded-lg"
                placeholder="Correct Order"
              />
              {results[synonym.scarmbledWords] !== undefined && (
                results[synonym.scarmbledWords] ? (
                <CheckCircle className="text-green-500" />
                ) : (
                <XCircle className="text-red-500" />
                )
              )}
              </div>
            </div>
            ))}
            </div>
            {/* Check answers button, use lowercase */}
            <div className="mt-8 text-center">
            <Button onClick={handleAnswerCheck} className="p-4 bg-green-500 text-white rounded-lg">
              Check Answers
            </Button>
            </div>
        
      </LessonContainer>
  );
};

export default Exercise2_0004;
