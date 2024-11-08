import { Card, CardContent } from "@/components/ui/card";
import summer from"@/assets/summer.png";
import autumn from"@/assets/autumn.png";
import spring from"@/assets/spring.png";
import winter from"@/assets/winter.png";
import sunny from"@/assets/sunny.png";
import cloudy from"@/assets/cloudy.png";
import rainy from"@/assets/rainy.png";
import windy from"@/assets/windy.png";
import { motion } from "framer-motion";
import { useState } from "react";
import LessonContainer from "@/components/LessonContainer";


// Dummy flashcard data
const flashcardsData = [
    {
        image: summer,
        frontText: "Summer",
        definition:
            "Summer is the hottest season of the year. It comes after spring and before autumn. Summer is a great time to go swimming, have picnics, and play outside!",
    },
    {
        image: autumn,
        frontText: "Autumn",
        definition:
            "Autumn is the season between summer and winter. It is also called fall. Autumn is known for its colorful leaves, cool weather, and harvest festivals!",
    },
    {
        image: spring,
        frontText: "Spring",
        definition:
            "Spring is the season between winter and summer. It is known for its blooming flowers, chirping birds, and warmer weather. Spring is a time of growth and renewal!",
    },
    {
        image: winter,
        frontText: "Winter",
        definition:
            "Winter is the coldest season of the year. It comes after autumn and before spring. Winter is a time for snow, ice skating, hot cocoa, and cozy sweaters!",
    },
    {
        image: sunny,
        frontText: "Sunny",
        definition:
            "Sunny weather is when the sun is shining brightly in the sky. It is warm and pleasant outside. Sunny days are perfect for going to the beach, having a picnic, or playing sports!",
    },
    {
        image: cloudy,
        frontText: "Cloudy",
        definition:
            "Cloudy weather is when the sky is covered with clouds. It is usually gray and overcast outside. Cloudy days are good for staying indoors, reading a book, or watching a movie!",
    },
    {
        image: rainy,
        frontText: "Rainy",
        definition:
            "Rainy weather is when water falls from the sky in the form of rain. It is wet and damp outside. Rainy days are perfect for listening to the sound of raindrops, jumping in puddles, or drinking hot tea!",
    },
    {
        image: windy,
        frontText: "Windy",
        definition:
            "Windy weather is when the air is moving quickly and forcefully. It can make the trees sway and the leaves rustle. Windy days are great for flying kites, sailing boats, or feeling the breeze on your face!",
    },
];
export default function Learning4_0001() {
    const [flippedCards, setFlippedCards] = useState<boolean[]>(
        new Array(flashcardsData.length).fill(false)
    );

    const handleFlip = (index: number) => {
        setFlippedCards((prev) => {
            const newFlippedCards = [...prev];
            newFlippedCards[index] = !newFlippedCards[index];
            return newFlippedCards;
        });
    };

    return (
        <LessonContainer
            title="Weather and Seasons Vocabulary"
            className="bg-gradient-to-l from-yellow-100 to-orange-200"
            headerBgColor="bg-orange-100"
            headerTextColor="text-yellow-800"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {flashcardsData.map((card, index) => (
                    <motion.div
                        key={index}
                        className="perspective-1000"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Card
                            className="w-full h-64 rounded-3xl overflow-hidden cursor-pointer"
                            onClick={() => handleFlip(index)}
                        >
                            <CardContent className="p-0 h-full overflow-hidden">
                                <motion.div
                                    className="w-full h-full relative"
                                    animate={{
                                        rotateY: flippedCards[index] ? 180 : 0,
                                    }}
                                    transition={{ duration: 0.5 }}
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    {/* Front Side */}
                                    <div
                                        className="absolute flex flex-col justify-normal w-full h-full py-10 backface-hidden "
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(0deg)",
                                        }}
                                    >
                                        <div className="flex flex-col w-full justify-between items-center">
                                            <img
                                                src={card.image}
                                                alt={card.frontText}
                                                className="w-full h-full  px-5 object-cover rounded-lg"
                                            />
                                            <div className="w-full bg-gray-200 p-4">
                                                <h2 className="text-2xl text-center font-bold text-gray-800">
                                                    {card.frontText}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Back Side */}
                                    <div
                                        className="absolute w-full h-full bg-white rounded-lg flex items-center justify-center"
                                        style={{
                                            backfaceVisibility: "hidden",
                                            transform: "rotateY(180deg)",
                                        }}
                                    >
                                        <div className="flex flex-col h-full justify-between items-center">
                                            <div className="w-full h-full bg-white ">
                                                <h2 className="text-2xl p-4 bg-gray-200 text-center font-bold mb-3 text-gray-800">
                                                    {card.frontText}
                                                </h2>
                                                <div className="text-gray-600 p-4 text-sm">
                                                    {card.definition}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </LessonContainer>
    );
}
