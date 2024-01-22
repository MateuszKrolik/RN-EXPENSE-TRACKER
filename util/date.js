export function getFormattedDate(date) {
  if (typeof date === "string") {
    // If date is a string, return it as is
    return date.slice(0, 10);
  } else {
    // If date is a Date object, convert it to a string
    return date.toISOString().slice(0, 10);
  }
}

export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}
