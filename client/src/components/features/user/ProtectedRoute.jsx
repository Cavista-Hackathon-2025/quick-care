import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded)
    return <BarLoader className="text-brandPrimary" width={"100%"} />;

  if (isLoaded && !isSignedIn && isSignedIn !== undefined)
    return <Navigate to="/?sign_in=true" />;

  return children;
}

export default ProtectedRoute;
