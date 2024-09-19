import { Card } from "@/components/ui/card";
import { UserAuthForm } from "@/components/user_auth_login";
import tara from '../assets/tara.png';


export default function LoginPage() {
    return (
       
        <div
            id="page"
            className="flex items-center justify-center h-screen rounded-sm w-screen"
        >
             
            <Card className="shadow-2xl p-7 rounded-3xl bg-white">
                <div
                    id="page"
                    className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
                >
                    <div className="relative hidden h-full flex-row justify-center items-center bg-muted p-10 text-white dark:border-r lg:flex">
                        <div className="absolute inset-0 bg-gradient-to-bl from-purple-950 via-purple-900 to-blue-900" />
                        <div className="relative z-20 flex items-center justify-center text-7xl font-medium">
                            <div className="flex items-center justify-center pt-"></div>
                            <img src={tara} alt="Logo" className="h-14" />
                        </div>
                    </div>
                    <div className="lg:p-8">
                        <div className="mx-auto flex w-full flex-col justify-start space-y-1 sm:w-[600px] p-28">
                            <div className="flex flex-col space-y-2 text-left  ">
                                <h1 className="text-5xl font-semibold tracking-tight">
                                    Sign In
                                </h1>
                            </div>
                            <div className="pt-10"></div>
                            <UserAuthForm />
                            
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
