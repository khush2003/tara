import { useState, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Mail, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HelpTopic {
  title: string;
  content: string;
}

const helpTopics: HelpTopic[] = [
  {
    title: "Accessing Your Courses",
    content: "To access your courses, log in to the student portal and click on the 'My Courses' tab. You'll see a list of all your enrolled courses. Click on any course to view its content, assignments, and resources."
  },
  {
    title: "Submitting Assignments",
    content: "To submit an assignment, go to the specific course page and find the 'Assignments' section. Click on the assignment you want to submit, upload your file or type your response, and click 'Submit'. Make sure to submit before the deadline!"
  },
  {
    title: "Checking Grades",
    content: "You can check your grades by clicking on the 'Grades' tab in the main navigation menu. This will show you an overview of your grades for all courses. To see detailed feedback, click on the specific grade or assignment."
  },
  {
    title: "Communicating with Instructors",
    content: "To communicate with your instructors, use the 'Messages' feature in the portal. You can also post questions in the course discussion forums or use the email provided in the course syllabus."
  },
  {
    title: "Technical Support",
    content: "If you're experiencing technical issues, first try clearing your browser cache and cookies. If the problem persists, contact our IT support team at support@studentportal.edu or use the 'Report an Issue' button in the portal."
  }
];

export default function Component() {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtering the help topics based on the search input
  const filteredTopics = helpTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle the search input change event
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center mb-4">
        {/* "Return" button styled as a button-like link */}
        <Link
          to="/dashboard"
          className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ChevronLeft className="mr-2" size={20} />
          <span>Return to Dashboard</span>
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
        <Button className="w-full sm:w-auto">
          <Mail className="mr-2 h-4 w-4" /> Contact Support
        </Button>
      </div>
    </div>
  );
}
