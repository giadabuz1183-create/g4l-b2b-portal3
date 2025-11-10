import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@g4l.local" },
    update: {},
    create: {
      email: "admin@g4l.local",
      name: "Admin G4L",
      password: await bcrypt.hash("admin123", 10),
      role: Role.ADMIN,
    },
  });

  const supUser = await prisma.user.upsert({
    where: { email: "supplier@g4l.local" },
    update: {},
    create: {
      email: "supplier@g4l.local",
      name: "Fornitore Demo",
      password: await bcrypt.hash("supplier123", 10),
      role: Role.SUPPLIER,
    },
  });

  const parUser = await prisma.user.upsert({
    where: { email: "partner@g4l.local" },
    update: {},
    create: {
      email: "partner@g4l.local",
      name: "Partner Demo",
      password: await bcrypt.hash("partner123", 10),
      role: Role.PARTNER,
    },
  });

  const supplier = await prisma.supplier.upsert({
    where: { email: "fornitore@demo.it" },
    update: {},
    create: {
      name: "Fornitore Demo S.p.A.",
      email: "fornitore@demo.it",
      userId: supUser.id,
    },
  });

  const partner = await prisma.partner.upsert({
    where: { email: "partner@demo.it" },
    update: {},
    create: {
      name: "Impresa Partner SRL",
      email: "partner@demo.it",
      userId: parUser.id,
    },
  });

  await prisma.product.upsert({
    where: { id: "FV-6K-001" },
    update: {},
    create: {
      id: "FV-6K-001",
      name: "Impianto FV 6 kW – Kit base",
      publicPrice: 650000,
      resellerPrice: 260000,
      supplierId: supplier.id,
    },
  });

  await prisma.product.upsert({
    where: { id: "FV-8K-002" },
    update: {},
    create: {
      id: "FV-8K-002",
      name: "Impianto FV 8 kW – Kit premium",
      publicPrice: 870000,
      resellerPrice: 348000,
      supplierId: supplier.id,
    },
  });

  console.log({ admin: admin.email, supplier: supplier.email, partner: partner.email });
}

main().finally(() => prisma.$disconnect());
