import { Link } from "react-router-dom";
import { ModeToggle } from "../theme/mode-toggle";
import UserButton from "@/components/features/user/UserButton";
import DashboardSideNav from "@/components/ui/DashboardSideNav";
import { useAuth } from "@clerk/clerk-react";
export default function Navbar() {
  const user = useAuth();

  const isSignedIn = user?.isSignedIn;

  return (
    <div className="w-full py-4 shadow-sm dark:border-b dark:border-gray-800">
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {isSignedIn && <DashboardSideNav />}
          <Link to="/" className="font-bold text-2xl">
            Better<span className="text-brandPrimary">Care</span>{" "}
          </Link>
        </div>
        <nav className="flex items-center gap-x-8"> 
          <div className="flex items-center gap-x-4">
            <ModeToggle />
            <UserButton />
          </div>
        </nav>
      </div>
    </div>
  );
}
