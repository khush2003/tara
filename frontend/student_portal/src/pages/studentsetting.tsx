import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  // State to manage profile fields
  const [firstName, setFirstName] = useState<string>('John');
  const [lastName, setLastName] = useState<string>('Doe');
  const [email, setEmail] = useState<string>('johndoe@example.com');
  const [password, setPassword] = useState<string>(''); // Password can be initially empty
  const [message, setMessage] = useState<string>(''); // Message for user feedback
  const [error, setError] = useState<string>(''); // Error message for validation

  const navigate = useNavigate(); // Hook for navigation

  // Handle form submission
  const handleSave = () => {
    // Validation: Check if any fields are empty
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill out all fields before submitting.');
      return;
    }

    // If all fields are filled, clear the error and show success message
    setError('');
    setMessage('Profile updated successfully!');

    // Redirect to the Dashboard after 1 second
    setTimeout(() => {
      navigate('/dashboard'); // Redirect to the Dashboard
    }, 1000); // Adding a small delay for user to see the success message
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Card className="shadow-2xl p-7 rounded-3xl bg-white lg:flex lg:w-full lg:max-w-none lg:px-0 lg:grid lg:grid-cols-2">
        {/* Left Side: Branding */}
        <div className="relative hidden h-full lg:flex items-center justify-center bg-muted text-white dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-bl from-purple-950 via-purple-900 to-blue-900" />
          <div className="relative z-20 flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-20 w-20 mb-4"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <h1 className="text-7xl font-medium">TARA</h1>
          </div>
        </div>

        {/* Right Side: Settings Form */}
        <div className="flex flex-col items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2 text-left">
              <h1 className="text-5xl font-semibold tracking-tight">
                Edit Profile
              </h1>
            </div>

            {/* First Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
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

            {/* Error Message */}
            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}

            {/* Save Button */}
            <Button className="w-full py-3 mt-4 bg-blue-500 text-white rounded-lg" onClick={handleSave}>
              Save Changes
            </Button>

            {/* Success Message */}
            {message && (
              <p className="mt-4 text-green-600 text-center">{message}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
