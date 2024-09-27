import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import StudentGuide from "../guidance";
import Logo from "../../assets/Chat.png";
import users from "../../assets/users.png";
import cake from "../../assets/TARA flashcards/cake.png";
import rice from "../../assets/TARA flashcards/rice.png";
import egg from "../../assets/TARA flashcards/egg.png";
import salad from "../../assets/TARA flashcards/salad.png";
import chicken from "../../assets/TARA flashcards/chicken.png";
import omelette from "../../assets/TARA flashcards/omelette.png";

// ID: 0001E0003

const ExercisePage3 = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

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

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const toggleGuide = useCallback(() => {
    setShowGuide(!showGuide);
  }, [showGuide]);

  const toggleMobileSidebar = useCallback(() => {
    setSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  return (
    <div className="relative flex h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-20">
        <Button
          onClick={toggleMobileSidebar}
          className="p-2 bg-blue-600 text-white rounded-lg shadow-lg"
        >
          {isSidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed z-10 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transform md:relative flex-shrink-0 ${
          isSidebarCollapsed ? "w-16" : "w-60"
        } h-full p-4 bg-gradient-to-r from-[#002761] to-[#5E0076] text-white shadow-lg transition-all duration-300 ease-in-out md:flex flex-col md:static`}
      >
        {/* Sidebar Header */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center space-y-2">
            <img
              src={users}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            {!isSidebarCollapsed && (
              <>
                <h2 className="text-sm font-semibold mt-2">Johnny</h2>
                <p className="text-xs text-gray-300">Level 3</p>
                <p className="text-xs text-gray-300">490 Points</p>
                <Button
                  className="w-full py-4 bg-blue-800 hover:from-purple-800 rounded-lg"
                  onClick={() => navigate("/gameintro")}
                >
                  Let's Play TARA Game!
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Recommended Courses */}
        {!isSidebarCollapsed && (
          <>
            <div className="mt-6">
              <h3 className="text-xs font-semibold">Lesson</h3>
              <ul className="flex flex-col mt-2 space-y-1 text-xs">
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-800 hover:to-[#25c3ea] rounded-lg px-2 py-2"
                  onClick={() => navigate("/learning")}
                >
                  Unit 1: Foods
                </Button>
              </ul>
            </div>

            {/* Current Courses */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold">Exercises</h3>
              <ul className="space-y-4 mt-2">
                <li className="flex flex-col">
                  <Button
                    className="w-full py-4 bg-blue-500 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                    onClick={() => navigate("/exercise")}
                  >
                    <span>Exercise 1: Translation</span>
                  </Button>
                </li>

                <li className="flex flex-col">
                  <Button
                    className="w-full py-4 bg-blue-400 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                    onClick={() => navigate("/exercise2")}
                  >
                    <span>Exercise 2: Fill in the blanks</span>
                  </Button>
                </li>

                <li className="flex flex-col">
                  <Button
                    className="w-full py-4 bg-blue-300 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                    onClick={() => navigate("/exercise3")}
                  >
                    <span>Exercise 3: Drag and Drop</span>
                  </Button>
                </li>
              </ul>
            </div>

            {/* See All Courses Button */}
            <Button
              className="mt-6 w-full bg-green-500 text-xs rounded-lg"
              onClick={() => navigate("/dashboard")}
            >
              See All Lessons
            </Button>
          </>
        )}
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

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

      <Button
        onClick={toggleGuide}
        className="fixed bottom-4 right-4 w-16 h-16 p-0 rounded-full bg-blue-900 text-white shadow-lg hover:bg-purple-600 flex items-center justify-center"
      >
        <img src={Logo} alt="Logo" className="w-10 h-10" />
      </Button>

      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg">
            <StudentGuide />
            <Button
              onClick={toggleGuide}
              className="mt-4 p-2 bg-red-500 text-white rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePage3;