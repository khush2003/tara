import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { useNavigate } from "react-router-dom";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      setErrorMessage("Both fields are required");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store JWT token and username in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);

        // Navigate to the dashboard
        navigate("/dashboard");
      } else {
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error); 
      setErrorMessage("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Label className="text-sm text-muted-foreground" htmlFor="email">
            Email Address
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />

          <Label className="text-sm text-muted-foreground" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            placeholder="*********"
            type="password"
            autoCapitalize="none"
            autoComplete="current-password"
            autoCorrect="off"
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />

          {errorMessage && <p className="text-red-600">{errorMessage}</p>}

          <Button disabled={isLoading} type="submit">
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Don't have an account?
          </span>
        </div>
      </div>

      <Button
        variant="secondary"
        type="button"
        disabled={isLoading}
        onClick={() => navigate("/register")}
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Register
      </Button>
    </div>
  );
}
