import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Body = z.object({ supplierId: z.string(), period: z.string(), payload: z.any() });

export async function POST(req: NextRequest) {
  const data = Body.parse(await req.json());
  const report = await prisma.monthlyReport.create({ data });
  return Response.json({ ok: true, report });
}
