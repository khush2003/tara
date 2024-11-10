import { useState, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, ChevronLeft, Link } from 'lucide-react';


interface HelpTopic {
  title: string;
  content: string;
}

const helpTopics: HelpTopic[] = [
  {
    title: "How to Update Your Profile",
    content: "To update your profile, navigate to the Settings page and click on 'Profile'. Here you can change your avatar (upload a photo), update your personal information, and save the changes by clicking the 'Save Your Profile Changes' button."
  },
  {
    title: "How to Change Your Password",
    content: "To change your password, navigate to the Settings page, enter your current password and the new password, then click 'Save Changes'."
  },
  {
    title: "What if I don't understand something?",
    content: "When learning, you will see a small chat button on the bottom-right corner of your screen. When you click on it, Tara Assistant will pop up. You can ask any question and AI will answer to your query instantly. If you still have questions, you can ask your teacher for help."
  },
  {
    title: "How to Use the Learning Modules",
    content: "The learning modules can be accessed from the Dashboard. Click on the module you want to start, and follow the instructions provided. Each module contains lessons and exercises to help you learn effectively. You can track your progress and revisit lessons or exercises as needed."
  },
  {
    title: "Navigating the Dashboard",
    content: "The Dashboard provides an overview of your progress and available modules. You can access different sections such as Settings, Help, and Learning Modules from here. Use the navigation buttons to explore each section. The Dashboard also displays announcements and your current learning status. You can play your tara game from the dashboard which will take you to the leaderboard. "
  },
  {
    title: "Understanding Your Learning Progress",
    content: "Your learning progress is displayed on the Dashboard and within each module. Progress bars indicate how much of the module you have completed. Keep track of your progress to stay motivated and on track with your learning goals. Detailed progress reports are available in the Learning Modules section."
  },
  {
    title: "Tara Game",
    content: "When you click on play now from the dashboard, you are taken to the leaderboard, where you can see your ranking against others in the class. There you can click on play now to go to the game. If you have not yet picked a name for your character you will be asked to put in a name for your character. You can then upgrade the stats of your character and battle other players or computer generated characters." 
  },
  {
    title: "Game Battle",
    content: "When you do a battle, it will automatically playout and if you win you will earn 2 stat points which you can use to upgrade your character. As you level up you might have a surprise waiting for you. (Hint: Evolution!!)" 
  },
  {
    title: "Accessing Your Learning Units",
    content: "Your Learning Units are listed on the Dashboard. Click on a unit to view its lessons and exercises. You can track your progress and start or revisit any lesson or exercise from this section."
  },
  {
    title: "Completing Exercises",
    content: "Exercises are part of the learning modules and can be accessed after completing the lessons. Each exercise has a maximum score you can achieve. Your performance is tracked, and you can reattempt exercises to improve your score. You will see your attempts and best score and coins earned for each exercise"
  },
  {
    title: "I complete an exercise but when I reattempt, I do not get more coins",
    content: "You will only get coins for the first time you complete an exercise. If you reattempt an exercise, you will not get more coins. You can however improve your score and see your attempts and best score. Then you can ask your teacher to score for you, and if the teacher scores your exercise to be high score, you will get more points."
  },
  {
    title: "Recommendations",
    content: "On the dashboard, you will see a list of recommended lessons and exercises. These recommendations are based on your learning progress and performance. You can choose to follow the recommendations or explore other modules and units as per your learning needs. If you complete a recommended lesson or exercise, you will earn extra coins."
  },
  {
    title: "I see a different exercise from my friend",
    content: "For some exercises, you might see a different exercise from your classmates or teacher based on your learning preference. For example if you like science and technology, you will see an exercise which has content realted to science and technology."
  }
];

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredTopics = helpTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center mb-4">
        <Link href="/dashboard">
          <a className="flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-2" size={20} />
            Back to Dashboard
          </a>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-center mb-8">Student Portal Help Center</h1>
      
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for help..."
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      <Accordion type="single" collapsible className="w-full">
        {filteredTopics.map((topic, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>{topic.title}</AccordionTrigger>
            <AccordionContent>
              {topic.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {filteredTopics.length === 0 && (
        <p className="text-center text-gray-500">No results found. Please try a different search term.</p>
      )}

      <div className="bg-gray-100 p-4 rounded-lg mt-8">
        <h2 className="text-xl font-semibold mb-2">Need More Help?</h2>
        <p className="mb-4">If you couldn't find the information you need, our support team is here to help!</p>
        <p> Email: khush.agar@kmutt.ac.th, LineId: khush2003</p>
        {/* <Button className="w-full sm:w-auto">
          <Mail className="mr-2 h-4 w-4" /> Contact Support
        </Button> */}
      </div>
    </div>
  );
};

export default HelpPage;
