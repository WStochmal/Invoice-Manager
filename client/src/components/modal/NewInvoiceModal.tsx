import { InvoiceApi } from "@/api/invoiceApi";
import React from "react";

type NewInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonInvoice = JSON.parse(e.target?.result as string);
        console.log("Parsed JSON:", jsonInvoice);
        await InvoiceApi.addInvoice(jsonInvoice);
        onClose();
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  };
  if (!isOpen) return null;
  return (
    <div>
      <div>
        <h2>New Invoice</h2>
        <input type="file" accept=".json" onChange={handleFileUpload} />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NewInvoiceModal;
