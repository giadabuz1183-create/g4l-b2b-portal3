import { prisma } from "@/lib/db";
export async function GET() {
  const products = await prisma.product.findMany({ include: { supplier: true }, orderBy: { createdAt: "desc" } });
  return Response.json({ products });
}
