import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useUser } from "@clerk/clerk-react";
import { Clock, Home, Menu, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const pharmacistNavLinks = [
  {
    label: "Home",
    path: "/pharmacist/dashboard",
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: "New Prescription",
    path: "/pharmacist/new-prescription",
    icon: <Plus className="w-5 h-5" />,
  },
  // {
  //   label: "Medication Lookup",
  //   path: "/pharmacist/medication-lookup",
  //   icon: <Search className="w-5 h-5" />,
  // },
  {
    label: "Recent Prescriptions",
    path: "/pharmacist/recent-prescriptions",
    icon: <Clock className="w-5 h-5" />,
  },
];
const patientNavLinks = [
  {
    label: "Home",
    path: "/patient/dashboard",
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: "Prescriptions",
    path: "/patient/prescriptions",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    label: "All Pharmacists",
    path: "/patient/all-pharmacists",
    icon: <Plus className="w-5 h-5" />,
  },
];

export default function DashboardSideNav() {
  const pathname = useLocation().pathname;
  const sideNavRef = useOutsideClick(() => setIsSideNavOpen(false));

  const user = useUser();
  const userType = user?.user?.unsafeMetadata?.role;

  // if (pathname.includes("patient") || pathname.includes("pharmacist")) return null;

  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  useEffect(() => {
    setIsSideNavOpen(false);
  }, [pathname]);

  const handleNavigateToSideNav = () => {
    setIsSideNavOpen((prev) => !prev);
  };

  return (
    <>
      {/* Side Nav */}
      <div
        className={`w-64 shadow-lg bg-white dark:bg-background dark:border-r-2 dark:border-gray-800 fixed top-0 left-0 h-full  flex flex-col z-[999] ${
          isSideNavOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
        ref={sideNavRef}
      >
        <div className="flex justify-between items-center p-4 pt-5 pb-0">
          <Link to="/" className="font-bold text-2xl ">
            Better<span className="text-brandPrimary">Care</span>{" "}
          </Link>
          <button onClick={() => setIsSideNavOpen(false)}>
            <X className="w-7 h-7" />
          </button>
        </div>
        <nav className="flex flex-1 justify-center flex-col divide-y divide-gray-200 dark:divide-gray-800">
          {userType === "pharmacist" &&
            pharmacistNavLinks.map((link) => (
              <Link
                key={link.path}
                className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium flex items-center gap-4 ${
                  pathname === link.path &&
                  "text-brandPrimary dark:text-brandPrimaryLight"
                }`}
                to={link.path}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          {userType === "patient" &&
            patientNavLinks.map((link) => (
              <Link
                key={link.path}
                className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium flex items-center gap-4 ${
                  pathname === link.path &&
                  "text-brandPrimary dark:text-brandPrimaryLight"
                }`}
                to={link.path}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
        </nav>
      </div>

      {/* Side Nav Toggle Button */}
      {pathname.includes("pharmacist") && (
        <button onClick={handleNavigateToSideNav}>
          <Menu className="w-7 h-7" />
        </button>
      )}
    </>
  );
}
