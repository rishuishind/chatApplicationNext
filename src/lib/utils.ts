import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";



//Function to merge custom classes with tailwind classes
export function cn(...inputs:ClassValue[]){
    return twMerge(clsx(inputs));
}