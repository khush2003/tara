import { useState } from 'react';

export const UserAuthForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    // Log the form data
    console.log('Form Data:', {
      username,
      email,
      password,
    });

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      // Log the raw response before parsing
      console.log('Raw Response:', response);

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        // Handle successful registration (e.g., redirect or show a success message)
        console.log('User registered successfully!');
      } else {
        // Handle error (e.g., show error message)
        console.error('Registration error:', data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};
