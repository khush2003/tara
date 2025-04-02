import React, { useState } from "react";
import Markdown from "react-markdown";

// import { Textarea } from "./components/ui/textarea";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

// Import API_KEY from .env
const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

// import { StopIcon, ThickArrowUpIcon } from "@radix-ui/react-icons";
import { TiArrowUp, TiMediaStop } from "react-icons/ti";
import remarkGfm from 'remark-gfm'
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inappropriateWords as inappropriateKeywords } from "@/lib/words";

interface Message {
    content: string;
    role: "user" | "assistant" | "system";
}

const systemPrompt: Message = {
    content: `I am an assistant created by Tara to help Thai middle school students better understand English. 
    I am here to guide students in understanding what they are struggling with. 
    I will absolutely not answer any offensive or inappropriate questions.
    Do not respond about racist, sexist, lewd or any other inappropriate content.`,
    role: "system",
};

const containsInappropriateContent = (message: string): boolean => {
    const words = message.toLowerCase().split(/\s+/);
    return inappropriateKeywords.some((keyword) => words.includes(keyword));
};

const exampleMessages: Message[] = [
    {
        content: `What is a meal?`,
        role: "user",
    },
    {
        content: `A simple and fun question!
A **"meal"** (มื้ออาหาร) means the food you eat at a certain time of the day (เวลาเฉพาะของวัน) 🍽️. It’s when you sit down and eat enough food (มากพอ) to give you energy ⚡ to play, learn, and do other things.

There are three main meals in a day:

- **Breakfast** (อาหารเช้า) 🌅: Eaten in the morning.
- **Lunch** (อาหารกลางวัน) 🥗: Eaten in the middle of the day.
- **Dinner** (อาหารเย็น) 🌆: Eaten in the evening.

Some people also like to eat **snacks** (ของว่าง) 🍪 between meals. Snacks are small amounts of food to help you stay full until the next meal.

Do you have any favorite foods or meals? 🤔🍕🥗`,
        role: "assistant",
    },
    {
        content: `What is bread?`,
        role: "user",
    },
    {
        content: `
Let’s talk about something delicious! 🍞

**Bread** (ขนมปัง) is a food that many people love ❤️. It’s made from flour (แป้ง), water (น้ำ), and yeast (ยีสต์). When you mix these ingredients and bake them in an oven (เตาอบ) 🔥, you get soft and tasty bread.

There are many kinds of bread. Some are fluffy and white (ขนมปังขาว) ☁️, while others are brown and healthy (ขนมปังโฮลวีต) 🌾.

People eat bread in many ways. You can spread butter (เนย) 🧈 or jam (แยม) 🍓 on it, or make sandwiches with meat (เนื้อ) 🍖 and vegetables (ผัก) 🥬.

What’s your favorite bread? How do you like to eat it? 🤔🥪
`,
        role: "assistant",
    },
    {
        content: `What is a Violin?`,
        role: "user",
    },
    {
        content: `
Okay, let's talk about the violin 🎻 (ไวโอลิน). A violin is a beautiful musical instrument (เครื่องดนตรี). Imagine a small box (กล่อง) with a long wooden neck (คอไม้) and strings (สาย) stretched across it.

**Here’s the interesting part**: When you want to make music, you use a bow (คันธนู). You gently stroke (ลูบ) the strings with the bow, and it makes lovely sounds (เสียงไพเราะ).

**And how does the violin make us feel?** 🎶 It can be happy (มีความสุข), sad (เศร้า), or even make us want to dance (เต้น)! People all over the world love playing the violin and listening to its beautiful melodies (ทำนอง).

So, the violin is like a magic box (กล่องวิเศษ) that makes wonderful music when you use the bow to touch its strings. Isn't that cool? 😄 Keep practicing, and you'll become a great violin player! 🌟
`,
role: "assistant"}
];

const fetchAssistantMessage = async (
    inputMessage: string,
    setStreamingMessage: React.Dispatch<React.SetStateAction<string | null>>,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    messages: Message[],
    setStreamReader: React.Dispatch<
        React.SetStateAction<ReadableStreamDefaultReader | null>
    
    >
) => {
    try {
        if (containsInappropriateContent(inputMessage)) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { content: "I'm sorry, I can't answer that question.", role: "assistant" },
            ]);
            return;
        }
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`, // Replace with your API key
                },
                body: JSON.stringify({
                    // model: "nousresearch/hermes-3-llama-3.1-405b:free",
                    // model: "mattshumer/reflection-70b:free",
                    "model": "meta-llama/llama-3.1-8b-instruct",
                    messages: [
                        systemPrompt,
                        ...exampleMessages,
                        ...messages,
                        { role: "user", content: inputMessage },
                    ],
                    temperature: 0.78,
                    stream: true,
                }),
            }
        );
        console.log(messages);  

        const reader = response.body?.getReader();
        if (reader) {
            setStreamReader(reader); // Save the reader to cancel the stream later
        }
        const decoder = new TextDecoder();
        let assistantMessage = "";

        while (true) {
            if (!reader) throw new Error("Reader is undefined");
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.trim().split("\n");

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    try {
                        const json = JSON.parse(line.replace("data: ", ""));
                        const content = json.choices[0].delta.content;
                        if (content) {
                            assistantMessage += content;
                            if (containsInappropriateContent(assistantMessage)) {
                                assistantMessage = "I'm sorry, I can't answer that question.";
                                reader.cancel();
                            }
                            setStreamingMessage(assistantMessage); // Update the UI with the streamed message
                        }
                    } catch {
                        //
                    }
                }
            }
        }

        if (containsInappropriateContent(assistantMessage)) {
            assistantMessage = "I'm sorry, I can't answer that question.";
        }
        setMessages((prevMessages) => [
            ...prevMessages,
            { content: assistantMessage, role: "assistant" },
        ]);
        setStreamingMessage(null);
        setStreamReader(null);
    } catch (error) {
        console.error("Error fetching assistant message:", error);
    } finally {
        setLoading(false);
    }
};

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    return (
        <div className="w-full">
            {message.role === "user" ? (
                <div className="flex flex-row justify-end">
                    <Card className="relative max-w-[70%] rounded-3xl px-5 py-2.5 bg-[#f4f4f4] dark:bg-token-main-surface-secondary">
                        {message.content}
                    </Card>
                </div>
            ) : (
                <div className="mx-auto flex mb-6  text-base">
                    <Avatar className="aspect-square min-w-[50px] min-h-[50px] w-[40px] h-[40px] ">
                       
                        <AvatarFallback>TA</AvatarFallback>
                    </Avatar>
                    <Markdown remarkPlugins={[[remarkGfm, {singleTilde: false}]]}
                    className="flex flex-col gap-4">
                        {message.content}
                    </Markdown>
                </div>
            )}
        </div>
    );
};

const ChatInput: React.FC<{
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSend: () => void;
    loading: boolean;
    streamReader: ReadableStreamDefaultReader | null;
    setStreamReader: React.Dispatch<
        React.SetStateAction<ReadableStreamDefaultReader | null>
    >;
    setStreamingMessage: React.Dispatch<React.SetStateAction<string | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
    inputMessage,
    setInputMessage,
    handleSend,
    loading,
    streamReader,
    setStreamReader,
    setStreamingMessage,
    setLoading,
}) => {
    return (
        <div className=" fixed  bottom-0 pb-6 bg-white mx-auto items-center text-base md:gap-5 lg:gap-6 md:max-w-4xl flex flex-row justify-between mt-10 sm:px-5 md:px-6 px-6 w-full gap-4">
            <div className=" relative flex h-full max-w-full flex-1 flex-col">
            <div className="bg-[#f4f4f4] absolute bottom-full left-0 right-0 z-20 rounded-3xl p-2 flex flex-row justify-between items-end w-full gap-4">
                <input
                    className="resize-none bg-[#f4f4f4] w-full pl-3 pr-4 border-none focus:outline-none hover:border-none py-2 h-auto overflow-hidden"
                    value={inputMessage}
                    onChange={(e) => {
                        setInputMessage(e.target.value);
                    }}
                    placeholder="Type your message..."
                
                    onKeyDown={
                        (e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                console.log("Clicked");
                                if (streamReader) {
                                    console.log("Canceling stream reader");
                                    streamReader.cancel();
                                    setStreamReader(null); // Reset the reader after canceling
                                    setStreamingMessage(null); // Clear the streaming message
                                    setLoading(false); // Stop loading
                                } else {
                                    handleSend();
                                    setInputMessage(""); // Clear the input message
                                    const textarea = document.querySelector("textarea");
                                    if (textarea) {
                                        textarea.style.height = "auto"; // Reset the height
                                    }
                                }
                            }
                        }
    
                    }
                />
                <Button
                    className=" rounded-full p-0 aspect-square"
                    onClick={() => {
                        console.log("Clicked");
                        if (streamReader) {
                            console.log("Canceling stream reader");
                            streamReader.cancel();
                            setStreamReader(null); // Reset the reader after canceling
                            setStreamingMessage(null); // Clear the streaming message
                            setLoading(false); // Stop loading
                        } else {
                            handleSend();
                            setInputMessage(""); // Clear the input message
                            const textarea = document.querySelector("textarea");
                            if (textarea) {
                                textarea.style.height = "auto"; // Reset the height
                            }
                        }
                    }}
                    disabled={loading ? false : !inputMessage}
                >
                    {!loading ? (
                        <TiArrowUp className="w-6 h-6 font-bold" />
                    ) : (
                        <TiMediaStop className="w-6 h-6 font-bold" />
                    )}
                </Button>
            </div>
            </div>
        </div>
    );
};

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
    ]);
    const [inputMessage, setInputMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [streamingMessage, setStreamingMessage] = useState<string | null>(
        null
    );
    const [streamReader, setStreamReader] =
        useState<ReadableStreamDefaultReader | null>(null);

    const handleSend = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = { content: inputMessage, role: "user" };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputMessage("");
        setLoading(true);
        setStreamingMessage(null); // Reset streaming message

        await fetchAssistantMessage(
            inputMessage,
            setStreamingMessage,
            setMessages,
            setLoading,
            messages,
            setStreamReader,
            
        );
    };

    return (
       
        <div
            className="flex  flex-col justify-between pt-6 px-3
        mx-auto text-base  items-center"
        >
        
            <div className="flex max-h-[70vh] px-3 overflow-y-auto flex-col md:w-full md:max-w-4xl gap-4 justify-start items-start pb-56">
                {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                ))}

                {streamingMessage && (
                    <div className="flex w-full gap-4 text-base">
                        <Avatar className="aspect-square min-w-[50px] min-h-[50px] w-[40px] h-[40px] ">
                            <AvatarImage src={""} alt="@shadcn" />
                            <AvatarFallback>
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            </AvatarFallback>
                        </Avatar>

                        <Markdown remarkPlugins={[[remarkGfm, {singleTilde: false}]]}
                        className="flex flex-col gap-4">
                            {streamingMessage}
                        </Markdown>
                    </div>
                )}
            </div>

            <ChatInput
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSend={handleSend}
                loading={loading}
                streamReader={streamReader}
                setStreamReader={setStreamReader}
                setStreamingMessage={setStreamingMessage}
                setLoading={setLoading}
            />
        </div>
     
    );
};

export default ChatInterface;
