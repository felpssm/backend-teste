import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Criar usuários
  const admin = await prisma.user.create({
    data: {
      name: "Felipe Ferreira",
      email: "felpss.dev@gmail.com",
      role: "ADMIN",
    },
  });

  const partner1 = await prisma.user.create({
    data: {
      name: "João Silva",
      email: "joao@partner.com",
      role: "PARTNER",
    },
  });

  const partner2 = await prisma.user.create({
    data: {
      name: "Maria Santos",
      email: "maria@partner.com",
      role: "PARTNER",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "Carlos Cliente",
      email: "carlos@customer.com",
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Ana Customer",
      email: "ana@customer.com",
      role: "CUSTOMER",
    },
  });

  console.log("Users created");

  // Criar produtos
  const product1 = await prisma.product.create({
    data: {
      name: "Curso de JavaScript",
      price: 199.9,
      active: true,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Curso de TypeScript",
      price: 249.9,
      active: true,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: "Curso de NestJS",
      price: 299.9,
      active: true,
    },
  });

  console.log("Products created");

  // Criar vendas
  await prisma.sale.create({
    data: {
      productId: product1.id,
      customerId: customer1.id,
      partnerId: partner1.id,
      value: product1.price,
    },
  });

  await prisma.sale.create({
    data: {
      productId: product2.id,
      customerId: customer1.id,
      partnerId: partner1.id,
      value: product2.price,
    },
  });

  await prisma.sale.create({
    data: {
      productId: product3.id,
      customerId: customer2.id,
      partnerId: partner2.id,
      value: product3.price,
    },
  });

  await prisma.sale.create({
    data: {
      productId: product1.id,
      customerId: customer2.id,
      partnerId: partner1.id,
      value: product1.price,
    },
  });

  console.log("Sales created");
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
