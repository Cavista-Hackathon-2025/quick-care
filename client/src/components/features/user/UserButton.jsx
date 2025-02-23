import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  UserButton as ClerkUserButton,
  SignIn,
} from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";

export default function UserButton() {
  const [searchParams, setSearchParams] = useSearchParams();

  const showSignIn = searchParams.get("sign_in"); // Get the value of 'sign_in'

  const handleNavigateToSignIn = () => {
    setSearchParams({ sign_in: "true" });
  };
  function handleCloseSignInModal(e) {
    // Close the modal

    if (e.target === e.currentTarget) setSearchParams({});
  }
  return (
    <header>
      <SignedOut>
        <Button onClick={handleNavigateToSignIn}>Login</Button>
      </SignedOut>
      <SignedIn>
        <ClerkUserButton />
      </SignedIn>

      {showSignIn && (
        <div
          onClick={handleCloseSignInModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <SignIn
            // signUpForceRedirectUrl="/pharmacist/dashboard"
            // fallbackRedirectUrl="/pharmacist/dashboard"
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </header>
  );
}
