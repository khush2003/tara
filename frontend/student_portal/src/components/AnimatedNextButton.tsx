import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

/**
 * Props for the AnimatedNextButton component.
 * @property {() => void} onClick - Function to call when the button is clicked.
 * @property {boolean} isAlreadyNext - Boolean indicating if the task is already marked as next.
 * @property {string} className - Additional CSS class to apply to the button.
 * @property {string} text - Optional text to display on the button.
 * @property {boolean} disabled - Boolean indicating if the button is disabled.
 */
interface AnimatedNextButtonProps {
  onClick: () => void;
  isAlreadyNext: boolean;
  className?: string;
  text?: string;
  disabled?: boolean;
}

/**
 * AnimatedNextButton component.
 * This button displays an animation when clicked and changes its state to "next".
 * 
 * @param {AnimatedNextButtonProps} props - The props for the component.
 * @returns {JSX.Element} The rendered button component.
 */
const AnimatedNextButton: React.FC<AnimatedNextButtonProps> = ({ onClick, isAlreadyNext, className, text, disabled }) => {
  const [isNext, setIsNext] = useState(isAlreadyNext);
  const [isIntermediate, setIsIntermediate] = useState(false);

  useEffect(() => {
    setIsNext(isAlreadyNext);
  }, [isAlreadyNext]);

  /**
   * Handles the button click event.
   * If the button is not already marked as next or in an intermediate state, it triggers the intermediate animation,
   * sets the button to next state, and calls the onClick function.
   */
  const handleClick = () => {
    console.log('handleClick', isNext, isIntermediate, disabled);
    if (!isNext && !isIntermediate && !disabled) {
      setIsIntermediate(true);
      setTimeout(() => {
        setIsIntermediate(false);
        // setIsNext(true);
        onClick();
      }, 1000); // Intermediate step duration
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden font-semibold text-white",
        "w-40 h-12 rounded-full",
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : isNext
          ? "bg-gradient-to-r from-green-500 to-teal-600"
          : isIntermediate
          ? "bg-yellow-500"
          : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700",
        className
      )}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : isNext ? 1 : 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      disabled={disabled}
    >
      <span className="relative z-10 flex items-center justify-center">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isNext ? 1.2 : isIntermediate ? 1.5 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {isNext ? (
            <ChevronRight className="w-5 h-5 mr-2" />
          ) : isIntermediate ? (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <ChevronRight className="w-5 h-5 mr-2" />
            </motion.div>
          ) : (
            <ChevronRight className="w-5 h-5 mr-2" />
          )}
        </motion.div>
        {isNext ? (text || 'Next') : (text || 'Go Next')}
      </span>
    </motion.button>
  );
};

export default AnimatedNextButton;