import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/pages/chat";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const ChatModule = () => {
    const [chatOpen, setChatOpen] = useState(false);


    const toggleChat = () => setChatOpen(!chatOpen);
    return (
        <>
            <motion.div
                className="fixed bottom-6 right-6"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <motion.button
                    className="rounded-full items-center justify-center w-16 px-4 h-16 bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleChat}
                >
                    <MessageCircle className="h-8 w-8" />
                </motion.button>
            </motion.div>

            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-32 right-6 w-96 bg-white rounded-3xl shadow-lg overflow-hidden max-h-[70vh]"
                    >
                        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 flex justify-between items-center">
                            <h3 className="font-bold">Chat with Tara</h3>
                            <motion.button
                                
                                size="icon"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleChat}
                            >
                                <X className="h-4 w-4" />
                            </motion.button>
                        </div>
                        <ChatInterface />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatModule;
