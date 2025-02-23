import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container-custom">
      <section className="text-center space-y-4 hero">
        <h1 className="headline">Revolutionizing Healthcare</h1>
        <p className="opacity-60 md:text-xl">
          Virtual Check-Ins, Smart Prescriptions, and Health Monitoring in One
          Place.
        </p>

        <Link to="/pharmacist/dashboard">
          <Button className="!mt-12 " size="xl">
            Get Started
          </Button>
        </Link>
      </section>
      <section className="space-y-4">
        <h2 className="text-center">How it works</h2>

        <div className="grid gap-6 container-small mx-auto">
          {/* <Card className="space-y-2">
            <CardHeader>
              <CardTitle>As a Patient</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-4">
                <li className="flex gap-5 items-center">
                  <CheckCircle className="text-brandPrimary" /> View dosages
                </li>
                <li className="flex gap-5 items-center">
                  <CheckCircle className="text-brandPrimary" /> Get reminders
                </li>
                <li className="flex gap-5 items-center">
                  <CheckCircle className="text-brandPrimary" /> Track your
                  health
                </li>
              </ul>
            </CardContent>
          </Card> */}
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>As a Pharmacist, you can now:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside flex gap-14 gap-y-6 flex-wrap">
                <li className="flex gap-5 items-center">
                  <CheckCircle className="text-brandPrimary" /> Assign Dosages
                  to patients
                </li>
                <li className="flex gap-5 items-center">
                  <CheckCircle className="text-brandPrimary" /> Send Dosage
                  Instructions to patients
                </li>
                <li className="flex gap-5 items-center">
                  <CheckCircle className="text-brandPrimary" /> Monitor Patient
                  Adherence
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
