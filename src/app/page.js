"use client";

import ListInvoice from "@/components/ListInvoice";
import { useRouter } from "next/navigation";

export default function InvoicePage() {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/create-invoice");
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Invoices List</h1>
      <button
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleCreate}
      >
        +New Invoice
      </button>
      <ListInvoice />
    </div>
  );
}
