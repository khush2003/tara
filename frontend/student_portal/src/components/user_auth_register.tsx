import * as React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Icons } from "./icons";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export const UserAuthForm: React.FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setUsername] = React.useState<string>(''); // Add username state
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [retypePassword, setRetypePassword] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !email || !password || !retypePassword) {
      setErrorMessage("All fields are required");
      console.log("Form validation failed: all fields are required.");
      return false;
    }
    if (password !== retypePassword) {
      setErrorMessage("Passwords do not match");
      console.log("Form validation failed: passwords do not match.");
      return false;
    }
    setErrorMessage(null); // Clear error if valid
    return true;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }), // Include username
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful", data);
        navigate("/"); // Redirect on success
      } else {
        console.log("Registration failed with response:", data);
        setErrorMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.log("Network error occurred:", error);
      setErrorMessage("Network error, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {/* Username Input */}
          <div className="grid gap-1">
            <Label htmlFor="username" className="text-sm text-muted-foreground">Username</Label>
            <Input
              id="username"
              placeholder="Username"
              type="text"
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div className="grid gap-1">
            <Label htmlFor="email" className="text-sm text-muted-foreground">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="grid gap-1">
            <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="*********"
              autoComplete="current-password"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Retype Password Input */}
          <div className="grid gap-1">
            <Label htmlFor="retypePassword" className="text-sm text-muted-foreground">Retype Password</Label>
            <Input
              id="retypePassword"
              type="password"
              placeholder="*********"
              disabled={isLoading}
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
            />
          </div>

          {errorMessage && <p className="text-red-600">{errorMessage}</p>}

          <Button variant="secondary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Register"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
