"use server";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const invoiceSchema = z.object({
  from: z.string().min(1, "From address is required"),
  to: z.string().min(1, "To address is required"),
  date: z
    .string()
    .refine((dateString) => !isNaN(new Date(dateString).getTime()), {
      message: "Invalid date format",
    }),
  dueDate: z
    .string()
    .refine((dateString) => !isNaN(new Date(dateString).getTime()), {
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

// GET ONE
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
      include: { items: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

// PUT (Update)
export async function PUT(request, { params }) {
  const body = await request.json();

  const { id } = params;
  const invoiceId = parseInt(id);

  const validation = invoiceSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { from, to, date, dueDate, purchaseOrder, items } = validation.data;

  try {
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        from,
        to,
        date: new Date(date).toISOString(),
        dueDate: new Date(dueDate).toISOString(),
        purchaseOrder,
        items: {
          deleteMany: {},
          create: items.map((item) => ({
            name: item.name,
            quantity: parseInt(item.quantity),
            rate: parseFloat(item.rate),
            amount: parseFloat(item.amount),
          })),
        },
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(request, { params }) {
  if (!params || !params.id) {
    return NextResponse.json(
      { error: "Invoice ID is required" },
      { status: 400 }
    );
  }

  const invoiceId = parseInt(params.id);

  try {
    await prisma.invoice.delete({
      where: { id: invoiceId },
    });

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
