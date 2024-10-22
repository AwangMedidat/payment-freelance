"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/format";
import Swal from "sweetalert2";
import { InputField } from "./InputField";
import { ItemForm } from "./create-invoice/ItemForm";

const UpdateInvoiceForm = ({ invoiceId }) => {
  const router = useRouter();
  const [invoiceData, setInvoiceData] = useState({
    from: "",
    to: "",
    date: "",
    dueDate: "",
    purchaseOrder: "",
    items: [{ name: "", quantity: 0, rate: 0, amount: 0 }],
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [errorMessages, setErrorMessages] = useState({});

  const calculateTotal = () => {
    const total = invoiceData.items.reduce((acc, item) => acc + item.amount, 0);
    setInvoiceData((prev) => ({ ...prev, total }));
  };

  useEffect(() => {
    calculateTotal();
  }, [invoiceData.items]);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoice/${invoiceId}`);
        const data = await response.json();
        const formattedDate = new Date(data.date).toISOString().split("T")[0];
        const formattedDueDate = new Date(data.dueDate)
          .toISOString()
          .split("T")[0];

        setInvoiceData({
          ...data,
          date: formattedDate,
          dueDate: formattedDueDate,
        });
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

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
    calculateTotal();
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        { name: "", quantity: 0, rate: 0, amount: 0 },
      ],
    });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
    calculateTotal();
  };

  const handleBack = () => {
    router.push("/");
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/invoice/${invoiceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Invoice updated successfully!",
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
      console.error("Error updating invoice:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-5">Loading...</div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6 p-6 bg-white shadow-md rounded-lg mt-10"
    >
      <h2 className="text-2xl font-bold text-gray-800">Update Invoice</h2>

      <div className="grid custom-grid-3 gap-8">
        <InputField
          label="Invoice No."
          value={`INV-${invoiceData.id}`}
          readOnly
          style={{ width: "75%", backgroundColor: "#e0e0e0" }}
        />
        <InputField
          label="Language"
          value="Indonesia"
          readOnly
          style={{ backgroundColor: "#e0e0e0" }}
        />
        <InputField
          label="Currency"
          value="Indonesia Rupiah - IDR"
          readOnly
          style={{ backgroundColor: "#e0e0e0" }}
        />
      </div>

      <hr />

      <div className="grid gap-4 custom-grid-2">
        <div className="flex flex-col" style={{ gridRow: "span 2" }}>
          <InputField
            label="From"
            name="from"
            value={invoiceData.from}
            onChange={handleInputChange}
            placeholder="Shipping Address"
            textarea
            error={errorMessages?.error?.from}
            style={{ marginBottom: "40px" }}
            rows={4}
          />
          <InputField
            label="To"
            name="to"
            value={invoiceData.to}
            onChange={handleInputChange}
            placeholder="Destination Address"
            textarea
            error={errorMessages?.error?.to}
            rows={4}
          />
        </div>

        <div className="flex flex-col">
          <InputField
            label="Date"
            name="date"
            value={invoiceData.date}
            onChange={handleInputChange}
            type="date"
            error={errorMessages?.error?.date}
            style={{ marginBottom: '20px' }}
          />
          <InputField
            label="Due Date"
            name="dueDate"
            value={invoiceData.dueDate}
            onChange={handleInputChange}
            type="date"
            error={errorMessages?.error?.dueDate}
            style={{ marginBottom: '20px' }}
          />
          <InputField
            label="Purchase Order Number"
            name="purchaseOrder"
            value={invoiceData.purchaseOrder}
            type="text"
            readOnly
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
          Update Invoice
        </button>
      </div>
    </form>
  );
};

export default UpdateInvoiceForm;
