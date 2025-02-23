import CustomFormField from "../../ui/CustomFormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form"; // ✅ This is fine
import { Button } from "@/components/ui/button";
import * as z from "zod";

// ✅ Form schema
const dosageFormSchema = z
  .object({
    drugName: z.string().min(2, "Drug name must be at least 2 characters"),
    duration: z.string().min(1, "Please enter duration"),
    dosage: z.string().min(1, "Please select a dosage"),
    isSyrup: z.boolean(),
    syrupAmount: z
      .union([z.coerce.number(), z.string()])
      .optional()
      .transform((val) => (val === "" ? null : val)), // Convert empty string to null
  })
  .refine(
    (data) => {
      if (data.isSyrup) {
        return data.syrupAmount !== null && data.syrupAmount > 0;
      }
      return true;
    },
    {
      message: "Syrup amount must be greater than 0",
      path: ["syrupAmount"],
    }
  );

export default function AddDosageForm({ onAddDrug }) {
  const form = useForm({
    resolver: zodResolver(dosageFormSchema),
    defaultValues: {
      drugName: "",
      duration: "",
      dosage: "",
      syrupAmount: "",
      isSyrup: false, // ✅ Include `isSyrup` in defaultValues
    },
  });

  // ✅ Sync the radio button state with the form
  const isSyrup = form.watch("isSyrup");

  const handleCategoryChange = (value) => {
    form.setValue("isSyrup", value); // ✅ Update form state when category changes
    if (!value) {
      form.setValue("syrupAmount", ""); // ✅ Reset syrup amount when switching to tablet
    }
  };

  const onSubmit = (values) => {
    console.log("Form submitted:", values);
    const formattedDosage = values.dosage.replaceAll(" - ", "-");
    onAddDrug({ ...values, dosage: formattedDosage });
  };

  const dosages = [
    "1-0-0",
    "0-1-0",
    "0-0-1",
    "1-0-1",
    "1-1-1",
    "1-1-0",
    "0-1-1",
    "2-0-2",
    "1-1-1-1",
    "1-0-0-1",
    "2-2-2",
    "1 daily",
    "2 daily",
    "3 daily",
    "4 daily",
    "every 4 hours",
    "every 6 hours",
    "every 8 hours",
    "as needed",
  ];

  return (
    <Form {...form}>
      <form
        id="modalForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="flex items-center justify-center sm:justify-start gap-6 mb-8 border-b pb-4">
          <p className="text-sm font-bold">Category:</p>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="tablet"
              checked={!isSyrup}
              onChange={() => handleCategoryChange(false)}
            />
            <label htmlFor="tablet" className="text-sm">
              Tablet
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="syrup"
              checked={isSyrup}
              onChange={() => handleCategoryChange(true)}
            />
            <label htmlFor="syrup" className="text-sm">
              Syrup
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <CustomFormField
            control={form.control}
            name="drugName"
            label="Drug Name"
            placeholder="Enter drug name"
            type="text"
            error={form.formState.errors.drugName?.message}
          />
          <CustomFormField
            control={form.control}
            name="duration"
            label="Duration (in days)"
            placeholder="Enter number of days"
            type="number"
            min={1}
            error={form.formState.errors.duration?.message}
          />
          <CustomFormField
            control={form.control}
            name="dosage"
            label="Dosage"
            type="select"
            options={dosages
              .map((d) => d.replaceAll("-", " - "))
              .map((d) => d.replace(d[0], d[0].toUpperCase()))}
            placeholder="Select dosage"
            error={form.formState.errors.dosage?.message}
          />

          {isSyrup && (
            <CustomFormField
              control={form.control}
              name="syrupAmount"
              label="Syrup Amount (ml)"
              type="number"
              placeholder="Enter amount in ml"
              error={form.formState.errors.syrupAmount?.message}
            />
          )}
        </div>

        <Button
          onClick={(e) => e.stopPropagation()}
          form="modalForm"
          type="submit"
          className="w-full"
        >
          Add Drug
        </Button>
      </form>
    </Form>
  );
}
