"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { formatRupiah } from "@/lib/format";
import { InputField } from "../InputField";
import { ItemForm } from "./ItemForm";

const CreateInvoiceForm = () => {
  const router = useRouter();
  const dynamicPurchaseOrder = `FL-${Date.now()}`;
  const [invoiceData, setInvoiceData] = useState({
    from: "",
    to: "",
    date: "",
    dueDate: "",
    purchaseOrder: "",
    items: [{ name: "", quantity: 0, rate: 0, amount: 0 }],
    total: 0,
  });
  const [errorMessages, setErrorMessages] = useState({});

  const calculateTotal = () => {
    const total = invoiceData.items.reduce((acc, item) => acc + item.amount, 0);
    setInvoiceData((prev) => ({ ...prev, total }));
  };

  useEffect(() => {
    calculateTotal();
  }, [invoiceData.items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = invoiceData.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        return updatedItem;
      }
      return item;
    });
    setInvoiceData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 0, rate: 0, amount: 0 }],
    }));
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData((prev) => ({ ...prev, items: newItems }));
  };

  const handleBack = () => {
    router.push("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalData = {
        ...invoiceData,
        purchaseOrder: dynamicPurchaseOrder,
        total: invoiceData.total,
        items: invoiceData.items.map((item) => ({
          ...item,
          amount: item.quantity * item.rate,
        })),
      };

      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Invoice created successfully!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        router.push("/");
      } else {
        const errorData = await response.json();
        setErrorMessages(errorData);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6 p-6 bg-white shadow-md rounded-lg mt-10"
    >
      <h2 className="text-2xl font-bold text-gray-800">Bill Invoice</h2>

      <div className="grid custom-grid-2 gap-8">
        <InputField
          label="Language"
          value="Indonesia"
          readOnly
          style={{ width: "60%", backgroundColor: "#e0e0e0" }}
        />
        <InputField
          label="Currency"
          value="Indonesia Rupiah - IDR"
          readOnly
          style={{ backgroundColor: "#e0e0e0" }}
        />
      </div>

      <hr />

      <div className="grid custom-grid-2 gap-8">
        <div>
          <InputField
            label="From"
            name="from"
            value={invoiceData.from}
            onChange={handleInputChange}
            placeholder="Shipping Address"
            textarea
            error={errorMessages?.error?.from}
            style={{ marginBottom: "40px" }}
            rows={5}
          />
          <InputField
            label="To"
            name="to"
            value={invoiceData.to}
            onChange={handleInputChange}
            placeholder="Destination Address"
            textarea
            error={errorMessages?.error?.to}
            rows={5}
          />
        </div>
        <div>
          <InputField
            label="Date"
            name="date"
            value={invoiceData.date}
            onChange={handleInputChange}
            type="date"
            error={errorMessages?.error?.date}
            style={{ marginBottom: "50px" }}
          />
          <InputField
            label="Due Date"
            name="dueDate"
            value={invoiceData.dueDate}
            onChange={handleInputChange}
            type="date"
            error={errorMessages?.error?.dueDate}
          />
        </div>
      </div>

      <hr />

      <h3 className="text-lg font-bold text-gray-800">Items</h3>
      {invoiceData.items.map((item, index) => (
        <ItemForm
          key={index}
          item={item}
          index={index}
          handleItemChange={handleItemChange}
          removeItem={removeItem}
          errorMessages={errorMessages}
        />
      ))}
      <button
        type="button"
        onClick={addItem}
        className="text-green-600 text-xs inline-flex items-center gap-1"
      >
        Add New Item
      </button>

      <hr />

      <div className="flex justify-between mt-4">
        <h3 className="text-lg font-bold text-gray-800">Total</h3>
        <span className="font-bold text-lg">
          {formatRupiah(invoiceData.total)}
        </span>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-grey-600 mr-5"
          onClick={handleBack}
        >
          Back Home
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Invoice
        </button>
      </div>
    </form>
  );
};

export default CreateInvoiceForm;
