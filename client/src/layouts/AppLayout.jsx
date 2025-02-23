import { Outlet } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function AppLayout() {
  return (
    <div>
      <div className="background-grid"></div>
      <main className="h-screen mx-auto flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto w-full">
          <div className="py-10 flex-1">
            <div className="container-custom">
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
