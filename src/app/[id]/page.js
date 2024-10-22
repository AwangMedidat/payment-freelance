import UpdateInvoiceForm from "@/components/UpdateInvoiceForm";

const UpdateInvoicePage = ({ params }) => {
  const { id } = params;
  return (
    <div>
      <UpdateInvoiceForm invoiceId={id} />
    </div>
  );
};

export default UpdateInvoicePage;
