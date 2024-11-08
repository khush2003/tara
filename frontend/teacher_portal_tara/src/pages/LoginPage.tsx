import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import useAuthStore from "@/stores/authStore";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/dashboard");
        }
    }, [isLoggedIn, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const error = await login(email, password);
            if (error) {
                setError(error);
                setIsError(true);
                setIsLoading(false);
                return;
            }
            navigate("/dashboard");
        } catch (error) {
            setIsError(true);

            setIsLoading(false);
            console.error("Login failed", error);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500">
                <div className="m-auto text-white p-8">
                    <h2 className="text-5xl font-bold mb-6">Welcome Back</h2>
                    <p className="text-xl">Access your account to continue your journey in empowering education.</p>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">Enter your details to access your teacher dashboard</p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <Input id="email" name="email" type="email" autoComplete="email" onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" autoComplete="current-password" onChange={
                                (e) => setPassword(e.target.value) 
                            } required className="mt-1" />
                        </div>
                        <div>
                            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign in
                            </Button>
                        </div>
                    </form>
                    {isError && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                    <div className="text-center">
                        <p className="mt-2 text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
