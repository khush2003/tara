import { Card, CardContent } from "@/components/ui/card";
import meal from "../../assets/TARA flashcards/meal.png";
import breakfast from "../../assets/TARA flashcards/breakfast.png";
import lunch from "../../assets/TARA flashcards/lunch.png";
import dinner from "../../assets/TARA flashcards/dinner.png";
import cake from "../../assets/TARA flashcards/cake.png";
import bread from "../../assets/TARA flashcards/bread.png";
import egg from "../../assets/TARA flashcards/egg.png";
import rice from "../../assets/TARA flashcards/rice.png";
import { motion } from "framer-motion";
import { useState } from "react";
import LessonContainer from "@/components/LessonContainer";

// ID: 0001L0001

// Dummy flashcard data
const flashcardsData = [
    {
        image: meal,
        frontText: "Meal",
        definition:
            "A meal is yummy food we eat to fill our tummies. It can be breakfast, lunch, or dinner. We eat meals to give our bodies the energy to play, learn, and grow!",
    },
    {
        image: breakfast,
        frontText: "Breakfast",
        definition:
            "Breakfast is the first meal of the day. It is important because it gives us the energy to start our day. A healthy breakfast can help us think better and feel good!",
    },
    {
        image: lunch,
        frontText: "Lunch",
        definition:
            "Lunch is the second meal of the day. It is usually eaten around noon. A healthy lunch can help us stay focused and active throughout the day!",
    },
    {
        image: dinner,
        frontText: "Dinner",
        definition:
            "Dinner is the last meal of the day. It is usually eaten in the evening. A healthy dinner can help us sleep better and feel rested in the morning!",
    },
    {
        image: cake,
        frontText: "Cake",
        definition:
            " Cake is a sweet treat that we eat on special occasions like birthdays and holidays. It is made with flour, sugar, eggs, and butter. Cake can be frosted with icing and decorated with sprinkles or candles!",
    },
    {
        image: bread,
        frontText: "Bread",
        definition:
            "Bread is a staple food made from flour, water, and yeast. It is baked in an oven and can be eaten plain or with butter, jam, or cheese. Bread is a good source of carbohydrates and energy!",
    },
    {
        image: egg,
        frontText: "Egg",
        definition:
            "Eggs are a nutritious food that comes from chickens. They are a good source of protein, vitamins, and minerals. Eggs can be cooked in many ways, such as boiled, fried, scrambled, or poached!",
    },
    {
        image: rice,
        frontText: "Rice",
        definition:
            "Rice is a grain that is a staple food for many people around the world. It is a good source of carbohydrates and energy. Rice can be cooked in many ways and served with vegetables, meat, or fish!",
    },
];
export default function Learning1_0001() {
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
            title="Cooking Vocabulary"
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
