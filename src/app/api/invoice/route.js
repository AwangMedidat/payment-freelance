"use server";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const invoiceSchema = z.object({
  from: z.string().min(1, "From address is required"),
  to: z.string().min(1, "To address is required"),
  date: z.string().refine((dateString) => !isNaN(new Date(dateString).getTime()), {
    message: "Invalid date format",
  }),
  dueDate: z.string().refine((dateString) => !isNaN(new Date(dateString).getTime()), {
    message: "Invalid due date format",
  }),
  purchaseOrder: z.string().min(1, "Purchase order is required"),
  items: z.array(
    z.object({
      name: z.string().min(1, "Item name is required"),
      quantity: z.number().min(0, "Quantity must be at least 0"),
      rate: z.number().min(0, "Rate must be at least 0"),
      amount: z.number().min(0, "Amount must be at least 0"),
    })
  ),
});

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { items: true },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(request) {
  const body = await request.json();

  const validation = invoiceSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { from, to, date, dueDate, purchaseOrder, items } = validation.data;

  try {
    const createdInvoice = await prisma.invoice.create({
      data: {
        from,
        to,
        date: new Date(date).toISOString(),
        dueDate: new Date(dueDate).toISOString(),
        purchaseOrder,
        items: {
          create: items.map((item) => ({
            name: item.name,
            quantity: parseInt(item.quantity),
            rate: parseFloat(item.rate),
            amount: parseFloat(item.amount),
          })),
        },
      },
    });

    return NextResponse.json(createdInvoice);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
