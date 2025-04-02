import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import all builders and viewers
import MCQBuilder from './mcqBuilder'
import MCQViewer from './mcqViewer'
import TextWithInputBuilder from './twiBuilder' 
import TextWithInputViewer from './twiViewer'
import TextWithQuestionsBuilder from './twqBuilder'
import TextWithQuestionsViewer from './twqViewer'
import ImagesWithInputBuilder from './iwiBuilder'
import ImagesWithInputViewer from './iwiViewer'
import FillInTheBlanksBuilder from './fibBuilder'
import FillInTheBlanksViewer from './fibViewer'
import DragAndDropBuilder from './dndBuilder'
import DragAndDropViewer from './dndViewer'
import CrosswordPuzzleBuilder from './crosswordBuilder'
import CrosswordPuzzleViewer from './crosswordExerciseViewer'
import LessonBuilder from './lessonBuilder'
import LessonViewer from './lessonDisplay'
import ContentContainer from "@/components/ContentContainerRaw"
import { useExerciseStore } from '@/store/exerciseStore';

export default function BuilderDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const {reset} = useExerciseStore();

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
    reset();
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Content Builder Dashboard</CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="mcq" className="w-full">
        <TabsList className="grid grid-cols-4 gap-4 mb-20">
          <TabsTrigger value="mcq">Multiple Choice</TabsTrigger>
          <TabsTrigger value="twi">Text with Input</TabsTrigger>
          <TabsTrigger value="twq">Text with Questions</TabsTrigger>
          <TabsTrigger value="iwi">Images with Input</TabsTrigger>
          <TabsTrigger value="fib">Fill in Blanks</TabsTrigger>
          <TabsTrigger value="dnd">Drag and Drop</TabsTrigger>
          <TabsTrigger value="crossword">Crossword</TabsTrigger>
          <TabsTrigger value="lesson">Lesson</TabsTrigger>
        </TabsList>

        {/* MCQ */}
        <TabsContent value="mcq">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
          <CardTitle>Builder</CardTitle>
              </CardHeader>
              <CardContent>
          <MCQBuilder />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
          <CardTitle>Preview</CardTitle>
          <button onClick={handleRefresh}>Refresh</button>
              </CardHeader>
              <CardContent>
          <ContentContainer key={refreshKey}><MCQViewer /></ContentContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Text with Input */}
        <TabsContent value="twi">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
          <CardTitle>Builder</CardTitle>
              </CardHeader>
              <CardContent>
          <TextWithInputBuilder />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
          <CardTitle>Preview</CardTitle>
          <button onClick={handleRefresh}>Refresh</button>
              </CardHeader>
              <CardContent>
          <ContentContainer key={refreshKey}><TextWithInputViewer /></ContentContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Text with Questions */}
        <TabsContent value="twq">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
          <CardTitle>Builder</CardTitle>
              </CardHeader>
              <CardContent>
          <TextWithQuestionsBuilder />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
          <CardTitle>Preview</CardTitle>
          <button onClick={handleRefresh}>Refresh</button>
              </CardHeader>
              <CardContent>
          <ContentContainer key={refreshKey}><TextWithQuestionsViewer /></ContentContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
            
        {/* Images with Input */}
        <TabsContent value="iwi">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
          <CardTitle>Builder</CardTitle>
              </CardHeader>
              <CardContent>
          <ImagesWithInputBuilder />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
          <CardTitle>Preview</CardTitle>
          <button onClick={handleRefresh}>Refresh</button>
              </CardHeader>
              <CardContent>
          <ContentContainer key={refreshKey}><ImagesWithInputViewer /></ContentContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
            
        {/* Fill in Blanks */}
        <TabsContent value="fib">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
          <CardTitle>Builder</CardTitle>
              </CardHeader>
              <CardContent>
          <FillInTheBlanksBuilder />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
          <CardTitle>Preview</CardTitle>
          <button onClick={handleRefresh}>Refresh</button>
              </CardHeader>
              <CardContent>
          <ContentContainer key={refreshKey}><FillInTheBlanksViewer /></ContentContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
            
        {/* Drag and Drop */}
        <TabsContent value="dnd">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
          <CardTitle>Builder</CardTitle>
              </CardHeader>
              <CardContent>
          <DragAndDropBuilder />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
          <CardTitle>Preview</CardTitle>
          <button onClick={handleRefresh}>Refresh</button>
              </CardHeader>
              <CardContent>
          <ContentContainer key={refreshKey}><DragAndDropViewer /></ContentContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
            
        {/* Crossword */}
        <TabsContent value="crossword">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
          <CardTitle>Builder</CardTitle>
              </CardHeader>
              <CardContent>
          <CrosswordPuzzleBuilder />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
          <CardTitle>Preview</CardTitle>
          <button onClick={handleRefresh}>Refresh</button>
              </CardHeader>
              <CardContent>
          <ContentContainer key={refreshKey}><CrosswordPuzzleViewer /></ContentContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      
        {/* Lesson */}
        <TabsContent value="lesson">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <LessonBuilder />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <button onClick={handleRefresh}>Refresh</button>
              </CardHeader>
              <CardContent>
                <LessonViewer key={refreshKey} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>   
      </Tabs>
    </div>
  )
}