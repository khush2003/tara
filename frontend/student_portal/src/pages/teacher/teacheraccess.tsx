import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacheraccessPage: React.FC = () => {
  const [code, setCode] = useState<string>('');  // Manage the input code
  const [errorMessage, setErrorMessage] = useState<string>('');  // Manage the error message
  const navigate = useNavigate();  // React Router navigation hook

  // Hardcoded correct access code for demonstration
  const correctCode = '12345';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the code is empty
    if (code.trim() === '') {
      setErrorMessage('Please enter an access code.');
      return;
    }

    // Validate the entered code
    if (code === correctCode) {
      navigate('/teacherdashboard');  // Navigate to the management page if the code is correct
    } else {
      setErrorMessage('Invalid access code. Please try again.');  // Show error message if code is incorrect
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Teacher Access</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter access code"
          value={code}
          onChange={(e) => setCode(e.target.value)}  // Update the state when the user types
          style={{
            padding: '10px',
            fontSize: '16px',
            marginBottom: '10px',
            width: '200px',
          }}
        />
        <br />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Access Management
        </button>
      </form>
      {errorMessage && (
        <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>  // Display error message if necessary
      )}
    </div>
  );
};

export default TeacheraccessPage;
