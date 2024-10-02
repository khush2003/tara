import { useState } from "react";

interface StorySectionProps {
    text: string;
    image: string;
    imageAlt: string;
    borderColor: string;
  }
  
  function StorySection({ text, image, imageAlt, borderColor }: StorySectionProps) {
    const words = text.split(' ');
    const blankCount = words.filter((word) => word === '_____').length;
    const [answers, setAnswers] = useState(Array(blankCount).fill(''));
  
    const handleInputChange = (index: number, value: string) => {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      setAnswers(newAnswers);
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