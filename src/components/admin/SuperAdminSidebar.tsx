import React from "react";
import {
  Users,
  BarChart3,
  Mail,
  TrendingUp,
  Briefcase,
  LogOut,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import AuthStorage from "@/src/lib/requests/auth.new";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

type TabType = "dashboard" | "users" | "jobs" | "newsletter" | "analytics";

interface SuperAdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: TabType) => void;
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "jobs", label: "Job Management", icon: Briefcase },
    { id: "newsletter", label: "Newsletter", icon: Mail },
    { id: "analytics", label: "Analytics & Metrics", icon: TrendingUp },
  ];

  const router = useRouter();

  const handleUserLogout = () => {
    toast.success("Logging out...");
    AuthStorage.clearAuth();

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <aside className="w-64 bg-[#0A1754] min-h-screen text-white font-urbanist max-lg:hidden flex flex-col">
      <div className="p-4 border-b border-blue-800">
        <div className="flex items-center justify-center">
          <div className="">
            <Image
              src="/assets/white-logo.png"
              alt="viewer profile"
              width={80}
              height={80}
            />
          </div>
          <h1 className="ml-3 text-xl font-bold text-white">Super Admin</h1>
        </div>
      </div>

      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center space-x-3 py-3 px-3 rounded-lg transition-colors cursor-pointer ${
                activeTab === item.id
                  ? "bg-blue-800 text-white"
                  : "text-white hover:bg-blue-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-bold text-lg">{item.label}</span>
            </button>
          </div>
        ))}
      </nav>

      {/* Admin Profile */}
      <div className="p-4 border-t border-blue-800">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">SA</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">Super Admin</p>
              <p className="text-xs text-blue-200">portgigacademy@gmail.com</p>
            </div>
          </div>

          <button
            onClick={handleUserLogout}
            className="flex items-center space-x-2 text-blue-200 hover:text-white p-2 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
            aria-label="Log out"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;