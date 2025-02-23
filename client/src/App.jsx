import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import DashboardLayout from "./layouts/DashboardLayout";
import AppLayout from "./layouts/AppLayout";
import { ThemeProvider } from "./components/theme/theme-provider";
import PharmacistDashboard from "@/pages/pharmacist/PharmacistDashboard";
import { Toaster } from "react-hot-toast";
import NewPrescription from "@/pages/pharmacist/NewPrescription";
import ProtectedRoute from "@/components/features/user/ProtectedRoute";
import RecentPrescriptions from "@/pages/pharmacist/RecentPrescriptions";
// import Onboarding from "@/pages/Onboarding";
// import PatientDashboard from "./pages/patient/PatientDashboard";
// import PatientPrescriptions from "@/pages/patient/PatientPrescriptions";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      // {
      //   path: "/onboarding",
      //   element: (
      //     <ProtectedRoute>
      //       <Onboarding />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: "/pharmacist/new-prescription",
        element: (
          <ProtectedRoute>
            <NewPrescription />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pharmacist/dashboard",
        element: (
          <ProtectedRoute>
            <PharmacistDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pharmacist/recent-prescriptions",
        element: (
          <ProtectedRoute>
            <RecentPrescriptions />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "/patient/dashboard",
      //   element: (
      //     <ProtectedRoute>
      //       <PatientDashboard />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/patient/prescriptions",
      //   element: (
      //     <ProtectedRoute>
      //       <PatientPrescriptions />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/admin/dashboard",
      //   element: (
      //     <ProtectedRoute>
      //       <AdminDashboard />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [],
      },
    ],
  },
]);

export default function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px",
            borderRadius: "8px",
          },
          success: {
            style: { background: "#4CAF50", color: "#fff" }, // Green
            iconTheme: { primary: "#fff", secondary: "#4CAF50" },
          },
          error: {
            style: { background: "#F44336", color: "#fff" }, // Red
            iconTheme: { primary: "#fff", secondary: "#F44336" },
          },
          warning: {
            style: { background: "#FFC107", color: "#fff" }, // Yellow
            iconTheme: { primary: "#fff", secondary: "#FFC107" },
          },
          info: {
            style: { background: "#2196F3", color: "#fff" }, // Blue
            iconTheme: { primary: "#fff", secondary: "#2196F3" },
          },
        }}
      />
    </div>
  );
}
