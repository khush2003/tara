import React, { useState } from 'react';

const StudentGuide: React.FC = () => {
  const [question, setQuestion] = useState<string>('');  // State for the question
  const [answer, setAnswer] = useState<string>('');  // State for the answer

  // Handle answering the question
  const handleAskQuestion = () => {
    if (question.trim() === '') {
      setAnswer('Please ask a question.');
    } else {
      // Simulate the response to the question
      setAnswer(`Answer to your question: "${question}" is not available right now. We'll get back to you!`);
    }
  };

  return (
    <div>
      <h2>Help & Guidance</h2>
      <textarea
        placeholder="Ask a question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={3}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={handleAskQuestion}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Ask Question
      </button>

      {/* Display the answer */}
      {answer && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default StudentGuide;
