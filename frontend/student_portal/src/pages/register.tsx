import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import tara from "../assets/tara.png";
import { Icons } from "@/components/icons";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const register = useAuthStore((state) => state.register);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [school, setSchool] = useState("");
    const [retype, setRetype] = useState("");
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
            navigate("/learningCode");
        } catch (error) {
            setIsError(true);
            setIsLoading(false);
            console.error("Register failed", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-gradient-to-b from-purple-700 to-blue-600 flex items-center justify-center p-8">
                <div className="text-center">
                    <img src={tara} alt="Logo" className="h-30" />
                    <p className="text-2xl text-purple-200">
                        Learn, Play, Grow!
                    </p>
                </div>
            </div>
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            Join the Fun!
                        </h2>
                        <p className="text-xl text-gray-600">
                            Create your tara profile
                        </p>
                    </div>
                    {/* <div className="p-1"></div> */}
                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <Label
                                htmlFor="name"
                                className="text-lg font-medium text-gray-700"
                            >
                                Choose Your Explorer Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="BraveExplorer123"
                                className="mt-1 text-lg p-3 rounded-xl"
                                required
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="school"
                                className="text-lg font-medium text-gray-700"
                            >
                                Enter your school name
                            </Label>
                            <Input
                                id="school"
                                type="text"
                                placeholder="My School"
                                className="mt-1 text-lg p-3 rounded-xl"
                                required
                                onChange={(e) => setSchool(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="email"
                                className="text-lg font-medium text-gray-700"
                            >
                                Your Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="mt-1 text-lg p-3 rounded-xl"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="password"
                                className="text-lg font-medium text-gray-700"
                            >
                                Create Your Secret Code
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Make it strong and memorable!"
                                className="mt-1 text-lg p-3 rounded-xl"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="retype"
                                className="text-lg font-medium text-gray-700"
                            >
                                Type Your Secret Code Again
                            </Label>
                            <Input
                                id="retype"
                                type="password"
                                placeholder="What is your secret code?"
                                className="mt-1 text-lg p-3 rounded-xl"
                                required
                                onChange={(e) => setRetype(e.target.value)}
                            />
                        </div>
                        {isError && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                        <Button
                            type="submit"
                            className="w-full text-xl py-6 rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors"
                        >
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Start Your Learning Adventure!
                        </Button>
                    </form>
                    <div className="flex flex-col gap-3">
                        <div className="relative mt-5   ">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>

                            <div className="relative flex justify-center text-md uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Already an explorer?
                                </span>
                            </div>
                        </div>
                        <div className="text-center">
                            <Button
                                variant="link"
                                className="text-lg text-purple-600 hover:text-purple-700"
                                onClick={() => navigate("/login")}
                            >
                                Return to Your Journey!
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
