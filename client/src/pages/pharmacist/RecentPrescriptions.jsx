import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const prescriptions = [
  {
    patientName: "John Doe",
    patientPhone: "+1234567890",
    nextOfKinName: "Jane Doe",
    nextOfKinPhone: "+0987654321",
    prescriptionName: "Fever Treatment",
    drugName: "Paracetamol",
    category: "Tablet",
    dosage: "1-1-1",
    duration: "5 Days",
  },
  {
    patientName: "John Doe",
    patientPhone: "+1234567890",
    nextOfKinName: "Jane Doe",
    nextOfKinPhone: "+0987654321",
    prescriptionName: "Fever Treatment",
    drugName: "Cough Syrup",
    category: "Syrup",
    amount: "10ml",
    dosage: "2-0-2",
    duration: "7 Days",
  },
  {
    patientName: "Alice Smith",
    patientPhone: "+1987654321",
    nextOfKinName: "Bob Smith",
    nextOfKinPhone: "+1098765432",
    prescriptionName: "Cold & Flu Treatment",
    drugName: "Ibuprofen",
    category: "Tablet",
    dosage: "1-0-1",
    duration: "3 Days",
  },
  {
    patientName: "Alice Smith",
    patientPhone: "+1987654321",
    nextOfKinName: "Bob Smith",
    nextOfKinPhone: "+1098765432",
    prescriptionName: "Cold & Flu Treatment",
    drugName: "Vitamin C Syrup",
    category: "Syrup",
    amount: "15ml",
    dosage: "1-1-1",
    duration: "7 Days",
  },
  {
    patientName: "Michael Johnson",
    patientPhone: "+1765432109",
    nextOfKinName: "Sarah Johnson",
    nextOfKinPhone: "+1654321098",
    prescriptionName: "Hypertension Medication",
    drugName: "Amlodipine",
    category: "Tablet",
    dosage: "1-0-0",
    duration: "30 Days",
  },
  {
    patientName: "Michael Johnson",
    patientPhone: "+1765432109",
    nextOfKinName: "Sarah Johnson",
    nextOfKinPhone: "+1654321098",
    prescriptionName: "Hypertension Medication",
    drugName: "Losartan",
    category: "Tablet",
    dosage: "1-0-1",
    duration: "30 Days",
  },
];

export default function RecentPrescriptions() {
  return (
    <div className="!mt-14">
      <h3 className="text-xl font-bold mb-6">Recent Prescriptions</h3>
      <Table className="min-w-[800px] overflow-x-auto">
        <TableHeader>
          <TableRow className="bg-gray-100 hover:bg-gray-100 h-14">
            <TableHead className="px-4">Patient</TableHead>
            <TableHead className="px-4">Next of Kin</TableHead>
            <TableHead className="px-4">Prescription</TableHead>
            <TableHead className="px-4">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.slice(0, 5).map((prescription) => (
            <TableRow className="h-14" key={prescription.id}>
              <TableCell className="px-4">{prescription.patientName}</TableCell>
              <TableCell className="px-4">
                {prescription.nextOfKinName}
              </TableCell>
              <TableCell className="px-4">
                {prescription.prescriptionName}
              </TableCell>
              <TableCell className="px-4">{prescription.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
