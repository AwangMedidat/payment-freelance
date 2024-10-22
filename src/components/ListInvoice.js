"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const ListInvoice = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleEdit = (id) => {
    router.push(`/${id}`);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E0E0E0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });

        try {
          const response = await fetch(`/api/invoice/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            Swal.fire({
              title: "Deleted!",
              text: "Your invoice has been deleted.",
              icon: "success",
            });
            setInvoices(invoices.filter((invoice) => invoice.id !== id));
          } else {
            Swal.fire({
              title: "Deleted!",
              text: "Failed to delete invoice",
              icon: "error",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Deleted!",
            text: error,
            icon: "error",
          });
        }
      }
    });
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/invoice");
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-5">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="w-full">
        {invoices.length > 0 ? (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Invoice ID</th>
                <th className="py-2 px-4 border">From</th>
                <th className="py-2 px-4 border">To</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Due Date</th>
                <th className="py-2 px-4 border">Purchase Order</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border">{`INV-${invoice.id}`}</td>
                  <td className="py-2 px-4 border">{invoice.from}</td>
                  <td className="py-2 px-4 border">{invoice.to}</td>
                  <td className="py-2 px-4 border">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border">{invoice.purchaseOrder}</td>
                  <td className="py-2 px-4 border flex">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 flex items-center justify-center"
                      onClick={() => handleEdit(invoice.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded flex items-center justify-center"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No invoices found.</p>
        )}
      </div>
    </div>
  );
};

export default ListInvoice;
