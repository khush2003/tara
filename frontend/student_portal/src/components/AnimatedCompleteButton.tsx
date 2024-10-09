import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircleIcon } from 'lucide-react';
import { cn } from "@/lib/utils";


/**
 * Props for the AnimatedCompleteButton component.
 * @property {() => void} onClick - Function to call when the button is clicked.
 * @property {boolean} isAlreadyComplete - Boolean indicating if the task is already complete.
 * @property {string} className - Additional CSS class to apply to the button.
 * @property {string} displayText - Text to display on the button.
 * @property {boolean} isExercise - Boolean indicating if the task is an exercise.
 */
interface AnimatedCompleteButtonProps {
  onClick: () => void;
  isAlreadyComplete: boolean;
  className?: string;
  displayText?: string;
  isExercise?: boolean;
}

/**
 * AnimatedCompleteButton component.
 * This button displays an animation when clicked and changes its state to "completed".
 * 
 * @param {AnimatedCompleteButtonProps} props - The props for the component.
 * @returns {JSX.Element} The rendered button component.
 */
const AnimatedCompleteButton: React.FC<AnimatedCompleteButtonProps> = ({ onClick, isAlreadyComplete, className, displayText, isExercise }: AnimatedCompleteButtonProps): JSX.Element => {
  const shouldShowCompleted = isExercise ? false : isAlreadyComplete;
  const [isCompleted, setIsCompleted] = useState(shouldShowCompleted);
  const [isIntermediate, setIsIntermediate] = useState(false);
  useEffect(() => {
    setIsCompleted(shouldShowCompleted);
  }, [shouldShowCompleted]);

  /**
   * Handles the button click event.
   * If the button is not already completed or in an intermediate state, it triggers the intermediate animation,
   * sets the button to completed state, and calls the onClick function.
   */
  const handleClick = () => {
    if (!isCompleted && !isIntermediate) {
      setIsIntermediate(true);
      setTimeout(() => {
        setIsIntermediate(false);
        if (isExercise) {
          setIsCompleted(false);
          isAlreadyComplete = true;
        } else {
          setIsCompleted(true);
        }
        onClick();
      }, 1000); // Intermediate step duration
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden font-semibold text-white",
        "w-52 h-12 rounded-full",
        isCompleted
          ? "bg-gradient-to-r from-blue-500 to-purple-600"
          : isIntermediate
          ? "bg-green-500"
          : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
        className
      )}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: isCompleted ? 1 : 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <span className="relative z-10 flex items-center justify-center">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isCompleted ? 1.2 : isIntermediate ? 1.5 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {isCompleted ? (
            <Check className="w-5 h-5 mr-2" />
          ) : isIntermediate ? (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Check className="w-5 h-5 mr-2" />
            </motion.div>
          ) : (
            <CheckCircleIcon className="w-5 h-5 mr-2" />
          )}
        </motion.div>
        {(() => {
          if (isCompleted) {
            return 'Completed';
          } else if (isExercise && isAlreadyComplete) {
            return "Submit Again";
          } else if (isExercise ) {
            return displayText;
          } else {
            return 'Complete';
          }
        })()}
      </span>
    </motion.button>
  );
};

export default AnimatedCompleteButton;