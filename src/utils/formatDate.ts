export const formatDate = (inputDate: string | number | Date): string=>{
    const date = new Date(inputDate);
    const formatted = date.toLocaleString("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true // ✅ enables AM/PM
});
return formatted
}