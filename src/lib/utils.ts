import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncateAddress = (address: string) => {
  if (!address) return "";
  const start = address.slice(0, 4);
  const end = address.slice(-4);
  return `${start}...${end}`;
};
