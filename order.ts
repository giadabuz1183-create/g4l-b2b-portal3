export function genOrderCode(date = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `G4L-${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}
