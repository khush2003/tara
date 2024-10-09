import { useState } from "react";

interface StorySectionProps {
    text: string;
    image: string;
    imageAlt: string;
    borderColor: string;
    index: number;
    setStoredAnswers: React.Dispatch<React.SetStateAction<string[]>>
  }
  
  function StorySection({ text, image, imageAlt, borderColor, index, setStoredAnswers }: StorySectionProps) {

    const words = text.split(' ');
    const blankCount = words.filter((word) => word === '_____').length;
    const [answers, setAnswers] = useState(Array(blankCount).fill(''));
  
    const handleInputChange = (blankIndex: number, value: string) => {
      const newAnswers = [...answers];
      newAnswers[blankIndex] = value;
      setAnswers(newAnswers);
      setStoredAnswers((prev) => {
        const newAnswers = [...prev]; //newAnswers[index] is the current sentence
        // Replace the ____ associated with blankIndex with the student's answer
        const sentenceWords = newAnswers[index].split(' ');

        let currentBlankIndex = 0;
        for (let i = 0; i < sentenceWords.length; i++) {
            if (sentenceWords[i].startsWith('_____')) {
            if (currentBlankIndex === blankIndex) {
              sentenceWords[i] = '_____' + "StudentAnswer:" + value ;
              break;
            }
            currentBlankIndex++;
            }
        }
        newAnswers[index] = sentenceWords.join(' ');
        
        return newAnswers;
      });
    };
  
    return (
      <div className={`p-4 border-2 ${borderColor} rounded-lg flex items-start space-x-4`}>
        <img src={image} alt={imageAlt} className="w-24 h-24 object-contain" />
        <p className="flex-1 text-lg">
          {words.map((word, wordIndex) => {
            if (word === '_____') {
              const blankIndex = words.slice(0, wordIndex).filter((w) => w === '_____').length;
              return (
                <input
                  key={wordIndex}
                  type="text"
                  maxLength={4}
                  value={answers[blankIndex]}
                  onChange={(e) => handleInputChange(blankIndex, e.target.value)}
                  className="w-16 inline-block mx-1 p-1 text-center border border-gray-300"
                  aria-label={`Fill in the blank ${blankIndex + 1}`}
                />
              );
            }
            return <span key={wordIndex}>{word} </span>;
          })}
        </p>
      </div>
    );
  }

  export default StorySection;