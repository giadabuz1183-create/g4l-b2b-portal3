import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { genOrderCode } from "@/lib/order";
import { sendMail } from "@/lib/mailer";
import { platformPrice } from "@/lib/price";

const Item = z.object({ productId: z.string(), qty: z.number().int().positive() });
const Delivery = z.object({ ragione: z.string(), referente: z.string(), indirizzo: z.string(), fasce: z.string().optional(), accesso: z.string().optional(), mezzo: z.string().optional(), scaricoAssistito: z.string().optional(), note: z.string().optional() });
const Body = z.object({ partnerId: z.string(), supplierId: z.string(), items: z.array(Item).min(1), delivery: Delivery });

export async function POST(req: NextRequest) {
  const body = Body.parse(await req.json());
  const code = genOrderCode();
  const prods = await prisma.product.findMany({ where: { id: { in: body.items.map(i => i.productId) } } });
  const itemsData = body.items.map(i => {
    const p = prods.find(pp => pp.id === i.productId)!;
    const unitPrice = platformPrice(p.publicPrice);
    return { productId: i.productId, qty: i.qty, unitPrice };
  });
  const order = await prisma.order.create({
    data: { code, partnerId: body.partnerId, supplierId: body.supplierId, deliveryJson: body.delivery, items: { create: itemsData } },
    include: { items: true, partner: true, supplier: true }
  });
  await sendMail(order.supplier.email, `Nuovo ordine ${order.code}`, `Ordine ${order.code} dal partner ${order.partner.name}.`);
  await sendMail(order.partner.email, `Conferma ordine ${order.code}`, `Il tuo ordine ${order.code} è stato creato.`);
  return Response.json({ ok: true, order });
}

export async function GET() {
  const orders = await prisma.order.findMany({ include: { items: true, partner: true, supplier: true, tracking: true }, orderBy: { createdAt: "desc" } });
  return Response.json({ orders });
}
