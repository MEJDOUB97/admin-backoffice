import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay<T>(value: T, ms = 200) {
  return new Promise<T>((resolve) => window.setTimeout(() => resolve(value), ms));
}
