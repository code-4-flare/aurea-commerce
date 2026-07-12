type ClassValue = string | false | null | undefined;

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatKES(value: number) {
  return "KSh " + new Intl.NumberFormat("en-KE").format(value);
}
