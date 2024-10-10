import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon } from "lucide-react";
import useAuthStore from "@/stores/authStore";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const register = useAuthStore((state) => state.register);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [retype, setRetype] = useState("");
    const [school, setSchool] = useState("");
    const [error, setError] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/dashboard");
        }
    }, [isLoggedIn, navigate]);

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
        if (password !== retype) {
            setError("Passwords do not match");
            setIsError(true);
            return;
        }
        setIsLoading(true);
        try {
            const error = await register(name, email, password, school);
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
            console.error("Register failed", error);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500">
                <div className="m-auto text-white p-8">
                    <h2 className="text-5xl font-bold mb-6">Join Our Community</h2>
                    <p className="text-xl">Create an account to access powerful tools and resources for educators.</p>
                </div>
            </div>

            {/* Right side - Registration form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">Sign up to start your journey as an educator on our platform</p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                        <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" type="text" onChange={(e) => setName(e.target.value)} required className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                onChange={(e) => setRetype(e.target.value)}
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="institution">School/Institution Name</Label>
                            <Input
                                id="institution"
                                name="institution"
                                onChange={(e) => setSchool(e.target.value)}
                                type="text"
                                required
                                className="mt-1"
                            />
                        </div>
                        {isError && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
                                {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                        </div>
                    </form>
                    <div className="text-center">
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
