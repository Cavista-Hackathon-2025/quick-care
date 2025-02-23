import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useNavigate } from "react-router-dom";

export default function Onboarding() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (user?.unsafeMetadata?.role === "patient")
    return <Navigate to="/patient/dashboard" />;
  if (user?.unsafeMetadata?.role === "pharmacist")
    return <Navigate to="/pharmacist/dashboard" />;

  async function handleSelectUserRole(role) {
    // Update the user's metadata with the selected role
    try {
      await user.update({
        unsafeMetadata: {
          role,
        },
      });
        role === "patient" ? navigate("/patient/dashboard") : navigate("/pharmacist/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="flex-1 h-full pt-20">
      <div className="text-center space-y-8">
        <h1 className="headline">Which of these are you?</h1>
        <div className="flex gap-4 justify-center">
          <Button
            size="xl"
            variant="outline"
            onClick={() => handleSelectUserRole("patient")}
          >
            Patient
          </Button>
          <Button
            size="xl"
            variant="outline"
            onClick={() => handleSelectUserRole("pharmacist")}
          >
            Pharmacist
          </Button>
        </div>
      </div>
    </section>
  );
}
