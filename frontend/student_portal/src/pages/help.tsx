import { useState, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Mail, ChevronLeft, Link } from 'lucide-react';


interface HelpTopic {
  title: string;
  content: string;
}

const helpTopics: HelpTopic[] = [
  {
    title: "How to Update Your Profile",
    content: "To update your profile, navigate to the Settings page and click on 'Profile'. Here you can change your avatar, update your personal information, and save the changes by clicking the 'Save Your Profile Changes' button."
  },
  {
    title: "How to Use the Learning Modules",
    content: "The learning modules can be accessed from the Dashboard. Click on the module you want to start, and follow the instructions provided. Each module contains lessons and exercises to help you learn effectively. You can track your progress and revisit lessons or exercises as needed."
  },
  {
    title: "How to Contact Support",
    content: "If you need further assistance, you can contact our support team by clicking the 'Contact Support' button on the Help page. Fill out the form with your query, and our team will get back to you as soon as possible. You can also reach us via email or phone for urgent issues."
  },
  {
    title: "Navigating the Dashboard",
    content: "The Dashboard provides an overview of your progress and available modules. You can access different sections such as Settings, Help, and Learning Modules from here. Use the navigation buttons to explore each section. The Dashboard also displays announcements and your current learning status."
  },
  {
    title: "Understanding Your Learning Progress",
    content: "Your learning progress is displayed on the Dashboard and within each module. Progress bars indicate how much of the module you have completed. Keep track of your progress to stay motivated and on track with your learning goals. Detailed progress reports are available in the Learning Modules section."
  },
  {
    title: "Using the Game Zone",
    content: "The Game Zone is accessible from the Dashboard. Click on 'Play Now!' to start playing educational games that help reinforce your learning. Your coins and playtime are displayed in the Game Zone section. Make sure to complete your lessons to earn more playtime."
  },
  {
    title: "Viewing Announcements",
    content: "Announcements from your classroom or the platform are displayed on the Dashboard under 'Tara News'. Check this section regularly to stay updated with the latest news and important information."
  },
  {
    title: "Accessing Your Learning Units",
    content: "Your Learning Units are listed on the Dashboard. Click on a unit to view its lessons and exercises. You can track your progress and start or revisit any lesson or exercise from this section."
  },
  {
    title: "Completing Exercises",
    content: "Exercises are part of the learning modules and can be accessed after completing the lessons. Each exercise has a maximum score you can achieve. Your performance is tracked, and you can reattempt exercises to improve your score."
  },
  {
    title: "Using the Sidebar in Learning Home",
    content: "The sidebar in the Learning Home page provides quick access to various sections such as Game Zone, Lessons, and Exercises. You can toggle the sidebar visibility using the button at the top. The sidebar also displays your profile information and allows you to navigate to the settings page."
  },
  {
    title: "Handling Errors in Learning Home",
    content: "If you encounter errors while fetching module or user data in the Learning Home page, you will see an error message with a button to navigate back to the Dashboard. Ensure you have a stable internet connection and try reloading the page."
  },
  {
    title: "Completing Lessons in Lesson Container",
    content: "The Lesson Container component is used to display lessons and exercises. After completing a lesson or exercise, click the 'Complete' button to mark it as complete. If it's an exercise, you may need to submit your answers for scoring. You can navigate to the next module or return to the Dashboard after completion."
  },
  {
    title: "Navigating Between Lessons and Exercises",
    content: "In the Lesson Container, you can navigate between lessons and exercises using the 'Next' button. If you have completed the current module, the 'Next' button will take you to the next module. If it's the last module, you will be redirected to the Dashboard."
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
