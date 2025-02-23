import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // const { isSignedIn } = useUser();
  // const navigate = useNavigate();

  // const userRole = useUser()?.user?.unsafeMetadata?.role;

  // useEffect(() => {
  //   if (!isSignedIn) {
  //     navigate("/");
  //   } else if (!userRole) {
  //     navigate("/onboarding");
  //   }
  // }, [isSignedIn, navigate]);

  // if (!isSignedIn) {
  //   return <Navigate to="/" />;
  // }

  return children;
}
