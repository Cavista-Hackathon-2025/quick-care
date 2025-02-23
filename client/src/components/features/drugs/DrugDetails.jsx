import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getDosageInWords } from "@/lib/utils";

export default function DrugDetails({ drugs }) {
  return (
    <div>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        {drugs.map((drug, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{drug.drugName}</span>
                <span className="text-sm font-normal bg-gray-100 px-2 py-1 rounded">
                  {drug.isSyrup ? "Syrup" : "Tablet"}
                </span>
              </CardTitle>
              <CardDescription className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Dosage:</span>
                  <span className="font-medium">
                    {getDosageInWords(drug.dosage)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Duration:</span>
                  <span className="font-medium">
                    {drug.duration} day{drug.duration > 1 ? "s" : ""}
                  </span>
                </div>
                {drug.isSyrup && (
                  <div className="flex justify-between items-center">
                    <span>Amount:</span>
                    <span className="font-medium">{drug.syrupAmount} ml</span>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
