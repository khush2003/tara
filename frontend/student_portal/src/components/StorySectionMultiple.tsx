import { useState } from "react";
import { Input } from "./ui/input";

interface StorySectionMultipleProps {
    text: string[];
    image?: string;
    imageAlt?: string;
    borderColor: string;
    placeholder?: string;
  }
  
  function StorySectionMultiple({ text, image, imageAlt, borderColor, placeholder }: StorySectionMultipleProps) {
    const words = text.join(" $$new$$ ").split(' ');
    console.log(words);
    const blankCount = words.filter((word) => word === '_____').length;
    const [answers, setAnswers] = useState(Array(blankCount).fill(''));
  
    const handleInputChange = (index: number, value: string) => {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      setAnswers(newAnswers);
    };
  
    return (
      <div className={`p-7 border-2 ${borderColor} rounded-3xl flex items-start space-x-4`}>
        {image && <img src={image} alt={imageAlt} className="w-24 h-24 object-contain"/>}
        <p className="flex-1 text-lg gap-10">
          {words.map((word, wordIndex) => {
            if (word === '_____') {
              const blankIndex = words.slice(0, wordIndex).filter((w) => w === '_____').length;
              return (
                <Input
                  key={wordIndex}
                  type="text"
                  maxLength={4}
                  placeholder={placeholder}
                  value={answers[blankIndex]}
                  onChange={(e) => handleInputChange(blankIndex, e.target.value)}
                  className="w-24 inline-block mx-3 p-1 text-center border border-gray-300"
                  aria-label={`Fill in the blank ${blankIndex + 1}`}
                />
              );
            } else if (word === '$$new$$') {
                return <div className="p-2" key={wordIndex} /> ;
                }
            return <span key={wordIndex}>{word} </span>;
          })}
        </p>
      </div>
    );
  }

  export default StorySectionMultiple;