const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** Formats a date string like "2026-09-19" as "September 19th, 2026" */
export function formatGameDate(dateStr: string): string {
  // Parse as UTC to avoid timezone shifting the date by one day
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  return `${MONTHS[month - 1]} ${ordinal(day)}, ${year}`;
}
