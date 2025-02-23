import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomFormField({
  control,
  name,
  label,
  description,
  ...props
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-black">{label}</FormLabel>
          <FormControl>{renderInput(field, props)}</FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const renderInput = (field, props) => {
  switch (props.type) {
    case "text":
      return (
        <Input
          {...props}
          className="text-sm"
          placeholder={props.placeholder}
          {...field} // ✅ Connects to react-hook-form
        />
      );
    case "number":
      return (
        <Input
          {...props}
          className="placeholder:text-sm"
          type="number"
          min={props.min || 0}
          placeholder={props.placeholder}
          {...field} // ✅ Connects to react-hook-form
        />
      );
    case "select":
      return (
        <Select onValueChange={field.onChange} value={field.value || ""}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    default:
      return <Input {...props} placeholder={field.placeholder} {...field} />;
  }
};
