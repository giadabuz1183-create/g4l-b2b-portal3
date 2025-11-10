import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mailer";

const Body = z.object({ orderCode: z.string(), number: z.string(), carrier: z.string().optional() });

export async function POST(req: NextRequest) {
  const { orderCode, number, carrier } = Body.parse(await req.json());
  const order = await prisma.order.findFirst({ where: { code: orderCode }, include: { partner: true, supplier: true } });
  if (!order) return new Response("Order not found", { status: 404 });
  await prisma.tracking.create({ data: { orderId: order.id, number, carrier } });
  await sendMail(order.partner.email, `Tracking ordine ${order.code}`, `Tracking: ${number}${carrier ? " ("+carrier+")" : ""}`);
  return Response.json({ ok: true });
}
