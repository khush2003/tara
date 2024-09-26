import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not logged in. Please log in again.');
      return;
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not logged in. Please log in again.');
        return;
      }
    
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch user data: ${response.status} ${errorText}`);
        }
    
        const data = await response.json();
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        // Use a type guard to check if 'error' is an instance of Error
        if (error instanceof Error) {
          console.error('Error fetching user data:', error);
          setError('Could not fetch user data: ' + error.message);
        } else {
          console.error('Unknown error:', error);
          setError('Could not fetch user data: An unknown error occurred.');
        }
      }
    };
    


    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!username || !email || (password.length === 0)) {
      setError('Please fill out all fields before submitting.');
      return;
    }

    setError('');
    setMessage('Updating profile...');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setMessage('Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Card className="shadow-2xl p-7 rounded-3xl bg-white lg:flex lg:w-full lg:max-w-none lg:px-0 lg:grid lg:grid-cols-2">
        <div className="relative hidden h-full lg:flex items-center justify-center bg-muted text-white dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-bl from-purple-950 via-purple-900 to-blue-900" />
          <div className="relative z-20 flex flex-col items-center justify-center">
            <h1 className="text-7xl font-medium">TARA</h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md space-y-6">
            <h1 className="text-5xl font-semibold tracking-tight">Edit Your Profile</h1>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}

            <Button className="w-full py-3 mt-4 bg-blue-500 text-white rounded-lg" onClick={handleSave}>
              Save Changes
            </Button>

            {message && (
              <p className="mt-4 text-green-600 text-center">{message}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
