import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/ui/CustomFormField";
import DrugDetails from "@/components/features/drugs/DrugDetails";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { PlusIcon } from "lucide-react";
import AddDosageForm from "@/components/features/drugs/AddDosageForm";

// ✅ Improved phone regex: Only digits, allows optional + at start
const phoneRegex = /^\+?\d{10,15}$/;

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),

  phone: z.string().regex(phoneRegex, {
    message: "Enter a valid phone number (only digits, 10-15 characters).",
  }),

  nextOfKinName: z
    .string()
    .min(2, { message: "Next of kin's name must be at least 2 characters." }),

  nextOfKinPhone: z
    .string()
    .regex(phoneRegex, { message: "Enter a valid next of kin phone number." }),
});

export default function NewPrescription() {
  const [drugs, setDrugs] = useState([]);
  const [fullData, setFullData] = useState({});
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  function incrementStep() {
    setStep(step + 1);
  }
  function decrementStep() {
    setStep(step - 1);
  }
  return (
    <>
      {step === 1 && (
        <NewPrescriptionForm
          drugs={drugs}
          setDrugs={setDrugs}
          setFullData={setFullData}
          fullData={fullData}
          incrementStep={incrementStep}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
      {step === 2 && <Summary data={fullData} decrementStep={decrementStep} />}
    </>
  );
}

function NewPrescriptionForm({
  drugs,
  setDrugs,
  setFullData,
  incrementStep,
  fullData,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: fullData.fullName || "", // ✅ Updated to match schema
      phone: fullData.phone || "",
      nextOfKinName: fullData.nextOfKinName || "",
      nextOfKinPhone: fullData.nextOfKinPhone || "",
    },
  });

  function handleAddDrug(drug) {
    setDrugs([...drugs, drug]);
    setIsOpen(false);
    toast.success("Drug added successfully");
  }

  function onSubmit(values) {
    if (drugs.length === 0) {
      toast.error("Please add at least one drug.");
      return;
    }
    setFullData({ ...values, drugs });
    incrementStep();
    console.log("Form Submitted:", values);
  }

  return (
    <div className="container-small space-y-12">
      <h1 className="page-heading text-center">New Prescription</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div>
            {/* ✅ Patient Details */}
            <h3 className="text-lg font-bold mb-6">Patient</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <CustomFormField
                control={form.control}
                name="fullName"
                label="Full Name"
                placeholder="Enter patient's full name."
                type="text"
                error={form.formState.errors.fullName?.message} // ✅ Fixed validation
              />
              <CustomFormField
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="Enter patient's phone number."
                type="text"
                error={form.formState.errors.phone?.message}
              />
            </div>

            {/* ✅ Next of Kin Details */}
            <h3 className="text-lg font-bold mb-6 mt-14">
              Relative/Next of Kin
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <CustomFormField
                control={form.control}
                name="nextOfKinName"
                label="Full Name"
                placeholder="Enter next of kin's full name."
                type="text"
                error={form.formState.errors.nextOfKinName?.message}
              />
              <CustomFormField
                control={form.control}
                name="nextOfKinPhone"
                label="Phone Number"
                placeholder="Enter next of kin's phone number."
                type="text"
                error={form.formState.errors.nextOfKinPhone?.message}
              />
            </div>

            {/* ✅ Dosage Details */}
            <h3 className="text-lg font-bold mb-6 mt-14">Dosage Details</h3>
            <button
              type="button"
              className="border-2 border-dashed border-gray-300 rounded-md p-2 flex justify-center items-center gap-2 hover:bg-gray-50 cursor-pointer transition-all duration-300 hover:border-gray-400 w-full"
              onClick={() => setIsOpen(true)}
            >
              <PlusIcon strokeWidth={3} className="w-4 h-4" />
              <p className="text-sm font-semibold">Add Drug</p>
            </button>
            <DrugDetails drugs={drugs} setDrugs={setDrugs} />
          </div>

          {/* ✅ Submit Button */}
          <Button
            size="xl"
            className="w-full !mt-14 inline-block"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4">
              Add a drug
            </DialogTitle>
          </DialogHeader>
          <AddDosageForm onAddDrug={handleAddDrug} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Summary({ data, decrementStep }) {
  const handleSave = () => {
    const beforePrint = () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.addEventListener("afterprint", afterPrint);
    };

    const afterPrint = () => {
      window.removeEventListener("afterprint", afterPrint);
      toast.success("Prescription saved!");
    };

    window.addEventListener("beforeprint", beforePrint);
    window.print();
  };

  const handleFinish = () => {
    // Navigate to the main page
    window.location.href = "/pharmacist/dashboard";
  };

  return (
    <div className="container-small space-y-8 print:space-y-6 print:p-6">
      <h1 className="page-heading text-center print:text-2xl print:mb-8">
        Prescription Summary
      </h1>

      {/* Patient Details */}
      <div className="bg-gray-50 p-6 rounded-lg print:bg-gray-50/50 print:p-4">
        <h3 className="text-lg font-bold mb-4 print:text-xl">
          Patient Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Full Name</p>
            <p className="font-medium">{data.fullName}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone Number</p>
            <p className="font-medium">{data.phone}</p>
          </div>
        </div>
      </div>

      {/* Next of Kin Details */}
      <div className="bg-gray-50 p-6 rounded-lg print:bg-gray-50/50 print:p-4">
        <h3 className="text-lg font-bold mb-4 print:text-xl">
          Next of Kin Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Full Name</p>
            <p className="font-medium">{data.nextOfKinName}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone Number</p>
            <p className="font-medium">{data.nextOfKinPhone}</p>
          </div>
        </div>
      </div>

      {/* Prescription Details */}
      <div className="bg-gray-50 p-6 rounded-lg print:bg-gray-50/50 print:p-4">
        <h3 className="text-lg font-bold mb-4 print:text-xl">
          Prescribed Medications
        </h3>
        <div className="space-y-4">
          {data.drugs.map((drug, index) => (
            <div
              key={index}
              className="border-b last:border-b-0 pb-4 print:pb-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 print:grid-cols-5">
                <div>
                  <p className="text-gray-600">Drug Name</p>
                  <p className="font-medium">{drug.drugName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="font-medium">
                    {drug.isSyrup ? "Syrup" : "Tablet"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Dosage</p>
                  <p className="font-medium">{drug.dosage}</p>
                </div>
                <div>
                  <p className="text-gray-600">Duration</p>
                  <p className="font-medium">{drug.duration} days</p>
                </div>
                {drug.isSyrup && (
                  <div>
                    <p className="text-gray-600">Syrup Amount</p>
                    <p className="font-medium">{drug.syrupAmount} ml</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-end print:hidden">
        <Button variant="outline" onClick={decrementStep}>
          Back
        </Button>
        <Button onClick={handleSave}>Save Prescription</Button>
        <Button variant="default" onClick={handleFinish}>
          Finish
        </Button>
      </div>
    </div>
  );
}
