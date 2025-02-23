import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const prescriptions = [
  {
    id: 1,
    name: "Amoxicillin",
    dosage: "500mg, 3 times a day",
    doctor: "Dr. John Doe",
    pharmacist: "Jane Smith, RPh",
    startDate: "2025-02-10",
    endDate: "2025-02-24",
    status: "Active",
    notes: "Take after meals. Avoid alcohol.",
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "1000mg, twice a day",
    doctor: "Dr. Sarah Lee",
    pharmacist: "Mark Benson, RPh",
    startDate: "2025-01-15",
    endDate: "2025-04-15",
    status: "Active",
    notes: "Monitor blood sugar levels regularly.",
  },
];

export default function PatientPrescriptions() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Your Prescriptions</h1>
      {prescriptions.map((prescription) => (
        <Card key={prescription.id} className="rounded-xl">
          <CardHeader
            className="flex justify-between items-center cursor-pointer p-4"
            onClick={() => toggleExpand(prescription.id)}
          >
            <div>
              <CardTitle>{prescription.name}</CardTitle>
              <Badge
                variant={
                  prescription.status === "Active" ? "success" : "secondary"
                }
                className="mt-1"
              >
                {prescription.status}
              </Badge>
            </div>
            {expandedId === prescription.id ? <ChevronUp /> : <ChevronDown />}
          </CardHeader>
          {expandedId === prescription.id && (
            <CardContent className="p-4 space-y-2 border-t">
              <p>
                <strong>Dosage:</strong> {prescription.dosage}
              </p>
              <p>
                <strong>Prescribing Doctor:</strong> {prescription.doctor}
              </p>
              <p>
                <strong>Assigned Pharmacist:</strong> {prescription.pharmacist}
              </p>
              <p>
                <strong>Start Date:</strong> {prescription.startDate}
              </p>
              <p>
                <strong>End Date:</strong> {prescription.endDate}
              </p>
              <p className="text-red-600">
                <strong>Notes:</strong> {prescription.notes}
              </p>
              <div className="flex gap-4 mt-4">
                <Button variant="outline">Mark as Taken</Button>
                <Button variant="destructive">Report Issue</Button>
                <Button>Request Refill</Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
