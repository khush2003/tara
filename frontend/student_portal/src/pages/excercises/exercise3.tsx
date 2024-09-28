import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import cake from "../../assets/TARA flashcards/cake.png";
import rice from "../../assets/TARA flashcards/rice.png";
import egg from "../../assets/TARA flashcards/egg.png";
import salad from "../../assets/TARA flashcards/salad.png";
import chicken from "../../assets/TARA flashcards/chicken.png";
import omelette from "../../assets/TARA flashcards/omelette.png";

// ID: 0001E0003

const ExercisePage3 = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([
    { id: 1, img: cake, alt: "Cake" },
    { id: 2, img: rice, alt: "Rice" },
    { id: 3, img: egg, alt: "Egg" },
    { id: 4, img: omelette, alt: "Omelette" },
    { id: 5, img: salad, alt: "Salad" },
    { id: 5, img: salad, alt: "Salad" },
    { id: 6, img: chicken, alt: "Chicken" },
  ]);

  const [sentences, setSentences] = useState([
    { id: 1, text: "Josh cooked an omelette and prepared a salad", answer: [], expectedAnswers: 2 },
    { id: 2, text: "Bingo prepared two salads", answer: [], expectedAnswers: 2 },
    { id: 3, text: "Leo prepared a meal with rice and chicken", answer: [], expectedAnswers: 2 },
  ]);

  const onDragStart = useCallback((e, item) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e, sentenceId, boxIndex) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("application/json"));
    
    setSentences((prevSentences) =>
      prevSentences.map((sentence) =>
        sentence.id === sentenceId
          ? {
              ...sentence,
              answer: [
                ...sentence.answer.slice(0, boxIndex),
                item,
                ...sentence.answer.slice(boxIndex + 1),
              ],
            }
          : sentence
      )
    );
    setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
  }, []);

  const checkAnswers = useCallback(() => {
    const correctAnswers = {
      1: [4, 5], // Omelette and Salad
      2: [5, 5], // Two Salads
      3: [2, 6], // Rice and Chicken
    };

    setSentences((prevSentences) =>
      prevSentences.map((sentence) => ({
        ...sentence,
        isCorrect:
          sentence.answer &&
          sentence.answer.length === correctAnswers[sentence.id].length &&
          sentence.answer.every(
            (item, index) => item.id === correctAnswers[sentence.id][index]
          ),
      }))
    );
  }, []);


  return (
    <div className="relative flex h-screen bg-gray-50">
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="flex items-center justify-center mb-3 bg-gradient-to-r from-[#002761] to-[#5E0076] pr-14 rounded-md border-1">
          <h1 className="text-white text-4xl">EXERCISE: FOODS</h1>
        </div>
        <Card className="p-8 shadow-md rounded-xl bg-white">
          <h2 className="text-2xl font-bold font-mono mb-4 text-center text-gray-700">
            DRAG AND DROP
          </h2>
          <p className="text-center mb-6 text-gray-600">
            Drag the images to complete the sentences
          </p>
          <div className="text-center mb-6">
            <div className="mb-4 flex justify-center">
              {items.map((item) => (
                <img
                  key={item.id}
                  src={item.img}
                  alt={item.alt}
                  draggable
                  onDragStart={(e) => onDragStart(e, item)}
                  className="w-16 h-16 m-2 cursor-move"
                />
              ))}
            </div>
            {sentences.map((sentence) => (
              <div key={sentence.id} className="mb-4">
                <span>{sentence.text}</span>
                <div className="flex justify-center space-x-4">
                  {Array.from({ length: sentence.expectedAnswers }).map(
                    (_, index) => (
                      <div
                        key={index}
                        onDragOver={(e) => onDragOver(e)}
                        onDrop={(e) => onDrop(e, sentence.id, index)}
                        className="w-20 h-20 border-2 border-dashed border-gray-400 flex items-center justify-center"
                      >
                        {sentence.answer[index] && (
                          <img
                            src={sentence.answer[index].img}
                            alt={sentence.answer[index].alt}
                            className="w-16 h-16"
                          />
                        )}
                      </div>
                    )
                  )}
                </div>
                {sentence.isCorrect !== undefined && (
                  <span
                    className={
                      sentence.isCorrect
                        ? "text-green-500 ml-2"
                        : "text-red-500 ml-2"
                    }
                  >
                    {sentence.isCorrect ? "✓" : "✗"}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              className="p-4 bg-green-500 text-white rounded-lg"
              onClick={checkAnswers}
            >
              Check Answers
            </Button>
            <Button
              className="p-4 bg-blue-500 text-white rounded-lg"
              onClick={() => navigate("/login")}
            >
              Next Lesson
            </Button>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default ExercisePage3;