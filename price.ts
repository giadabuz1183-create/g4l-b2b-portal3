export const platformPrice = (publicPriceCents: number) => Math.round(publicPriceCents * 0.8);
export const euro = (cents: number) => (cents / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
