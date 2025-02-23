import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const getDosageInWords = (dosage) => {
  switch (dosage) {
    case "1-0-0":
      return "Once in the morning";
    case "0-1-0":
      return "Once in the afternoon";
    case "0-0-1":
      return "Once in the evening";
    case "1-0-1":
      return "Morning and evening";
    case "1-1-1":
      return "Three times daily (morning, afternoon, evening)";
    case "1-1-0":
      return "Morning and afternoon";
    case "0-1-1":
      return "Afternoon and evening";
    case "2-0-2":
      return "Two times daily (morning and evening)";
    case "1-1-1-1":
      return "Four times daily";
    case "1-0-0-1":
      return "Morning and night";
    case "2-2-2":
      return "Two tablets, three times daily";
    case "1 daily":
      return "Once daily";
    case "2 daily":
      return "Twice daily";
    case "3 daily":
      return "Three times daily";
    case "4 daily":
      return "Four times daily";
    case "every 4 hours":
      return "Every 4 hours";
    case "every 6 hours":
      return "Every 6 hours";
    case "every 8 hours":
      return "Every 8 hours";
    default:
      return "As prescribed";
  }
};
