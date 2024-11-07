import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import ContentContainer from '@/components/ContentContainer'

const lessonContent = [
 
"Bears are large mammals that can be found in forests, mountains, and even arctic regions. There are several different species of bears, including the brown bear, black bear, and polar bear. Most bears are omnivores, which means they eat both plants and animals. Their diet can include fruits, berries, fish, insects, and small mammals. However, some bears, like the polar bear, rely mostly on meat, hunting seals for food."
,
"During the warmer months, bears spend a lot of time eating to build up fat reserves. This is important because, in the winter, many bears hibernate. Hibernation is a special kind of deep sleep that helps bears conserve energy during the cold months when food is scarce. During hibernation, a bear's heart rate and body temperature drop, and they don't need to eat, drink, or go to the bathroom. Some bears, like polar bears, do not hibernate because they live in cold environments year-round and can hunt even in winter."
,
"Despite their size, bears are excellent swimmers and climbers. Polar bears are especially skilled swimmers, using their strong paws to navigate icy waters. Black bears, on the other hand, are known for their climbing abilities and will often climb trees to escape danger or search for food.",

"Bears are generally solitary animals, although mothers are very protective of their cubs. Cubs stay with their mothers for about two years, learning how to find food and survive in the wild. After that, they venture off on their own."

]

export default function Learning3_0001() {
  const [visibleContent, setVisibleContent] = useState(1)

  const showMore = () => {
    setVisibleContent((prev) => Math.min(prev + 1, lessonContent.length))
  }

  return (
    <ContentContainer title="Learn about Bears">
      <AnimatePresence>
            {lessonContent.slice(0, visibleContent).map((content, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-lg mb-4"
              >
                {content}
              </motion.p>
            ))}
          </AnimatePresence>
          {visibleContent < lessonContent.length && (
            <Button onClick={showMore} className="mt-4 w-full">
              Learn More
            </Button>
          )}
    </ContentContainer>
  )
}

