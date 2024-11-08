import { useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, LogOut, Plus, Settings} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/authStore";
import { Button } from "./ui/button";
import { useUser } from "@/hooks/useUser";
// import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface ContentContainerProps {
    children?: React.ReactNode | React.ReactNode[];
}

const ContentContainer: React.FC<ContentContainerProps> = ({ children }) => {
    // const [activeItem, setActiveItem] = useState("Dashboard");
    const accessToken = useAuthStore((state) => state.accessToken);
    const {
        data: user,
        error: userError,
        isLoading: userLoading,
    } = useUser();

    // const [showLogOut, setShowLogout] = useState(false);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken) {
            navigate("/login");
        }
    }, [accessToken, navigate]);

    if (userLoading) {
        return <div>Loading...</div>;
    }

    if (userError) {
        return <div>{userError && "User Error: " + userError} </div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            {/* <aside className="w-64 bg-white border-r border-gray-200 p-6">
                <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                        <motion.a
                            key={item.label}
                            href={item.href}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center space-x-3 px-4 py-2 rounded-full ${
                                activeItem === item.label ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveItem(item.label)}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </motion.a>
                    ))}
                </nav>
            </aside> */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white border-b border-gray-200">
                    <div className=" mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex flex-row gap-3">
                            <motion.a
                                onClick={() => navigate("/")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center space-x-3 px-2 py-2 rounded-full ${"bg-gray-900 text-white"}`}
                            >
                                <Home className="w-5 h-5" />
                            </motion.a>
                            <div className="flex items-center">
                                {/* <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src="/placeholder-avatar.jpg" alt="" />
                                <AvatarFallback>ME</AvatarFallback>
                            </Avatar> */}
                                <div>
                                    <h2 className="font-semibold">{user?.name}</h2>
                                    <p className="text-sm text-gray-500">School: {user?.school}</p>
                                </div>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Tara Teacher Portal</h1>
                        <div className="flex items-center space-x-4">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center space-x-3 px-4 py-2 rounded-full ${"bg-gray-900 text-white"}`}
                                href="/createClass"
                            >
                                <Plus className="w-5 h-5" />
                                <span>{"Create New Class"}</span>
                            </motion.a>
                            <Button className="rounded-lg bg-red-700" onClick={
                                () => {
                                    logout();
                                } 
                            }>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </Button>
                                <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} className="rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            <Settings className="w-5 h-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                        </div>
                    </div>
                </header>

                {children}
            </div>
        </div>
    );
};

export default ContentContainer;
